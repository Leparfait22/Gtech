import { ShieldCheck, Truck, Clock, MapPin, Mail, Phone, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function NotreBoutiquePage() {
  return (
    <main className="flex-1 bg-white dark:bg-zinc-950">
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555529733-0e670560f4e1?q=80&w=2000&auto=format&fit=crop" 
            alt="Intérieur de la boutique G-Tech" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md text-white rounded-xl mb-6 border border-white/20">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-lg">
            Notre Boutique
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto drop-shadow-md">
            G-Tech Store : Votre référence de confiance à Lomé pour l'électronique premium, le reconditionné certifié et la réparation d'expertise.
          </p>
        </div>
      </section>

      {/* Nos Différences */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Nos Différences</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nous ne faisons pas que vendre des appareils. Nous vous accompagnons avec une expertise technique et un service client inégalé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm border text-center transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualité Garantie</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tous nos produits, qu'ils soient neufs ou reconditionnés, passent par des tests rigoureux pour garantir une performance optimale.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-sm border text-center transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Livraison Rapide</h3>
              <p className="text-muted-foreground leading-relaxed">
                Profitez d'un service de livraison express directement à votre porte, ou récupérez vos achats en magasin selon vos préférences.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-sm border text-center transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Support Technique</h3>
              <p className="text-muted-foreground leading-relaxed">
                Notre équipe de techniciens spécialisés est à votre disposition pour le SAV, les réparations complexes et les conseils d'utilisation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Au cœur de G-Tech</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre espace conçu pour vous offrir la meilleure expérience technologique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl overflow-hidden h-64 shadow-sm">
              <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop" alt="Smartphones en rayon" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-64 shadow-sm lg:col-span-2">
              <img src="https://images.unsplash.com/photo-1601524909162-ae8725290836?q=80&w=1200&auto=format&fit=crop" alt="Espace de réparation tech" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-64 shadow-sm lg:col-span-2">
              <img src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1200&auto=format&fit=crop" alt="Accessoires premium" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-64 shadow-sm">
              <img src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop" alt="Laptops et ordinateurs" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Localisation */}
      <section className="py-24 bg-zinc-950 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Formulaire */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Contactez-nous</h2>
              <p className="text-zinc-400 mb-8">
                Une question sur un produit ? Besoin d'un devis pour une réparation ? Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
              </p>

              <form action="mailto:remamoussougan@gmail.com" method="GET" encType="text/plain" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Nom complet</label>
                    <Input name="subject" placeholder="Jean Dupont" className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary h-12" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Email</label>
                    <Input type="email" placeholder="jean@exemple.com" className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary h-12" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Message</label>
                  <Textarea name="body" placeholder="Comment pouvons-nous vous aider ?" className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary min-h-[150px] resize-none" required />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-full">
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Infos & Map */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6">Nos Coordonnées</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 border border-zinc-800">
                      <MapPin className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">Adresse</p>
                      <p className="text-zinc-400 mt-1">Decon Allo Mobile<br />Non loin de NOPEGALI<br />Lomé, Togo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 border border-zinc-800">
                      <Phone className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">Téléphone / WhatsApp</p>
                      <p className="text-zinc-400 mt-1">+228 79542958</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 border border-zinc-800">
                      <Mail className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">Email</p>
                      <p className="text-zinc-400 mt-1">remamoussougan@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden h-64 border border-zinc-800">
                <iframe
                  src="https://www.google.com/maps?q=6.137617111206055,1.2280464172363281&z=17&hl=fr&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation de la boutique G-Tech"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
