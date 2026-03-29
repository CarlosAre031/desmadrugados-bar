'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface CarouselImage {
  id: string
  src: string
  alt: string
  altEn: string
}

interface Props {
  images: CarouselImage[]
}

export default function HeroCarousel({ images }: Props) {
  const [current, setCurrent] = useState(0)
  const { lang } = useLanguage()

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length)
  }, [images.length])

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)

  useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  if (!images.length) return null

  return (
    <div className="relative w-full h-full">
      {images.map((img, i) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={img.src}
            alt={lang === 'es' ? img.alt : img.altEn}
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
            unoptimized
          />
        </div>
      ))}

      {/* Dark overlay — stronger on mobile for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 sm:from-black/80 sm:via-black/40 sm:to-black/20" />

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 border border-white/20 hover:border-gold text-white p-2 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 border border-white/20 hover:border-gold text-white p-2 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Siguiente imagen"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'bg-gold w-6' : 'bg-white/40 w-2'
                }`}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
