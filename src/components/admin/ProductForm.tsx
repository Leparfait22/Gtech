'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct } from '@/app/actions/productActions'
import { Loader2, Plus, Trash2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  default_features?: {label: string, icon: string}[]
}

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  promotional_price: number | null
  stock: number
  category_id: string
  condition: string
  image_url: string | null
  features: {label: string, value: string, icon?: string}[] | null
  images?: string[] | null
}

export function ProductForm({ categories, product }: { categories: Category[], product?: Product }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [features, setFeatures] = useState<{label: string, value: string, icon?: string}[]>(
    product?.features && Array.isArray(product.features) ? product.features : []
  )
  const [images, setImages] = useState<string[]>(
    product?.images && Array.isArray(product.images) ? product.images : []
  )
  const router = useRouter()

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatId = e.target.value
    const cat = categories.find(c => c.id === newCatId)
    
    if (cat && cat.default_features && cat.default_features.length > 0) {
      const allEmpty = features.every(f => f.value.trim() === '')
      if (allEmpty) {
        setFeatures(cat.default_features.map(f => ({ label: f.label, value: '', icon: f.icon })))
      }
    }
  }

  const addFeature = () => setFeatures([...features, { label: '', value: '', icon: '' }])
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index))
  const updateFeature = (index: number, key: 'label' | 'value', val: string) => {
    const newFeatures = [...features]
    newFeatures[index][key] = val
    setFeatures(newFeatures)
  }

  const addImage = () => setImages([...images, ''])
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index))
  const updateImage = (index: number, val: string) => {
    const newImages = [...images]
    newImages[index] = val
    setImages(newImages)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    formData.append('features', JSON.stringify(features.filter(f => f.label.trim() && f.value.trim())))
    formData.append('images', JSON.stringify(images.filter(img => img.trim())))
    
    const result = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData)

    if (result.success) {
      router.push('/admin/produits')
      router.refresh()
    } else {
      setError(result.error || 'Une erreur est survenue.')
      setIsLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Nom du produit *</Label>
        <Input id="title" name="title" required defaultValue={product?.title} placeholder="Ex: Casque Audio Premium" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description || ''}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Décrivez votre produit..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Prix normal ( FCFA) *</Label>
          <Input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="promotional_price">Prix promotionnel ( FCFA)</Label>
          <Input id="promotional_price" name="promotional_price" type="number" step="0.01" min="0" defaultValue={product?.promotional_price || ''} placeholder="0.00" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock disponible *</Label>
          <Input id="stock" name="stock" type="number" min="0" required defaultValue={product?.stock} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_id">Catégorie *</Label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={product?.category_id || ""}
            onChange={handleCategoryChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Sélectionnez une catégorie...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="condition">État du produit *</Label>
          <select
            id="condition"
            name="condition"
            required
            defaultValue={product?.condition || "Neuf"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Neuf">Neuf</option>
            <option value="Occasion">Occasion</option>
            <option value="Reconditionné">Reconditionné</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="image_url">URL de l'image (Optionnel)</Label>
          <Input id="image_url" name="image_url" type="url" defaultValue={product?.image_url || ''} placeholder="https://images.unsplash.com/..." />
          <p className="text-xs text-muted-foreground">Collez un lien direct vers l'image du produit.</p>
        </div>
      </div>

      {/* Additional Images Section */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Images supplémentaires (Optionnel)</Label>
            <p className="text-xs text-muted-foreground">Ajoutez d'autres photos sous différents angles.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addImage}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter uma imagem
          </Button>
        </div>

        {images.length === 0 && (
          <p className="text-sm text-muted-foreground italic">Aucune image supplémentaire.</p>
        )}

        <div className="grid grid-cols-1 gap-3">
          {images.map((image, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/... (Angle/Détail)"
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  required
                />
              </div>
              {image && (image.startsWith('http://') || image.startsWith('https://')) && (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border bg-zinc-100 flex-shrink-0">
                  <img src={image} alt={`Aperçu ${index + 1}`} className="object-cover w-full h-full" />
                </div>
              )}
              <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeImage(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label>Caractéristiques techniques (Fiche Technique)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter une caractéristique
          </Button>
        </div>
        
        {features.length === 0 && (
          <p className="text-sm text-muted-foreground italic">Aucune caractéristique ajoutée. Ex: "RAM" - "32Go"</p>
        )}

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1 space-y-1">
                <Input 
                  placeholder="Label (Ex: RAM, Processeur...)" 
                  value={feature.label}
                  onChange={(e) => updateFeature(index, 'label', e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 space-y-1">
                <Input 
                  placeholder="Valeur (Ex: 32Go, Apple M1...)" 
                  value={feature.value}
                  onChange={(e) => updateFeature(index, 'value', e.target.value)}
                  required
                />
              </div>
              <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeFeature(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.push('/admin/produits')} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {product ? 'Modification...' : 'Création...'}
              </>
            ) : (
              product ? 'Modifier le produit' : 'Créer le produit'
            )}
          </Button>
        </div>
    </form>
  )
}
