-- Fala Inglês: banco de conteúdo (frases, diálogos, escrita, histórias) + histórico de cada pessoa.
-- Projeto Supabase PRÓPRIO do Fala Inglês (separado do ManagerTransfer).
-- Só o administrador (tabela fi_admins) edita o conteúdo. Rode no SQL Editor (pode rodar de novo sem problema).

create table if not exists public.fi_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.fi_admins enable row level security;
revoke all on public.fi_admins from anon, authenticated;
grant select on public.fi_admins to authenticated;
drop policy if exists "admins: le o proprio" on public.fi_admins;
create policy "admins: le o proprio" on public.fi_admins for select to authenticated using (user_id = (select auth.uid()));
create or replace function public.fi_eh_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.fi_admins where user_id = (select auth.uid()))
$$;

create table if not exists public.fi_situacoes (
  id text primary key,
  tipo text not null check (tipo in ('work','travel')),
  titulo text not null,
  papel text not null,
  abertura text not null,
  ordem int not null default 0
);
create table if not exists public.fi_frases (
  id bigint generated always as identity primary key,
  situacao text not null references public.fi_situacoes(id) on delete cascade,
  en text not null, pt text not null, dica text,
  ordem int not null default 0,
  unique (situacao, en)
);
create table if not exists public.fi_palavras (
  id bigint generated always as identity primary key,
  situacao text not null references public.fi_situacoes(id) on delete cascade,
  en text not null, pt text not null,
  ordem int not null default 0,
  unique (situacao, en)
);
create table if not exists public.fi_dialogos (
  id bigint generated always as identity primary key,
  situacao text not null references public.fi_situacoes(id) on delete cascade,
  ordem int not null,
  quem text not null check (quem in ('outro','voce')),
  en text not null, pt text not null,
  unique (situacao, ordem)
);
create table if not exists public.fi_tarefas_escrita (
  id text primary key,
  tipo text not null check (tipo in ('work','travel')),
  titulo text not null,
  instrucao_pt text not null,
  modelo_en text not null,
  pontos jsonb not null default '[]',
  nivel text not null default 'A2',
  ordem int not null default 0
);
create table if not exists public.fi_historias (
  id text primary key,
  tipo text not null check (tipo in ('work','travel')),
  nivel text not null,
  titulo text not null,
  texto text not null,
  glossario jsonb not null default '[]',
  pontos jsonb not null default '[]',
  ordem int not null default 0
);

-- Histórico de cada pessoa (só ela vê e escreve)
create table if not exists public.fi_falas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  origem text not null default 'frase' check (origem in ('dialogo','frase')),
  situacao text,
  alvo text not null, dito text not null, pct int not null,
  criado_em timestamptz not null default now()
);
create table if not exists public.fi_escritas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tarefa_id text references public.fi_tarefas_escrita(id) on delete set null,
  texto text not null, pct int,
  criado_em timestamptz not null default now()
);
create table if not exists public.fi_resumos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  historia_id text references public.fi_historias(id) on delete set null,
  texto text not null, nota int,
  criado_em timestamptz not null default now()
);
create table if not exists public.fi_caderno (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  en text not null, pt text,
  criado_em timestamptz not null default now(),
  unique (user_id, en)
);
create index if not exists fi_falas_user on public.fi_falas (user_id, criado_em desc);
create index if not exists fi_escritas_user on public.fi_escritas (user_id, criado_em desc);
create index if not exists fi_resumos_user on public.fi_resumos (user_id, criado_em desc);

-- Permissões e RLS
do $$
declare t text;
begin
  foreach t in array array['fi_situacoes','fi_frases','fi_palavras','fi_dialogos','fi_tarefas_escrita','fi_historias'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to authenticated', t);
    execute format('drop policy if exists "conteudo: le logado" on public.%I', t);
    execute format('create policy "conteudo: le logado" on public.%I for select to authenticated using (true)', t);
    -- só o administrador altera o conteúdo pelo site
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists "conteudo: admin altera" on public.%I', t);
    execute format('create policy "conteudo: admin altera" on public.%I for all to authenticated using ((select public.fi_eh_admin())) with check ((select public.fi_eh_admin()))', t);
  end loop;
  foreach t in array array['fi_falas','fi_escritas','fi_resumos','fi_caderno'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists "dono" on public.%I', t);
    execute format('create policy "dono" on public.%I for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
  end loop;
end $$;
