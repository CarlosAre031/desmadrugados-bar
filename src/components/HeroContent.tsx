'use client'

import { useLanguage } from '@/context/LanguageContext'
import { MessageCircle, ChevronDown } from 'lucide-react'

interface Props {
  whatsapp: string
}

export default function HeroContent({ whatsapp }: Props) {
  const { t } = useLanguage()
  const waUrl = `https://wa.me/${whatsapp}`

  return (
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      {/* Tagline */}
      <h1
        className="font-heading text-7xl sm:text-9xl lg:text-[10rem] text-gold leading-none mb-4"
        style={{ textShadow: '0 0 40px rgba(212,160,23,0.5), 0 0 80px rgba(212,160,23,0.2)' }}
      >
        {t.hero.tagline}
      </h1>

      {/* Sub */}
      <p className="text-white/80 text-lg sm:text-xl mb-10 font-mono tracking-wide">
        {t.hero.sub}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="#menu"
          className="px-8 py-4 font-heading text-2xl tracking-wider bg-gold text-black rounded hover:bg-orange-bar transition-all min-h-[56px] flex items-center justify-center"
        >
          {t.hero.cta}
        </a>
        {whatsapp && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 font-heading text-2xl tracking-wider border border-white/60 text-white rounded hover:border-gold hover:text-gold hover:bg-black/20 transition-all min-h-[56px] flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            {t.hero.ctaSub}
          </a>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={24} className="text-white/40" />
      </div>
    </div>
  )
}
