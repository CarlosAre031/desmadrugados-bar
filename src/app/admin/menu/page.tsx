'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
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

interface MenuData {
  categories: Category[]
  items: MenuItem[]
}

function ItemRow({ item, categories, onSave, onDelete }: {
  item: MenuItem
  categories: Category[]
  onSave: (item: MenuItem) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(item)
  const cat = categories.find((c) => c.id === item.category)

  const save = () => {
    onSave(form)
    setEditing(false)
  }

  if (editing) {
    return (
      <tr className="border-b border-border bg-secondary/20">
        <td className="px-3 py-2">
          <input
            className="w-full bg-card border border-[#D4A017] rounded px-2 py-1 text-sm focus:outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre ES"
          />
        </td>
        <td className="px-3 py-2 hidden sm:table-cell">
          <input
            className="w-full bg-card border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-[#D4A017]"
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            placeholder="Name EN"
          />
        </td>
        <td className="px-3 py-2">
          <select
            className="w-full bg-card border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-[#D4A017]"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2">
          <input
            type="number"
            className="w-20 bg-card border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-[#D4A017]"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </td>
        <td className="px-3 py-2">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="accent-[#D4A017] w-4 h-4"
          />
        </td>
        <td className="px-3 py-2">
          <div className="flex gap-2">
            <button onClick={save} className="p-1.5 bg-[#D4A017] text-black rounded hover:bg-[#C96A1A] transition-colors">
              <Check size={14} />
            </button>
            <button onClick={() => setEditing(false)} className="p-1.5 border border-border rounded hover:border-[#B83232] hover:text-[#B83232] transition-colors">
              <X size={14} />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-border hover:bg-secondary/10 transition-colors">
      <td className="px-3 py-3 text-sm font-medium">{item.name}</td>
      <td className="px-3 py-3 text-sm text-muted-foreground hidden sm:table-cell">{item.nameEn}</td>
      <td className="px-3 py-3 text-sm">{cat?.icon} {cat?.name}</td>
      <td className="px-3 py-3 text-sm font-heading text-lg text-[#D4A017]">${item.price}</td>
      <td className="px-3 py-3">
        <Badge className={item.available ? 'bg-green-700/20 text-green-400 border-green-700/30' : 'bg-secondary text-muted-foreground'}>
          {item.available ? 'Activo' : 'Inactivo'}
        </Badge>
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <button onClick={() => { setForm(item); setEditing(true) }} className="p-1.5 border border-border rounded hover:border-[#D4A017] hover:text-[#D4A017] transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-1.5 border border-border rounded hover:border-[#B83232] hover:text-[#B83232] transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function MenuAdminPage() {
  const [data, setData] = useState<MenuData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newItem, setNewItem] = useState(false)
  const [form, setForm] = useState({ name: '', nameEn: '', category: '', price: 0, available: true })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/menu').then((r) => r.json()).then(setData)
  }, [])

  const save = async (updated: MenuData) => {
    setSaving(true)
    await fetch('/api/menu', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateItem = (updated: MenuItem) => {
    if (!data) return
    const items = data.items.map((i) => i.id === updated.id ? updated : i)
    const next = { ...data, items }
    setData(next)
    save(next)
  }

  const deleteItem = (id: string) => {
    if (!data || !confirm('¿Eliminar este producto?')) return
    const next = { ...data, items: data.items.filter((i) => i.id !== id) }
    setData(next)
    save(next)
  }

  const addItem = () => {
    if (!data || !form.name || !form.category) return
    const item: MenuItem = {
      id: Date.now().toString(),
      ...form,
    }
    const next = { ...data, items: [...data.items, item] }
    setData(next)
    save(next)
    setForm({ name: '', nameEn: '', category: '', price: 0, available: true })
    setNewItem(false)
  }

  if (!data) return <div className="text-muted-foreground text-sm">Cargando...</div>

  const filtered = filter === 'all' ? data.items : data.items.filter((i) => i.category === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl text-[#D4A017] tracking-wider">Menú</h1>
          <p className="text-muted-foreground text-sm">{data.items.length} productos</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-400">✓ Guardado</span>}
          {saving && <span className="text-xs text-muted-foreground">Guardando...</span>}
          <button
            onClick={() => setNewItem(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4A017] text-black font-semibold text-sm rounded hover:bg-[#C96A1A] transition-all min-h-[40px]"
          >
            <Plus size={16} /> Agregar
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs rounded border transition-all ${filter === 'all' ? 'bg-[#D4A017] text-black border-[#D4A017]' : 'border-border hover:border-[#D4A017]'}`}
        >
          Todos
        </button>
        {data.categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1 text-xs rounded border transition-all ${filter === c.id ? 'bg-[#D4A017] text-black border-[#D4A017]' : 'border-border hover:border-[#D4A017]'}`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Add new form */}
      {newItem && (
        <div className="mb-4 p-4 border border-[#D4A017]/40 rounded bg-card">
          <p className="text-sm font-semibold mb-3">Nuevo producto</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <input
              className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none"
              placeholder="Nombre ES *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none"
              placeholder="Name EN"
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            />
            <select
              className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Categoría *</option>
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="number"
              className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none"
              placeholder="Precio"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
            <div className="flex gap-2">
              <button
                onClick={addItem}
                className="flex-1 py-2 bg-[#D4A017] text-black font-semibold text-sm rounded hover:bg-[#C96A1A] transition-all"
              >
                Guardar
              </button>
              <button
                onClick={() => setNewItem(false)}
                className="px-3 py-2 border border-border rounded hover:border-[#B83232] hover:text-[#B83232] transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold">Nombre ES</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold hidden sm:table-cell">Name EN</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold">Categoría</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold">Precio</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold">Estado</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <ItemRow key={item.id} item={item} categories={data.categories} onSave={updateItem} onDelete={deleteItem} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
