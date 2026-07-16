import { createClient } from '@/utils/supabase/server'
import { BannerList } from '@/components/admin/BannerList'
import { BannerModal } from '@/components/admin/BannerModal'
import { Image as ImageIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminBannersPage() {
  const supabase = await createClient()

  const { data: banners, error } = await supabase
    .from('hero_banners')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching banners:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ImageIcon className="h-8 w-8 text-primary" />
            Gestion des Banners
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les vidéos et images qui s'affichent dans le carrousel de la page d'accueil.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BannerModal />
        </div>
      </div>

      <BannerList initialBanners={banners || []} />
    </div>
  )
}
