'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Banner {
  id: string
  title: string
  media_url: string
  media_type: string
}

interface HeroCarouselProps {
  banners: Banner[]
  children: React.ReactNode // Pass the overlay text/buttons as children
}

export function HeroCarousel({ banners, children }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Fallback to static black background if no banners
  if (!banners || banners.length === 0) {
    return (
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 opacity-80" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          {children}
        </div>
      </section>
    )
  }

  // Handle video end to switch to next banner
  const handleVideoEnded = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

  // Auto-advance for images or as fallback
  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    let timer: NodeJS.Timeout;

    // If it's an image, we must manually advance it after a delay (e.g., 5s)
    if (banners[currentIndex]?.media_type === 'image') {
      timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
      }, 5000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [currentIndex, banners])

  return (
    <section className="relative h-[80vh] min-h-[600px] text-white overflow-hidden bg-zinc-950">
      
      {/* Media Background Carousel */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {banners[currentIndex].media_type === 'video' ? (
            <video
              key={`video-${currentIndex}`} // Force remount to ensure autoplay triggers
              src={banners[currentIndex].media_url}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover"
              // Fallback if video fails to load or play (e.g. low power mode on iOS)
              onError={handleVideoEnded} 
            />
          ) : (
            <img 
              src={banners[currentIndex].media_url}
              alt={banners[currentIndex].title || 'Banner'}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center h-full flex flex-col justify-between pt-32 pb-24">
        {children}
      </div>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/40 w-3 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
