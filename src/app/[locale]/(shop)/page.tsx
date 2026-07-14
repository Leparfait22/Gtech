import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, Truck, Clock, Wrench } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { ProductCard } from '@/components/product/ProductCard'
import { FilterBar } from '@/components/catalogue/FilterBar'
import { Link } from '@/i18n/routing'

// Mock products fallback
const MOCK_PRODUCTS = [
  {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    title: 'Casque Audio Premium Sans Fil',
    slug: 'casque-audio-premium',
    price: 299.99,
    promotional_price: 249.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stock: 10
  },
  {
    id: 'a492f232-2d88-444a-9b80-8777eeb09a80',
    title: 'Montre Connectée Sport Pro',
    slug: 'montre-connectee-sport',
    price: 199.50,
    image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    stock: 15
  },
  {
    id: 'e88a38a7-9610-4493-86c3-181cb21fdb93',
    title: 'Appareil Photo Hybride 4K',
    slug: 'appareil-photo-hybride',
    price: 899.00,
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    stock: 5
  },
  {
    id: 'c51f4961-9c60-4654-8c01-7fa17e7d69b9',
    title: 'Enceinte Bluetooth Portable 360°',
    slug: 'enceinte-bluetooth-360',
    price: 129.99,
    promotional_price: 99.99,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    stock: 20
  }
]

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Extract filters from search parameters
  const category = params.category as string | undefined
  const condition = params.condition as string | undefined
  const minPrice = params.minPrice ? parseFloat(params.minPrice as string) : undefined
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice as string) : undefined
  const sort = (params.sort as string) || 'recent'

  // Fetch categories for the filter bar
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  // Build the featured products query
  let query = supabase
    .from('products')
    .select('*, categories(name)')
    .limit(4) // Limiting to 4 for the featured section

  // Apply filters
  if (category && category !== 'all') query = query.eq('category_id', category)
  if (condition && condition !== 'all') query = query.eq('condition', condition)
  if (minPrice !== undefined && !isNaN(minPrice)) query = query.gte('price', minPrice)
  if (maxPrice !== undefined && !isNaN(maxPrice)) query = query.lte('price', maxPrice)

  // Apply sorting
  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: dbProducts } = await query
  const products = dbProducts && dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS

  // se tem filtro, a gente ignora o MOCK e mostra vazio se não achar, ou mostra mock se não tem filtro?
  // Se o usuário filtrou algo e não retornou, melhor mostrar array vazio para indicar que o filtro não achou nada
  const hasActiveFilters = category || condition || minPrice || maxPrice
  const displayProducts = hasActiveFilters && (!dbProducts || dbProducts.length === 0) ? [] : products

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-zinc-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 opacity-80" />

          <div className="container relative z-10 mx-auto px-4 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6">
              Nouveau: L'ultime expérience
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              La technologie de demain,<br />aujourd'hui.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Découvrez notre sélection exclusive des meilleurs appareils électroniques. Design premium, performances exceptionnelles.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/catalogue">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full">
                  Voir le catalogue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
                Découvrir les promotions
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products Showcase */}
        <section className="py-20 bg-white dark:bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Produits en vedette</h2>
                <p className="text-muted-foreground">Découvrez nos articles les plus populaires du moment.</p>
              </div>
              <Link href="/catalogue">
                <Button variant="ghost" className="hidden sm:flex text-primary hover:text-primary/80">
                  Voir tout le catalogue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="mb-10">
              <FilterBar categories={categories || []} />
            </div>

            {displayProducts.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-xl border shadow-sm">
                <p className="text-muted-foreground">Aucun produit ne correspond à vos critères de recherche.</p>
                <Link href="/" className="text-primary hover:underline mt-4 inline-block">
                  Réinitialiser les filtres
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-center sm:hidden">
              <Link href="/catalogue" className="w-full">
                <Button variant="outline" className="w-full">
                  Voir tout le catalogue
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Technical Assistance / Repair Section */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 shadow-xl border border-zinc-800">
              {/* Placeholder image background */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=2000&auto=format&fit=crop" 
                  alt="Réparation de téléphone" 
                  className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/80 to-transparent"></div>
              </div>

              <div className="relative z-10 p-8 md:p-16 max-w-2xl">
                <div className="inline-flex items-center justify-center p-3 bg-primary/20 text-primary rounded-xl mb-6">
                  <Wrench className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                  Besoin d'une réparation ?
                </h2>
                <p className="text-lg text-zinc-300 mb-8 max-w-xl leading-relaxed">
                  Notre équipe d'experts est là pour donner une seconde vie à vos appareils. Écrans cassés, batteries défectueuses ou problèmes logiciels, nous avons la solution.
                </p>
                <Link href="/reparation">
                  <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full">
                    Faire un devis <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Livraison Rapide</h3>
                <p className="text-muted-foreground text-sm">Livraison gratuite sur toutes les commandes de plus de 100 FCFA.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Paiement Sécurisé</h3>
                <p className="text-muted-foreground text-sm">Vos données sont protégées par un cryptage de bout en bout.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Support Client 24/7</h3>
                <p className="text-muted-foreground text-sm">Une équipe dédiée pour vous aider à tout moment.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
