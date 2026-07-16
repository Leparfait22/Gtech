import { Link } from '@/i18n/routing'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export function Footer() {
  return (
    <div className="mt-auto flex flex-col">
      {/* Map Section */}
      <div className="w-full h-[300px] border-t">
        <iframe
          src="https://www.google.com/maps?q=6.137617111206055,1.2280464172363281&z=17&hl=fr&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation de la boutique"
        ></iframe>
      </div>

      <footer className="bg-[#0f172a] text-zinc-300 py-12 text-sm">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
             
              <span className="font-bold text-white tracking-widest text-lg">G-TECH STORE</span>
            </div>
            <p className="text-zinc-400 mt-4 leading-relaxed max-w-xs">
              La Tech Premium au meilleur prix. Produits neufs et reconditionnés, qualité garantie.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-bold text-white tracking-widest uppercase text-xs mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-white transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/notre-boutique" className="hover:text-white transition-colors">
                  Notre Boutique & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-white tracking-widest uppercase text-xs mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-zinc-400 shrink-0" />
                <span>+228 79542958</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-zinc-400 shrink-0" />
                <a href="mailto:G-TECHstore2k21@gmail.com" className="hover:text-white transition-colors">
                  remamoussougan@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-zinc-400 shrink-0" />
                <a 
                  href="https://www.google.com/maps?q=6.137617111206055,1.2280464172363281" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Decon Allo Mobile - Non loin de NOPEGALI
                </a>
              </li>
            
            </ul>
          </div>

          {/* Horaires */}
          <div className="space-y-4">
            <h3 className="font-bold text-white tracking-widest uppercase text-xs mb-4">Horaires</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-zinc-400 shrink-0" />
                <span>Lundi à Samedi : 09H30 - 20H30</span>
              </li>
              <li className="flex items-start gap-3 pl-7">
                <span>Dimanche : Fermé</span>
              </li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  )
}
