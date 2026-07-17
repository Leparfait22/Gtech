'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  // Verify admin authorization
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return { error: 'Non autorisé. Droits administrateur requis.' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  
  const defaultFeaturesJson = formData.get('default_features') as string
  const default_features = defaultFeaturesJson ? JSON.parse(defaultFeaturesJson) : []

  if (!name) {
    return { error: 'Le nom de la catégorie est obligatoire' }
  }

  const slug = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, slug, description, default_features }])
    .select()

  if (error) {
    console.error('Error creating category:', error)
    return { error: 'Erreur lors de la création de la catégorie' }
  }

  revalidatePath('/admin/produits')
  revalidatePath('/admin/produits/new')
  
  return { success: true, data }
}
