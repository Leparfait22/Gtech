'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductCarouselProps {
  mainImage: string | null
  additionalImages: string[] | null
  title: string
}

export function ProductCarousel({ mainImage, additionalImages, title }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const allImages = [
    ...(mainImage ? [mainImage] : []),
    ...(Array.isArray(additionalImages) ? additionalImages.filter(Boolean) : [])
  ]

  if (allImages.length === 0) {
    return (
      <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center text-zinc-400">
        Sans image
      </div>
    )
  }

  if (allImages.length === 1) {
    return (
      <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm">
        <Image
          src={allImages[0]}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
    )
  }

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  // Mobile swipe support
  const minSwipeDistance = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Viewport */}
      <div
        className="aspect-square relative bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm group select-none cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={allImages[activeIndex]}
          alt={`${title} - image ${activeIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300 ease-in-out"
          priority
        />

        {/* Overlay Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            prevImage()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-center text-zinc-800 dark:text-zinc-200 border border-zinc-200/20 shadow-md hover:bg-white dark:hover:bg-zinc-950 transition-all opacity-0 group-hover:opacity-100 md:group-hover:scale-105 active:scale-95"
          aria-label="Image précédente"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            nextImage()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-center text-zinc-800 dark:text-zinc-200 border border-zinc-200/20 shadow-md hover:bg-white dark:hover:bg-zinc-950 transition-all opacity-0 group-hover:opacity-100 md:group-hover:scale-105 active:scale-95"
          aria-label="Image suivante"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bullet indicators overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/20 dark:bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex(index)
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-4 bg-white'
                  : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Clickable Thumbnails Row */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scroll-smooth">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative w-20 h-20 rounded-xl overflow-hidden border flex-shrink-0 bg-zinc-50 dark:bg-zinc-900 transition-all ${
              index === activeIndex
                ? 'ring-2 ring-zinc-950 dark:ring-zinc-50 ring-offset-2 dark:ring-offset-zinc-950 border-transparent scale-[0.98]'
                : 'opacity-70 hover:opacity-100 border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <Image
              src={image}
              alt={`${title} miniature ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
