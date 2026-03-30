import { useEffect, useState } from 'react'
import { complaintAPI, adminAPI } from '../../services/api'
import Layout from '../../components/layout/Layout'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate, STATUSES, uniqueCategories } from '../../utils/helpers'
import { X, AlertTriangle, Upload, Send, Search, Filter, ZoomIn, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Image Lightbox ────────────────────────────────────────────────────────────
function ImageLightbox({ url, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 animate-fade-in"
      onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
        <X size={18} />
      </button>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={e => e.stopPropagation()}
        className="absolute top-4 right-16 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
        <ExternalLink size={16} />
      </a>
      <img
        src={url}
        alt="Full size"
        onClick={e => e.stopPropagation()}
        className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl shadow-2xl"
      />
    </div>
  )
}

// ── Resolution Modal ──────────────────────────────────────────────────────────
function ResolutionModal({ complaint, onClose, onDone }) {
  const [status,       setStatus]  = useState(complaint.status)
  const [message,      setMessage] = useState(complaint.adminMessage || '')
  const [image,        setImage]   = useState(null)
  const [saving,       setSaving]  = useState(false)
  const [lightboxUrl,  setLightboxUrl] = useState(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminAPI.updateStatus(complaint.id, { status })
      if (message || image) {
        const fd = new FormData()
        fd.append('complaintId', complaint.id)
        if (message) fd.append('message', message)
        if (image)   fd.append('image', image)
        await adminAPI.uploadResolution(fd)
      }
      toast.success('Complaint updated!')
      onDone()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed.')
    } finally { setSaving(false) }
  }

  const STATUS_OPTIONS = [
    { value: 'PENDING',       label: 'Pending',       color: '#D97706' },
    { value: 'UNDER_PROCESS', label: 'Under Process',  color: '#2563EB' },
    { value: 'RESOLVED',      label: 'Resolved',       color: '#059669' },
    { value: 'REJECTED',      label: 'Rejected',       color: '#DC2626' },
  ]

  return (
    <>
      {lightboxUrl && <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg p-6 animate-fade-up max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Bricolage Grotesque,sans-serif' }}>
                Complaint #{complaint.id}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage status and send response</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Info card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="font-semibold text-slate-800 text-sm mb-1">
                {complaint.title || <span className="italic text-slate-400">Untitled</span>}
              </p>
              {complaint.description && (
                <p className="text-slate-500 text-xs leading-relaxed mb-2">{complaint.description}</p>
              )}
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {complaint.category && <span className="bg-white border border-slate-200 rounded-lg px-2 py-0.5">{complaint.category}</span>}
                {complaint.location && <span className="bg-white border border-slate-200 rounded-lg px-2 py-0.5">{complaint.location}</span>}
              </div>
            </div>

            {/* Issue photo — clickable */}
            {complaint.imageUrl && (
              <div className="relative group cursor-zoom-in" onClick={() => setLightboxUrl(complaint.imageUrl)}>
                <img
                  src={complaint.imageUrl}
                  alt="Issue"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200 transition-all group-hover:brightness-90"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <div className="bg-black/60 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-xs font-medium">
                    <ZoomIn size={13} /> Click to view full image
                  </div>
                </div>
              </div>
            )}

            {/* Fraud warning */}
            {complaint.flaggedAsFraud && (
              <div className="flex items-center gap-2.5 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl p-3.5 text-sm">
                <AlertTriangle size={15} className="flex-shrink-0" />
                <div>
                  <span className="font-semibold">Fraud Flag: </span>
                  {complaint.fraudReason}
                </div>
              </div>
            )}

            {/* Status selector */}
            <div>
              <label className="input-label">Update Status</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`text-sm py-2.5 px-3 rounded-xl border font-semibold transition-all text-left flex items-center gap-2 ${
                      status === opt.value ? 'text-white shadow-sm' : 'bg-white text-slate-600 hover:border-slate-300'}`}
                    style={status === opt.value ? { background: opt.color, borderColor: opt.color } : {}}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: status === opt.value ? 'rgba(255,255,255,0.6)' : opt.color }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin message */}
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Send size={10} /> Admin Message
                <span className="text-slate-400 normal-case tracking-normal font-normal">(visible to student)</span>
              </label>
              <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Write a resolution or update message…"
                className="input-field resize-none" />
            </div>

            {/* Resolution image */}
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Upload size={10} /> Resolution Image
                <span className="text-slate-400 normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
                className="block w-full text-sm text-slate-500
                  file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border file:border-slate-200
                  file:text-sm file:font-semibold file:bg-white file:text-slate-700
                  hover:file:bg-slate-50 file:transition-all cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading]       = useState(true)
  const [selected, setSelected]     = useState(null)
  const [filterStatus,   setFS]     = useState('ALL')
  const [filterCategory, setFC]     = useState('ALL')
  const [search, setSearch]         = useState('')
  const [showFraud, setShowFraud]   = useState(false)

  const load = () => {
    setLoading(true)
    complaintAPI.all().then(r => setComplaints(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const categories = uniqueCategories(complaints)

  const visible = complaints.filter(c => {
    if (showFraud && !c.flaggedAsFraud)                            return false
    if (filterStatus   !== 'ALL' && c.status   !== filterStatus)   return false
    if (filterCategory !== 'ALL' && c.category !== filterCategory)  return false
    if (search) {
      const q = search.toLowerCase()
      if (!(c.title    || '').toLowerCase().includes(q) &&
          !(c.userName || '').toLowerCase().includes(q)) return false
    }
    return true
  })

  const STATUS_LABELS = { PENDING: 'Pending', UNDER_PROCESS: 'In Progress', RESOLVED: 'Resolved', REJECTED: 'Rejected' }

  return (
    <Layout>
      {selected && (
        <ResolutionModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onDone={() => { setSelected(null); load() }} />
      )}

      <div className="page-header">
        <h1 className="page-title">Complaint Management</h1>
        <p className="page-subtitle">{complaints.length} total complaint{complaints.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search title or student…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 w-52" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={13} className="text-slate-400" />
            {['ALL', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFS(s)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  filterStatus === s
                    ? 'bg-primary text-white border-primary shadow-glow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-primary/40 hover:text-primary'}`}>
                {s === 'ALL' ? 'All' : STATUS_LABELS[s] || s}
              </button>
            ))}
          </div>

          {categories.length > 0 && (
            <select value={filterCategory} onChange={e => setFC(e.target.value)}
              className="input-field w-auto text-xs py-2">
              <option value="ALL">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          <button onClick={() => setShowFraud(f => !f)}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-semibold transition-all ml-auto ${
              showFraud
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-orange-400 hover:text-orange-500'}`}>
            <AlertTriangle size={13} /> Fraud Only
          </button>
        </div>
      </div>

      {!loading && (
        <p className="text-xs text-slate-400 mb-4 font-medium">
          Showing {visible.length} of {complaints.length} complaints
        </p>
      )}

      {/* Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-14" />)}
          </div>
        ) : (
          <table className="data-table min-w-[720px]">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No complaints match the current filters.
                  </td>
                </tr>
              ) : visible.map(c => (
                <tr key={c.id} className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setSelected(c)}>
                  <td className="text-slate-400 font-mono text-xs">#{c.id}</td>
                  <td>
                    <p className="font-medium text-slate-800">{c.userName || '—'}</p>
                    <p className="text-xs text-slate-400">{c.userEmail}</p>
                  </td>
                  <td className="max-w-[160px]">
                    <div className="flex items-start gap-1.5">
                      {c.flaggedAsFraud && (
                        <AlertTriangle size={12} className="text-orange-500 mt-0.5 flex-shrink-0 fraud-pulse" />
                      )}
                      <span className="line-clamp-2 text-slate-700">
                        {c.title || <span className="italic text-slate-400">Untitled</span>}
                      </span>
                    </div>
                  </td>
                  <td className="text-slate-600">{c.category || '—'}</td>
                  <td className="text-xs text-slate-500">{c.location || '—'}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="text-xs text-slate-400 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                  <td>
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(c) }}
                      className="btn-primary py-1.5 px-3 text-xs">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}