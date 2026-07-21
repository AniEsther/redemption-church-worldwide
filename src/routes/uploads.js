import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

// POST /api/uploads — admin only, multipart/form-data with field "file"
router.post('/', requireAdmin, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No file received.' })

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    res.status(201).json({ url })
  })
})

// POST /api/uploads/bulk — admin only, multipart/form-data with field "files"
// Used for uploading a whole photo album (e.g. an event's gallery photos) in one go.
router.post('/bulk', requireAdmin, (req, res) => {
  upload.array('files', 40)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files received.' })

    const urls = req.files.map((file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`)
    res.status(201).json({ urls })
  })
})

export default router
