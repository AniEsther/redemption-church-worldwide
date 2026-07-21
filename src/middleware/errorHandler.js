export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, _next) {
  console.error(err)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(', ') })
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'This email is already subscribed.' })
  }

  res.status(err.status || 500).json({ error: err.message || 'Something went wrong on our end.' })
}
