'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'

interface Hour { day: string; dayEn: string; time: string }
interface SpecialNight { name: string; nameEn: string; desc: string; descEn: string }
interface SettingsData {
  whatsapp: string
  instagram: string
  facebook: string
  address: string
  addressEn: string
  hours: Hour[]
  specialNights: SpecialNight[]
  mapEmbedUrl: string
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setData)
  }, [])

  const save = async () => {
    if (!data) return
    setSaving(true)
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateHour = (i: number, field: keyof Hour, value: string) => {
    if (!data) return
    const hours = data.hours.map((h, idx) => idx === i ? { ...h, [field]: value } : h)
    setData({ ...data, hours })
  }

  const addHour = () => {
    if (!data) return
    setData({ ...data, hours: [...data.hours, { day: '', dayEn: '', time: '' }] })
  }

  const removeHour = (i: number) => {
    if (!data) return
    setData({ ...data, hours: data.hours.filter((_, idx) => idx !== i) })
  }

  const updateNight = (i: number, field: keyof SpecialNight, value: string) => {
    if (!data) return
    const specialNights = data.specialNights.map((n, idx) => idx === i ? { ...n, [field]: value } : n)
    setData({ ...data, specialNights })
  }

  const addNight = () => {
    if (!data) return
    setData({ ...data, specialNights: [...data.specialNights, { name: '', nameEn: '', desc: '', descEn: '' }] })
  }

  const removeNight = (i: number) => {
    if (!data) return
    setData({ ...data, specialNights: data.specialNights.filter((_, idx) => idx !== i) })
  }

  if (!data) return <div className="text-muted-foreground text-sm">Cargando...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl text-gold tracking-wider">Configuración</h1>
          <p className="text-muted-foreground text-sm">WhatsApp, redes, dirección y horarios</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-400">✓ Guardado</span>}
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold text-sm rounded hover:bg-orange-bar transition-all disabled:opacity-50 min-h-[40px]">
            <Save size={14} /> {saving ? 'Guardando...' : 'Guardar todo'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Contact */}
        <section className="border border-border rounded p-5 bg-card">
          <h2 className="font-heading text-2xl text-foreground tracking-wider mb-4">Contacto</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Número de WhatsApp <span className="text-gold">(con código de país, sin + ni espacios)</span></label>
              <input
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold"
                placeholder="ej: 525512345678"
                value={data.whatsapp}
                onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="border border-border rounded p-5 bg-card">
          <h2 className="font-heading text-2xl text-foreground tracking-wider mb-4">Redes Sociales</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Instagram (usuario o URL completa)</label>
              <input
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold"
                placeholder="ej: desmadrugadosbar"
                value={data.instagram}
                onChange={(e) => setData({ ...data, instagram: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Facebook (usuario o URL completa)</label>
              <input
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold"
                placeholder="ej: DesmadrugadosBar"
                value={data.facebook}
                onChange={(e) => setData({ ...data, facebook: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="border border-border rounded p-5 bg-card">
          <h2 className="font-heading text-2xl text-foreground tracking-wider mb-4">Ubicación</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Dirección (español)</label>
              <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Address (English)</label>
              <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" value={data.addressEn} onChange={(e) => setData({ ...data, addressEn: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                URL del mapa de Google Maps
                <span className="ml-1 text-gold">(abre Google Maps → compartir → insertar → copia la URL del src)</span>
              </label>
              <input
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={data.mapEmbedUrl}
                onChange={(e) => setData({ ...data, mapEmbedUrl: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Hours */}
        <section className="border border-border rounded p-5 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl text-foreground tracking-wider">Horarios</h2>
            <button onClick={addHour} className="flex items-center gap-1 text-xs text-gold hover:text-orange-bar transition-colors">
              <Plus size={13} /> Agregar
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {data.hours.map((h, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 items-center">
                <input className="bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" placeholder="Día ES" value={h.day} onChange={(e) => updateHour(i, 'day', e.target.value)} />
                <input className="bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" placeholder="Day EN" value={h.dayEn} onChange={(e) => updateHour(i, 'dayEn', e.target.value)} />
                <div className="flex gap-2">
                  <input className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" placeholder="Horario" value={h.time} onChange={(e) => updateHour(i, 'time', e.target.value)} />
                  <button onClick={() => removeHour(i)} className="p-2 border border-border rounded hover:border-red-bar hover:text-red-bar transition-colors shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Nights */}
        <section className="border border-border rounded p-5 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl text-foreground tracking-wider">Noches Especiales</h2>
            <button onClick={addNight} className="flex items-center gap-1 text-xs text-gold hover:text-orange-bar transition-colors">
              <Plus size={13} /> Agregar
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {data.specialNights.map((n, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 items-start relative">
                <input className="bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" placeholder="Nombre ES" value={n.name} onChange={(e) => updateNight(i, 'name', e.target.value)} />
                <input className="bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" placeholder="Name EN" value={n.nameEn} onChange={(e) => updateNight(i, 'nameEn', e.target.value)} />
                <input className="bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" placeholder="Descripción ES" value={n.desc} onChange={(e) => updateNight(i, 'desc', e.target.value)} />
                <div className="flex gap-2">
                  <input className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" placeholder="Description EN" value={n.descEn} onChange={(e) => updateNight(i, 'descEn', e.target.value)} />
                  <button onClick={() => removeNight(i)} className="p-2 border border-border rounded hover:border-red-bar hover:text-red-bar transition-colors shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Save bottom */}
      <div className="mt-6 flex justify-end">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gold text-black font-semibold text-sm rounded hover:bg-orange-bar transition-all disabled:opacity-50 min-h-[44px]">
          <Save size={16} /> {saving ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </div>
  )
}
