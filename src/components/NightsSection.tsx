'use client'

import { useLanguage } from '@/context/LanguageContext'
import { Clock, Star } from 'lucide-react'

interface Hour {
  day: string
  dayEn: string
  time: string
}

interface SpecialNight {
  name: string
  nameEn: string
  desc: string
  descEn: string
}

interface Props {
  hours: Hour[]
  specialNights: SpecialNight[]
}

export default function NightsSection({ hours, specialNights }: Props) {
  const { lang, t } = useLanguage()

  return (
    <section className="py-24 brick-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <h2 className="font-heading text-6xl sm:text-8xl text-orange-bar mb-3">
            {t.nights.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t.nights.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hours */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock size={18} className="text-gold" />
              <h3 className="font-heading text-3xl text-foreground tracking-wider">
                {t.nights.hoursTitle}
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {hours.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-border/40 last:border-0"
                >
                  <span className="text-sm font-semibold text-foreground/80">
                    {lang === 'es' ? h.day : h.dayEn}
                  </span>
                  <span className="font-heading text-xl text-gold">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Special nights */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Star size={18} className="text-red-bar" />
              <h3 className="font-heading text-3xl text-foreground tracking-wider">
                {t.nights.specialsTitle}
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {specialNights.map((night, i) => (
                <div key={i} className="border border-border/40 hover:border-orange-bar/50 rounded p-4 transition-all bg-card">
                  <p className="font-heading text-2xl text-orange-bar mb-1">
                    {lang === 'es' ? night.name : night.nameEn}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'es' ? night.desc : night.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
