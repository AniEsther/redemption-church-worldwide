import { Router } from 'express'
import Sermon from '../models/Sermon.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/sermons — public
router.get('/', async (req, res, next) => {
  try {
    const sermons = await Sermon.find().sort({ date: -1 })
    res.json(sermons)
  } catch (err) {
    next(err)
  }
})

// POST /api/sermons — admin only
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { title, speaker, date, topic, thumbnailUrl, videoUrl, audioUrl, downloadUrl } = req.body
    if (!title || !speaker || !date) {
      return res.status(400).json({ error: 'Title, speaker, and date are required.' })
    }
    const doc = await Sermon.create({ title, speaker, date, topic, thumbnailUrl, videoUrl, audioUrl, downloadUrl })
    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
})

// PUT /api/sermons/:id — admin only
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Sermon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return res.status(404).json({ error: 'Sermon not found.' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/sermons/:id — admin only
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await Sermon.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Sermon not found.' })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
