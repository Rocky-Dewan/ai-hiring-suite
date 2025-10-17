-- Enable pgvector (run in Supabase or Postgres with pgvector)
create extension if not exists vector;

-- Jobs table (Airtable synced separately)
create table if not exists jobs (
  id text primary key,
  title text not null,
  department text,
  location text,
  level text,
  description text,
  requirements text,
  created_at timestamptz default now()
);

-- Applicants
create table if not exists applicants (
  id text primary key,
  name text not null,
  email text not null,
  resume_url text,
  resume_text text,
  status text default 'applied',
  created_at timestamptz default now()
);

-- Vector index for jobs (embedding dimension 1536 default for OpenAI text-embedding-3-large/mini adjust as needed)
create table if not exists job_vectors (
  job_id text references jobs(id) on delete cascade,
  title text,
  chunk text,
  embedding vector(1536),
  primary key(job_id, title, chunk)
);

-- Simple matching function (cosine similarity)
-- SELECT job_id, title, chunk, 1 - (embedding <=> query_embedding) AS score
-- FROM job_vectors ORDER BY embedding <=> query_embedding ASC LIMIT 20;
