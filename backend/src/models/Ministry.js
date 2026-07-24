import mongoose from 'mongoose'

const ministrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }, // short blurb for cards
    details: { type: String, trim: true }, // longer "what we do" text for the summary page
    yearlyActivities: { type: String, trim: true }, // for the deeper "Learn More" page
    leaderName: { type: String, trim: true },
    meetingTime: { type: String, trim: true }, // e.g. "Saturdays, 4:00 PM"
    meetingLocation: { type: String, trim: true }, // e.g. "Children's Wing, Main Auditorium"
    contactPhone: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    howToJoin: { type: String, trim: true }, // requirements / next steps for someone interested
    galleryCategory: { type: String, trim: true }, // matches a Gallery category, pulls related photos onto the detail page
    imageUrl: { type: String, trim: true },
    order: { type: Number, default: 0 }, // lower numbers show first
  },
  { timestamps: true }
)

export default mongoose.model('Ministry', ministrySchema)
