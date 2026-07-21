import mongoose from 'mongoose'

const prayerRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    category: {
      type: String,
      enum: ['Healing', 'Family', 'Finances', 'Guidance', 'Other'],
      default: 'Other',
    },
    request: { type: String, required: true, trim: true },
    confidential: { type: Boolean, default: false },
    prayedFor: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('PrayerRequest', prayerRequestSchema)
