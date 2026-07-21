import mongoose from 'mongoose'

const leaderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    portraitUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Leader', leaderSchema)
