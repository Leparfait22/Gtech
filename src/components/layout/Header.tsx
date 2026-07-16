'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ShoppingCart, Search, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartSheet } from './CartSheet'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'

export function Header() {
  const t = useTranslations('Navigation')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            G-TECH<span className="text-primary">.</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/catalogue" className="hover:text-foreground transition-colors">{t('catalogue')}</Link>
          <Link href="/promotions" className="hover:text-primary transition-colors">{t('promotions')}</Link>
          <Link href="/nouveautes" className="hover:text-foreground transition-colors">{t('new')}</Link>
          <Link href="/notre-boutique" className="hover:text-foreground transition-colors">{t('about')}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="w-5 h-5" />
          </Button>
          <Link href="/login">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </Link>

          <CartSheet />

          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            } />
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left font-bold tracking-tighter text-xl">
                  G-TECH<span className="text-primary">.</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                <SheetClose render={
                  <Link href="/catalogue" className="text-lg font-medium hover:text-primary transition-colors">{t('catalogue')}</Link>
                } />
                <SheetClose render={
                  <Link href="/promotions" className="text-lg font-medium hover:text-primary transition-colors">{t('promotions')}</Link>
                } />
                <SheetClose render={
                  <Link href="/nouveautes" className="text-lg font-medium hover:text-primary transition-colors">{t('new')}</Link>
                } />
                <SheetClose render={
                  <Link href="/notre-boutique" className="text-lg font-medium hover:text-primary transition-colors">{t('about')}</Link>
                } />
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}
