create extension if not exists "pgcrypto";

create table if not exists public.phases (
  slug text primary key,
  title text not null,
  label text not null,
  description text,
  price integer not null check (price > 0),
  sort_order integer not null unique,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.phases (slug, title, label, description, price, sort_order, is_premium)
values
  ('employability-foundation', 'Employability Foundation', 'Phase 1', 'Build the mindset, portfolio, and career identity that makes employers notice you.', 799, 1, false),
  ('real-world-experience', 'Real-World Experience', 'Phase 2', 'Execute employer-style projects with real feedback and career-ready outcomes.', 799, 2, false),
  ('job-readiness', 'Job Readiness', 'Phase 3', 'Sharpen interview performance, application systems, and job search rhythm.', 799, 3, false),
  ('premium-skill-track', 'Premium Skill Track', 'Phase 4', 'A high-impact premium skill stack focused on elite roles and rapid salary growth.', 1299, 4, true)
on conflict (slug) do update set
  title = excluded.title,
  label = excluded.label,
  description = excluded.description,
  price = excluded.price,
  sort_order = excluded.sort_order,
  is_premium = excluded.is_premium;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null,
  amount integer not null check (amount > 0),
  provider text not null default 'paystack',
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  reference text not null unique,
  payment_type text not null default 'single_phase' check (payment_type in ('single_phase', 'full_access')),
  selected_phases text[] not null default '{}',
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments
  add column if not exists payment_type text not null default 'single_phase',
  add column if not exists selected_phases text[] not null default '{}';

alter table public.payments
  drop constraint if exists payments_payment_type_check,
  add constraint payments_payment_type_check check (payment_type in ('single_phase', 'full_access'));

create table if not exists public.payment_phase_access (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  phase_slug text not null references public.phases(slug) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, phase_slug)
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  phase_slug text not null references public.phases(slug) on delete cascade,
  title text not null,
  description text,
  thumbnail_url text,
  video_url text,
  resource_url text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content text,
  video_url text,
  resource_url text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_user_id_created_at_idx on public.payments (user_id, created_at desc);
create index if not exists payments_reference_idx on public.payments (reference);
create index if not exists payment_phase_access_user_phase_idx on public.payment_phase_access (user_id, phase_slug);
create index if not exists courses_phase_slug_sort_order_idx on public.courses (phase_slug, sort_order);
create index if not exists course_lessons_course_id_sort_order_idx on public.course_lessons (course_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists phases_set_updated_at on public.phases;
create trigger phases_set_updated_at before update on public.phases for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments for each row execute function public.set_updated_at();

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at before update on public.courses for each row execute function public.set_updated_at();

drop trigger if exists course_lessons_set_updated_at on public.course_lessons;
create trigger course_lessons_set_updated_at before update on public.course_lessons for each row execute function public.set_updated_at();

alter table public.phases enable row level security;
alter table public.payments enable row level security;
alter table public.payment_phase_access enable row level security;
alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;

drop policy if exists "Anyone can view phases" on public.phases;
create policy "Anyone can view phases" on public.phases for select using (true);

drop policy if exists "Users can view their own payments" on public.payments;
create policy "Users can view their own payments" on public.payments for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can view their own phase access" on public.payment_phase_access;
create policy "Users can view their own phase access" on public.payment_phase_access for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Paid users can view courses for unlocked phases" on public.courses;
create policy "Paid users can view courses for unlocked phases"
on public.courses
for select
to authenticated
using (
  is_published
  and exists (
    select 1
    from public.payment_phase_access access
    where access.user_id = auth.uid()
      and access.phase_slug = courses.phase_slug
  )
);

drop policy if exists "Paid users can view lessons for unlocked course phases" on public.course_lessons;
create policy "Paid users can view lessons for unlocked course phases"
on public.course_lessons
for select
to authenticated
using (
  is_published
  and exists (
    select 1
    from public.courses course
    join public.payment_phase_access access on access.phase_slug = course.phase_slug
    where course.id = course_lessons.course_id
      and course.is_published
      and access.user_id = auth.uid()
  )
);

drop policy if exists "Service role can manage phases" on public.phases;
create policy "Service role can manage phases" on public.phases for all to service_role using (true) with check (true);

drop policy if exists "Service role can manage payments" on public.payments;
create policy "Service role can manage payments" on public.payments for all to service_role using (true) with check (true);

drop policy if exists "Service role can manage payment phase access" on public.payment_phase_access;
create policy "Service role can manage payment phase access" on public.payment_phase_access for all to service_role using (true) with check (true);

drop policy if exists "Service role can manage courses" on public.courses;
create policy "Service role can manage courses" on public.courses for all to service_role using (true) with check (true);

drop policy if exists "Service role can manage course lessons" on public.course_lessons;
create policy "Service role can manage course lessons" on public.course_lessons for all to service_role using (true) with check (true);
