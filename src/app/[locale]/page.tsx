import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react'

export default function Home() {
  const t = useTranslations('Navigation')

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-zinc-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 opacity-80" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6">
              Nouveau: L'ultime expérience
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              La technologie de demain,<br />aujourd'hui.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Découvrez notre sélection exclusive des meilleurs appareils électroniques. Design premium, performances exceptionnelles.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full">
                Voir le catalogue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
                Découvrir les promotions
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Livraison Rapide</h3>
                <p className="text-muted-foreground text-sm">Livraison gratuite sur toutes les commandes de plus de 100€.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Paiement Sécurisé</h3>
                <p className="text-muted-foreground text-sm">Vos données sont protégées par un cryptage de bout en bout.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Support Client 24/7</h3>
                <p className="text-muted-foreground text-sm">Une équipe dédiée pour vous aider à tout moment.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
