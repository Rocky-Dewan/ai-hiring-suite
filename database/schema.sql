
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


create table if not exists job_vectors (
  job_id text references jobs(id) on delete cascade,
  title text,
  chunk text,
  embedding vector(1536),
  primary key(job_id, title, chunk)
);

