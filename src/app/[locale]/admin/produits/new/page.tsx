import { createClient } from '@/utils/supabase/server'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, default_features')
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Link href="/admin/produits" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux produits
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Ajouter un produit</h2>
        <p className="text-muted-foreground">Créez un nouveau produit pour votre catalogue.</p>
      </div>

      {(!categories || categories.length === 0) ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 p-6 rounded-xl flex flex-col items-start gap-4">
          <div>
            <h3 className="font-semibold text-lg">Aucune catégorie disponible</h3>
            <p className="mt-1">Vous devez créer au moins une catégorie avant de pouvoir ajouter un produit.</p>
          </div>
          <Link href="/admin/categories">
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              Créer une catégorie
            </Button>
          </Link>
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  )
}
