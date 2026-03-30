import { useEffect, useState } from 'react'
import { complaintAPI } from '../../services/api'
import Layout from '../../components/layout/Layout'
import ComplaintCard from '../../components/common/ComplaintCard'
import StatusBadge from '../../components/common/StatusBadge'
import { STATUSES, formatDate, categoryColor, statusBorderColor } from '../../utils/helpers'
import { Search, SlidersHorizontal, FileText, X, MapPin, Calendar, Tag, MessageSquare, ZoomIn, ExternalLink } from 'lucide-react'

// ── Image Lightbox ─────────────────────────────────────────────────────────────
function ImageLightbox({ url, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 animate-fade-in"
      onClick={onClose}>
      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
        <X size={18} />
      </button>
      <a href={url} target="_blank" rel="noreferrer"
        onClick={e => e.stopPropagation()}
        className="absolute top-4 right-16 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
        <ExternalLink size={16} />
      </a>
      <img src={url} alt="Full size"
        onClick={e => e.stopPropagation()}
        className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl shadow-2xl" />
    </div>
  )
}

// ── Complaint Detail Modal ─────────────────────────────────────────────────────
function ComplaintDetailModal({ complaint: c, onClose }) {
  const [lightboxUrl, setLightboxUrl] = useState(null)
  const borderCls = statusBorderColor(c.status)

  return (
    <>
      {lightboxUrl && <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-fade-in"
        onClick={onClose}>
        <div
          className={`bg-white rounded-2xl shadow-modal w-full max-w-lg animate-fade-up max-h-[90vh] overflow-y-auto border-t-4 ${borderCls}`}
          onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-0">
            <div>
              <p className="text-xs text-slate-400 font-mono mb-0.5">Complaint #{c.id}</p>
              <h2 className="font-bold text-slate-900 text-base leading-snug" style={{ fontFamily: 'Bricolage Grotesque,sans-serif' }}>
                {c.title || <span className="italic text-slate-400 font-normal">Untitled complaint</span>}
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              <StatusBadge status={c.status} />
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Meta */}
            <div className="flex flex-wrap gap-2">
              {c.category && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border"
                  style={{
                    background: categoryColor(c.category) + '12',
                    borderColor: categoryColor(c.category) + '30',
                    color: categoryColor(c.category),
                  }}>
                  <Tag size={10} /> {c.category}
                </span>
              )}
              {c.location && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  <MapPin size={10} className="text-slate-400" /> {c.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 px-2.5 py-1">
                <Calendar size={10} /> {formatDate(c.createdAt)}
              </span>
            </div>

            {/* Description */}
            {c.description && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed">{c.description}</p>
              </div>
            )}

            {/* Issue image — clickable */}
            {c.imageUrl && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Photo Evidence</p>
                <div className="relative group cursor-zoom-in rounded-xl overflow-hidden"
                  onClick={() => setLightboxUrl(c.imageUrl)}>
                  <img src={c.imageUrl} alt="Issue"
                    className="w-full h-52 object-cover transition-all group-hover:brightness-90" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <div className="bg-black/60 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-xs font-medium">
                      <ZoomIn size={13} /> Click to view full image
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin response */}
            {c.adminMessage ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageSquare size={13} className="text-emerald-600" />
                  <p className="text-xs font-semibold text-emerald-700">Admin Response</p>
                </div>
                <p className="text-sm text-emerald-800 leading-relaxed">{c.adminMessage}</p>
                {c.resolvedAt && (
                  <p className="text-xs text-emerald-500 mt-1.5">{new Date(c.resolvedAt).toLocaleString()}</p>
                )}
                {/* Resolution image — clickable */}
                {c.resolutionImageUrl && (
                  <div className="relative group cursor-zoom-in rounded-lg overflow-hidden mt-3"
                    onClick={() => setLightboxUrl(c.resolutionImageUrl)}>
                    <img src={c.resolutionImageUrl} alt="Resolution"
                      className="w-full h-36 object-cover border border-emerald-200 transition-all group-hover:brightness-90" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="bg-black/60 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-xs font-medium">
                        <ZoomIn size={13} /> Click to view full image
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-400">No admin response yet. Check back within 2 business days.</p>
              </div>
            )}
          </div>

          <div className="px-5 pb-5">
            <button onClick={onClose} className="btn-secondary w-full">Close</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('ALL')
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState(null)   // ← detail modal

  useEffect(() => {
    complaintAPI.myList().then(r => setComplaints(r.data)).finally(() => setLoading(false))
  }, [])

  const visible = complaints.filter(c => {
    const matchStatus = filter === 'ALL' || c.status === filter
    const matchSearch = !search ||
      (c.title    || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const STATUS_LABELS = {
    ALL: 'All', PENDING: 'Pending', UNDER_PROCESS: 'In Progress',
    RESOLVED: 'Resolved', REJECTED: 'Rejected'
  }

  return (
    <Layout>
      {selected && (
        <ComplaintDetailModal
          complaint={selected}
          onClose={() => setSelected(null)} />
      )}

      <div className="page-header">
        <h1 className="page-title">My Complaints</h1>
        <p className="page-subtitle">{complaints.length} total complaint{complaints.length !== 1 ? 's' : ''} submitted by you.</p>
      </div>

      {/* Search + Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search by title or location…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-10" />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <SlidersHorizontal size={13} className="text-slate-400" />
            {['ALL', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  filter === s
                    ? 'bg-primary text-white border-primary shadow-glow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-primary/40 hover:text-primary'}`}>
                {STATUS_LABELS[s] || s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && (
        <p className="text-xs text-slate-400 mb-4 font-medium">
          Showing {visible.length} of {complaints.length} complaints
        </p>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-48" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="card text-center py-20 border-dashed border-2 border-slate-200">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText size={24} className="text-slate-400" />
          </div>
          <p className="font-semibold text-slate-600">No complaints found</p>
          <p className="text-sm text-slate-400 mt-1">Try changing the filters or search term.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(c => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              onClick={() => setSelected(c)}   // ← this was missing!
            />
          ))}
        </div>
      )}
    </Layout>
  )
}