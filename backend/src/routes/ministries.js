import { Router } from 'express'
import Ministry from '../models/Ministry.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/ministries — public
router.get('/', async (req, res, next) => {
  try {
    const ministries = await Ministry.find().sort({ order: 1, createdAt: 1 })
    res.json(ministries)
  } catch (err) {
    next(err)
  }
})

// GET /api/ministries/:id — public, single ministry (for the detail page)
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Ministry.findById(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Ministry not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// POST /api/ministries — admin only
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, description, details, yearlyActivities, leaderName, meetingTime, meetingLocation, contactPhone, contactEmail, howToJoin, galleryCategory, imageUrl, order } = req.body
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required.' })
    }
    const doc = await Ministry.create({ name, description, details, yearlyActivities, leaderName, meetingTime, meetingLocation, contactPhone, contactEmail, howToJoin, galleryCategory, imageUrl, order })
    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
})

// PUT /api/ministries/:id — admin only
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Ministry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return res.status(404).json({ error: 'Ministry not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/ministries/:id — admin only
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Ministry.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Ministry not found.' })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
