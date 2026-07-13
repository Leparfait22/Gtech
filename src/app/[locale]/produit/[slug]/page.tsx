import { Header } from '@/components/layout/Header'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, Shield, Truck } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { AddToCartButton } from './AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('slug', slug)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-8">
          <Link href="/catalogue" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au catalogue
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            {/* Product Image */}
            <div className="aspect-square relative bg-zinc-100 rounded-3xl overflow-hidden shadow-sm">
              {product.image_url ? (
                <Image 
                  src={product.image_url} 
                  alt={product.title} 
                  fill 
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  Sans image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <span className="text-primary font-medium mb-2 tracking-wider uppercase text-sm">
                {product.categories?.name || 'Général'}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {product.title}
              </h1>
              
              <div className="text-3xl font-medium mb-6 flex items-end gap-3">
                {product.promotional_price ? (
                  <>
                    <span>{product.promotional_price}€</span>
                    <span className="text-xl text-muted-foreground line-through mb-1">{product.price}€</span>
                  </>
                ) : (
                  <span>{product.price}€</span>
                )}
              </div>

              <div className="prose dark:prose-invert text-muted-foreground mb-8">
                <p>{product.description || "Aucune description n'est disponible pour ce produit."}</p>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>En stock et prêt à être expédié ({product.stock} disponibles)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  <span>Livraison gratuite en 24/48h</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span>Garantie constructeur de 2 ans incluse</span>
                </div>
              </div>

              <AddToCartButton product={{
                id: product.id,
                title: product.title,
                price: product.promotional_price || product.price,
                imageUrl: product.image_url
              }} disabled={product.stock <= 0} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
