# PollApp

A survey app without accounts. Anyone can create a survey, anyone can take part,
and the results are visible to everyone in real time.

## Features

- **Create surveys** in a modal dialog: title, description, category, end date,
  and any number of questions with two or more answer options each. Questions can
  allow a single choice or multiple choices.
- **Browse** surveys on the home page — a hero section, a row of surveys ending
  within the next two weeks, and tabs for active and past surveys with a category
  filter.
- **Participate** on `/survey/:id` with radio buttons or checkboxes, depending on
  the question. A local flag remembers a submitted vote across reloads, and
  expired surveys are read-only.
- **Live results** as percentage bars that update through a Supabase Realtime
  channel — no reload, no polling.

Categories are a TypeScript constant, not a database table: Team Activities,
Health & Wellness, Gaming & Entertainment, Education & Learning, Lifestyle &
Preferences, Technology & Innovation.

## Tech stack

| | |
|---|---|
| Framework | Angular 22, standalone components, no NgModules |
| State | Signals and `computed()` — no NgRx, no RxJS store |
| Backend | Supabase (PostgreSQL, RLS, Realtime) |
| Styling | Plain SCSS with design tokens — no CSS framework, no UI library |
| Forms | Reactive Forms with nested `FormArray`s |
| Tests | Vitest via `ng test` |

There is no authentication and no user table. Writes are protected by row level
security policies and database `CHECK` constraints, not by the client.

## Getting started

### Prerequisites

- Node 22 or newer
- A Supabase project

### Install

```bash
npm install
```

### Database

Run the following in the Supabase SQL editor, in this order.

**Tables and indexes.** `questions.id` deliberately has no default — the ID is
always generated in the browser so that the option IDs stored in `responses`
point somewhere.

```sql
create table surveys (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  category    text,
  end_date    timestamptz,
  created_at  timestamptz not null default now()
);

create table questions (
  id             uuid primary key,
  survey_id      uuid not null references surveys(id) on delete cascade,
  text           text not null,
  position       int  not null,
  allow_multiple boolean not null default false,
  options        jsonb not null default '[]'::jsonb
);

create table responses (
  id           uuid primary key default gen_random_uuid(),
  survey_id    uuid not null references surveys(id) on delete cascade,
  answers      jsonb not null default '[]'::jsonb,
  submitted_at timestamptz not null default now()
);

create index questions_survey_id_idx on questions (survey_id, position);
create index responses_survey_id_idx on responses (survey_id);
create index surveys_end_date_idx    on surveys (end_date);
```

**Atomic creation.** A survey and its questions are written in one transaction
through an RPC, never as two separate inserts.

```sql
create or replace function create_survey(
  p_title       text,
  p_description text,
  p_category    text,
  p_end_date    timestamptz,
  p_questions   jsonb
) returns uuid
language plpgsql
security definer as $$
declare
  v_survey_id uuid;
begin
  insert into surveys (title, description, category, end_date)
  values (p_title, nullif(p_description, ''), p_category, p_end_date)
  returning id into v_survey_id;

  insert into questions (id, survey_id, text, position, allow_multiple, options)
  select
    (q->>'id')::uuid,
    v_survey_id,
    q->>'text',
    (q->>'position')::int,
    (q->>'allow_multiple')::boolean,
    q->'options'
  from jsonb_array_elements(p_questions) q;

  return v_survey_id;
end;
$$;
```

**Row level security.** Everything is readable. Responses can only be inserted
while the survey is still running, surveys and questions only through the RPC
above, and updates and deletes are blocked entirely — the app has neither an edit
nor a delete view.

```sql
alter table surveys   enable row level security;
alter table questions enable row level security;
alter table responses enable row level security;

create policy "read surveys"   on surveys   for select using (true);
create policy "read questions" on questions for select using (true);
create policy "read responses" on responses for select using (true);

create policy "submit responses" on responses for insert with check (
  exists (
    select 1 from surveys s
    where s.id = survey_id
      and (s.end_date is null or s.end_date > now())
  )
);
```

**Realtime.** The results page subscribes to new responses.

```sql
alter publication supabase_realtime add table responses;
```

### Configuration

Copy the environment template and fill in your Supabase URL and anon key:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

The anon key is public by design — it ships to the browser, and the row level
security policies above are what actually protect the data.

### Development server

```bash
npm start
```

The app runs at `http://localhost:4200/` and reloads on source changes.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Development server |
| `npm run build` | Production build |
| `npm run watch` | Development build in watch mode |
| `npm test` | Unit tests with Vitest |

## Project structure

```
src/
├── app/
│   ├── core/           # models, services, pipes, category constant
│   ├── features/       # home, survey-create, survey-detail, imprint, not-found
│   └── shared/         # header, footer, button, badge, empty state, …
├── assets/             # fonts and SVGs
├── environments/
└── styles/             # _tokens.scss, _mixins.scss, _base.scss, _fonts.scss
```

Only page components talk to services; presentational components receive data
through `input()` and emit events through `output()`.
