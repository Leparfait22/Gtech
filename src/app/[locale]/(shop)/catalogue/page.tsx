import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { FilterBar } from '@/components/catalogue/FilterBar'
import { formatPrice } from '@/utils/formatPrice'

export const metadata = {
  title: 'Catalogue',
}

export default async function CataloguePage({
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

  // Build the products query
  let query = supabase
    .from('products')
    .select('*, categories(name)')

  // Apply category filter
  if (category && category !== 'all') {
    query = query.eq('category_id', category)
  }

  // Apply condition filter
  if (condition && condition !== 'all') {
    query = query.eq('condition', condition)
  }

  // Apply price range filters
  if (minPrice !== undefined && !isNaN(minPrice)) {
    // Check both price and promotional_price (complex in standard Supabase client, so we do a simple filter or a complex string filter)
    // For simplicity, we can filter by the regular price. A more accurate filter would use an `or` statement
    query = query.gte('price', minPrice)
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    query = query.lte('price', maxPrice)
  }

  // Apply sorting
  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    // Default: recent
    query = query.order('created_at', { ascending: false })
  }

  const { data: products, error } = await query

  return (
    <>
      <main className="flex-1 bg-muted/20 min-h-screen pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Catalogue complet</h1>
            <p className="text-muted-foreground">Découvrez tous nos produits technologiques de pointe.</p>
          </div>

          <FilterBar categories={categories || []} />

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md mb-8">
              Une erreur s'est produite lors du chargement des produits.
            </div>
          )}

          {!products || products.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm">
              <p className="text-muted-foreground">Aucun produit ne correspond à vos critères de recherche.</p>
              <Link href="/catalogue" className="text-primary hover:underline mt-4 inline-block">
                Réinitialiser les filtres
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link href={`/produit/${product.id}`} key={product.id} className="group flex flex-col bg-card rounded-xl border overflow-hidden hover:shadow-md transition-shadow relative">
                  <div className="aspect-square relative bg-zinc-100 overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        Sans image
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.condition && (
                        <div className="bg-white/90 backdrop-blur text-zinc-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm border">
                          {product.condition}
                        </div>
                      )}
                    </div>
                    {product.promotional_price && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        PROMO
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-muted-foreground mb-1">
                      {product.categories?.name || 'Général'}
                    </span>
                    <h3 className="font-medium text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-2">
                      {product.promotional_price ? (
                        <>
                          <span className="font-bold text-lg">{formatPrice(product.promotional_price)} FCFA</span>
                          <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)} FCFA</span>
                        </>
                      ) : (
                        <span className="font-bold text-lg">{formatPrice(product.price)} FCFA</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

