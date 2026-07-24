import { Router } from 'express'
import Testimony from '../models/Testimony.js'
import { requireAdmin } from '../middleware/auth.js'
import { formLimiter } from '../middleware/formLimiter.js'

const router = Router()

// GET /api/testimonies — public, only approved testimonies
router.get('/', async (req, res, next) => {
  try {
    const testimonies = await Testimony.find({ approved: true }).sort({ createdAt: -1 })
    res.json(testimonies)
  } catch (err) {
    next(err)
  }
})

// POST /api/testimonies — public, submit a testimony (goes in as unapproved)
router.post('/', formLimiter, async (req, res, next) => {
  try {
    const { name, email, text } = req.body
    if (!name || !text) {
      return res.status(400).json({ error: 'Name and testimony text are required.' })
    }

    const doc = await Testimony.create({ name, email, text })
    res.status(201).json({ success: true, id: doc._id, message: 'Thank you — your testimony will appear once reviewed.' })
  } catch (err) {
    next(err)
  }
})

// GET /api/testimonies/all — admin only, includes unapproved
router.get('/all', requireAdmin, async (req, res, next) => {
  try {
    const testimonies = await Testimony.find().sort({ createdAt: -1 })
    res.json(testimonies)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/testimonies/:id/approve — admin only
router.patch('/:id/approve', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Testimony.findByIdAndUpdate(req.params.id, { approved: true }, { new: true })
    if (!doc) return res.status(404).json({ error: 'Testimony not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/testimonies/:id — admin only
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Testimony.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Testimony not found.' })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
