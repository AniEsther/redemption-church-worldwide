import { Router } from 'express'
import Event from '../models/Event.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/events — public, upcoming events first
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 })
    res.json(events)
  } catch (err) {
    next(err)
  }
})

// POST /api/events — admin only
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { title, date, dateLabel, time, location, description } = req.body
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required.' })
    }
    const doc = await Event.create({ title, date, dateLabel, time, location, description })
    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
})

// PUT /api/events/:id — admin only
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return res.status(404).json({ error: 'Event not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/events/:id — admin only
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Event.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Event not found.' })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
