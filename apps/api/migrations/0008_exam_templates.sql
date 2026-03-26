ALTER TABLE exams ADD COLUMN is_template INTEGER NOT NULL DEFAULT 0;
ALTER TABLE exams ADD COLUMN source_exam_id TEXT;

CREATE INDEX IF NOT EXISTS idx_exams_is_template ON exams(is_template);
CREATE INDEX IF NOT EXISTS idx_exams_source_exam_id ON exams(source_exam_id);
