/**
 * Migration script: JSON files → MongoDB Atlas
 *
 * Usage:
 *   1. Set MONGODB_URI in .env.local
 *   2. Run: npx tsx scripts/migrate-to-mongodb.ts
 */

import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables')
  console.log('   Add it to .env.local:')
  console.log('   MONGODB_URI=mongodb+srv://user:password@cluster.xxxxx.mongodb.net/desmadrugados')
  process.exit(1)
}

const dataDir = path.join(process.cwd(), 'data')

function readJSON<T>(filename: string): T {
  const filePath = path.join(dataDir, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

// Define schemas inline to avoid import issues
const MenuSchema = new mongoose.Schema({
  categories: [{ id: String, name: String, nameEn: String, icon: String }],
  items: [{ id: String, name: String, nameEn: String, category: String, price: Number, available: Boolean }],
}, { timestamps: true })

const InventorySchema = new mongoose.Schema({
  items: [{
    id: String, name: String, brand: String, presentation: String,
    category: String, stock: Number, minStock: Number, unit: String,
    cost: Number, price: Number, image: String
  }],
}, { timestamps: true })

const PromotionsSchema = new mongoose.Schema({
  items: [{
    id: String, title: String, titleEn: String, description: String, descriptionEn: String,
    badge: String, badgeEn: String, active: Boolean
  }],
}, { timestamps: true })

const SettingsSchema = new mongoose.Schema({
  whatsapp: String, instagram: String, facebook: String,
  address: String, addressEn: String,
  hours: [{ day: String, dayEn: String, time: String }],
  specialNights: [{ name: String, nameEn: String, desc: String, descEn: String }],
  mapEmbedUrl: String,
}, { timestamps: true })

const CarouselSchema = new mongoose.Schema({
  images: [{ id: String, src: String, alt: String, altEn: String }],
}, { timestamps: true })

async function migrate() {
  console.log('🔄 Connecting to MongoDB Atlas...')

  await mongoose.connect(MONGODB_URI!)
  console.log('✅ Connected to MongoDB Atlas')

  const Menu = mongoose.model('Menu', MenuSchema)
  const Inventory = mongoose.model('Inventory', InventorySchema)
  const Promotions = mongoose.model('Promotions', PromotionsSchema)
  const Settings = mongoose.model('Settings', SettingsSchema)
  const Carousel = mongoose.model('Carousel', CarouselSchema)

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await Menu.deleteMany({})
  await Inventory.deleteMany({})
  await Promotions.deleteMany({})
  await Settings.deleteMany({})
  await Carousel.deleteMany({})

  // Import from JSON files
  console.log('📥 Importing data from JSON files...')

  const menuData = readJSON('menu.json')
  await Menu.create(menuData)
  console.log('   ✅ Menu imported')

  const inventoryData = readJSON('inventory.json')
  await Inventory.create(inventoryData)
  console.log('   ✅ Inventory imported')

  const promotionsData = readJSON('promotions.json')
  await Promotions.create(promotionsData)
  console.log('   ✅ Promotions imported')

  const settingsData = readJSON('settings.json')
  await Settings.create(settingsData)
  console.log('   ✅ Settings imported')

  const carouselData = readJSON('carousel.json')
  await Carousel.create(carouselData)
  console.log('   ✅ Carousel imported')

  console.log('')
  console.log('🎉 Migration complete!')
  console.log('   Your data is now in MongoDB Atlas.')
  console.log('   The app will automatically use MongoDB when MONGODB_URI is set.')

  await mongoose.disconnect()
  process.exit(0)
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
