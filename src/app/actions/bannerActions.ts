'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBanner(formData: FormData) {
  const supabase = await createClient()

  // Verify admin authorization
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return { success: false, error: 'Non autorisé. Droits administrateur requis.' }
  }

  const title = formData.get('title') as string
  const media_url = formData.get('media_url') as string
  const media_type = formData.get('media_type') as string || 'video'
  
  // Get max display_order to append the new banner at the end
  const { data: maxOrderData } = await supabase
    .from('hero_banners')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
  
  const display_order = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].display_order + 1 : 1

  const { data, error } = await supabase
    .from('hero_banners')
    .insert([
      {
        title,
        media_url,
        media_type,
        display_order,
        is_active: true
      }
    ])

  if (error) {
    console.error('Error creating banner:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/admin/banners', 'page')
  revalidatePath('/[locale]', 'page')
  
  return { success: true }
}

export async function toggleBannerStatus(id: string, is_active: boolean) {
  const supabase = await createClient()

  // Verify admin authorization
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return { success: false, error: 'Non autorisé. Droits administrateur requis.' }
  }

  const { error } = await supabase
    .from('hero_banners')
    .update({ is_active })
    .eq('id', id)

  if (error) {
    console.error('Error toggling banner status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/admin/banners', 'page')
  revalidatePath('/[locale]', 'page')
  return { success: true }
}

export async function updateBannerOrder(orderedIds: string[]) {
  const supabase = await createClient()

  // Verify admin authorization
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return { success: false, error: 'Non autorisé. Droits administrateur requis.' }
  }

  // Update each banner's display_order based on its index in the array
  const updates = orderedIds.map((id, index) => 
    supabase
      .from('hero_banners')
      .update({ display_order: index + 1 })
      .eq('id', id)
  )

  await Promise.all(updates)

  revalidatePath('/[locale]/admin/banners', 'page')
  revalidatePath('/[locale]', 'page')
  return { success: true }
}

export async function deleteBanner(id: string) {
  const supabase = await createClient()

  // Verify admin authorization
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return { success: false, error: 'Non autorisé. Droits administrateur requis.' }
  }

  const { error } = await supabase
    .from('hero_banners')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting banner:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/[locale]/admin/banners', 'page')
  revalidatePath('/[locale]', 'page')
  return { success: true }
}
