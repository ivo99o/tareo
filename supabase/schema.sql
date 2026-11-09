drop trigger if exists al_registrar_usuario on auth.users;
drop function if exists public.crear_perfil();
drop table if exists public.tareas;
drop table if exists public.perfiles;

create table public.perfiles (
    id        uuid primary key references auth.users (id) on delete cascade,
    telefono  text
);

create table public.tareas (
    id              bigint generated always as identity primary key,
    usuario_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
    titulo          text not null,
    categoria       text not null check (categoria in ('laboral', 'estudio', 'recordatorio')),
    fecha_objetivo  timestamptz not null,
    creada_en       timestamptz not null default now()
);

create index tareas_usuario_id_idx on public.tareas (usuario_id);

create function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.perfiles (id) values (new.id);
    return new;
end;
$$;

create trigger al_registrar_usuario
after insert on auth.users
for each row execute function public.crear_perfil();

alter table public.perfiles enable row level security;
alter table public.tareas enable row level security;

create policy "perfiles_ver_propio" on public.perfiles
    for select to authenticated
    using (id = (select auth.uid()));

create policy "perfiles_editar_propio" on public.perfiles
    for update to authenticated
    using (id = (select auth.uid()))
    with check (id = (select auth.uid()));

create policy "tareas_ver_propias" on public.tareas
    for select to authenticated
    using (usuario_id = (select auth.uid()));

create policy "tareas_crear_propias" on public.tareas
    for insert to authenticated
    with check (usuario_id = (select auth.uid()));

create policy "tareas_editar_propias" on public.tareas
    for update to authenticated
    using (usuario_id = (select auth.uid()))
    with check (usuario_id = (select auth.uid()));

create policy "tareas_borrar_propias" on public.tareas
    for delete to authenticated
    using (usuario_id = (select auth.uid()));

grant select, update on public.perfiles to authenticated;
grant select, insert, update, delete on public.tareas to authenticated;
