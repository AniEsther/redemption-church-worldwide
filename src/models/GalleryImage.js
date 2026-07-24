import mongoose from 'mongoose'

const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
    category: { type: String, trim: true, default: 'General' },
  },
  { timestamps: true }
)

export default mongoose.model('GalleryImage', galleryImageSchema)
