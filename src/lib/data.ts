import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

function readJSON<T>(filename: string): T {
  const filePath = path.join(dataDir, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

function writeJSON<T>(filename: string, data: T): void {
  const filePath = path.join(dataDir, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// Types
export type MenuData = {
  categories: { id: string; name: string; nameEn: string; icon: string }[]
  items: { id: string; name: string; nameEn: string; category: string; price: number; available: boolean }[]
}

export type PromotionsData = {
  items: {
    id: string; title: string; titleEn: string; description: string; descriptionEn: string;
    badge: string; badgeEn: string; active: boolean
  }[]
}

export type SettingsData = {
  whatsapp: string; instagram: string; facebook: string;
  address: string; addressEn: string;
  hours: { day: string; dayEn: string; time: string }[]
  specialNights: { name: string; nameEn: string; desc: string; descEn: string }[]
  mapEmbedUrl: string
}

export type CarouselData = {
  images: { id: string; src: string; alt: string; altEn: string }[]
}

export type InventoryData = {
  items: {
    id: string; name: string; brand: string; presentation: string;
    category: string; stock: number; minStock: number; unit: string;
    cost: number; price: number; image: string
  }[]
}

// JSON-based functions (used as fallback and for static pages)
export function getMenu(): MenuData {
  return readJSON<MenuData>('menu.json')
}

export function saveMenu(data: MenuData): void {
  writeJSON('menu.json', data)
}

export function getPromotions(): PromotionsData {
  return readJSON<PromotionsData>('promotions.json')
}

export function savePromotions(data: PromotionsData): void {
  writeJSON('promotions.json', data)
}

export function getSettings(): SettingsData {
  return readJSON<SettingsData>('settings.json')
}

export function saveSettings(data: SettingsData): void {
  writeJSON('settings.json', data)
}

export function getCarousel(): CarouselData {
  return readJSON<CarouselData>('carousel.json')
}

export function saveCarousel(data: CarouselData): void {
  writeJSON('carousel.json', data)
}

export function getInventory(): InventoryData {
  return readJSON<InventoryData>('inventory.json')
}

export function saveInventory(data: InventoryData): void {
  writeJSON('inventory.json', data)
}
