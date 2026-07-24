import mongoose from 'mongoose'

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String, trim: true }, // denormalized so it still reads fine if the event is later deleted
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('EventRegistration', eventRegistrationSchema)
