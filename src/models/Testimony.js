import mongoose from 'mongoose'

const testimonySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    text: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Testimony', testimonySchema)
