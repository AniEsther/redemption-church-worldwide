import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'

import { connectDB } from './src/config/db.js'
import { notFound, errorHandler } from './src/middleware/errorHandler.js'

import authRoutes from './src/routes/auth.js'
import contactRoutes from './src/routes/contact.js'
import prayerRoutes from './src/routes/prayer.js'
import newsletterRoutes from './src/routes/newsletter.js'
import testimonyRoutes from './src/routes/testimonies.js'
import sermonRoutes from './src/routes/sermons.js'
import eventRoutes from './src/routes/events.js'
import ministryRoutes from './src/routes/ministries.js'
import galleryRoutes from './src/routes/gallery.js'
import uploadRoutes from './src/routes/uploads.js'
import leaderRoutes from './src/routes/leaders.js'
import settingsRoutes from './src/routes/settings.js'
import branchRoutes from './src/routes/branches.js'

await connectDB()

const app = express()

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10kb' }))
app.use('/uploads', express.static(path.resolve('uploads')))

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: allowedOrigins,
  })
)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/prayer-requests', prayerRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/testimonies', testimonyRoutes)
app.use('/api/sermons', sermonRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/ministries', ministryRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/leaders', leaderRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/branches', branchRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
