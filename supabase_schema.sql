-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create companies table
create table companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- Create score_metrics table (snapshot)
create table score_metrics (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade,
  overall numeric,
  components jsonb,
  created_at timestamp with time zone default now()
);

-- Create documents table
create table documents (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade,
  file_url text,
  status text,
  created_at timestamp with time zone default now()
);

-- Enable RLS (Row Level Security) - Optional validation
alter table companies enable row level security;
alter table score_metrics enable row level security;
alter table documents enable row level security;

-- Create policies (Open for public play as per request "Sem planos pagos... 100% funcional")
-- In production, restrict to authenticated users.
create policy "Public companies" on companies for all using (true);
create policy "Public metrics" on score_metrics for all using (true);
create policy "Public documents" on documents for all using (true);
