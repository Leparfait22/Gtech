'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Wrench, Phone, AlertCircle } from 'lucide-react'


export default function ReparationPage() {
  const [model, setModel] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')

  const WHATSAPP_NUMBER = '5549999802249' // Format international sans le +

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Format the message
    const message = `Bonjour G-TECH STORE,%0A%0AJe souhaite avoir un devis pour une réparation.%0A%0A*Nom:* ${name || 'Non spécifié'}%0A*Modèle de l'appareil:* ${model}%0A*Description du problème:*%0A${description}%0A%0A(Envoyé depuis le site web)`

    // Create the WhatsApp URL
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-4">
          <Wrench className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Service de Réparation</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Décrivez le problème de votre appareil et obtenez un devis rapidement. Vous pourrez nous envoyer des photos directement sur WhatsApp.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demande de devis gratuit</CardTitle>
          <CardDescription>
            Remplissez ce formulaire. Vous serez redirigé vers WhatsApp pour finaliser l'envoi de votre demande.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Votre Nom (Optionnel)</Label>
              <Input
                id="name"
                placeholder="Ex: Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modèle de l'appareil <span className="text-red-500">*</span></Label>
              <Input
                id="model"
                placeholder="Ex: iPhone 13 Pro, Samsung Galaxy S22..."
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du problème <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Décrivez en détail ce qui ne va pas avec votre appareil (écran cassé, batterie qui se décharge vite, ne s'allume plus...)"
                className="min-h-[120px]"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-900">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>Astuce :</strong> Si vous avez des photos de l'appareil endommagé, vous pourrez les joindre directement dans la conversation WhatsApp qui va s'ouvrir.
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-14 bg-[#25D366] hover:bg-[#128C7E] text-white">
              <Phone className="w-5 h-5 mr-2" />
              Demander un devis sur WhatsApp
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
