import { Router } from 'express'
import SiteSettings from '../models/SiteSettings.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/settings — public
router.get('/', async (req, res, next) => {
  try {
    const settings = await SiteSettings.getSingleton()
    res.json(settings)
  } catch (err) {
    next(err)
  }
})

// PUT /api/settings — admin only
router.put('/', requireAdmin, async (req, res, next) => {
  try {
    const settings = await SiteSettings.getSingleton()
    Object.assign(settings, req.body)
    await settings.save()
    res.json(settings)
  } catch (err) {
    next(err)
  }
})

export default router
