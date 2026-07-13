import { Header } from '@/components/layout/Header'
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import { Link } from '@/i18n/routing'

export default async function CataloguePage() {
  const supabase = await createClient()
  
  // Buscar produtos do banco
  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/20 min-h-screen pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Catalogue complet</h1>
            <p className="text-muted-foreground">Découvrez tous nos produits technologiques de pointe.</p>
          </div>
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md mb-8">
              Une erreur s'est produite lors du chargement des produits.
            </div>
          )}

          {!products || products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Aucun produit trouvé dans le catalogue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link href={`/produit/${product.slug}`} key={product.id} className="group flex flex-col bg-card rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
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
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-muted-foreground mb-1">
                      {product.categories?.name || 'Général'}
                    </span>
                    <h3 className="font-medium text-lg leading-tight mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-2">
                      {product.promotional_price ? (
                        <>
                          <span className="font-bold text-lg">{product.promotional_price}€</span>
                          <span className="text-sm text-muted-foreground line-through">{product.price}€</span>
                        </>
                      ) : (
                        <span className="font-bold text-lg">{product.price}€</span>
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
