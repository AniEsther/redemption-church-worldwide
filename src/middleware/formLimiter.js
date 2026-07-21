import rateLimit from 'express-rate-limit'

// Prevents spam/abuse of public form endpoints (contact, prayer, newsletter, testimonies)
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions from this device. Please try again later.' },
})
