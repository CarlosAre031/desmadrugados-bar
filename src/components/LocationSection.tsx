'use client'

import { useLanguage } from '@/context/LanguageContext'
import { MapPin, MessageCircle } from 'lucide-react'

interface Props {
  address: string
  addressEn: string
  whatsapp: string
  mapEmbedUrl: string
}

export default function LocationSection({ address, addressEn, whatsapp, mapEmbedUrl }: Props) {
  const { lang, t } = useLanguage()
  const waUrl = `https://wa.me/${whatsapp}`

  return (
    <section id="ubicacion" className="py-24 brick-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <h2 className="font-heading text-6xl sm:text-8xl text-foreground mb-3">
            {t.location.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">{t.location.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Info */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <MapPin size={24} className="text-gold shrink-0 mt-1" />
              <div>
                <p className="font-heading text-2xl text-foreground mb-1">{t.location.address}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {lang === 'es' ? address : addressEn}
                </p>
              </div>
            </div>

            {whatsapp && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white rounded hover:bg-[#1ebe59] transition-all font-semibold min-h-[56px] w-fit"
              >
                <MessageCircle size={20} />
                {t.location.whatsapp}
              </a>
            )}
          </div>

          {/* Map or placeholder */}
          <div className="aspect-video rounded border border-border overflow-hidden bg-card flex items-center justify-center">
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Desmadrugados Bar"
              />
            ) : (
              <div className="text-center px-6">
                <MapPin size={40} className="text-gold/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  {lang === 'es'
                    ? 'Agrega el enlace de Google Maps desde el panel admin.'
                    : 'Add the Google Maps link from the admin panel.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
