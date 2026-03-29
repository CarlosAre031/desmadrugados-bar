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
    <div className="relative z-10 text-center px-6 sm:px-4 max-w-4xl mx-auto">
      {/* Tagline */}
      <h1
        className="font-heading text-[clamp(2.5rem,10vw,10rem)] text-gold leading-[0.9] mb-6"
        style={{ textShadow: '0 0 40px rgba(212,160,23,0.5), 0 0 80px rgba(212,160,23,0.2)' }}
      >
        {t.hero.tagline}
      </h1>

      {/* Sub */}
      <p className="text-white/80 text-base sm:text-xl mb-10 font-mono tracking-wide max-w-md mx-auto">
        {t.hero.sub}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <a
          href="#menu"
          className="px-8 py-4 font-heading text-xl sm:text-2xl tracking-wider bg-gold text-black rounded hover:bg-orange-bar transition-all min-h-[52px] sm:min-h-[56px] flex items-center justify-center"
        >
          {t.hero.cta}
        </a>
        {whatsapp && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 font-heading text-xl sm:text-2xl tracking-wider border border-white/60 text-white rounded hover:border-gold hover:text-gold hover:bg-black/20 transition-all min-h-[52px] sm:min-h-[56px] flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            {t.hero.ctaSub}
          </a>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="mt-12 sm:mt-16 animate-bounce">
        <ChevronDown size={24} className="text-white/40 mx-auto" />
      </div>
    </div>
  )
}
