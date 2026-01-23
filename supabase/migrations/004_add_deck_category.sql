-- Phase 6: Add category and updated_at to decks table

-- Add category and updated_at columns to decks table
ALTER TABLE decks 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone('utc'::text, now());

-- Update existing decks to have updated_at = created_at if not set
UPDATE decks SET updated_at = created_at WHERE updated_at IS NULL;

-- Create index for category to optimize filtering
CREATE INDEX IF NOT EXISTS idx_decks_category ON decks(category);

-- Create index for title using GIN for full-text search
CREATE INDEX IF NOT EXISTS idx_decks_title ON decks USING gin(to_tsvector('english', title));

-- Create index for updated_at to optimize sorting
CREATE INDEX IF NOT EXISTS idx_decks_updated_at ON decks(updated_at DESC);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on decks
DROP TRIGGER IF EXISTS update_decks_updated_at ON decks;
CREATE TRIGGER update_decks_updated_at
  BEFORE UPDATE ON decks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update deck's updated_at when cards are modified
CREATE OR REPLACE FUNCTION update_deck_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE decks 
  SET updated_at = timezone('utc'::text, now())
  WHERE id = COALESCE(NEW.deck_id, OLD.deck_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_deck_on_card_change ON cards;
CREATE TRIGGER update_deck_on_card_change
  AFTER INSERT OR UPDATE OR DELETE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_deck_updated_at();
