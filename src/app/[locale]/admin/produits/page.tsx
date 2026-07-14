import { createClient } from '@/utils/supabase/server'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'

import { CategoryModal } from '@/components/admin/CategoryModal'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Produits</h2>
          <p className="text-muted-foreground">Gérez le catalogue de votre boutique.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CategoryModal />
          <Link href="/admin/produits/new" className="flex-1 sm:flex-none">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nouveau Produit</span>
              <span className="sm:hidden">Produit</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Produit</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun produit trouvé. Commencez par en ajouter un.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-zinc-100 flex-shrink-0">
                          {product.image_url ? (
                            <Image src={product.image_url} alt={product.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Img</div>
                          )}
                        </div>
                        <span className="font-medium truncate max-w-[200px]">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {product.categories?.name || 'Sans catégorie'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        {product.promotional_price ? (
                          <>
                            <span className="font-semibold text-green-600 dark:text-green-400">{product.promotional_price} FCFA</span>
                            <span className="text-xs text-muted-foreground line-through">{product.price} FCFA</span>
                          </>
                        ) : (
                          <span className="font-medium">{product.price} FCFA</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <span>{product.stock}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
