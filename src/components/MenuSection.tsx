'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Badge } from '@/components/ui/badge'

interface MenuItem {
  id: string
  name: string
  nameEn: string
  category: string
  price: number
  available: boolean
}

interface Category {
  id: string
  name: string
  nameEn: string
  icon: string
}

interface Props {
  categories: Category[]
  items: MenuItem[]
}

export default function MenuSection({ categories, items }: Props) {
  const { lang, t } = useLanguage()
  const [active, setActive] = useState('all')

  const filtered = active === 'all' ? items : items.filter((i) => i.category === active)

  return (
    <section id="menu" className="py-24 brick-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-heading text-6xl sm:text-8xl text-[#D4A017] neon-gold mb-3">
            {t.menu.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
            {t.menu.subtitle}
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActive('all')}
            className={`px-4 py-2 font-heading text-lg tracking-wider rounded border transition-all min-h-[44px] ${
              active === 'all'
                ? 'bg-[#D4A017] text-black border-[#D4A017]'
                : 'border-border hover:border-[#D4A017] hover:text-[#D4A017]'
            }`}
          >
            {t.menu.all}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-4 py-2 font-heading text-lg tracking-wider rounded border transition-all min-h-[44px] flex items-center gap-1 ${
                active === cat.id
                  ? 'bg-[#D4A017] text-black border-[#D4A017]'
                  : 'border-border hover:border-[#D4A017] hover:text-[#D4A017]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{lang === 'es' ? cat.name : cat.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 border rounded transition-all ${
                item.available
                  ? 'border-border hover:border-[#D4A017]/50 bg-card'
                  : 'border-border/30 bg-card/40 opacity-50'
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="font-heading text-xl tracking-wide text-foreground">
                  {lang === 'es' ? item.name : item.nameEn}
                </span>
                {!item.available && (
                  <Badge variant="secondary" className="text-xs w-fit">
                    {t.menu.unavailable}
                  </Badge>
                )}
              </div>
              <span className="font-heading text-2xl text-[#D4A017] shrink-0 ml-4">
                ${item.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
