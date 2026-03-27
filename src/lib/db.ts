import { connectDB, isMongoDBConfigured } from './mongodb'
import { Menu, Inventory, Promotions, Settings, Carousel } from './models'
import * as jsonData from './data'
import type { MenuData, InventoryData, PromotionsData, SettingsData, CarouselData } from './data'

// Helper to ensure single document exists
async function ensureSingleDocument<T>(
  Model: typeof Menu | typeof Inventory | typeof Promotions | typeof Settings | typeof Carousel,
  defaultData: T
): Promise<T> {
  let doc = await Model.findOne()
  if (!doc) {
    doc = await Model.create(defaultData)
  }
  return doc.toObject() as T
}

// Menu
export async function getMenuDB(): Promise<MenuData> {
  if (!isMongoDBConfigured()) {
    return jsonData.getMenu()
  }
  await connectDB()
  const doc = await ensureSingleDocument(Menu, jsonData.getMenu())
  return { categories: doc.categories || [], items: doc.items || [] }
}

export async function saveMenuDB(data: MenuData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.saveMenu(data)
    return
  }
  await connectDB()
  await Menu.findOneAndUpdate({}, data, { upsert: true, new: true })
}

// Inventory
export async function getInventoryDB(): Promise<InventoryData> {
  if (!isMongoDBConfigured()) {
    return jsonData.getInventory()
  }
  await connectDB()
  const doc = await ensureSingleDocument(Inventory, jsonData.getInventory())
  return { items: doc.items || [] }
}

export async function saveInventoryDB(data: InventoryData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.saveInventory(data)
    return
  }
  await connectDB()
  await Inventory.findOneAndUpdate({}, data, { upsert: true, new: true })
}

// Promotions
export async function getPromotionsDB(): Promise<PromotionsData> {
  if (!isMongoDBConfigured()) {
    return jsonData.getPromotions()
  }
  await connectDB()
  const doc = await ensureSingleDocument(Promotions, jsonData.getPromotions())
  return { items: doc.items || [] }
}

export async function savePromotionsDB(data: PromotionsData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.savePromotions(data)
    return
  }
  await connectDB()
  await Promotions.findOneAndUpdate({}, data, { upsert: true, new: true })
}

// Settings
export async function getSettingsDB(): Promise<SettingsData> {
  if (!isMongoDBConfigured()) {
    return jsonData.getSettings()
  }
  await connectDB()
  const doc = await ensureSingleDocument(Settings, jsonData.getSettings())
  return {
    whatsapp: doc.whatsapp || '',
    instagram: doc.instagram || '',
    facebook: doc.facebook || '',
    address: doc.address || '',
    addressEn: doc.addressEn || '',
    hours: doc.hours || [],
    specialNights: doc.specialNights || [],
    mapEmbedUrl: doc.mapEmbedUrl || '',
  }
}

export async function saveSettingsDB(data: SettingsData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.saveSettings(data)
    return
  }
  await connectDB()
  await Settings.findOneAndUpdate({}, data, { upsert: true, new: true })
}

// Carousel
export async function getCarouselDB(): Promise<CarouselData> {
  if (!isMongoDBConfigured()) {
    return jsonData.getCarousel()
  }
  await connectDB()
  const doc = await ensureSingleDocument(Carousel, jsonData.getCarousel())
  return { images: doc.images || [] }
}

export async function saveCarouselDB(data: CarouselData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.saveCarousel(data)
    return
  }
  await connectDB()
  await Carousel.findOneAndUpdate({}, data, { upsert: true, new: true })
}
