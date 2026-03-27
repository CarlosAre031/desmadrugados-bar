import mongoose, { Schema, Document } from 'mongoose'

export interface ICarouselImage {
  id: string
  src: string
  alt: string
  altEn: string
}

export interface ICarouselDocument extends Document {
  images: ICarouselImage[]
}

const CarouselImageSchema = new Schema<ICarouselImage>({
  id: { type: String, required: true },
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  altEn: { type: String, default: '' },
})

const CarouselSchema = new Schema<ICarouselDocument>({
  images: [CarouselImageSchema],
}, { timestamps: true })

export const Carousel = mongoose.models.Carousel || mongoose.model<ICarouselDocument>('Carousel', CarouselSchema)
