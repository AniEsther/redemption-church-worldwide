import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({ token, admin: { email: admin.email, name: admin.name } })
  } catch (err) {
    next(err)
  }
})

export default router
