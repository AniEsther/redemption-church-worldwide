import { Router } from 'express'
import Event from '../models/Event.js'
import EventRegistration from '../models/EventRegistration.js'
import { requireAdmin } from '../middleware/auth.js'
import { formLimiter } from '../middleware/formLimiter.js'

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

// GET /api/events/registrations — admin only, ALL registrations across events.
// Placed before "/:id" so it isn't swallowed by that param route.
router.get('/registrations', requireAdmin, async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find().sort({ createdAt: -1 })
    res.json(registrations)
  } catch (err) {
    next(err)
  }
})

// GET /api/events/:id — public, single event (used by the registration page)
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Event.findById(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Event not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// POST /api/events/:id/register — public, register for an event
router.post('/:id/register', formLimiter, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ error: 'Event not found.' })

    const { name, email, phone } = req.body
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' })
    }

    const doc = await EventRegistration.create({ event: event._id, eventTitle: event.title, name, email, phone })
    res.status(201).json({ success: true, id: doc._id })
  } catch (err) {
    next(err)
  }
})

// GET /api/events/:id/registrations — admin only, registrations for one event
router.get('/:id/registrations', requireAdmin, async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ event: req.params.id }).sort({ createdAt: -1 })
    res.json(registrations)
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

// DELETE /api/events/:id — admin only.
// Registrations are intentionally kept (not cascade-deleted) so past
// attendance records survive — EventRegistration stores the event title
// separately for exactly this reason.
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
