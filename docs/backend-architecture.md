# PineQuest Backend Architecture

## 1. Зорилго

PineQuest-ийн backend нь сургуулийн шалгалтын системийг тогтвортой ажиллуулах зорилготой.
Гол шаардлага нь:

- олон сурагч зэрэг шалгалт өгөхөд API унахгүй байх
- асуултын сан, шалгалт, оролдлого, хариултыг найдвартай хадгалах
- их ачаалалтай үед submit урсгалыг зөөллөх
- цаашдаа extension-ийн event log-ийг зөрчилгүйгээр нэмэх

## 2. Одоогийн stack

- API runtime: `Cloudflare Workers`
- API contract: `GraphQL`
- Database: `Cloudflare D1`
- Frontend query typing: `GraphQL Code Generator`
- File storage: дараагийн шатанд `Cloudflare R2`
- Cache: дараагийн шатанд `Cloudflare KV`
- Async processing: дараагийн шатанд `Cloudflare Queues`
- Live coordination: шаардлагатай бол `Durable Objects`

## 3. High-level architecture

```text
Browser / Web App
        |
        v
Cloudflare Workers API (GraphQL)
        |
        +--> D1 (source of truth)
        |
        +--> KV (fast read cache, later)
        |
        +--> Queues (heavy background jobs, later)
        |
        +--> Durable Objects (live exam session, later)
        |
        +--> R2 (attachments, later)
```

## 4. Яагаад энэ architecture зөв вэ

`Workers` нь request-үүдийг сайн даана. Харин их ачаалалтай үед bottleneck нь ихэвчлэн `D1` дээрх write болно.

Тиймээс дараах зарчим барина:

- `Workers` нь request handler байна
- `D1` нь үнэн зөв үндсэн өгөгдөл байна
- `KV` нь хурдан уншигдах exam payload cache байна
- `Queues` нь submit-ийн дараах хүнд ажлыг салгаж авна
- `Durable Objects` нь realtime session/state-ийг хариуцна

## 5. Source of truth

Системийн source of truth нь `D1`.

Үндсэн relational data:

- users
- classes
- class_students
- question_banks
- questions
- exams
- exam_questions
- attempts
- answers

Cache-д байгаа өгөгдөл truth биш.
Queues доторх job ч truth биш.
Truth үргэлж `D1` дээр байна.

## 6. Request flow

### 6.1 Read flow

1. Web app GraphQL query явуулна
2. Worker query-г хүлээн авна
3. Хэрэв payload cache-д байвал KV-ээс авна
4. Байхгүй бол D1-ээс уншина
5. Хариуг GraphQL response болгон буцаана

### 6.2 Submit flow

1. Student `submitAttempt` mutation дарна
2. Worker final answers-ийг баталгаажуулна
3. Attempt status-ийг `SUBMITTED` болгоно
4. Answers-ийг `D1` дээр хадгална
5. Immediate response буцаана
6. Heavy ажил байвал `Queues` руу job өгнө

Хамгийн чухал дүрэм:

`submitAttempt` дотор хүнд ажил бүгдийг зэрэг хийхгүй.

## 7. Scale-ийн гол зарчим

### 7.1 1000+ зэрэг submit хийх үед

Асуудал нь Worker унахдаа биш.
Асуудал нь database write овоорох эрсдэлтэй.

Тиймээс:

- autosave-г keypress бүр дээр хийхгүй
- submit үед зөвхөн хэрэгтэй write-аа хийнэ
- analytics, notification, heavy scoring-г background руу гаргана

### 7.2 Autosave strategy

Autosave дараах байдлаар байна:

- 5-10 секунд debounce
- эсвэл question change дээр save
- submit хийхэд нэг final sync хийнэ

### 7.3 Idempotency

Submit flow заавал idempotent байна.

Өөрөөр хэлбэл:

- хэрэглэгч submit-г 2 удаа дарсан ч
- ижил attempt давхар эвдэрч бичигдэхгүй

## 8. Current backend modules

Одоогийн codebase:

- [`apps/api/src/index.ts`](../apps/api/src/index.ts): Worker entrypoint
- [`apps/api/src/graphql/schema.ts`](../apps/api/src/graphql/schema.ts): GraphQL schema
- [`apps/api/src/graphql/root-value.ts`](../apps/api/src/graphql/root-value.ts): GraphQL root resolvers
- [`apps/api/src/graphql/mock-data.ts`](../apps/api/src/graphql/mock-data.ts): temporary mock state
- [`apps/api/migrations/0001_init.sql`](../apps/api/migrations/0001_init.sql): D1 schema
- [`apps/api/migrations/0002_seed.sql`](../apps/api/migrations/0002_seed.sql): seed data

