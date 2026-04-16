-- Create qa (Questions & Answers) table
CREATE TABLE IF NOT EXISTS qa (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for published and display_order columns for faster queries
CREATE INDEX IF NOT EXISTS idx_qa_published ON qa(published);
CREATE INDEX IF NOT EXISTS idx_qa_display_order ON qa(display_order);
CREATE INDEX IF NOT EXISTS idx_qa_category ON qa(category);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_qa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_qa_updated_at
BEFORE UPDATE ON qa
FOR EACH ROW
EXECUTE FUNCTION update_qa_updated_at();
