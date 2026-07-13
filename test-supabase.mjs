import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import ws from 'ws'

const envFile = fs.readFileSync('.env.local', 'utf8')
const envLines = envFile.split('\n').filter(line => line.trim() && !line.startsWith('#'))

const env = {}
for (const line of envLines) {
  const [key, ...valueParts] = line.split('=')
  if (key) {
    env[key.trim()] = valueParts.join('=').trim()
  }
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!supabaseUrl || !supabaseKey) {
  console.error("As chaves estão faltando no .env.local!")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    WebSocket: ws
  }
})

async function testConnection() {
  try {
    // Tenta listar buckets para validar a chave (é uma operação que exige chave anon válida)
    const { data, error } = await supabase.storage.listBuckets()
    
    if (error) {
      if (error.message.includes('API key')) {
        console.error("Erro de Autenticação: Chave API inválida.")
        process.exit(1)
      } else {
        // Pode dar erro de RLS, mas se chegar aqui a comunicação foi bem sucedida
        console.log("Comunicação com Supabase testada (Resposta recebida).")
      }
    } else {
      console.log("Conexão e Autenticação com Supabase validadas com SUCESSO! 🎉")
    }
  } catch (err) {
    console.error("Erro fatal ao tentar conectar:", err.message)
    process.exit(1)
  }
}

testConnection()
