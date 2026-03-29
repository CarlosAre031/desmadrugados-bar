'use client'

import { useLanguage } from '@/context/LanguageContext'
import { Badge } from '@/components/ui/badge'

interface Promo {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  badge: string
  badgeEn: string
  active: boolean
}

interface Props {
  items: Promo[]
}

export default function PromotionsSection({ items }: Props) {
  const { lang, t } = useLanguage()
  const active = items.filter((p) => p.active)

  if (!active.length) return null

  return (
    <section id="promociones" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <h2 className="font-heading text-6xl sm:text-8xl text-red-bar neon-red mb-3">
            {t.promotions.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t.promotions.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((promo) => (
            <div
              key={promo.id}
              className="relative border border-red-bar/30 hover:border-red-bar rounded bg-card p-6 transition-all group overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-bar/5 to-transparent pointer-events-none" />

              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-heading text-3xl text-foreground leading-tight">
                  {lang === 'es' ? promo.title : promo.titleEn}
                </h3>
                <Badge className="bg-red-bar text-white shrink-0 text-xs">
                  {lang === 'es' ? promo.badge : promo.badgeEn}
                </Badge>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {lang === 'es' ? promo.description : promo.descriptionEn}
              </p>

              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="text-xs text-gold font-semibold tracking-wider uppercase">
                  {t.promotions.active}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
