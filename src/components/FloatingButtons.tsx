'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/context/LanguageContext'
import { Sun, Moon, MessageCircle } from 'lucide-react'

interface Props {
  whatsapp: string
}

export default function FloatingButtons({ whatsapp }: Props) {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const waUrl = `https://wa.me/${whatsapp}`

  const btnBase =
    'w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm'

  return (
    <div className="fixed bottom-6 right-4 flex flex-col gap-3 z-40">
      {/* WhatsApp */}
      {whatsapp && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} bg-[#25D366] border-[#25D366] text-white hover:scale-110`}
          aria-label={t.floating.whatsapp}
          title={t.floating.whatsapp}
        >
          <MessageCircle size={20} />
        </a>
      )}

      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`${btnBase} bg-background/90 border-border hover:border-[#D4A017] hover:text-[#D4A017]`}
          aria-label="Cambiar tema"
          title="Cambiar tema"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      )}

      {/* Language */}
      <button
        onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
        className={`${btnBase} bg-background/90 border-border hover:border-[#D4A017] hover:text-[#D4A017] font-mono text-xs font-bold`}
        aria-label="Cambiar idioma"
        title="Cambiar idioma"
      >
        {lang === 'es' ? 'EN' : 'ES'}
      </button>
    </div>
  )
}
