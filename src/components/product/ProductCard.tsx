import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { AddToCartButton } from '@/app/[locale]/(shop)/produit/[id]/AddToCartButton'
import { formatPrice } from '@/utils/formatPrice'

interface ProductCardProps {
  product: {
    id: string
    title: string
    slug: string
    price: number
    promotional_price?: number
    image_url: string
    stock: number
    condition?: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col bg-card rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      <Link href={`/produit/${product.id}`} className="block relative aspect-[4/3] bg-zinc-100 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-100">
            Image indisponible
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
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <Link href={`/produit/${product.id}`} className="flex-1">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="flex items-end gap-2 mb-4">
            {product.promotional_price ? (
              <>
                <span className="text-xl font-bold">{formatPrice(product.promotional_price)} FCFA</span>
                <span className="text-sm text-muted-foreground line-through mb-0.5">{formatPrice(product.price)} FCFA</span>
              </>
            ) : (
              <span className="text-xl font-bold">{formatPrice(product.price)} FCFA</span>
            )}
          </div>
        </Link>

        <div className="mt-auto pt-4 border-t">
          <AddToCartButton
            product={{
              id: product.id,
              title: product.title,
              price: product.promotional_price || product.price,
              imageUrl: product.image_url
            }}
            disabled={product.stock <= 0}
          />
        </div>
      </div>
    </div>
  )
}
