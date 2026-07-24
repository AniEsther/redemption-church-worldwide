import { Router } from 'express'
import streamifier from 'streamifier'
import { requireAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import cloudinary, { cloudinaryEnabled } from '../config/cloudinary.js'

const router = Router()

function uploadBufferToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith('image') ? 'image' : 'auto'
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'redemption-church', resource_type: resourceType },
      (err, result) => {
        if (err) return reject(err)
        resolve(result.secure_url)
      }
    )
    streamifier.createReadStream(file.buffer).pipe(uploadStream)
  })
}

function localUrl(req, file) {
  return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
}

// POST /api/uploads — admin only, multipart/form-data with field "file"
router.post('/', requireAdmin, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No file received.' })

    try {
      const url = cloudinaryEnabled ? await uploadBufferToCloudinary(req.file) : localUrl(req, req.file)
      res.status(201).json({ url })
    } catch (uploadErr) {
      res.status(500).json({ error: uploadErr.message || 'Upload failed.' })
    }
  })
})

// POST /api/uploads/bulk — admin only, multipart/form-data with field "files"
// Used for uploading a whole photo album (e.g. an event's gallery photos) in one go.
router.post('/bulk', requireAdmin, (req, res) => {
  upload.array('files', 40)(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files received.' })

    try {
      const urls = cloudinaryEnabled
        ? await Promise.all(req.files.map(uploadBufferToCloudinary))
        : req.files.map((file) => localUrl(req, file))
      res.status(201).json({ urls })
    } catch (uploadErr) {
      res.status(500).json({ error: uploadErr.message || 'Upload failed.' })
    }
  })
})

export default router
