ALTER TABLE exam_import_jobs
  ADD COLUMN extraction_json TEXT;

ALTER TABLE exam_import_jobs
  ADD COLUMN classifier_json TEXT;

ALTER TABLE exam_import_questions
  ADD COLUMN source_block_id TEXT;

ALTER TABLE exam_import_questions
  ADD COLUMN source_bbox_json TEXT;
