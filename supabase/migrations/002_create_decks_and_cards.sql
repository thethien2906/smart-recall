-- Enable UUID extension (nếu chưa có từ Phase 1)
create extension if not exists "uuid-ossp";

-- =====================================================
-- TABLE: decks (Bộ thẻ)
-- =====================================================
create table public.decks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- TABLE: cards (Thẻ học)
-- =====================================================
create table public.cards (
  id uuid default uuid_generate_v4() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  question text not null,
  answer text not null,
  type text default 'concept' check (type in ('concept', 'scenario', 'choice', 'code')),
  
  -- SRS Fields (Spaced Repetition System)
  box int default 0,
  interval int default 0,
  ease_factor float default 2.5,
  next_review_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- INDEXES (Tối ưu query performance)
-- =====================================================
create index idx_decks_user_id on public.decks(user_id);
create index idx_cards_deck_id on public.cards(deck_id);
create index idx_cards_next_review on public.cards(deck_id, next_review_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
alter table public.decks enable row level security;
alter table public.cards enable row level security;

-- Policy: Users can CRUD their own decks
create policy "Users can view their own decks"
  on public.decks for select
  using (auth.uid() = user_id);

create policy "Users can create their own decks"
  on public.decks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own decks"
  on public.decks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own decks"
  on public.decks for delete
  using (auth.uid() = user_id);

-- Policy: Users can CRUD cards in their own decks
create policy "Users can view cards in their decks"
  on public.cards for select
  using (
    deck_id in (
      select id from public.decks where user_id = auth.uid()
    )
  );

create policy "Users can create cards in their decks"
  on public.cards for insert
  with check (
    deck_id in (
      select id from public.decks where user_id = auth.uid()
    )
  );

create policy "Users can update cards in their decks"
  on public.cards for update
  using (
    deck_id in (
      select id from public.decks where user_id = auth.uid()
    )
  );

create policy "Users can delete cards in their decks"
  on public.cards for delete
  using (
    deck_id in (
      select id from public.decks where user_id = auth.uid()
    )
  );
