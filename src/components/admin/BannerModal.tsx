'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getPresignedUrl } from '@/app/actions/r2Actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Link as LinkIcon, Loader2 } from 'lucide-react'
import { createBanner } from '@/app/actions/bannerActions'

export function BannerModal() {
  const [open, setOpen] = useState(false)
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const form = new FormData(e.currentTarget)
      const title = form.get('title') as string
      const media_type = form.get('media_type') as string
      let media_url = ''

      if (uploadMode === 'url') {
        media_url = form.get('media_url') as string
      } else {
        const file = form.get('file_upload') as File
        if (file && file.size > 0) {
          // Get presigned URL
          const { success, uploadUrl, publicUrl, error: presignedError } = await getPresignedUrl(file.name, file.type)
          
          if (!success || !uploadUrl || !publicUrl) {
            throw new Error(presignedError || 'Erreur lors de la génération de l\'URL Cloudflare R2.')
          }

          // Upload to R2 directly from client
          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          })

          if (!uploadResponse.ok) {
            throw new Error('Erreur lors de l\'upload vers Cloudflare R2.')
          }

          media_url = publicUrl
        } else {
          throw new Error('Veuillez sélectionner un fichier.')
        }
      }

      if (!media_url) {
        throw new Error('URL du média requise.')
      }

      // We need to create a new FormData with the resolved media_url
      const finalForm = new FormData()
      finalForm.append('title', title)
      finalForm.append('media_url', media_url)
      finalForm.append('media_type', media_type)

      const result = await createBanner(finalForm)

      if (result.success) {
        setOpen(false)
      } else {
        setError(result.error || 'Erreur lors de la création du banner.')
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-zinc-900 hover:bg-zinc-800 text-white" />}>
        <Plus className="w-4 h-4 mr-2" />
        Nouveau Banner
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un banner</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau banner vidéo ou image pour la page d'accueil.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Titre (Interne)</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Ex: Campagne Été 2026"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type de média</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="media_type" value="video" defaultChecked />
                Vidéo
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="media_type" value="image" />
                Image
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Source du média</label>
            
            <div className="flex gap-2 p-1 bg-muted rounded-md w-full">
              <button 
                type="button" 
                onClick={() => setUploadMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-sm transition-all ${uploadMode === 'url' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LinkIcon className="w-4 h-4" /> Coller l'URL
              </button>
              <button 
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-sm transition-all ${uploadMode === 'file' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Upload className="w-4 h-4" /> Uploader
              </button>
            </div>

            {uploadMode === 'url' ? (
              <div className="space-y-2">
                <input
                  name="media_url"
                  type="url"
                  required={uploadMode === 'url'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="https://pub-....r2.dev/video.mp4"
                />
                <p className="text-xs text-muted-foreground">Idéal pour les vidéos hébergées sur Cloudflare R2 ou YouTube (si supporté).</p>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  name="file_upload"
                  type="file"
                  accept="video/*,image/*"
                  required={uploadMode === 'file'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium hover:file:text-primary"
                />
                <p className="text-xs text-amber-600 font-medium">Votre fichier sera uploadé directement sur Cloudflare R2.</p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-zinc-800 text-white">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Création...' : 'Ajouter le banner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
