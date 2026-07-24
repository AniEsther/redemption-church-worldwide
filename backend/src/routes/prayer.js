import { Router } from 'express'
import PrayerRequest from '../models/PrayerRequest.js'
import { requireAdmin } from '../middleware/auth.js'
import { formLimiter } from '../middleware/formLimiter.js'
import { sendNotification } from '../config/mailer.js'

const router = Router()

// POST /api/prayer-requests — public
router.post('/', formLimiter, async (req, res, next) => {
  try {
    const { name, email, category, request, confidential } = req.body
    if (!name || !email || !request) {
      return res.status(400).json({ error: 'Name, email, and prayer request are required.' })
    }

    const doc = await PrayerRequest.create({ name, email, category, request, confidential })

    sendNotification({
      subject: `New prayer request from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCategory: ${category || '-'}\nConfidential: ${confidential ? 'Yes' : 'No'}\n\nRequest:\n${request}\n\nView in dashboard: /admin/prayer-requests`,
    })

    res.status(201).json({ success: true, id: doc._id })
  } catch (err) {
    next(err)
  }
})

// GET /api/prayer-requests — admin only
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const requests = await PrayerRequest.find().sort({ createdAt: -1 })
    res.json(requests)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/prayer-requests/:id/prayed — admin only
router.patch('/:id/prayed', requireAdmin, async (req, res, next) => {
  try {
    const doc = await PrayerRequest.findByIdAndUpdate(req.params.id, { prayedFor: true }, { new: true })
    if (!doc) return res.status(404).json({ error: 'Request not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

export default router