## 9. Recommended target folder structure

```text
apps/api/src/
  index.ts
  graphql/
    schema.ts
    root-value.ts
  lib/
    db/
    cache/
    queue/
    ids/
  modules/
    auth/
    users/
    classes/
    question-banks/
    questions/
    exams/
    attempts/
    grading/
    integrity/
```

Эхний шатанд `graphql/` дотроо байж болно.
Дараа нь resolver-ууд томрохоор `modules/` руу салгана.

## 10. Database tables

Одоогийн migration дээр байгаа tables:

### users

- id
- full_name
- email
- role
- created_at

### classes

- id
- name
- description
- teacher_id
- created_at

### class_students

- id
- class_id
- student_id

### question_banks

- id
- title
- description
- owner_id
- created_at

### questions

- id
- bank_id
- type
- title
- prompt
- options_json
- correct_answer
- difficulty
- tags_json
- created_by_id
- created_at

### exams

- id
- class_id
- title
- description
- mode
- status
- duration_minutes
- created_by_id
- created_at

### exam_questions

- id
- exam_id
- question_id
- points
- display_order

### attempts

- id
- exam_id
- student_id
- status
- auto_score
- manual_score
- total_score
- started_at
- submitted_at

### answers

- id
- attempt_id
- question_id
- value
- auto_score
- manual_score
- feedback
- created_at

## 11. Index strategy

Одоогийн index-үүд зөв чиглэлтэй байна:

- classes.teacher_id
- class_students.class_id
- class_students.student_id
- question_banks.owner_id
- questions.bank_id
- exams.class_id
- exam_questions.exam_id
- attempts.exam_id
- attempts.student_id
- answers.attempt_id

Дараагийн шатанд нэмэх магадлалтай index:

- answers.question_id
- exam_questions.question_id
- attempts(status, exam_id)

## 12. GraphQL contract

Одоогийн GraphQL schema-д:

### Query

- health
- hello
- me
- users
- classes
- class
- questionBanks
- questionBank
- questions
- exams
- exam
- attempts
- attempt

### Mutation

- createClass
- createQuestionBank
- createQuestion
- createExam
- addQuestionToExam
- publishExam
- startAttempt
- saveAnswer
- submitAttempt

## 13. Frontend integration

Frontend талд `codegen` аль хэдийн орсон:

- [`apps/web/codegen.ts`](../apps/web/codegen.ts)

Иймээс frontend дараа нь:

- `.graphql` query/mutation файл бичнэ
- codegen ажиллуулна
- typed document node ашиглана

## 14. Submit flow-ийн зөв implementation

### MVP version

1. attempt-ийг олно
2. attempt status-г шалгана
3. answers-ийг upsert хийнэ
4. auto score тооцно
5. attempt total fields-ийг шинэчилнэ
6. status-г `SUBMITTED` болгоно

### Scalable version

1. attempt final state-г баталгаажуулна
2. minimal write хийж `SUBMITTED` болгоно
3. heavy scoring-ийг queue руу явуулна
4. analytics-г queue руу явуулна
5. integrity event processing-г queue руу явуулна

## 15. Extension-ready design

Extension-ийг дараа нь нэмэхдээ:

- Web app нь source of truth хэвээрээ байна
- Extension нь event logger байна
- Extension answer submit хийхгүй
- Extension зөвхөн `attemptId`-гаар integrity event явуулна

Ингэснээр extension ба exam system хооронд state conflict үүсэхгүй.

## 16. Immediate next steps

1. Mock data-аас D1 query/service layer руу шилжих
2. Resolver бүрийг module руу салгах
3. `submitAttempt`-ийг idempotent болгох
4. `saveAnswer` дээр debounce strategy тохируулах
5. Exam payload caching-г KV дээр нэмж эхлэх

## 17. Team guideline

### Backend ownership

- schema
- migrations
- resolver/service layer
- D1 integration
- submit flow
- scaling safeguards

### Frontend ownership

- query/mutation documents
- teacher dashboard
- question bank UI
- exam runner UI
- attempt UI

## 18. Final decision

PineQuest backend-ийн зөв чиглэл:

- `Workers` = API layer
- `D1` = source of truth
- `GraphQL` = app contract
- `KV` = fast reads
- `Queues` = heavy async work
- `Durable Objects` = live session coordination when needed

Энэ architecture нь одоогийн codebase дээр өсгөхөд хамгийн аюул багатай, мөн 1000+ зэрэг хэрэглэгчтэй шалгалтын систем рүү өргөжихөд хамгийн зөв суурь болно.
