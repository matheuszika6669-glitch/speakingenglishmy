-- O primeiro usuário criado neste projeto vira administrador do conteúdo (o cadastro livre fica desligado).
create or replace function public.fi_primeiro_usuario_admin() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.fi_admins) then
    insert into public.fi_admins (user_id) values (new.id) on conflict do nothing;
  end if;
  return new;
end $$;
drop trigger if exists fi_primeiro_admin on auth.users;
create trigger fi_primeiro_admin after insert on auth.users for each row execute function public.fi_primeiro_usuario_admin();
-- se já existir usuário e ninguém for admin ainda, o mais antigo vira admin
insert into public.fi_admins (user_id)
  select id from auth.users where not exists (select 1 from public.fi_admins) order by created_at limit 1
  on conflict do nothing;
