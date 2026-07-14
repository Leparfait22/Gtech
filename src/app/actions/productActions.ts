'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const promotional_price = formData.get('promotional_price') 
    ? parseFloat(formData.get('promotional_price') as string) 
    : null
  const stock = parseInt(formData.get('stock') as string, 10)
  const image_url = formData.get('image_url') as string
  const category_id = formData.get('category_id') as string
  const condition = formData.get('condition') as string || 'Neuf'
  
  const featuresJson = formData.get('features') as string
  const features = featuresJson ? JSON.parse(featuresJson) : []

  // Simple slug generation
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        title,
        slug,
        description,
        price,
        promotional_price,
        stock,
        image_url,
        category_id,
        condition,
        features
      }
    ])

  if (error) {
    console.error('Error creating product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/admin/produits', 'page')
  revalidatePath('/[locale]/catalogue', 'page')
  revalidatePath('/[locale]', 'page')
  
  return { success: true }
}
