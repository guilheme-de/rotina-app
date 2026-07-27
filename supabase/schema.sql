-- =========================================================================
-- Routine App - Supabase Schema
-- Espaço de trabalho privado e compartilhado entre exatamente 2 usuários.
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.
-- =========================================================================

-- ----------------------------------------------------------------------
-- 1. Extensões
-- ----------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------
-- 2. Perfis (um por usuário autorizado)
--    Só existem linhas aqui para os usuários que você convidar manualmente
--    pelo painel do Supabase (Authentication > Users > Invite user).
--    Nenhum cadastro público é permitido pelo app.
-- ----------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Usuário',
  avatar_url text,
  notifications_enabled boolean not null default true,
  theme text not null default 'dark',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cria automaticamente um perfil quando um novo usuário autenticado é criado
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------
-- 3. Função auxiliar: o usuário atual é um dos 2 membros autorizados?
--    (isto é, existe um perfil para ele — perfis só existem para contas
--    convidadas manualmente, então isso já restringe o acesso).
-- ----------------------------------------------------------------------
create or replace function public.is_workspace_member()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

-- ----------------------------------------------------------------------
-- 4. Tarefas (Kanban)
-- ----------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date date,
  tags text[] not null default '{}',
  position integer not null default 0,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------
-- 5. Hábitos + registros diários
-- ----------------------------------------------------------------------
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text not null default '#e3a53d',
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly')),
  target_days integer not null default 7,
  archived boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  log_date date not null default current_date,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

-- ----------------------------------------------------------------------
-- 6. Metas
-- ----------------------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  deadline date,
  progress integer not null default 0 check (progress between 0 and 100),
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------
-- 7. Agenda
-- ----------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,
  all_day boolean not null default false,
  color text not null default '#8b85f0',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------
-- 8. Notas
-- ----------------------------------------------------------------------
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Sem título',
  content text not null default '',
  pinned boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------
-- 9. Financeiro
-- ----------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount >= 0),
  category text not null default 'Outros',
  description text,
  occurred_on date not null default current_date,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------
-- 10. Índices
-- ----------------------------------------------------------------------
create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists tasks_due_date_idx on public.tasks (due_date);
create index if not exists habit_logs_habit_id_idx on public.habit_logs (habit_id);
create index if not exists habit_logs_date_idx on public.habit_logs (log_date);
create index if not exists events_start_time_idx on public.events (start_time);
create index if not exists transactions_occurred_on_idx on public.transactions (occurred_on);

-- ----------------------------------------------------------------------
-- 11. Row Level Security — apenas os 2 membros do workspace têm acesso,
--     tanto para leitura quanto para escrita, em todas as tabelas.
-- ----------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.goals enable row level security;
alter table public.events enable row level security;
alter table public.notes enable row level security;
alter table public.transactions enable row level security;

-- profiles: qualquer membro pode ver os dois perfis; só pode editar o próprio
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (public.is_workspace_member());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- Política genérica aplicada às demais tabelas: qualquer membro do
-- workspace pode ler e escrever qualquer registro.
do $$
declare
  t text;
begin
  foreach t in array array['tasks', 'habits', 'habit_logs', 'goals', 'events', 'notes', 'transactions']
  loop
    execute format('drop policy if exists "%1$s_all" on public.%1$s', t);
    execute format(
      'create policy "%1$s_all" on public.%1$s for all using (public.is_workspace_member()) with check (public.is_workspace_member())',
      t
    );
  end loop;
end $$;

-- ----------------------------------------------------------------------
-- 12. Realtime (sincronização entre dispositivos)
-- ----------------------------------------------------------------------
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habit_logs;
alter publication supabase_realtime add table public.goals;
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.notes;
alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.profiles;

-- ----------------------------------------------------------------------
-- 13. Storage — bucket para fotos de perfil
-- ----------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_read" on storage.objects;
create policy "avatars_read" on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_write" on storage.objects;
create policy "avatars_write" on storage.objects for insert
  with check (bucket_id = 'avatars' and public.is_workspace_member());

drop policy if exists "avatars_update" on storage.objects;
create policy "avatars_update" on storage.objects for update
  using (bucket_id = 'avatars' and public.is_workspace_member());

-- =========================================================================
-- PRÓXIMOS PASSOS (fazer manualmente no painel do Supabase):
-- 1. Authentication > Providers > Email: desative "Allow new users to sign up".
-- 2. Authentication > Users > Invite user: convide os 2 e-mails autorizados
--    (você e seu sócio). Cada convite cria a linha em auth.users, o que
--    dispara o trigger acima e cria automaticamente o perfil.
-- 3. Copie a Project URL e a anon key em Project Settings > API para o
--    seu arquivo .env.local (veja .env.example).
-- =========================================================================
