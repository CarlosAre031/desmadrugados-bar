'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Check, X, AlertTriangle, Trash2, Upload, ImageIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface InventoryItem {
  id: string
  name: string
  brand: string
  presentation: string
  category: string
  stock: number
  minStock: number
  unit: string
  cost: number
  price: number
  image: string
}

interface InventoryData {
  items: InventoryItem[]
}

interface MenuCategory {
  id: string
  name: string
  nameEn: string
  icon: string
}

const UNITS = ['piezas', 'botellas', 'cajas', 'latas', 'bolsas']

function StockBadge({ stock, min }: { stock: number; min: number }) {
  if (stock === 0) return <Badge className="bg-[#B83232]/20 text-[#B83232] border-[#B83232]/30">Agotado</Badge>
  if (stock <= min) return <Badge className="bg-[#C96A1A]/20 text-[#C96A1A] border-[#C96A1A]/30">Stock bajo</Badge>
  return <Badge className="bg-green-700/20 text-green-400 border-green-700/30">OK</Badge>
}

function ItemRow({ item, categories, onSave, onDelete }: {
  item: InventoryItem
  categories: MenuCategory[]
  onSave: (item: InventoryItem) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(item)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const save = () => { onSave(form); setEditing(false) }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const json = await res.json()
    if (json.url) {
      setForm({ ...form, image: json.url })
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  if (editing) {
    return (
      <tr className="border-b border-border bg-secondary/20">
        <td className="px-3 py-2" colSpan={2}>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              {/* Image preview/upload */}
              <div className="relative w-12 h-12 rounded bg-card border border-border shrink-0 overflow-hidden">
                {form.image ? (
                  <Image src={form.image} alt="" fill className="object-cover" unoptimized={form.image.startsWith('http')} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={16} />
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="p-1.5 border border-border rounded hover:border-[#D4A017] hover:text-[#D4A017] transition-colors text-xs"
              >
                {uploading ? '...' : <Upload size={12} />}
              </button>
            </div>
            <input className="w-full bg-card border border-[#D4A017] rounded px-2 py-1 text-sm outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" />
            <input className="w-full bg-card border border-border rounded px-2 py-1 text-sm outline-none focus:border-[#D4A017]" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Marca" />
            <input className="w-full bg-card border border-border rounded px-2 py-1 text-sm outline-none focus:border-[#D4A017]" value={form.presentation} onChange={(e) => setForm({ ...form, presentation: e.target.value })} placeholder="Presentación (ej: Botella 355ml)" />
          </div>
        </td>
        <td className="px-3 py-2 hidden md:table-cell">
          <select className="bg-card border border-border rounded px-2 py-1 text-sm outline-none focus:border-[#D4A017] w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </td>
        <td className="px-3 py-2">
          <input type="number" className="w-16 bg-card border border-border rounded px-2 py-1 text-sm outline-none focus:border-[#D4A017]" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
        </td>
        <td className="px-3 py-2 hidden sm:table-cell">
          <input type="number" className="w-14 bg-card border border-border rounded px-2 py-1 text-sm outline-none focus:border-[#D4A017]" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} />
        </td>
        <td className="px-3 py-2 hidden lg:table-cell">
          <select className="bg-card border border-border rounded px-2 py-1 text-sm outline-none focus:border-[#D4A017]" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </td>
        <td className="px-3 py-2 hidden lg:table-cell">
          <input type="number" className="w-16 bg-card border border-border rounded px-2 py-1 text-sm outline-none focus:border-[#D4A017]" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
        </td>
        <td className="px-3 py-2 hidden sm:table-cell">
          <input type="number" className="w-16 bg-card border border-border rounded px-2 py-1 text-sm outline-none focus:border-[#D4A017]" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        </td>
        <td className="px-3 py-2">
          <div className="flex gap-1">
            <button onClick={save} className="p-1.5 bg-[#D4A017] text-black rounded hover:bg-[#C96A1A] transition-colors"><Check size={13} /></button>
            <button onClick={() => setEditing(false)} className="p-1.5 border border-border rounded hover:border-[#B83232] hover:text-[#B83232] transition-colors"><X size={13} /></button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className={`border-b border-border hover:bg-secondary/10 transition-colors ${item.stock <= item.minStock ? 'bg-[#B83232]/5' : ''}`}>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          {/* Image */}
          <div className="w-10 h-10 rounded bg-card border border-border shrink-0 overflow-hidden">
            {item.image ? (
              <Image src={item.image} alt={item.name} width={40} height={40} className="object-cover w-full h-full" unoptimized={item.image.startsWith('http')} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                <ImageIcon size={14} />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium flex items-center gap-2 text-foreground">
              {item.stock <= item.minStock && <AlertTriangle size={12} className="text-[#B83232] shrink-0" />}
              {item.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">{item.brand}</span>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-xs text-muted-foreground hidden sm:table-cell">{item.presentation}</td>
      <td className="px-3 py-3 text-sm text-muted-foreground hidden md:table-cell capitalize">{categories.find(c => c.id === item.category)?.icon} {categories.find(c => c.id === item.category)?.name || item.category}</td>
      <td className="px-3 py-3 text-sm font-heading text-xl text-foreground">{item.stock} <span className="text-xs text-muted-foreground font-mono">{item.unit}</span></td>
      <td className="px-3 py-3 text-sm text-muted-foreground hidden sm:table-cell">{item.minStock}</td>
      <td className="px-3 py-3 hidden lg:table-cell"><StockBadge stock={item.stock} min={item.minStock} /></td>
      <td className="px-3 py-3 text-sm text-muted-foreground hidden lg:table-cell">${item.cost}</td>
      <td className="px-3 py-3 text-sm text-[#D4A017] font-heading text-lg hidden sm:table-cell">${item.price}</td>
      <td className="px-3 py-3">
        <div className="flex gap-1">
          <button onClick={() => { setForm(item); setEditing(true) }} className="p-1.5 border border-border rounded hover:border-[#D4A017] hover:text-[#D4A017] transition-colors"><Pencil size={13} /></button>
          <button onClick={() => onDelete(item.id)} className="p-1.5 border border-border rounded hover:border-[#B83232] hover:text-[#B83232] transition-colors"><Trash2 size={13} /></button>
        </div>
      </td>
    </tr>
  )
}

export default function InventoryPage() {
  const [data, setData] = useState<InventoryData | null>(null)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newItem, setNewItem] = useState(false)
  const [form, setForm] = useState({
    name: '', brand: '', presentation: '', category: '',
    stock: 0, minStock: 5, unit: 'piezas', cost: 0, price: 0, image: ''
  })
  const [filter, setFilter] = useState('all')
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch('/api/inventory').then((r) => r.json()).then(setData)
    fetch('/api/menu').then((r) => r.json()).then((menu) => {
      setCategories(menu.categories || [])
    })
  }, [])

  const save = async (updated: InventoryData) => {
    setSaving(true)
    await fetch('/api/inventory', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateItem = (updated: InventoryItem) => {
    if (!data) return
    const next = { items: data.items.map((i) => i.id === updated.id ? updated : i) }
    setData(next)
    save(next)
  }

  const deleteItem = (id: string) => {
    if (!data || !confirm('¿Eliminar este producto del inventario?')) return
    const next = { items: data.items.filter((i) => i.id !== id) }
    setData(next)
    save(next)
  }

  const handleNewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const json = await res.json()
    if (json.url) {
      setForm({ ...form, image: json.url })
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const addItem = () => {
    if (!data || !form.name) return
    const item: InventoryItem = { id: Date.now().toString(), ...form }
    const next = { items: [...data.items, item] }
    setData(next)
    save(next)
    setForm({ name: '', brand: '', presentation: '', category: '', stock: 0, minStock: 5, unit: 'piezas', cost: 0, price: 0, image: '' })
    setNewItem(false)
  }

  if (!data) return <div className="text-muted-foreground text-sm">Cargando...</div>

  const lowStock = data.items.filter((i) => i.stock <= i.minStock)
  const filtered = filter === 'all' ? data.items : data.items.filter((i) => i.category === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl text-[#D4A017] tracking-wider">Inventario</h1>
          <p className="text-muted-foreground text-sm">{data.items.length} productos registrados</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-400">✓ Guardado</span>}
          {saving && <span className="text-xs text-muted-foreground">Guardando...</span>}
          <button onClick={() => setNewItem(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A017] text-black font-semibold text-sm rounded hover:bg-[#C96A1A] transition-all min-h-[40px]">
            <Plus size={16} /> Agregar
          </button>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="mb-4 p-3 border border-[#B83232]/40 rounded bg-[#B83232]/10 flex items-center gap-2">
          <AlertTriangle size={16} className="text-[#B83232]" />
          <p className="text-sm text-[#B83232] font-medium">
            {lowStock.length} producto{lowStock.length > 1 ? 's' : ''} con stock bajo o agotado
          </p>
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs rounded border transition-all ${filter === 'all' ? 'bg-[#D4A017] text-black border-[#D4A017]' : 'border-border hover:border-[#D4A017]'}`}
        >
          Todos ({data.items.length})
        </button>
        {categories.map((c) => {
          const count = data.items.filter(i => i.category === c.id).length
          if (count === 0) return null
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-3 py-1 text-xs rounded border transition-all ${filter === c.id ? 'bg-[#D4A017] text-black border-[#D4A017]' : 'border-border hover:border-[#D4A017]'}`}
            >
              {c.icon} {c.name} ({count})
            </button>
          )
        })}
      </div>

      {newItem && (
        <div className="mb-4 p-4 border border-[#D4A017]/40 rounded bg-card">
          <p className="text-sm font-semibold mb-3">Nuevo producto</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Image upload */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
              <div className="w-16 h-16 rounded bg-background border border-border shrink-0 overflow-hidden flex items-center justify-center">
                {form.image ? (
                  <Image src={form.image} alt="" width={64} height={64} className="object-cover w-full h-full" unoptimized />
                ) : (
                  <ImageIcon size={20} className="text-muted-foreground/30" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleNewImageUpload} className="hidden" />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-1.5 text-xs border border-border rounded hover:border-[#D4A017] hover:text-[#D4A017] transition-colors">
                  {uploading ? 'Subiendo...' : 'Subir imagen'}
                </button>
                {form.image && (
                  <button onClick={() => setForm({ ...form, image: '' })} className="text-xs text-muted-foreground hover:text-[#B83232]">Quitar</button>
                )}
              </div>
            </div>
            <input className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none" placeholder="Nombre *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none" placeholder="Marca" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <input className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none" placeholder="Presentación (ej: Botella 355ml)" value={form.presentation} onChange={(e) => setForm({ ...form, presentation: e.target.value })} />
            <select className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Categoría *</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
            <input type="number" className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none" placeholder="Stock" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            <input type="number" className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none" placeholder="Stock mínimo" value={form.minStock || ''} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} />
            <select className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <input type="number" className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none" placeholder="Costo $" value={form.cost || ''} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
            <input type="number" className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-[#D4A017] outline-none" placeholder="Precio venta $" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <div className="flex gap-2 col-span-2 sm:col-span-1">
              <button onClick={addItem} className="flex-1 py-2 bg-[#D4A017] text-black font-semibold text-sm rounded hover:bg-[#C96A1A] transition-all">Guardar</button>
              <button onClick={() => setNewItem(false)} className="px-3 py-2 border border-border rounded hover:border-[#B83232] hover:text-[#B83232] transition-all"><X size={16} /></button>
            </div>
          </div>
        </div>
      )}

      <div className="border border-border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold">Producto</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold hidden sm:table-cell">Presentación</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold hidden md:table-cell">Categoría</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold">Stock</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold hidden sm:table-cell">Mín.</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold hidden lg:table-cell">Estado</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold hidden lg:table-cell">Costo</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold hidden sm:table-cell">Precio</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <ItemRow key={item.id} item={item} categories={categories} onSave={updateItem} onDelete={deleteItem} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
