import { ReactNode } from 'react'
import { Link } from '@/i18n/routing'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, Image as ImageIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { logout } from '../(shop)/login/actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Administration',
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Proteção server-side: verifica sessão e role de admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/fr/login')
  }

  const navigation = [
    { name: "Vue d'ensemble", href: '/admin', icon: LayoutDashboard },
    { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'Produits', href: '/admin/produits', icon: Package },
    { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 dark:bg-zinc-950">
      {/* Top Navbar */}
      <header className="sticky top-16 z-30 flex h-14 items-center gap-4 border-b bg-white dark:bg-zinc-900 px-4 sm:px-6">

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger render={
            <button className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </button>
          } />
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium pt-6">
              <span className="font-bold text-xl">Admin Panel</span>
              {navigation.map((item) => (
                <SheetClose
                  key={item.name}
                  nativeButton={false}
                  render={
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  }
                />
              ))}
              <div className="border-t pt-4">
                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-4 px-2.5 text-red-600 hover:text-red-500 bg-transparent border-0 cursor-pointer text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    Déconnexion
                  </button>
                </form>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop nav */}
        <div className="flex w-full items-center justify-between">
          <div className="hidden sm:flex items-center gap-6">
            <span className="font-bold text-lg mr-4">Admin Panel</span>
            <nav className="flex items-center space-x-4 lg:space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden sm:flex">
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-500 bg-transparent border-0 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
