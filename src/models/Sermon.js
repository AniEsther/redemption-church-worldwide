import mongoose from 'mongoose'

const sermonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    speaker: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    topic: { type: String, trim: true }, // e.g. "Faith", "Marriage", "Prayer" — used for filtering
    thumbnailUrl: { type: String, trim: true },
    videoUrl: { type: String, trim: true },
    audioUrl: { type: String, trim: true },
    downloadUrl: { type: String, trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Sermon', sermonSchema)
