import mongoose from 'mongoose'

const ministrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Ministry', ministrySchema)
