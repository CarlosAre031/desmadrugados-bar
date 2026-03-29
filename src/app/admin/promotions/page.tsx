'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
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

interface PromoData { items: Promo[] }

function PromoCard({ promo, onSave, onDelete }: { promo: Promo; onSave: (p: Promo) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(promo)

  const save = () => { onSave(form); setEditing(false) }

  if (editing) {
    return (
      <div className="border border-gold/40 rounded bg-card p-4 flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Título ES</label>
            <input className="w-full bg-background border border-gold rounded px-3 py-2 text-sm outline-none" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title EN</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Descripción ES</label>
            <textarea className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description EN</label>
            <textarea className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold resize-none" rows={2} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Badge ES (ej: VIERNES)</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Badge EN (ej: FRIDAY)</label>
            <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" value={form.badgeEn} onChange={(e) => setForm({ ...form, badgeEn: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-gold w-4 h-4" />
            Activa / visible en el sitio
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold text-sm rounded hover:bg-orange-bar transition-all">
            <Check size={14} /> Guardar
          </button>
          <button onClick={() => setEditing(false)} className="px-4 py-2 border border-border rounded text-sm hover:border-red-bar hover:text-red-bar transition-all">
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded bg-card p-4 transition-all ${promo.active ? 'border-red-bar/30' : 'border-border opacity-60'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-2xl text-foreground">{promo.title}</h3>
          <Badge className="bg-red-bar text-white text-xs">{promo.badge}</Badge>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full ${promo.active ? 'bg-green-700/20 text-green-400' : 'bg-secondary text-muted-foreground'}`}>
            {promo.active ? 'Activa' : 'Inactiva'}
          </span>
          <button onClick={() => { setForm(promo); setEditing(true) }} className="p-1.5 border border-border rounded hover:border-gold hover:text-gold transition-colors">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(promo.id)} className="p-1.5 border border-border rounded hover:border-red-bar hover:text-red-bar transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{promo.description}</p>
      {promo.titleEn && (
        <p className="text-xs text-muted-foreground/50 mt-1 italic">EN: {promo.titleEn}</p>
      )}
    </div>
  )
}

export default function PromotionsAdminPage() {
  const [data, setData] = useState<PromoData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', titleEn: '', description: '', descriptionEn: '', badge: '', badgeEn: '', active: true })

  useEffect(() => {
    fetch('/api/promotions').then((r) => r.json()).then(setData)
  }, [])

  const save = async (updated: PromoData) => {
    setSaving(true)
    await fetch('/api/promotions', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updatePromo = (updated: Promo) => {
    if (!data) return
    const next = { items: data.items.map((p) => p.id === updated.id ? updated : p) }
    setData(next)
    save(next)
  }

  const deletePromo = (id: string) => {
    if (!data || !confirm('¿Eliminar esta promoción?')) return
    const next = { items: data.items.filter((p) => p.id !== id) }
    setData(next)
    save(next)
  }

  const addPromo = () => {
    if (!data || !form.title) return
    const promo: Promo = { id: Date.now().toString(), ...form }
    const next = { items: [...data.items, promo] }
    setData(next)
    save(next)
    setForm({ title: '', titleEn: '', description: '', descriptionEn: '', badge: '', badgeEn: '', active: true })
    setAdding(false)
  }

  if (!data) return <div className="text-muted-foreground text-sm">Cargando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl text-gold tracking-wider">Promociones</h1>
          <p className="text-muted-foreground text-sm">{data.items.filter((p) => p.active).length} activas de {data.items.length}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-400">✓ Guardado</span>}
          {saving && <span className="text-xs text-muted-foreground">Guardando...</span>}
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold text-sm rounded hover:bg-orange-bar transition-all min-h-[40px]">
            <Plus size={16} /> Nueva
          </button>
        </div>
      </div>

      {adding && (
        <div className="mb-4 border border-gold/40 rounded bg-card p-4 flex flex-col gap-3">
          <p className="text-sm font-semibold">Nueva promoción</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Título ES *</label>
              <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Title EN</label>
              <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Descripción ES</label>
              <textarea className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description EN</label>
              <textarea className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold resize-none" rows={2} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Badge ES</label>
              <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" placeholder="ej: VIERNES" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Badge EN</label>
              <input className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-gold" placeholder="ej: FRIDAY" value={form.badgeEn} onChange={(e) => setForm({ ...form, badgeEn: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-gold w-4 h-4" />
            Activa desde el principio
          </label>
          <div className="flex gap-2">
            <button onClick={addPromo} className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold text-sm rounded hover:bg-orange-bar transition-all">
              <Check size={14} /> Guardar
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 border border-border rounded text-sm hover:border-red-bar hover:text-red-bar transition-all">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {data.items.map((promo) => (
          <PromoCard key={promo.id} promo={promo} onSave={updatePromo} onDelete={deletePromo} />
        ))}
      </div>
    </div>
  )
}
