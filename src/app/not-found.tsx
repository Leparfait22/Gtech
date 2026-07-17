import { AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="fr">
      <body>
        <main className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-zinc-50 px-4 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Page indisponible
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            La page que vous recherchez semble introuvable. Elle a peut-être été supprimée, renommée, ou son adresse est temporairement indisponible.
          </p>

          <Link href="/" className="inline-flex items-center justify-center rounded-full px-8 h-12 bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors">
            <Home className="w-4 h-4 mr-2" /> Retour à l'accueil
          </Link>
        </main>
      </body>
    </html>
  )
}
