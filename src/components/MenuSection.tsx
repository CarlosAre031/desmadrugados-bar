'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  nameEn: string
  category: string
  price: number
  available: boolean
  image?: string
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

function ProductModal({ item, category, lang, onClose }: {
  item: MenuItem
  category?: Category
  lang: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card border border-border rounded-lg max-w-md w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        {/* Image */}
        {item.image ? (
          <div className="w-full aspect-[4/3] bg-secondary">
            <img
              src={item.image}
              alt={lang === 'es' ? item.name : item.nameEn}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] bg-secondary/30 flex items-center justify-center">
            <span className="text-6xl">{category?.icon || '🍽️'}</span>
          </div>
        )}

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-2xl tracking-wide text-foreground">
                {lang === 'es' ? item.name : item.nameEn}
              </h3>
              {category && (
                <p className="text-sm text-muted-foreground mt-1">
                  {category.icon} {lang === 'es' ? category.name : category.nameEn}
                </p>
              )}
            </div>
            <span className="font-heading text-3xl text-gold shrink-0">
              ${item.price}
            </span>
          </div>
          {!item.available && (
            <Badge variant="secondary" className="mt-3 text-xs">
              {lang === 'es' ? 'No disponible' : 'Unavailable'}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MenuSection({ categories, items }: Props) {
  const { lang, t } = useLanguage()
  const [active, setActive] = useState('all')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const filtered = active === 'all' ? items : items.filter((i) => i.category === active)

  return (
    <section id="menu" className="py-24 brick-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-heading text-6xl sm:text-8xl text-gold neon-gold mb-3">
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
                ? 'bg-gold text-black border-gold'
                : 'border-border hover:border-gold hover:text-gold'
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
                  ? 'bg-gold text-black border-gold'
                  : 'border-border hover:border-gold hover:text-gold'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{lang === 'es' ? cat.name : cat.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item) => {
            const cat = categories.find((c) => c.id === item.category)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`flex items-center gap-3 p-4 border rounded transition-all text-left ${
                  item.available
                    ? 'border-border hover:border-gold/50 bg-card cursor-pointer'
                    : 'border-border/30 bg-card/40 opacity-50 cursor-pointer'
                }`}
              >
                {/* Thumbnail */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={lang === 'es' ? item.name : item.nameEn}
                    className="w-14 h-14 rounded object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded bg-secondary/30 border border-border/30 flex items-center justify-center shrink-0 text-xl">
                    {cat?.icon || '🍽️'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <span className="font-heading text-xl tracking-wide text-foreground block truncate">
                    {lang === 'es' ? item.name : item.nameEn}
                  </span>
                  {!item.available && (
                    <Badge variant="secondary" className="text-xs mt-0.5">
                      {t.menu.unavailable}
                    </Badge>
                  )}
                </div>
                <span className="font-heading text-2xl text-gold shrink-0 ml-2">
                  ${item.price}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Product Modal */}
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          category={categories.find((c) => c.id === selectedItem.category)}
          lang={lang}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  )
}
