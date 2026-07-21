import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    // Optional override for display, e.g. "Sept 14–20" for multi-day events —
    // avoids trying to force a date range into the small day/month badge.
    dateLabel: { type: String, trim: true },
    time: { type: String, trim: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Event', eventSchema)
