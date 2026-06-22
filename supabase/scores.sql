-- Run this in the Supabase SQL editor to provision the full schema.

-- ENUMS
create type team_color as enum ('red', 'green', 'blue', 'yellow');
create type building_code as enum ('B1', 'B6', 'B7');
create type game_type as enum ('speed_67', 'pushup', 'boxing');

-- CLASSROOMS
create table classrooms (
  id serial primary key,
  name text not null unique,
  color team_color not null,
  building building_code not null
);

-- PLAYERS
create table players (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  classroom_id int not null references classrooms(id),
  total_score int not null default 0,
  play_count_today int not null default 0,
  last_played_date date,
  device_fingerprint text,
  created_at timestamptz default now()
);

-- SCORES (one best score per player per game)
create table scores (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id),
  game game_type not null,
  score int not null,
  created_at timestamptz default now(),
  constraint scores_player_game_unique unique (player_id, game)
);

-- AUDIT LOGS (insert-only — never delete rows)
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  player_id uuid references players(id),
  metadata jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table classrooms enable row level security;
alter table players enable row level security;
alter table scores enable row level security;
alter table audit_logs enable row level security;

create policy "anon read classrooms" on classrooms for select to anon using (true);
create policy "anon insert players" on players for insert to anon with check (true);
create policy "anon read players" on players for select to anon using (true);
create policy "anon update own player" on players for update to anon using (true);
create policy "anon insert scores" on scores for insert to anon with check (true);
create policy "anon upsert scores" on scores for update to anon using (true);
create policy "anon read scores" on scores for select to anon using (true);
create policy "anon insert logs" on audit_logs for insert to anon with check (true);
create policy "service role full access" on audit_logs for select to service_role using (true);

-- SEED CLASSROOMS
insert into classrooms (name, color, building) values
-- GREEN
('ม.1/3','green','B7'), ('ม.2/1','green','B7'), ('ม.2/2','green','B7'),
('ม.3/2','green','B7'), ('ม.3/3','green','B7'), ('ม.6/1','green','B6'),
('Gr.10/4','green','B6'), ('Gr.10/5','green','B6'), ('Gr.11/5','green','B6'),
-- RED
('ม.1/1','red','B7'), ('ม.1/2','red','B7'), ('ม.2/3','red','B7'),
('ม.3/1','red','B7'), ('ม.4/3','red','B6'), ('ม.5/1','red','B6'),
('ม.6/2','red','B6'),
-- BLUE
('ม.4/2','blue','B6'), ('ม.5/3','blue','B6'), ('Gr.7/4','blue','B1'),
('Gr.8/4','blue','B1'), ('Gr.9/5','blue','B1'), ('Gr.12/4','blue','B6'),
('Gr.12/5','blue','B6'),
-- YELLOW
('ม.4/1','yellow','B6'), ('ม.5/2','yellow','B6'), ('ม.6/3','yellow','B6'),
('Gr.7/5','yellow','B1'), ('Gr.8/5','yellow','B1'), ('Gr.9/4','yellow','B1'),
('Gr.11/4','yellow','B6');

-- UPSERT FUNCTION: keeps only the best (highest) score per player per game
create or replace function upsert_best_score(
  p_player_id uuid,
  p_game game_type,
  p_score int
) returns void language sql as $$
  insert into scores (player_id, game, score)
  values (p_player_id, p_game, p_score)
  on conflict (player_id, game)
  do update set
    score = greatest(excluded.score, scores.score),
    created_at = now();
$$;
