-- Perfil de cada pessoa (onde trabalha, função...) e banco de vocabulário para as "palavras do dia".
create table if not exists public.fi_perfil (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  empresa text, funcao text, termos_tecnicos text,
  categorias text[] not null default '{}',
  atualizado_em timestamptz not null default now()
);
create table if not exists public.fi_vocab (
  id bigint generated always as identity primary key,
  categoria text not null,
  grupo text not null check (grupo in ('trabalho','dia')),
  en text not null, pt text not null, ex_en text, ex_pt text,
  ordem int not null default 0,
  unique (categoria, en)
);
create table if not exists public.fi_vocab_vistas (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  vocab_id bigint not null references public.fi_vocab(id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (user_id, vocab_id)
);
do $$
begin
  -- conteúdo: todo usuário logado lê; só o administrador altera
  alter table public.fi_vocab enable row level security;
  revoke all on public.fi_vocab from anon, authenticated;
  grant select, insert, update, delete on public.fi_vocab to authenticated;
  drop policy if exists "conteudo: le logado" on public.fi_vocab;
  create policy "conteudo: le logado" on public.fi_vocab for select to authenticated using (true);
  drop policy if exists "conteudo: admin altera" on public.fi_vocab;
  create policy "conteudo: admin altera" on public.fi_vocab for all to authenticated using ((select public.fi_eh_admin())) with check ((select public.fi_eh_admin()));
  -- dados de cada pessoa: só ela
  alter table public.fi_perfil enable row level security;
  revoke all on public.fi_perfil from anon, authenticated;
  grant select, insert, update, delete on public.fi_perfil to authenticated;
  drop policy if exists "dono" on public.fi_perfil;
  create policy "dono" on public.fi_perfil for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
  alter table public.fi_vocab_vistas enable row level security;
  revoke all on public.fi_vocab_vistas from anon, authenticated;
  grant select, insert, update, delete on public.fi_vocab_vistas to authenticated;
  drop policy if exists "dono" on public.fi_vocab_vistas;
  create policy "dono" on public.fi_vocab_vistas for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
end $$;
