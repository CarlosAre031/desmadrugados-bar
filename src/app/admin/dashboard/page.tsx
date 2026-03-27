import { getMenu, getInventory, getPromotions, getSettings } from '@/lib/data'
import Link from 'next/link'
import { UtensilsCrossed, Package, Megaphone, Images, Settings, AlertTriangle } from 'lucide-react'

export default function DashboardPage() {
  const menu = getMenu()
  const inventory = getInventory()
  const promotions = getPromotions()
  const settings = getSettings()

  const lowStock = inventory.items.filter((i) => i.stock <= i.minStock)
  const activePromos = promotions.items.filter((p) => p.active).length
  const availableItems = menu.items.filter((i) => i.available).length

  const cards = [
    {
      href: '/admin/menu',
      icon: UtensilsCrossed,
      label: 'Productos en menú',
      value: availableItems,
      sub: `de ${menu.items.length} totales`,
      color: '#D4A017',
    },
    {
      href: '/admin/inventory',
      icon: Package,
      label: 'Inventario',
      value: inventory.items.length,
      sub: lowStock.length > 0 ? `${lowStock.length} con stock bajo` : 'Todo en orden',
      color: lowStock.length > 0 ? '#B83232' : '#D4A017',
      alert: lowStock.length > 0,
    },
    {
      href: '/admin/promotions',
      icon: Megaphone,
      label: 'Promociones activas',
      value: activePromos,
      sub: `de ${promotions.items.length} totales`,
      color: '#C96A1A',
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: 'Configuración',
      value: settings.whatsapp ? '✓' : '!',
      sub: settings.whatsapp ? 'WhatsApp configurado' : 'Configura el WhatsApp',
      color: settings.whatsapp ? '#D4A017' : '#B83232',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-5xl text-[#D4A017] tracking-wider">Panel de Control</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestiona tu bar desde aquí.</p>
      </div>

      {/* Alert: low stock */}
      {lowStock.length > 0 && (
        <div className="mb-6 p-4 border border-[#B83232]/40 rounded bg-[#B83232]/10 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#B83232] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#B83232]">Stock bajo en {lowStock.length} producto{lowStock.length > 1 ? 's' : ''}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStock.map((i) => i.name).join(', ')}
            </p>
            <Link href="/admin/inventory" className="text-xs text-[#D4A017] hover:underline mt-1 inline-block">
              Ver inventario →
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-border hover:border-[#D4A017]/50 rounded bg-card p-5 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <card.icon size={18} className="text-muted-foreground" />
              {card.alert && <AlertTriangle size={14} className="text-[#B83232]" />}
            </div>
            <p className="font-heading text-4xl" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs font-semibold text-foreground mt-1">{card.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { href: '/admin/menu', icon: UtensilsCrossed, label: 'Editar menú', desc: 'Agrega, edita o desactiva productos' },
          { href: '/admin/inventory', icon: Package, label: 'Ver inventario', desc: 'Actualiza el stock de productos' },
          { href: '/admin/promotions', icon: Megaphone, label: 'Promociones', desc: 'Gestiona campañas y ofertas' },
          { href: '/admin/carousel', icon: Images, label: 'Carrusel de fotos', desc: 'Sube y ordena imágenes del bar' },
          { href: '/admin/settings', icon: Settings, label: 'Configuración', desc: 'WhatsApp, redes sociales, mapa' },
          { href: '/', icon: UtensilsCrossed, label: 'Ver el sitio', desc: 'Abre la página pública del bar' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            target={item.href === '/' ? '_blank' : undefined}
            className="flex items-center gap-4 p-4 border border-border hover:border-[#D4A017]/50 rounded bg-card transition-all"
          >
            <item.icon size={18} className="text-[#D4A017] shrink-0" />
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
