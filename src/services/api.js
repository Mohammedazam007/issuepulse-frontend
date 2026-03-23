import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// Attach JWT token to every request automatically
API.interceptors.request.use(config => {
  const token = localStorage.getItem('ip_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ip_token')
      localStorage.removeItem('ip_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)  => API.post('/auth/register', data),
  login:    (data)  => API.post('/auth/login',    data),
}

// ── Complaints ────────────────────────────────────────────────────────────────
export const complaintAPI = {
  create:     (formData) => API.post('/complaints/create', formData),
  myList:     ()         => API.get('/complaints/my'),
  resolved:   ()         => API.get('/complaints/resolved'),
  trending:   ()         => API.get('/complaints/trending'),
  all:        ()         => API.get('/complaints/all'),
  getById:    (id)       => API.get(`/complaints/${id}`),
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  updateStatus:     (id, data)     => API.put(`/admin/update-status/${id}`, data),
  uploadResolution: (formData)     => API.post('/admin/upload-resolution', formData),
  respond:          (data)         => API.post('/admin/respond', data),
  analytics:        ()             => API.get('/admin/analytics'),
}

export default API
