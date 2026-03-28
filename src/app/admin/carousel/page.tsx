'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react'

interface CarouselImage {
  id: string
  src: string
  alt: string
  altEn: string
}

interface CarouselData { images: CarouselImage[] }

export default function CarouselAdminPage() {
  const [data, setData] = useState<CarouselData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [altInput, setAltInput] = useState('')
  const [altEnInput, setAltEnInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/carousel').then((r) => r.json()).then(setData)
  }, [])

  const save = async (updated: CarouselData) => {
    setSaving(true)
    await fetch('/api/carousel', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const moveUp = (i: number) => {
    if (!data || i === 0) return
    const imgs = [...data.images]
    ;[imgs[i - 1], imgs[i]] = [imgs[i], imgs[i - 1]]
    const next = { images: imgs }
    setData(next)
    save(next)
  }

  const moveDown = (i: number) => {
    if (!data || i === data.images.length - 1) return
    const imgs = [...data.images]
    ;[imgs[i], imgs[i + 1]] = [imgs[i + 1], imgs[i]]
    const next = { images: imgs }
    setData(next)
    save(next)
  }

  const deleteImage = (id: string) => {
    if (!data || !confirm('¿Eliminar esta imagen del carrusel?')) return
    const next = { images: data.images.filter((img) => img.id !== id) }
    setData(next)
    save(next)
  }

  const addByUrl = () => {
    if (!data || !urlInput) return
    const img: CarouselImage = {
      id: Date.now().toString(),
      src: urlInput,
      alt: altInput || 'Imagen del bar',
      altEn: altEnInput || 'Bar image',
    }
    const next = { images: [...data.images, img] }
    setData(next)
    save(next)
    setUrlInput('')
    setAltInput('')
    setAltEnInput('')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !data) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const json = await res.json()

    if (json.url) {
      const img: CarouselImage = {
        id: Date.now().toString(),
        src: json.url,
        alt: file.name.replace(/\.[^.]+$/, '').replace(/-|_/g, ' '),
        altEn: file.name.replace(/\.[^.]+$/, '').replace(/-|_/g, ' '),
      }
      const next = { images: [...data.images, img] }
      setData(next)
      save(next)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  if (!data) return <div className="text-muted-foreground text-sm">Cargando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl text-[#D4A017] tracking-wider">Carrusel de Fotos</h1>
          <p className="text-muted-foreground text-sm">{data.images.length} imagen{data.images.length !== 1 ? 'es' : ''} — arrastra para reordenar</p>
        </div>
        {saved && <span className="text-xs text-green-400">✓ Guardado</span>}
        {saving && <span className="text-xs text-muted-foreground">Guardando...</span>}
      </div>

      {/* Upload options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Upload file */}
        <div className="border border-border rounded p-4 bg-card">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Upload size={14} /> Subir desde tu computadora</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`flex items-center justify-center gap-2 w-full py-3 border border-dashed border-border rounded cursor-pointer hover:border-[#D4A017] hover:text-[#D4A017] transition-all text-sm text-muted-foreground ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {uploading ? 'Subiendo...' : (
              <><Plus size={16} /> Seleccionar imagen (JPG, PNG, WebP · máx 5MB)</>
            )}
          </label>
        </div>

        {/* Add by URL */}
        <div className="border border-border rounded p-4 bg-card">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Plus size={14} /> Agregar por URL</p>
          <div className="flex flex-col gap-2">
            <input
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-[#D4A017]"
              placeholder="https://... (URL de la imagen)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-[#D4A017]"
                placeholder="Descripción ES"
                value={altInput}
                onChange={(e) => setAltInput(e.target.value)}
              />
              <input
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-[#D4A017]"
                placeholder="Description EN"
                value={altEnInput}
                onChange={(e) => setAltEnInput(e.target.value)}
              />
            </div>
            <button
              onClick={addByUrl}
              disabled={!urlInput}
              className="py-2 bg-[#D4A017] text-black font-semibold text-sm rounded hover:bg-[#C96A1A] transition-all disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Image grid */}
      {data.images.length === 0 ? (
        <div className="border border-dashed border-border rounded p-12 text-center text-muted-foreground text-sm">
          No hay imágenes en el carrusel. Sube una o agrega una URL.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.images.map((img, i) => (
            <div key={img.id} className="border border-border rounded bg-card overflow-hidden group">
              <div className="relative aspect-video bg-secondary">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="p-2 bg-black/60 rounded hover:bg-[#D4A017] hover:text-black transition-all disabled:opacity-30">
                    <ArrowUp size={16} />
                  </button>
                  <button onClick={() => moveDown(i)} disabled={i === data.images.length - 1} className="p-2 bg-black/60 rounded hover:bg-[#D4A017] hover:text-black transition-all disabled:opacity-30">
                    <ArrowDown size={16} />
                  </button>
                  <button onClick={() => deleteImage(img.id)} className="p-2 bg-black/60 rounded hover:bg-[#B83232] hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate flex-1">{img.alt}</span>
                <span className="text-xs text-muted-foreground/50 ml-2">#{i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
