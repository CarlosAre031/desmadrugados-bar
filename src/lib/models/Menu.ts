import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory {
  id: string
  name: string
  nameEn: string
  icon: string
}

export interface IMenuItem {
  id: string
  name: string
  nameEn: string
  category: string
  price: number
  available: boolean
}

export interface IMenuDocument extends Document {
  categories: ICategory[]
  items: IMenuItem[]
}

const CategorySchema = new Schema<ICategory>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  icon: { type: String, required: true },
})

const MenuItemSchema = new Schema<IMenuItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
})

const MenuSchema = new Schema<IMenuDocument>({
  categories: [CategorySchema],
  items: [MenuItemSchema],
}, { timestamps: true })

export const Menu = mongoose.models.Menu || mongoose.model<IMenuDocument>('Menu', MenuSchema)
