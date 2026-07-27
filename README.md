<div align="center">

# G-TECH STORE

**Plateforme e-commerce full-stack avec panneau d'administration intégré**  
Vente de produits tech neufs & reconditionnés + service de réparation — Lomé, Togo

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

</div>

---

## Sobre o Projeto

G-Tech Store é uma plataforma de e-commerce completa desenvolvida para uma loja real de tecnologia em Lomé, Togo. O projeto combina uma vitrine pública de produtos com um sistema administrativo protegido, permitindo que o dono da loja gerencie todo o catálogo, banners e pedidos diretamente pela interface web — sem precisar de acesso ao banco de dados.

A plataforma oferece duas propostas de valor: **venda de eletrônicos** (novos e recondicionados) e um **serviço de reparação** com formulário integrado ao WhatsApp para agilizar orçamentos.

---

## Stack Tecnológica

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 16.x | Framework React com App Router, SSR e Server Actions |
| **React** | 19.x | Biblioteca de interface |
| **TypeScript** | 5.x | Tipagem estática em todo o projeto |
| **Tailwind CSS** | v4 | Estilização utility-first com design system |
| **shadcn/ui** + **Base UI** | — | Componentes acessíveis (Sheet, Dialog, Cards) |
| **Framer Motion** | 12.x | Animações e transições |
| **Lucide React** | — | Biblioteca de ícones |

### Backend & Infraestrutura
| Tecnologia | Uso |
|---|---|
| **Supabase** | BaaS completo: PostgreSQL, Auth, Row Level Security |
| **Cloudflare R2** | Armazenamento de mídia (imagens e vídeos dos banners) |
| **Next.js Server Actions** | Lógica de servidor sem API routes separadas |
| **AWS SDK v3** | Integração com R2 via protocolo S3-compatível |

### Estado & Internacionalização
| Tecnologia | Uso |
|---|---|
| **Zustand** | Gerenciamento do carrinho com persistência no localStorage |
| **next-intl** | Estrutura de internacionalização (i18n) preparada |

---

## Funcionalidades

### Vitrine Pública
- **Homepage** com Hero Carousel dinâmico (vídeos e imagens do banco de dados)
- **Catálogo** com filtros por categoria, condição (novo/recondicionado), faixa de preço e ordenação
- **Página de produto** com carrossel de imagens, especificações e botão de adicionar ao carrinho
- **Carrinho lateral** (Sheet) persistente entre sessões via localStorage
- **Serviço de Reparação** com formulário que gera mensagem pré-formatada e abre o WhatsApp
- **Footer** com mapa Google Maps embutido, horários de funcionamento e contatos
- Design responsivo para mobile e desktop

### Painel Administrativo
Protegido por autenticação — acesso exclusivo para administradores.

- **Dashboard** com visão geral da loja
- **Gestão de Produtos**: criar, editar e deletar produtos com múltiplas imagens, preço promocional, estoque, categoria e condição
- **Gestão de Banners**: upload de vídeos/imagens para o Hero Carousel com controle de ordem e ativação
- **Gestão de Categorias**: criação de categorias via modal integrado

---

## Arquitetura

```
src/
├── app/
│   ├── [locale]/                   # Roteamento internacionalizado
│   │   ├── (shop)/                 # Grupo de rotas públicas (storefront)
│   │   │   ├── page.tsx            # Homepage — SSR com filtros dinâmicos
│   │   │   ├── catalogue/          # Catálogo completo
│   │   │   ├── produit/[id]/       # Página de produto individual
│   │   │   ├── reparation/         # Formulário de orçamento via WhatsApp
│   │   │   ├── paiement/           # Checkout
│   │   │   └── login/              # Autenticação admin
│   │   └── admin/                  # Painel administrativo (protegido)
│   │       ├── produits/           # CRUD de produtos
│   │       ├── banners/            # Gestão de banners
│   │       └── commandes/          # Pedidos
│   └── actions/                    # Next.js Server Actions
│       ├── productActions.ts       # CRUD de produtos
│       ├── bannerActions.ts        # CRUD de banners + ordenação
│       ├── categoryActions.ts      # CRUD de categorias
│       └── r2Actions.ts            # Upload de mídia via presigned URL
├── components/
│   ├── admin/                      # Formulários e tabelas do admin
│   ├── layout/                     # Header, Footer, HeroCarousel, CartSheet
│   ├── product/                    # ProductCard, ProductCarousel
│   └── ui/                         # Componentes base (shadcn/ui)
├── store/
│   └── cart.ts                     # Zustand store com persistência
└── utils/
    └── supabase/                   # Clientes Supabase (server/client/middleware)
```

### Decisões Técnicas

**Server Actions como camada de API**  
Em vez de criar rotas de API separadas (`/api/...`), todas as mutações (criar, editar, deletar) usam Server Actions do Next.js. Isso simplifica o código, elimina boilerplate de fetch/response e garante que a lógica de negócio fique no servidor.

**Upload de mídia com Presigned URLs**  
O upload de imagens e vídeos para o Cloudflare R2 usa presigned URLs — a Server Action gera uma URL temporária assinada e o cliente faz o upload diretamente para o R2, sem passar pelo servidor Next.js. Isso reduz latência e elimina limitações de payload.

**Row Level Security (RLS) no Supabase**  
As tabelas têm políticas de segurança em nível de linha:
- Leitura pública para produtos, categorias e banners
- Escrita restrita a usuários com `app_metadata.role = 'admin'`

**Proteção dupla do painel admin**  
O acesso ao `/admin` é protegido em duas camadas:
1. **Middleware** (`proxy.ts`): intercepta todas as requisições e verifica a sessão Supabase
2. **Layout server-side** (`admin/layout.tsx`): verifica a sessão e o role de admin antes de renderizar qualquer conteúdo

---

## Banco de Dados

Schema PostgreSQL gerenciado pelo Supabase com 3 tabelas principais:

```sql
-- Categorias de produtos
categories (id, name, slug, description, created_at)

-- Produtos com suporte a múltiplas imagens e preço promocional
products (id, category_id, title, slug, description, price, 
          promotional_price, stock, image_url, condition, images, created_at)

-- Banners do Hero Carousel (vídeos e imagens)
hero_banners (id, title, media_url, media_type, is_active, display_order, created_at)
```

---

## Configuração

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Bucket no [Cloudflare R2](https://www.cloudflare.com/products/r2/) (para upload de mídia)

### Instalação

```bash
git clone https://github.com/Leparfait22/Gtech.git
cd Gtech
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase — encontre em: Dashboard > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudflare R2 — para upload de imagens e vídeos
R2_ACCOUNT_ID=xxxxxxxxxxxx
R2_ACCESS_KEY_ID=xxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxx
R2_BUCKET_NAME=nome-do-bucket
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxxxxxxxxx.r2.dev
```

### Banco de Dados

Execute o schema no SQL Editor do Supabase:

```bash
# Copie o conteúdo do arquivo schema.sql e execute no Supabase Dashboard
# Dashboard > SQL Editor > New query
```

### Criar usuário admin

No Supabase Dashboard, após criar o usuário via Authentication, execute:

```sql
-- Substituir pelo ID real do usuário
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
WHERE id = 'UUID_DO_USUARIO';
```

### Executar

```bash
npm run dev
# Acesse http://localhost:3000
# Admin: http://localhost:3000/admin
```

---

## Licença

MIT — livre para uso e adaptação.

---

<div align="center">
  <sub>Desenvolvido com Next.js 16, Supabase e Cloudflare R2</sub>
</div>
