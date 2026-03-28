import mongoose, { Schema, Document } from 'mongoose'

export interface IUploadDocument extends Document {
  filename: string
  contentType: string
  data: string // base64
  createdAt: Date
}

const UploadSchema = new Schema<IUploadDocument>({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: String, required: true },
}, { timestamps: true })

export const Upload = mongoose.models.Upload || mongoose.model<IUploadDocument>('Upload', UploadSchema)
