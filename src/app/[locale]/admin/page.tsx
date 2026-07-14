import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Users, Euro } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { name: 'Revenu Total', value: ' FCFA45,231.89', icon: Euro, change: '+20.1%' },
    { name: 'Commandes', value: '+2350', icon: ShoppingCart, change: '+180.1%' },
    { name: 'Produits Actifs', value: '+12,234', icon: Package, change: '+19%' },
    { name: 'Nouveaux Clients', value: '+573', icon: Users, change: '+201 since last week' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aperçu des Ventes</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 flex justify-center items-center h-64 text-muted-foreground">
            [Graphique des Ventes - Espace Réservé]
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Commandes Récentes</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-64 text-muted-foreground">
            [Liste des Commandes - Espace Réservé]
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
