import mongoose from 'mongoose'

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Redemption Church - Lagos"
    location: { type: String, required: true, trim: true }, // full address / community
    pastorName: { type: String, trim: true }, // pastor in charge
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    mapEmbedUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Branch', branchSchema)
