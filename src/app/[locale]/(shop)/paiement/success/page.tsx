'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { CheckCircle2 } from 'lucide-react'

export default function SuccessPage() {
  const t = useTranslations('Checkout')
  const cart = useCart()
  const router = useRouter()

  useEffect(() => {
    // Clear the cart when the user lands on the success page
    cart.clearCart()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Commande Confirmée !</h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
        Merci pour votre achat. Nous avons reçu votre commande et nous la préparerons pour l'expédition sous peu.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => router.push('/catalogue')} size="lg" className="text-white">
          Continuer vos achats
        </Button>
      </div>
    </div>
  )
}
