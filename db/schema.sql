-- db/schema.sql
create table characters (
  id text primary key,           -- slug, e.g. "david"
  name text not null,
  image_url text,                -- relative path, e.g. "assets/images/david.jpg"
  era_label text,                -- human-readable, e.g. "Época de los reyes, ~1040–970 a.E.C."
  era_sort_key integer,          -- numeric year for ordering/positioning (negative = a.E.C.)
  lived_in text,
  known_for text,
  books text[],
  sources text[]
);

alter table characters enable row level security;

create policy "Public read access"
  on characters for select
  using (true);
