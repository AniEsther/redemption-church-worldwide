import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { cloudinaryEnabled } from '../config/cloudinary.js'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'application/pdf',
]

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true)
  cb(new Error('Unsupported file type.'))
}

// When Cloudinary is configured, multer just holds the file in memory —
// the route handler streams it up to Cloudinary from there. Otherwise,
// fall back to writing straight to local disk (fine for local dev only).
let storage
if (cloudinaryEnabled) {
  storage = multer.memoryStorage()
} else {
  const uploadDir = path.resolve('uploads')
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
      cb(null, safeName)
    },
  })
}

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter,
})
