'use client'

import { useState } from 'react'
import { Plus, Pencil, Check, X, Tag, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

export interface Category {
  id: string
  name: string
  nameEn: string
  icon: string
}

export function CategoryManager({ categories, onUpdate }: {
  categories: Category[]
  onUpdate: (categories: Category[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', nameEn: '', icon: '' })
  const [newCat, setNewCat] = useState(false)

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setForm({ name: cat.name, nameEn: cat.nameEn, icon: cat.icon })
  }

  const saveEdit = () => {
    if (!editingId || !form.name) return
    onUpdate(categories.map((c) => c.id === editingId ? { ...c, ...form } : c))
    setEditingId(null)
    setForm({ name: '', nameEn: '', icon: '' })
  }

  const addCategory = () => {
    if (!form.name) return
    const id = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    onUpdate([...categories, { id, ...form }])
    setForm({ name: '', nameEn: '', icon: '' })
    setNewCat(false)
  }

  const deleteCategory = (id: string) => {
    if (!confirm('¿Eliminar esta categoría? Los productos de esta categoría quedarán sin categoría.')) return
    onUpdate(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="mb-6 border border-border rounded bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-gold" />
          <span className="text-sm font-semibold">Categorías ({categories.length})</span>
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="mt-3 space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                {editingId === cat.id ? (
                  <>
                    <input className="flex-1 bg-background border border-gold rounded px-2 py-1.5 text-sm outline-none" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Emoji" style={{ maxWidth: 60 }} />
                    <input className="flex-1 bg-background border border-gold rounded px-2 py-1.5 text-sm outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre ES *" />
                    <input className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-sm outline-none focus:border-gold" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} placeholder="Name EN" />
                    <button onClick={saveEdit} className="p-1.5 bg-gold text-black rounded hover:bg-orange-bar transition-colors"><Check size={14} /></button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 border border-border rounded hover:border-red-bar hover:text-red-bar transition-colors"><X size={14} /></button>
                  </>
                ) : (
                  <>
                    <span className="text-sm w-8 text-center">{cat.icon}</span>
                    <span className="flex-1 text-sm font-medium">{cat.name}</span>
                    <span className="flex-1 text-sm text-muted-foreground hidden sm:block">{cat.nameEn}</span>
                    <button onClick={() => startEdit(cat)} className="p-1.5 border border-border rounded hover:border-gold hover:text-gold transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-1.5 border border-border rounded hover:border-red-bar hover:text-red-bar transition-colors"><Trash2 size={13} /></button>
                  </>
                )}
              </div>
            ))}
          </div>

          {newCat ? (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <input className="bg-background border border-border rounded px-2 py-1.5 text-sm outline-none focus:border-gold" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Emoji" style={{ maxWidth: 60 }} />
              <input className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-sm outline-none focus:border-gold" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre ES *" />
              <input className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-sm outline-none focus:border-gold" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} placeholder="Name EN" />
              <button onClick={addCategory} className="p-1.5 bg-gold text-black rounded hover:bg-orange-bar transition-colors"><Check size={14} /></button>
              <button onClick={() => { setNewCat(false); setForm({ name: '', nameEn: '', icon: '' }) }} className="p-1.5 border border-border rounded hover:border-red-bar hover:text-red-bar transition-colors"><X size={14} /></button>
            </div>
          ) : (
            <button
              onClick={() => { setNewCat(true); setForm({ name: '', nameEn: '', icon: '' }) }}
              className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              <Plus size={14} /> Agregar categoría
            </button>
          )}
        </div>
      )}
    </div>
  )
}
