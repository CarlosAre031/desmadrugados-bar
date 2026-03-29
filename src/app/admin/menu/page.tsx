'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, Check, X, ImagePlus, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CategoryManager, type Category } from '@/components/admin/CategoryManager'

interface MenuItem {
  id: string
  name: string
  nameEn: string
  category: string
  price: number
  available: boolean
  image: string
}

interface MenuData {
  categories: Category[]
  items: MenuItem[]
}

function ImageUploader({ image, onUpload }: { image: string; onUpload: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (json.url) onUpload(json.url)
    } catch (e) {
      console.error('Upload failed', e)
    }
    setUploading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
      />
      {image ? (
        <div className="relative group">
          <img src={image} alt="" className="w-10 h-10 rounded object-cover border border-border" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center"
          >
            <Pencil size={12} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-10 h-10 border border-dashed border-border rounded flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
        </button>
      )}
    </div>
  )
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
          <ImageUploader image={form.image} onUpload={(url) => setForm({ ...form, image: url })} />
        </td>
        <td className="px-3 py-2">
          <input
            className="w-full bg-card border border-gold rounded px-2 py-1 text-sm focus:outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre ES"
          />
        </td>
        <td className="px-3 py-2 hidden sm:table-cell">
          <input
            className="w-full bg-card border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-gold"
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            placeholder="Name EN"
          />
        </td>
        <td className="px-3 py-2">
          <select
            className="w-full bg-card border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-gold"
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
            className="w-20 bg-card border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-gold"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </td>
        <td className="px-3 py-2">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="accent-gold w-4 h-4"
          />
        </td>
        <td className="px-3 py-2">
          <div className="flex gap-2">
            <button onClick={save} className="p-1.5 bg-gold text-black rounded hover:bg-orange-bar transition-colors">
              <Check size={14} />
            </button>
            <button onClick={() => setEditing(false)} className="p-1.5 border border-border rounded hover:border-red-bar hover:text-red-bar transition-colors">
              <X size={14} />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-border hover:bg-secondary/10 transition-colors">
      <td className="px-3 py-3">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover border border-border" />
        ) : (
          <div className="w-10 h-10 rounded border border-border/30 bg-secondary/20 flex items-center justify-center text-muted-foreground">
            <ImagePlus size={14} />
          </div>
        )}
      </td>
      <td className="px-3 py-3 text-sm font-medium">{item.name}</td>
      <td className="px-3 py-3 text-sm text-muted-foreground hidden sm:table-cell">{item.nameEn}</td>
      <td className="px-3 py-3 text-sm">{cat?.icon} {cat?.name}</td>
      <td className="px-3 py-3 text-sm font-heading text-lg text-gold">${item.price}</td>
      <td className="px-3 py-3">
        <Badge className={item.available ? 'bg-green-700/20 text-green-400 border-green-700/30' : 'bg-secondary text-muted-foreground'}>
          {item.available ? 'Activo' : 'Inactivo'}
        </Badge>
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <button onClick={() => { setForm(item); setEditing(true) }} className="p-1.5 border border-border rounded hover:border-gold hover:text-gold transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-1.5 border border-border rounded hover:border-red-bar hover:text-red-bar transition-colors">
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
  const [form, setForm] = useState({ name: '', nameEn: '', category: '', price: 0, available: true, image: '' })
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
    setForm({ name: '', nameEn: '', category: '', price: 0, available: true, image: '' })
    setNewItem(false)
  }

  if (!data) return <div className="text-muted-foreground text-sm">Cargando...</div>

  const filtered = filter === 'all' ? data.items : data.items.filter((i) => i.category === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl text-gold tracking-wider">Menú</h1>
          <p className="text-muted-foreground text-sm">{data.items.length} productos</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-400">✓ Guardado</span>}
          {saving && <span className="text-xs text-muted-foreground">Guardando...</span>}
          <button
            onClick={() => setNewItem(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold text-sm rounded hover:bg-orange-bar transition-all min-h-[40px]"
          >
            <Plus size={16} /> Agregar
          </button>
        </div>
      </div>

      {/* Category manager */}
      <CategoryManager
        categories={data.categories}
        onUpdate={(categories) => {
          const next = { ...data, categories }
          setData(next)
          save(next)
        }}
      />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs rounded border transition-all ${filter === 'all' ? 'bg-gold text-black border-gold' : 'border-border hover:border-gold'}`}
        >
          Todos
        </button>
        {data.categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1 text-xs rounded border transition-all ${filter === c.id ? 'bg-gold text-black border-gold' : 'border-border hover:border-gold'}`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Add new form */}
      {newItem && (
        <div className="mb-4 p-4 border border-gold/40 rounded bg-card">
          <p className="text-sm font-semibold mb-3">Nuevo producto</p>
          <div className="flex items-start gap-3">
            <ImageUploader image={form.image} onUpload={(url) => setForm({ ...form, image: url })} />
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <input
                className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-gold outline-none"
                placeholder="Nombre ES *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-gold outline-none"
                placeholder="Name EN"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              />
              <select
                className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-gold outline-none"
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
                className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-gold outline-none"
                placeholder="Precio"
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
              <div className="flex gap-2">
                <button
                  onClick={addItem}
                  className="flex-1 py-2 bg-gold text-black font-semibold text-sm rounded hover:bg-orange-bar transition-all"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setNewItem(false)}
                  className="px-3 py-2 border border-border rounded hover:border-red-bar hover:text-red-bar transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold w-14">Foto</th>
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
