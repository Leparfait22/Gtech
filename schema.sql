-- Habilitar a extensão para UUID
create extension if not exists "uuid-ossp";

-- 1. Tabela de Categorias
create table if not exists public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text not null unique,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela de Produtos
create table if not exists public.products (
    id uuid default uuid_generate_v4() primary key,
    category_id uuid references public.categories(id) on delete set null,
    title text not null,
    slug text not null unique,
    description text,
    price numeric(10, 2) not null,
    promotional_price numeric(10, 2),
    stock integer default 0 not null,
    image_url text,
    condition text default 'Neuf',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Configuração de RLS (Row Level Security)
-- Habilita segurança nas tabelas
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Políticas: Leitura pública para todos
create policy "Categorias visíveis publicamente" on public.categories for select using (true);
create policy "Produtos visíveis publicamente" on public.products for select using (true);

-- Políticas: Apenas usuários autenticados (admin) podem inserir/atualizar
create policy "Apenas admin modifica categorias" on public.categories for all using (auth.role() = 'authenticated');
create policy "Apenas admin modifica produtos" on public.products for all using (auth.role() = 'authenticated');
