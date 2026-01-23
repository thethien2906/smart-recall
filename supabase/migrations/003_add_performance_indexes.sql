-- Phase 5: Add Performance Indexes
-- Purpose: Optimize query performance for fetching due cards

-- Create composite index on deck_id and next_review_at
-- This speeds up the getDueCards query significantly
CREATE INDEX IF NOT EXISTS idx_cards_deck_review 
ON cards(deck_id, next_review_at);

-- Create index on next_review_at alone for global due card queries
CREATE INDEX IF NOT EXISTS idx_cards_next_review 
ON cards(next_review_at);

-- Create index on user_id in decks table for faster deck listing
CREATE INDEX IF NOT EXISTS idx_decks_user 
ON decks(user_id);
