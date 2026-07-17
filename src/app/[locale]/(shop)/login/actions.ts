'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  let errorResponse = null

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.error('Login error:', error)
      errorResponse = error.message || 'E-mail ou mot de passe incorrect.'
    } else if (authData?.user?.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut()
      errorResponse = "Accès refusé. Vous n'avez pas les droits d'administrateur."
    }
  } catch (err: any) {
    console.error('Unexpected login error:', err)
    errorResponse = err.message || 'Une erreur de réseau ou de communication avec le serveur est survenue. Veuillez réessayer.'
  }

  if (errorResponse) {
    return { error: errorResponse }
  }

  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

