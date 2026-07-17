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

      <ProductForm categories={categories || []} />
    </div>
  )
}
