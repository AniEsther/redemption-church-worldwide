import { Router } from 'express'
import Branch from '../models/Branch.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/branches — public
router.get('/', async (req, res, next) => {
  try {
    const branches = await Branch.find().sort({ order: 1, createdAt: 1 })
    res.json(branches)
  } catch (err) {
    next(err)
  }
})

// POST /api/branches — admin only
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, location, pastorName, phone, email, imageUrl, mapEmbedUrl, order } = req.body
    if (!name || !location) {
      return res.status(400).json({ error: 'Branch name and location are required.' })
    }
    const doc = await Branch.create({ name, location, pastorName, phone, email, imageUrl, mapEmbedUrl, order })
    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
})

// PUT /api/branches/:id — admin only
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return res.status(404).json({ error: 'Branch not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/branches/:id — admin only
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Branch.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Branch not found.' })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
