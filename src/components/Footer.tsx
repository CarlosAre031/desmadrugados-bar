'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { Separator } from '@/components/ui/separator'

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

interface Props {
  instagram: string
  facebook: string
}

export default function Footer({ instagram, facebook }: Props) {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Desmadrugados Bar"
                width={52}
                height={52}
                className="object-contain h-12 w-12"
              />
              <span className="font-heading text-2xl text-gold tracking-widest">
                DESMADRUGADOS
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">{t.footer.tagline}</p>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            {instagram && (
              <a
                href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border rounded hover:border-gold hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Instagram"
              >
                <IconInstagram />
              </a>
            )}
            {facebook && (
              <a
                href={facebook.startsWith('http') ? facebook : `https://facebook.com/${facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border rounded hover:border-gold hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Facebook"
              >
                <IconFacebook />
              </a>
            )}
            {!instagram && !facebook && (
              <p className="text-xs text-muted-foreground italic">
                Agrega tus redes sociales desde el panel admin
              </p>
            )}
          </div>
        </div>

        <Separator className="mb-6 opacity-30" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-muted-foreground">
          <p>© {year} Desmadrugados Bar. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
