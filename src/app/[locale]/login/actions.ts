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

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Retornamos a mensagem de erro para o frontend se houver falha
    return { error: 'E-mail ou senha incorretos. Verifique suas credenciais.' }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}
