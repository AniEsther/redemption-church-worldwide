import { Router } from 'express'
import Leader from '../models/Leader.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/leaders — public
router.get('/', async (req, res, next) => {
  try {
    const leaders = await Leader.find().sort({ order: 1, createdAt: 1 })
    res.json(leaders)
  } catch (err) {
    next(err)
  }
})

// POST /api/leaders — admin only
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, role, bio, portraitUrl, order } = req.body
    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required.' })
    }
    const doc = await Leader.create({ name, role, bio, portraitUrl, order })
    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
})

// PUT /api/leaders/:id — admin only
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Leader.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return res.status(404).json({ error: 'Leader not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/leaders/:id — admin only
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Leader.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Leader not found.' })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
