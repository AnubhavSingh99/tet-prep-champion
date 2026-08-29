-- UPQuizBazaar quiz platform foundation.
-- Auth users live in auth.users. App roles are kept separate from profiles.

create extension if not exists pgcrypto;

create type public.app_role as enum ('learner', 'admin');
create type public.question_type as enum ('single_choice', 'multiple_choice');
create type public.attempt_status as enum ('in_progress', 'submitted', 'expired');
create type public.payment_status as enum ('pending', 'verified', 'failed', 'cancelled');
create type public.entitlement_status as enum ('active', 'expired', 'revoked');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  exam_goal text default 'UPTET / CTET',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'learner',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin');
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_inr integer not null check (price_inr >= 0),
  tagline text not null,
  is_featured boolean not null default false,
  badge text,
  feature_limit jsonb not null default '{}'::jsonb,
  features text[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.tests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  package_id uuid references public.packages(id) on delete set null,
  title text not null,
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  total_marks integer not null check (total_marks > 0),
  pass_percentage integer not null default 60 check (pass_percentage between 0 and 100),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  question_text text not null,
  question_type public.question_type not null default 'single_choice',
  options jsonb not null,
  correct_answer text not null,
  explanation text not null,
  marks integer not null default 1 check (marks > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_id uuid not null references public.packages(id),
  exam_code text not null,
  exam_name text not null,
  provider text not null default 'paddle',
  provider_checkout_id text,
  provider_transaction_id text,
  amount_inr integer not null,
  status public.payment_status not null default 'pending',
  failure_reason text,
  raw_event jsonb,
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  unique (provider, provider_transaction_id)
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_id uuid not null references public.packages(id),
  exam_code text not null,
  exam_name text not null,
  payment_id uuid references public.payments(id),
  status public.entitlement_status not null default 'active',
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, exam_code, package_id)
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_id uuid not null references public.tests(id) on delete cascade,
  status public.attempt_status not null default 'in_progress',
  answers jsonb not null default '{}'::jsonb,
  score integer,
  percentage numeric(5,2),
  correct_count integer,
  wrong_count integer,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();
create trigger packages_touch_updated_at before update on public.packages
for each row execute function public.touch_updated_at();
create trigger tests_touch_updated_at before update on public.tests
for each row execute function public.touch_updated_at();
create trigger questions_touch_updated_at before update on public.questions
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.packages enable row level security;
alter table public.categories enable row level security;
alter table public.tests enable row level security;
alter table public.questions enable row level security;
alter table public.payments enable row level security;
alter table public.entitlements enable row level security;
alter table public.attempts enable row level security;
alter table public.settings enable row level security;

create policy "Profiles are readable by owners and admins" on public.profiles
for select using (id = auth.uid() or public.is_admin());
create policy "Profiles are inserted by owners" on public.profiles
for insert with check (id = auth.uid());
create policy "Profiles are updated by owners and admins" on public.profiles
for update using (id = auth.uid() or public.is_admin());

create policy "Roles are readable by owner and admins" on public.user_roles
for select using (user_id = auth.uid() or public.is_admin());
create policy "Roles are managed by admins" on public.user_roles
for all using (public.is_admin()) with check (public.is_admin());

create policy "Active packages are public" on public.packages
for select using (is_active or public.is_admin());
create policy "Packages managed by admins" on public.packages
for all using (public.is_admin()) with check (public.is_admin());

create policy "Categories are public" on public.categories
for select using (true);
create policy "Categories managed by admins" on public.categories
for all using (public.is_admin()) with check (public.is_admin());

create policy "Published tests are public" on public.tests
for select using (is_published or public.is_admin());
create policy "Tests managed by admins" on public.tests
for all using (public.is_admin()) with check (public.is_admin());

create policy "Question prompts are available for published tests" on public.questions
for select using (
  public.is_admin()
  or exists (
    select 1 from public.tests t
    where t.id = questions.test_id and t.is_published
  )
);
create policy "Questions managed by admins" on public.questions
for all using (public.is_admin()) with check (public.is_admin());

create policy "Payments are readable by owner and admins" on public.payments
for select using (user_id = auth.uid() or public.is_admin());
create policy "Payments are inserted by owner" on public.payments
for insert with check (user_id = auth.uid());
create policy "Payments managed by admins" on public.payments
for update using (public.is_admin());

create policy "Entitlements are readable by owner and admins" on public.entitlements
for select using (user_id = auth.uid() or public.is_admin());
create policy "Entitlements managed by admins" on public.entitlements
for all using (public.is_admin()) with check (public.is_admin());

create policy "Attempts are owned by learners" on public.attempts
for select using (user_id = auth.uid() or public.is_admin());
create policy "Attempts are inserted by owners" on public.attempts
for insert with check (user_id = auth.uid());
create policy "Attempts are updated by owners while active" on public.attempts
for update using (user_id = auth.uid() or public.is_admin());

create policy "Settings readable by admins" on public.settings
for select using (public.is_admin());
create policy "Settings managed by admins" on public.settings
for all using (public.is_admin()) with check (public.is_admin());

insert into public.packages (slug, name, price_inr, tagline, badge, is_featured, sort_order, feature_limit, features)
values
('starter', 'Starter', 29, 'Get started with the essentials.', null, false, 1, '{"mocks":5,"questions":500,"subjectTests":10}', array['5 Full Mock Tests','10 Subject Tests','500+ Questions','Basic result analysis','Exam-like timer','Solutions for every question']),
('complete', 'Complete', 49, 'Most balanced value for serious aspirants.', 'Best Value', false, 2, '{"mocks":15,"questions":2000,"subjectTests":40}', array['15 Full Mock Tests','40 Subject / Chapter Tests','2,000+ Questions','Previous Year Questions','Detailed explanations','Performance analysis','Wrong-question practice']),
('premium', 'Premium', 99, 'The complete TET preparation package.', 'Best Selling', true, 3, '{"mocks":30,"questions":5000,"subjectTests":100}', array['30 Full Mock Tests','100+ Chapter / Subject Tests','5,000+ Questions','PYQs with detailed solutions','Daily quizzes','Rank & leaderboard','Wrong-question practice','Unlimited re-attempts','Exam-like interface'])
on conflict (slug) do update set
  name = excluded.name,
  price_inr = excluded.price_inr,
  tagline = excluded.tagline,
  badge = excluded.badge,
  is_featured = excluded.is_featured,
  feature_limit = excluded.feature_limit,
  features = excluded.features;

insert into public.categories (slug, name, description, sort_order)
values
('cdp', 'Child Development & Pedagogy', 'Learning theories, inclusive education and pedagogy fundamentals.', 1),
('hindi', 'Hindi', 'Grammar, comprehension and pedagogy-oriented Hindi practice.', 2),
('english', 'English', 'Language skills, comprehension and teaching methodology.', 3),
('maths', 'Mathematics', 'Core maths concepts with speed-focused practice.', 4),
('evs-science', 'EVS / Science', 'Environment, science basics and classroom application.', 5),
('social-studies', 'Social Studies', 'History, geography, civics and social pedagogy.', 6)
on conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;

with starter as (select id from public.packages where slug = 'starter'),
     complete as (select id from public.packages where slug = 'complete'),
     premium as (select id from public.packages where slug = 'premium'),
     cdp as (select id from public.categories where slug = 'cdp'),
     maths as (select id from public.categories where slug = 'maths'),
     evs as (select id from public.categories where slug = 'evs-science')
insert into public.tests (slug, category_id, package_id, title, description, duration_minutes, total_marks, pass_percentage, is_published)
values
('tet-starter-mock-1', (select id from cdp), (select id from starter), 'Starter Full Mock 1', 'A balanced starter mock across major TET sections.', 25, 5, 60, true),
('ctet-cdp-practice', (select id from cdp), (select id from complete), 'CTET CDP Practice Set', 'Child development and pedagogy questions with detailed explanations.', 20, 5, 60, true),
('uptet-maths-speed', (select id from maths), (select id from premium), 'UPTET Maths Speed Drill', 'Timed maths practice for accuracy and speed.', 15, 5, 60, true),
('evs-pyq-revision', (select id from evs), (select id from premium), 'EVS PYQ Revision', 'Previous-year style EVS questions with solution review.', 15, 5, 60, true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  duration_minutes = excluded.duration_minutes,
  total_marks = excluded.total_marks,
  pass_percentage = excluded.pass_percentage,
  is_published = excluded.is_published;

insert into public.questions (test_id, question_text, options, correct_answer, explanation, sort_order)
select t.id, q.question_text, q.options::jsonb, q.correct_answer, q.explanation, q.sort_order
from public.tests t
join (values
('tet-starter-mock-1', 'Which principle best supports child-centred education?', '["Memorisation first","Learning by doing","Punishment for errors","One-way lecture"]', 'Learning by doing', 'Child-centred education values active participation, exploration and learning by doing.', 1),
('tet-starter-mock-1', 'A formative assessment is mainly used to:', '["Rank students only","Improve learning during instruction","Replace all exams","Select teachers"]', 'Improve learning during instruction', 'Formative assessment gives feedback during the learning process so teaching can be adjusted.', 2),
('tet-starter-mock-1', 'Which is a primary number?', '["1","2","4","9"]', '2', 'Two is the smallest prime number because it has exactly two factors: 1 and itself.', 3),
('ctet-cdp-practice', 'Inclusive education means:', '["Teaching only high scorers","Separating children by ability","Welcoming diverse learners in one classroom","Avoiding assessment"]', 'Welcoming diverse learners in one classroom', 'Inclusive classrooms adapt support so learners with different needs can participate together.', 1),
('ctet-cdp-practice', 'The zone of proximal development was proposed by:', '["Piaget","Vygotsky","Skinner","Thorndike"]', 'Vygotsky', 'Vygotsky described the gap between what a learner can do alone and with guidance as ZPD.', 2),
('uptet-maths-speed', 'What is 25% of 240?', '["40","50","60","80"]', '60', '25% is one-fourth, and one-fourth of 240 is 60.', 1),
('uptet-maths-speed', 'The next number in 3, 6, 12, 24 is:', '["30","36","42","48"]', '48', 'Each term is doubled, so 24 doubled is 48.', 2),
('evs-pyq-revision', 'Which gas do plants mainly absorb for photosynthesis?', '["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"]', 'Carbon dioxide', 'Plants use carbon dioxide and water to prepare food during photosynthesis.', 1),
('evs-pyq-revision', 'A good EVS classroom should encourage:', '["Only textbook copying","Observation and questioning","Silent memorisation","No field activity"]', 'Observation and questioning', 'EVS learning becomes meaningful when children observe, ask questions and connect concepts to life.', 2)
) as q(test_slug, question_text, options, correct_answer, explanation, sort_order)
on q.test_slug = t.slug
on conflict do nothing;

insert into public.settings (key, value)
values
('payments', '{"provider":"paddle","mode":"test","liveCredentialsRequired":true,"checkoutConfigured":false}'::jsonb),
('platform', '{"brand":"UPQuizBazaar","supportEmail":"support@upquizbazaar.example"}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
