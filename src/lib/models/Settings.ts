import mongoose, { Schema, Document } from 'mongoose'

export interface IHours {
  day: string
  dayEn: string
  time: string
}

export interface ISpecialNight {
  name: string
  nameEn: string
  desc: string
  descEn: string
}

export interface ISettingsDocument extends Document {
  whatsapp: string
  instagram: string
  facebook: string
  address: string
  addressEn: string
  hours: IHours[]
  specialNights: ISpecialNight[]
  mapEmbedUrl: string
}

const HoursSchema = new Schema<IHours>({
  day: { type: String, required: true },
  dayEn: { type: String, required: true },
  time: { type: String, required: true },
})

const SpecialNightSchema = new Schema<ISpecialNight>({
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  desc: { type: String, required: true },
  descEn: { type: String, required: true },
})

const SettingsSchema = new Schema<ISettingsDocument>({
  whatsapp: { type: String, default: '' },
  instagram: { type: String, default: '' },
  facebook: { type: String, default: '' },
  address: { type: String, default: '' },
  addressEn: { type: String, default: '' },
  hours: [HoursSchema],
  specialNights: [SpecialNightSchema],
  mapEmbedUrl: { type: String, default: '' },
}, { timestamps: true })

export const Settings = mongoose.models.Settings || mongoose.model<ISettingsDocument>('Settings', SettingsSchema)
