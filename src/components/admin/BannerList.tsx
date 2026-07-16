'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, Trash2, Power, PowerOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleBannerStatus, updateBannerOrder, deleteBanner } from '@/app/actions/bannerActions'

interface Banner {
  id: string
  title: string
  media_url: string
  media_type: string
  is_active: boolean
  display_order: number
}

interface BannerListProps {
  initialBanners: Banner[]
}

export function BannerList({ initialBanners }: BannerListProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id)
    const result = await toggleBannerStatus(id, !currentStatus)
    if (result.success) {
      setBanners(banners.map(b => b.id === id ? { ...b, is_active: !currentStatus } : b))
    }
    setLoadingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce banner ?')) return
    setLoadingId(id)
    const result = await deleteBanner(id)
    if (result.success) {
      setBanners(banners.filter(b => b.id !== id))
    }
    setLoadingId(null)
  }

  const moveBanner = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === banners.length - 1) return

    const newBanners = [...banners]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap items
    const temp = newBanners[index]
    newBanners[index] = newBanners[swapIndex]
    newBanners[swapIndex] = temp

    // Update local state instantly for UI feel
    setBanners(newBanners)

    // Save order to backend
    const orderedIds = newBanners.map(b => b.id)
    await updateBannerOrder(orderedIds)
  }

  if (banners.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-zinc-900 border rounded-xl">
        <p className="text-muted-foreground">Aucun banner configuré. Ajoutez-en un pour commencer.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-muted-foreground">Aperçu</th>
              <th className="px-6 py-3 font-semibold text-muted-foreground">Détails</th>
              <th className="px-6 py-3 font-semibold text-muted-foreground text-center">Ordre</th>
              <th className="px-6 py-3 font-semibold text-muted-foreground text-center">Statut</th>
              <th className="px-6 py-3 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {banners.map((banner, index) => (
              <tr key={banner.id} className={`hover:bg-muted/30 transition-colors ${!banner.is_active ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4 w-32">
                  <div className="w-24 h-14 rounded-md overflow-hidden bg-black relative border">
                    {banner.media_type === 'video' ? (
                      <video src={banner.media_url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={banner.media_url} alt={banner.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{banner.title || 'Sans titre'}</div>
                  <div className="text-xs text-muted-foreground uppercase">{banner.media_type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      disabled={index === 0}
                      onClick={() => moveBanner(index, 'up')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="w-4 text-center font-medium">{index + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      disabled={index === banners.length - 1}
                      onClick={() => moveBanner(index, 'down')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggle(banner.id, banner.is_active)}
                    disabled={loadingId === banner.id}
                    className={banner.is_active ? 'text-green-600 hover:text-green-700 hover:bg-green-50' : 'text-zinc-500 hover:bg-zinc-100'}
                  >
                    {loadingId === banner.id ? <Loader2 className="h-4 w-4 animate-spin" /> : banner.is_active ? <Power className="h-4 w-4 mr-1.5" /> : <PowerOff className="h-4 w-4 mr-1.5" />}
                    {banner.is_active ? 'Actif' : 'Inactif'}
                  </Button>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(banner.id)}
                    disabled={loadingId === banner.id}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
