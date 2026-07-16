'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterBarProps {
  categories: { id: string; name: string }[]
}

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (key: string, value: string) => {
    router.push(`${pathname}?${createQueryString(key, value)}`)
  }

  const handlePriceBlur = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')

    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')

    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePriceBlur()
    }
  }

  const currentCategory = searchParams.get('category') || 'all'
  const currentCondition = searchParams.get('condition') || 'all'
  const currentSort = searchParams.get('sort') || 'recent'

  const selectedCatName = currentCategory === 'all' 
    ? "Toutes les catégories" 
    : categories.find(c => c.id === currentCategory)?.name || "Toutes..."

  const selectedConditionName = currentCondition === 'all' 
    ? "Tous états" 
    : currentCondition

  const sortNames: Record<string, string> = {
    'recent': 'Plus récents',
    'price_asc': 'Prix croissant',
    'price_desc': 'Prix décroissant'
  }
  const selectedSortName = sortNames[currentSort] || 'Trier par'

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border shadow-sm mb-8">
      <div className="flex items-center text-muted-foreground mr-2">
        <SlidersHorizontal className="w-5 h-5" />
      </div>

      <div className="w-full sm:w-[180px]">
        <Select
          value={currentCategory}
          onValueChange={(value) => handleFilterChange('category', value === 'all' || !value ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue>{selectedCatName}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-[180px]">
        <Select
          value={currentCondition}
          onValueChange={(value) => handleFilterChange('condition', value === 'all' || !value ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue>{selectedConditionName}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous états</SelectItem>
            <SelectItem value="Neuf">Neuf</SelectItem>
            <SelectItem value="Occasion">Occasion</SelectItem>
            <SelectItem value="Reconditionné">Reconditionné</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Min"
          className="w-[90px]"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          onBlur={handlePriceBlur}
          onKeyDown={handlePriceKeyDown}
        />
        <span className="text-muted-foreground">—</span>
        <Input
          type="number"
          placeholder="Max"
          className="w-[90px]"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onBlur={handlePriceBlur}
          onKeyDown={handlePriceKeyDown}
        />
        <span className="text-sm text-muted-foreground ml-1"> FCFA</span>
      </div>

      <div className="w-full sm:w-[180px] sm:ml-auto">
        <Select
          value={currentSort}
          onValueChange={(value) => handleFilterChange('sort', value || 'recent')}
        >
          <SelectTrigger>
            <SelectValue>{selectedSortName}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="price_asc">Prix croissant</SelectItem>
            <SelectItem value="price_desc">Prix décroissant</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
