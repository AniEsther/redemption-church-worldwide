import { Router } from 'express'
import ContactMessage from '../models/ContactMessage.js'
import { requireAdmin } from '../middleware/auth.js'
import { formLimiter } from '../middleware/formLimiter.js'

const router = Router()

// POST /api/contact — public, submit the contact form
router.post('/', formLimiter, async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' })
    }

    const doc = await ContactMessage.create({ name, email, phone, message })
    res.status(201).json({ success: true, id: doc._id })
  } catch (err) {
    next(err)
  }
})

// GET /api/contact — admin only, list messages
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/contact/:id/read — admin only, mark as read
router.patch('/:id/read', requireAdmin, async (req, res, next) => {
  try {
    const doc = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    if (!doc) return res.status(404).json({ error: 'Message not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

export default router
