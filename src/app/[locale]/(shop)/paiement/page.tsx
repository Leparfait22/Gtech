'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { formatPrice } from '@/utils/formatPrice'

export default function CheckoutPage() {
  const t = useTranslations('Checkout')
  const cart = useCart()
  const router = useRouter()

  const totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 5.99
  const total = totalPrice + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate order processing
    router.push('/paiement/success')
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
        <Button onClick={() => router.push('/catalogue')}>Retourner au catalogue</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Paiement Sécurisé</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-6">
          <form id="checkout-form" onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Adresse de livraison</CardTitle>
                <CardDescription>Où devons-nous expédier votre commande ?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Code Postal</Label>
                    <Input id="zipCode" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Moyen de paiement</CardTitle>
                <CardDescription>Entrez vos informations de paiement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Date d'expiration</Label>
                    <Input id="expiry" placeholder="MM/AA" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="md:col-span-5">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden relative flex-shrink-0">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200" />
                      )}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium line-clamp-1">{item.title}</p>
                      <p className="text-muted-foreground">Qté: {item.quantity}</p>
                    </div>
                    <div className="font-medium">
                      {formatPrice(item.price * item.quantity)} FCFA
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(totalPrice)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frais de livraison</span>
                  <span>{formatPrice(shipping)} FCFA</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)} FCFA</span>
              </div>

              <Button type="submit" form="checkout-form" className="w-full text-white" size="lg">
                Confirmer le paiement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
