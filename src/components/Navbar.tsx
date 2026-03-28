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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/images/logo.png"
            alt="Desmadrugados Bar"
            width={60}
            height={60}
            className="object-contain h-14 w-14 sm:h-16 sm:w-16"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-heading text-lg tracking-wider text-foreground/80 hover:text-[#D4A017] transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="px-2 py-1 text-xs font-mono font-semibold border border-border rounded hover:border-[#D4A017] hover:text-[#D4A017] transition-colors min-h-[36px] min-w-[36px]"
            aria-label="Cambiar idioma"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 border border-border rounded hover:border-[#D4A017] hover:text-[#D4A017] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden p-2 border border-border rounded hover:border-[#D4A017] hover:text-[#D4A017] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                  className="font-heading text-2xl tracking-wider text-foreground/80 hover:text-[#D4A017] transition-colors block"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
