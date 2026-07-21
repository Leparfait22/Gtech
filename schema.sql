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
    images jsonb default '[]'::jsonb,
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

-- 4. Tabela de Banners Principais (Vídeos/Imagens)
create table if not exists public.hero_banners (
    id uuid default uuid_generate_v4() primary key,
    title text,
    media_url text not null,
    media_type text default 'video' not null,
    is_active boolean default true not null,
    display_order integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hero_banners enable row level security;
create policy "Banners visíveis publicamente" on public.hero_banners for select using (true);
create policy "Apenas admin modifica banners" on public.hero_banners for all using (auth.role() = 'authenticated');

-- Inserir um banner de vídeo temporário (exemplo da Apple)
insert into public.hero_banners (title, media_url, display_order)
values ('Vídeo Provisório Apple', 'https://www.apple.com/105/media/us/macbook-pro/2023/82abce04-b6db-484c-bdf6-e179262e3477/anim/hero/medium.mp4', 1);
