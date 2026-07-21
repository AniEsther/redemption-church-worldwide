import { Router } from 'express'
import GalleryImage from '../models/GalleryImage.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/gallery — public
router.get('/', async (req, res, next) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 })
    res.json(images)
  } catch (err) {
    next(err)
  }
})

// POST /api/gallery — admin only
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { imageUrl, caption, category } = req.body
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required.' })
    const doc = await GalleryImage.create({ imageUrl, caption, category })
    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
})

// PUT /api/gallery/:id — admin only
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return res.status(404).json({ error: 'Image not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/gallery/:id — admin only
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await GalleryImage.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Image not found.' })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
