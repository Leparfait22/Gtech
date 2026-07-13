'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart, CartItem } from '@/store/cart'

export function AddToCartButton({ product, disabled }: { product: Omit<CartItem, 'quantity'>, disabled?: boolean }) {
  const addItem = useCart((state) => state.addItem)

  return (
    <Button 
      size="lg" 
      className="w-full h-14 text-lg rounded-full"
      disabled={disabled}
      onClick={() => addItem(product)}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {disabled ? 'Rupture de stock' : 'Ajouter au panier'}
    </Button>
  )
}
