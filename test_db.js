import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Conectando ao Supabase...")
  const { data, error } = await supabase.from('products').select('*').limit(1)
  
  if (error) {
    console.error("Erro na conexão/tabela:", error.message)
  } else {
    console.log("Sucesso! Supabase conectado e tabela 'products' existe.")
    console.log("Dados:", data)
  }
}

test()
