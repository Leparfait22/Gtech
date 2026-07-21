import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, Shield, Truck, Cpu, HardDrive, Monitor, Camera, Battery, Gamepad, Settings, Smartphone, MemoryStick } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { AddToCartButton } from './AddToCartButton'
import { formatPrice } from '@/utils/formatPrice'
import { ProductCarousel } from '@/components/product/ProductCarousel'

// Mock products fallback
const MOCK_PRODUCTS = [
  {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    title: 'Casque Audio Premium Sans Fil',
    slug: 'casque-audio-premium',
    price: 299.99,
    promotional_price: 249.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stock: 10,
    description: 'Une expérience sonore incroyable avec réduction de bruit active.'
  },
  {
    id: 'a492f232-2d88-444a-9b80-8777eeb09a80',
    title: 'Montre Connectée Sport Pro',
    slug: 'montre-connectee-sport',
    price: 199.50,
    image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    stock: 15,
    description: 'Montre connectée avec suivi cardio et GPS intégré pour les sportifs.'
  },
  {
    id: 'e88a38a7-9610-4493-86c3-181cb21fdb93',
    title: 'Appareil Photo Hybride 4K',
    slug: 'appareil-photo-hybride',
    price: 899.00,
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    stock: 5,
    description: 'Qualité professionnelle, vidéo 4K et objectifs interchangeables.'
  },
  {
    id: 'c51f4961-9c60-4654-8c01-7fa17e7d69b9',
    title: 'Enceinte Bluetooth Portable 360°',
    slug: 'enceinte-bluetooth-360',
    price: 129.99,
    promotional_price: 99.99,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    stock: 20,
    description: 'Un son immersif à 360 degrés pour animer toutes vos soirées.'
  }
]

const IconMap: Record<string, any> = {
  Cpu, HardDrive, Monitor, Camera, Battery, Gamepad, Settings, Smartphone, MemoryStick
}

function getFeatureIcon(label: string, iconName?: string) {
  if (iconName && IconMap[iconName]) {
    const Icon = IconMap[iconName]
    return <Icon className="w-5 h-5" />
  }

  const l = label.toLowerCase()
  if (l.includes('stockage') || l.includes('ssd') || l.includes('rom') || l.includes('disque')) return <HardDrive className="w-5 h-5" />
  if (l.includes('écran') || l.includes('ecran') || l.includes('affichage')) return <Monitor className="w-5 h-5" />
  if (l.includes('caméra') || l.includes('photo') || l.includes('objectif')) return <Camera className="w-5 h-5" />
  if (l.includes('batterie') || l.includes('autonomie')) return <Battery className="w-5 h-5" />
  if (l.includes('processeur') || l.includes('puce') || l.includes('cpu') || l.includes('ram') || l.includes('mémoire')) return <Cpu className="w-5 h-5" />
  if (l.includes('manette') || l.includes('contrôleur') || l.includes('jeu')) return <Gamepad className="w-5 h-5" />
  return <Settings className="w-5 h-5" />
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  let { data: product } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single()

  if (!product) {
    product = MOCK_PRODUCTS.find(p => p.id === id) as any
  }

  if (!product) {
    notFound()
  }

  return (
    <>
      <main className="flex-1 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-8">
          <Link href="/catalogue" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au catalogue
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            {/* Product Image Carousel */}
            <ProductCarousel
              mainImage={product.image_url}
              additionalImages={product.images}
              title={product.title}
            />

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                {product.condition && (
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold px-3 py-1 rounded-full border">
                    {product.condition}
                  </span>
                )}
                <span className="text-primary font-medium tracking-wider uppercase text-sm">
                  {product.categories?.name || 'Général'}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {product.title}
              </h1>

              <div className="text-3xl font-medium mb-6 flex items-end gap-3">
                {product.promotional_price ? (
                  <>
                    <span>{formatPrice(product.promotional_price)} FCFA</span>
                    <span className="text-xl text-muted-foreground line-through mb-1">{formatPrice(product.price)} FCFA</span>
                  </>
                ) : (
                  <span>{formatPrice(product.price)} FCFA</span>
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

              {/* Technical Features Section */}
              {product.features && product.features.length > 0 && (
                <div className="mb-10">
                  <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-zinc-800 dark:text-zinc-200">
                    <Cpu className="w-5 h-5 text-primary" />
                    Caractéristiques techniques
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.features.map((feature: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg text-zinc-600 dark:text-zinc-400">
                          {getFeatureIcon(feature.label, feature.icon)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none mb-1">{feature.label}</span>
                          <span className="font-semibold text-sm leading-none">{feature.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
