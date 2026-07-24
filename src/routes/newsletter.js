import { Router } from 'express'
import Subscriber from '../models/Subscriber.js'
import { requireAdmin } from '../middleware/auth.js'
import { formLimiter } from '../middleware/formLimiter.js'

const router = Router()

// POST /api/newsletter — public
router.post('/', formLimiter, async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required.' })

    const existing = await Subscriber.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(200).json({ success: true, message: 'You are already subscribed.' })
    }

    await Subscriber.create({ email })
    res.status(201).json({ success: true })
  } catch (err) {
    next(err)
  }
})

// GET /api/newsletter — admin only
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 })
    res.json(subscribers)
  } catch (err) {
    next(err)
  }
})

export default router
