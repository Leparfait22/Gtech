import { createClient } from '@/utils/supabase/server'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id

  const supabase = await createClient()

  // Fetch product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

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
        <h2 className="text-2xl font-bold tracking-tight">Modifier le produit</h2>
        <p className="text-muted-foreground">Modifiez les informations de "{product.title}".</p>
      </div>

      <ProductForm categories={categories || []} product={product} />
    </div>
  )
}
