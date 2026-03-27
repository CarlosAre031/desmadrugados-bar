import mongoose, { Schema, Document } from 'mongoose'

export interface IPromotion {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  badge: string
  badgeEn: string
  active: boolean
}

export interface IPromotionsDocument extends Document {
  items: IPromotion[]
}

const PromotionSchema = new Schema<IPromotion>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  titleEn: { type: String, required: true },
  description: { type: String, required: true },
  descriptionEn: { type: String, required: true },
  badge: { type: String, default: '' },
  badgeEn: { type: String, default: '' },
  active: { type: Boolean, default: true },
})

const PromotionsSchema = new Schema<IPromotionsDocument>({
  items: [PromotionSchema],
}, { timestamps: true })

export const Promotions = mongoose.models.Promotions || mongoose.model<IPromotionsDocument>('Promotions', PromotionsSchema)
