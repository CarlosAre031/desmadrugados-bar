'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/context/LanguageContext'
import { Sun, Moon, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#menu', label: t.nav.menu },
    { href: '#promociones', label: t.nav.promotions },
    { href: '#juegos', label: t.nav.games },
    { href: '#ubicacion', label: t.nav.location },
  ]

  // When not scrolled, navbar is over the dark hero — always use light text
  const overHero = !scrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-8 sm:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/logo.png"
            alt="Desmadrugados Bar"
            width={80}
            height={80}
            className="object-contain h-16 w-16 sm:h-20 sm:w-20 drop-shadow-lg"
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`font-heading text-lg tracking-wider hover:text-gold transition-colors duration-200 ${
                  overHero ? 'text-white/90' : 'text-foreground/80'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className={`px-2 py-1 text-xs font-mono font-semibold border rounded hover:border-gold hover:text-gold transition-colors min-h-[36px] min-w-[36px] ${
              overHero ? 'border-white/30 text-white/90' : 'border-border'
            }`}
            aria-label="Cambiar idioma"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 border rounded hover:border-gold hover:text-gold transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                overHero ? 'border-white/30 text-white/90' : 'border-border'
              }`}
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          <button
            className={`md:hidden p-2 border rounded hover:border-gold hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              overHero ? 'border-white/30 text-white/90' : 'border-border'
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Menú de navegación"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-b border-border">
          <ul className="px-4 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-heading text-2xl tracking-wider text-foreground/80 hover:text-gold transition-colors block"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4 flex items-center gap-2 border-t border-border/30 pt-3">
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="px-3 py-1.5 text-xs font-mono font-semibold border border-border rounded hover:border-gold hover:text-gold transition-colors"
              aria-label="Cambiar idioma"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 border border-border rounded hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
