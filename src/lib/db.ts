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
  try {
    await connectDB()
    const doc = await ensureSingleDocument(Menu, jsonData.getMenu())
    return { categories: doc.categories || [], items: doc.items || [] }
  } catch (error) {
    console.error('MongoDB error (menu), falling back to JSON:', error)
    return jsonData.getMenu()
  }
}

export async function saveMenuDB(data: MenuData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.saveMenu(data)
    return
  }
  try {
    await connectDB()
    await Menu.findOneAndUpdate({}, data, { upsert: true, new: true })
  } catch (error) {
    console.error('MongoDB error (save menu), falling back to JSON:', error)
    jsonData.saveMenu(data)
  }
}

// Inventory
export async function getInventoryDB(): Promise<InventoryData> {
  if (!isMongoDBConfigured()) {
    return jsonData.getInventory()
  }
  try {
    await connectDB()
    const doc = await ensureSingleDocument(Inventory, jsonData.getInventory())
    return { items: doc.items || [] }
  } catch (error) {
    console.error('MongoDB error (inventory), falling back to JSON:', error)
    return jsonData.getInventory()
  }
}

export async function saveInventoryDB(data: InventoryData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.saveInventory(data)
    return
  }
  try {
    await connectDB()
    await Inventory.findOneAndUpdate({}, data, { upsert: true, new: true })
  } catch (error) {
    console.error('MongoDB error (save inventory), falling back to JSON:', error)
    jsonData.saveInventory(data)
  }
}

// Promotions
export async function getPromotionsDB(): Promise<PromotionsData> {
  if (!isMongoDBConfigured()) {
    return jsonData.getPromotions()
  }
  try {
    await connectDB()
    const doc = await ensureSingleDocument(Promotions, jsonData.getPromotions())
    return { items: doc.items || [] }
  } catch (error) {
    console.error('MongoDB error (promotions), falling back to JSON:', error)
    return jsonData.getPromotions()
  }
}

export async function savePromotionsDB(data: PromotionsData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.savePromotions(data)
    return
  }
  try {
    await connectDB()
    await Promotions.findOneAndUpdate({}, data, { upsert: true, new: true })
  } catch (error) {
    console.error('MongoDB error (save promotions), falling back to JSON:', error)
    jsonData.savePromotions(data)
  }
}

// Settings
export async function getSettingsDB(): Promise<SettingsData> {
  if (!isMongoDBConfigured()) {
    return jsonData.getSettings()
  }
  try {
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
  } catch (error) {
    console.error('MongoDB error (settings), falling back to JSON:', error)
    return jsonData.getSettings()
  }
}

export async function saveSettingsDB(data: SettingsData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.saveSettings(data)
    return
  }
  try {
    await connectDB()
    await Settings.findOneAndUpdate({}, data, { upsert: true, new: true })
  } catch (error) {
    console.error('MongoDB error (save settings), falling back to JSON:', error)
    jsonData.saveSettings(data)
  }
}

// Admin Password
export async function getAdminPasswordDB(): Promise<string> {
  if (!isMongoDBConfigured()) {
    return process.env.ADMIN_PASSWORD || 'Desmadrugados2024'
  }
  try {
    await connectDB()
    const doc = await Settings.findOne()
    if (doc?.adminPassword) return doc.adminPassword
    return process.env.ADMIN_PASSWORD || 'Desmadrugados2024'
  } catch {
    return process.env.ADMIN_PASSWORD || 'Desmadrugados2024'
  }
}

export async function saveAdminPasswordDB(password: string): Promise<void> {
  if (!isMongoDBConfigured()) return
  try {
    await connectDB()
    await Settings.findOneAndUpdate({}, { adminPassword: password }, { upsert: true })
  } catch (error) {
    console.error('MongoDB error (save password):', error)
  }
}

// Carousel
export async function getCarouselDB(): Promise<CarouselData> {
  if (!isMongoDBConfigured()) {
    return jsonData.getCarousel()
  }
  try {
    await connectDB()
    const doc = await ensureSingleDocument(Carousel, jsonData.getCarousel())
    return { images: doc.images || [] }
  } catch (error) {
    console.error('MongoDB error (carousel), falling back to JSON:', error)
    return jsonData.getCarousel()
  }
}

export async function saveCarouselDB(data: CarouselData): Promise<void> {
  if (!isMongoDBConfigured()) {
    jsonData.saveCarousel(data)
    return
  }
  try {
    await connectDB()
    await Carousel.findOneAndUpdate({}, data, { upsert: true, new: true })
  } catch (error) {
    console.error('MongoDB error (save carousel), falling back to JSON:', error)
    jsonData.saveCarousel(data)
  }
}
