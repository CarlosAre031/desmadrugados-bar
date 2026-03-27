import mongoose, { Schema, Document } from 'mongoose'

export interface IInventoryItem {
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

export interface IInventoryDocument extends Document {
  items: IInventoryItem[]
}

const InventoryItemSchema = new Schema<IInventoryItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, default: '' },
  presentation: { type: String, default: '' },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  minStock: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  cost: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  image: { type: String, default: '' },
})

const InventorySchema = new Schema<IInventoryDocument>({
  items: [InventoryItemSchema],
}, { timestamps: true })

export const Inventory = mongoose.models.Inventory || mongoose.model<IInventoryDocument>('Inventory', InventorySchema)
