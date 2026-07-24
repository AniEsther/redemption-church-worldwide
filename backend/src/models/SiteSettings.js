import mongoose from 'mongoose'

const serviceItemSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    time: { type: String, trim: true },
  },
  { _id: false }
)

const serviceBlockSchema = new mongoose.Schema(
  {
    day: { type: String, trim: true },
    items: [serviceItemSchema],
  },
  { _id: false }
)

const bankAccountSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true }, // e.g. "Tithes & Offerings", "Building Fund"
    bankName: { type: String, trim: true },
    accountName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
  },
  { _id: false }
)

const specialProgrammeSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true }, // e.g. "Redemption Night"
    weekOfMonth: {
      type: String,
      enum: ['First', 'Second', 'Third', 'Fourth', 'Last'],
      default: 'Last',
    },
    dayOfWeek: {
      type: String,
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      default: 'Friday',
    },
    time: { type: String, trim: true }, // e.g. "9:00 PM"
    description: { type: String, trim: true },
  },
  { _id: false }
)

const siteSettingsSchema = new mongoose.Schema(
  {
    // Identity
    churchName: { type: String, trim: true },
    slogan: { type: String, trim: true },

    // Home / About
    aboutHeading: { type: String, trim: true }, // e.g. "A Christ-Centered Family of Faith"
    aboutText: { type: String, trim: true },
    visionText: { type: String, trim: true },
    missionText: { type: String, trim: true },
    valuesText: { type: String, trim: true },

    // Theme of the year
    themeYear: { type: String, trim: true },
    themeTitle: { type: String, trim: true },
    themeDescription: { type: String, trim: true },

    // Theme of the month
    themeMonthLabel: { type: String, trim: true }, // e.g. "August 2026"
    themeMonthTitle: { type: String, trim: true },
    themeMonthDescription: { type: String, trim: true },

    // Branding
    logoUrl: { type: String, trim: true },

    // Service times
    serviceTimes: [serviceBlockSchema],
    specialProgrammes: [specialProgrammeSchema],

    // Contact
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    mapEmbedUrl: { type: String, trim: true },

    // Give / bank details — supports multiple accounts
    bankAccounts: [bankAccountSchema],

    // Social links
    facebookUrl: { type: String, trim: true },
    instagramUrl: { type: String, trim: true },
    youtubeUrl: { type: String, trim: true },
    twitterUrl: { type: String, trim: true },
    whatsappNumber: { type: String, trim: true },

    // Typography — kept to a small curated list (see frontend/src/data/fonts.js)
    fontHeading: { type: String, trim: true, default: 'Playfair Display' },
    fontBody: { type: String, trim: true, default: 'Inter' },
  },
  { timestamps: true }
)

// There is only ever one settings document — fetch or lazily create it.
siteSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne()
  if (!doc) doc = await this.create({})
  return doc
}

export default mongoose.model('SiteSettings', siteSettingsSchema)
