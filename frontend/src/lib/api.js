const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'rcw_admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Lets AdminAuthContext react immediately when a request comes back 401
// (expired/invalid token) — without this, the token was cleared silently
// but the app kept believing the admin was still logged in until they
// manually refreshed the page.
let unauthorizedHandler = null
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.headers || {}) }
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    if (res.status === 401) {
      clearToken()
      unauthorizedHandler?.()
    }
    throw new Error(data.error || 'Something went wrong. Please try again.')
  }
  return data
}

const json = (body) => JSON.stringify(body)

// Nearly every component on the site (Navbar, Footer, Loader, FontLoader,
// and most page sections) independently asks for /settings on mount. Left
// alone, a single page load fires a dozen+ identical requests at once.
// This coalesces concurrent calls into one shared network request.
let inFlightSettingsRequest = null
function getSettingsDeduped() {
  if (!inFlightSettingsRequest) {
    inFlightSettingsRequest = request('/settings').finally(() => {
      inFlightSettingsRequest = null
    })
  }
  return inFlightSettingsRequest
}

export const api = {
  // --- auth ---
  login: (email, password) => request('/auth/login', { method: 'POST', body: json({ email, password }) }),

  // --- public forms ---
  submitContact: (payload) => request('/contact', { method: 'POST', body: json(payload) }),
  submitPrayerRequest: (payload) => request('/prayer-requests', { method: 'POST', body: json(payload) }),
  subscribeNewsletter: (email) => request('/newsletter', { method: 'POST', body: json({ email }) }),
  submitTestimony: (payload) => request('/testimonies', { method: 'POST', body: json(payload) }),

  // --- public reads ---
  getTestimonies: () => request('/testimonies'),
  getSermons: () => request('/sermons'),
  getEvents: () => request('/events'),
  getEvent: (id) => request(`/events/${id}`),
  registerForEvent: (id, payload) => request(`/events/${id}/register`, { method: 'POST', body: json(payload) }),
  getMinistries: () => request('/ministries'),
  getMinistry: (id) => request(`/ministries/${id}`),
  getGallery: () => request('/gallery'),
  getLeaders: () => request('/leaders'),
  getSettings: () => getSettingsDeduped(),
  getBranches: () => request('/branches'),

  // --- admin: messages ---
  getMessages: () => request('/contact'),
  markMessageRead: (id) => request(`/contact/${id}/read`, { method: 'PATCH' }),

  // --- admin: prayer requests ---
  getPrayerRequests: () => request('/prayer-requests'),
  markPrayed: (id) => request(`/prayer-requests/${id}/prayed`, { method: 'PATCH' }),

  // --- admin: subscribers ---
  getSubscribers: () => request('/newsletter'),

  // --- admin: testimonies ---
  getAllTestimonies: () => request('/testimonies/all'),
  approveTestimony: (id) => request(`/testimonies/${id}/approve`, { method: 'PATCH' }),
  deleteTestimony: (id) => request(`/testimonies/${id}`, { method: 'DELETE' }),

  // --- admin: sermons ---
  createSermon: (payload) => request('/sermons', { method: 'POST', body: json(payload) }),
  updateSermon: (id, payload) => request(`/sermons/${id}`, { method: 'PUT', body: json(payload) }),
  deleteSermon: (id) => request(`/sermons/${id}`, { method: 'DELETE' }),

  // --- admin: events ---
  createEvent: (payload) => request('/events', { method: 'POST', body: json(payload) }),
  updateEvent: (id, payload) => request(`/events/${id}`, { method: 'PUT', body: json(payload) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  getAllEventRegistrations: () => request('/events/registrations'),
  getEventRegistrations: (id) => request(`/events/${id}/registrations`),

  // --- admin: ministries ---
  createMinistry: (payload) => request('/ministries', { method: 'POST', body: json(payload) }),
  updateMinistry: (id, payload) => request(`/ministries/${id}`, { method: 'PUT', body: json(payload) }),
  deleteMinistry: (id) => request(`/ministries/${id}`, { method: 'DELETE' }),

  // --- admin: gallery ---
  createGalleryImage: (payload) => request('/gallery', { method: 'POST', body: json(payload) }),
  deleteGalleryImage: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  // --- admin: leaders / pastors ---
  createLeader: (payload) => request('/leaders', { method: 'POST', body: json(payload) }),
  updateLeader: (id, payload) => request(`/leaders/${id}`, { method: 'PUT', body: json(payload) }),
  deleteLeader: (id) => request(`/leaders/${id}`, { method: 'DELETE' }),

  // --- admin: site settings (About / Contact / Give) ---
  updateSettings: (payload) => request('/settings', { method: 'PUT', body: json(payload) }),

  // --- admin: branches ---
  createBranch: (payload) => request('/branches', { method: 'POST', body: json(payload) }),
  updateBranch: (id, payload) => request(`/branches/${id}`, { method: 'PUT', body: json(payload) }),
  deleteBranch: (id) => request(`/branches/${id}`, { method: 'DELETE' }),

  // --- admin: file upload (returns { url }) ---
  uploadFile: (file) => {
    const form = new FormData()
    form.append('file', file)
    return request('/uploads', { method: 'POST', body: form })
  },

  // --- admin: bulk file upload for a whole photo album (returns { urls: [...] }) ---
  uploadFiles: (files) => {
    const form = new FormData()
    Array.from(files).forEach((file) => form.append('files', file))
    return request('/uploads/bulk', { method: 'POST', body: form })
  },
}
