import { StudentExamRoom } from "../../../components/student-exam-room";

type StudentExamPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentExamPage({
  params,
}: StudentExamPageProps) {
  const { id } = await params;

  return <StudentExamRoom examId={id} />;
}
