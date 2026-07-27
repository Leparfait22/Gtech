'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct } from '@/app/actions/productActions'
import { getPresignedUrl } from '@/app/actions/r2Actions'
import {
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  Link2,
  X,
  ImagePlus,
  CheckCircle2,
} from 'lucide-react'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  default_features?: { label: string; icon: string }[]
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
  features: { label: string; value: string; icon?: string }[] | null
  images?: string[] | null
}

// ─── Reusable Image Uploader ────────────────────────────────────────────────

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

interface ImageUploaderProps {
  /** Current URL value (controlled) */
  value: string
  /** Called with the final public URL (from R2 or pasted URL) */
  onChange: (url: string) => void
  /** Label shown above the uploader */
  label?: string
  /** Placeholder for the URL input */
  placeholder?: string
  /** Whether the field is required */
  required?: boolean
}

function ImageUploader({
  value,
  onChange,
  label,
  placeholder = 'https://…',
  required,
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [mode, setMode] = useState<'upload' | 'url'>(value ? 'url' : 'upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide.')
        return
      }
      setUploadState('uploading')
      setUploadProgress(10)

      try {
        const result = await getPresignedUrl(file.name, file.type, 'produits')
        if (!result.success || !result.uploadUrl) {
          throw new Error(result.error || "Impossible d'obtenir l'URL de chargement.")
        }

        setUploadProgress(40)

        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(40 + Math.round((e.loaded / e.total) * 50))
          }
        }

        await new Promise<void>((resolve, reject) => {
          xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status}`)))
          xhr.onerror = () => reject(new Error('Erreur réseau'))
          xhr.open('PUT', result.uploadUrl!)
          xhr.setRequestHeader('Content-Type', file.type)
          xhr.send(file)
        })

        setUploadProgress(100)
        setUploadState('done')
        onChange(result.publicUrl!)
      } catch (err: unknown) {
        console.error(err)
        setUploadState('error')
      }
    },
    [onChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleRemove = () => {
    onChange('')
    setUploadState('idle')
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const hasImage = !!value

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {/* Mode switcher */}
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === 'upload'
              ? 'bg-white dark:bg-zinc-700 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Téléverser
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === 'url'
              ? 'bg-white dark:bg-zinc-700 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          Lien URL
        </button>
      </div>

      {/* Upload mode */}
      {mode === 'upload' && (
        <div>
          {!hasImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all p-8 ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-primary/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {uploadState === 'uploading' ? (
                <>
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm font-medium">Téléversement en cours…</p>
                  <div className="w-full max-w-xs bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </>
              ) : uploadState === 'error' ? (
                <>
                  <X className="w-8 h-8 text-red-500" />
                  <p className="text-sm font-medium text-red-600">Échec du téléversement</p>
                  <p className="text-xs text-muted-foreground">Cliquez pour réessayer</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UploadCloud className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Glissez une image ici ou{' '}
                      <span className="text-primary underline underline-offset-2">cliquez</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP jusqu&apos;à 10 Mo
                    </p>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            /* Preview after upload */
            <div className="relative rounded-xl overflow-hidden border bg-zinc-50 dark:bg-zinc-800">
              <div className="relative w-full aspect-video">
                <Image src={value} alt="Aperçu" fill className="object-contain" />
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                {uploadState === 'done' && (
                  <span className="flex items-center gap-1 text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Téléversé
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium shadow hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="space-y-2">
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required && mode === 'url'}
          />
          {value && (value.startsWith('http://') || value.startsWith('https://')) && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-zinc-50 dark:bg-zinc-800">
              <Image src={value} alt="Aperçu" fill className="object-contain" />
            </div>
          )}
        </div>
      )}

      {/* Hidden input so FormData always contains image_url */}
      <input type="hidden" name={required === undefined ? 'image_url' : undefined} value={value} />
    </div>
  )
}

// ─── Additional Images (list) ────────────────────────────────────────────────

function AdditionalImages({
  images,
  setImages,
}: {
  images: string[]
  setImages: (imgs: string[]) => void
}) {
  const addImage = () => setImages([...images, ''])
  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i))
  const updateImage = (i: number, val: string) => {
    const next = [...images]
    next[i] = val
    setImages(next)
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Images supplémentaires (optionnel)</Label>
          <p className="text-xs text-muted-foreground">
            Ajoutez d&apos;autres photos sous différents angles.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addImage}>
          <ImagePlus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground italic">Aucune image supplémentaire.</p>
      )}

      <div className="space-y-4">
        {images.map((img, index) => (
          <div key={index} className="relative border rounded-xl p-3 space-y-2 bg-zinc-50 dark:bg-zinc-800/50">
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <p className="text-xs font-medium text-muted-foreground">Image {index + 1}</p>
            <ImageUploader
              value={img}
              onChange={(url) => updateImage(index, url)}
              placeholder="https://… ou téléversez depuis votre appareil"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Form ───────────────────────────────────────────────────────────────

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[]
  product?: Product
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [features, setFeatures] = useState<{ label: string; value: string; icon?: string }[]>(
    product?.features && Array.isArray(product.features) ? product.features : []
  )
  const [images, setImages] = useState<string[]>(
    product?.images && Array.isArray(product.images) ? product.images : []
  )
  const [mainImageUrl, setMainImageUrl] = useState(product?.image_url || '')

  const router = useRouter()

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatId = e.target.value
    const cat = categories.find((c) => c.id === newCatId)
    if (cat && cat.default_features && cat.default_features.length > 0) {
      const allEmpty = features.every((f) => f.value.trim() === '')
      if (allEmpty) {
        setFeatures(cat.default_features.map((f) => ({ label: f.label, value: '', icon: f.icon })))
      }
    }
  }

  const addFeature = () => setFeatures([...features, { label: '', value: '', icon: '' }])
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index))
  const updateFeature = (index: number, key: 'label' | 'value', val: string) => {
    const next = [...features]
    next[index][key] = val
    setFeatures(next)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    // Inject controlled state values
    formData.set('image_url', mainImageUrl)
    formData.append('features', JSON.stringify(features.filter((f) => f.label.trim() && f.value.trim())))
    formData.append('images', JSON.stringify(images.filter((img) => img.trim())))

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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm"
    >
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Nom */}
      <div className="space-y-2">
        <Label htmlFor="title">Nom du produit *</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={product?.title}
          placeholder="Ex: Casque Audio Premium"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description || ''}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Décrivez votre produit…"
        />
      </div>

      {/* Prix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Prix normal (FCFA) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="promotional_price">Prix promotionnel (FCFA)</Label>
          <Input
            id="promotional_price"
            name="promotional_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.promotional_price || ''}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Stock & Catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock disponible *</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={product?.stock}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_id">Catégorie *</Label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={product?.category_id || ''}
            onChange={handleCategoryChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Sélectionnez une catégorie…</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* État */}
      <div className="space-y-2">
        <Label htmlFor="condition">État du produit *</Label>
        <select
          id="condition"
          name="condition"
          required
          defaultValue={product?.condition || 'Neuf'}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Neuf">Neuf</option>
          <option value="Occasion">Occasion</option>
          <option value="Reconditionné">Reconditionné</option>
        </select>
      </div>

      {/* ── Image principale ── */}
      <div className="pt-4 border-t">
        <ImageUploader
          label="Image principale du produit"
          value={mainImageUrl}
          onChange={setMainImageUrl}
          placeholder="https://images.unsplash.com/…"
        />
      </div>

      {/* ── Images supplémentaires ── */}
      <AdditionalImages images={images} setImages={setImages} />

      {/* ── Caractéristiques ── */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label>Caractéristiques techniques (Fiche Technique)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une caractéristique
          </Button>
        </div>

        {features.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Aucune caractéristique ajoutée. Ex: «RAM» – «32 Go»
          </p>
        )}

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <Input
                  placeholder='Label (Ex: RAM, Processeur…)'
                  value={feature.label}
                  onChange={(e) => updateFeature(index, 'label', e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Valeur (Ex: 32 Go, Apple M1…)"
                  value={feature.value}
                  onChange={(e) => updateFeature(index, 'value', e.target.value)}
                  required
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t flex justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push('/admin/produits')}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[140px]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {product ? 'Modification…' : 'Création…'}
            </>
          ) : product ? (
            'Modifier le produit'
          ) : (
            'Créer le produit'
          )}
        </Button>
      </div>
    </form>
  )
}
