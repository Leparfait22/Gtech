import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { AlertCircle, LayoutDashboard } from 'lucide-react'

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-zinc-900 rounded-lg border border-dashed p-8 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
      </div>
      
      <h2 className="text-3xl font-bold tracking-tight mb-2">
        Page Admin Introuvable
      </h2>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        La section d'administration que vous essayez d'atteindre n'existe pas ou n'est pas encore implémentée.
      </p>

      <Link href="/admin">
        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900">
          <LayoutDashboard className="w-4 h-4 mr-2" /> Retour au Dashboard
        </Button>
      </Link>
    </div>
  )
}
