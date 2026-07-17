import { ShoppingCart } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCommandesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Commandes
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez les commandes de vos clients et suivez leurs statuts.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white dark:bg-zinc-900 rounded-lg border border-dashed p-8 text-center">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Pas de commande pour le moment
        </h2>
        
        <p className="text-muted-foreground max-w-sm mx-auto">
          Lorsqu'un client passera une commande sur votre boutique, elle apparaîtra ici.
        </p>
      </div>
    </div>
  )
}
