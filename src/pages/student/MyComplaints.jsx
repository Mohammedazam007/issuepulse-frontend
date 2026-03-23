import { useEffect, useState } from 'react'
import { complaintAPI } from '../../services/api'
import Layout from '../../components/layout/Layout'
import ComplaintCard from '../../components/common/ComplaintCard'
import { STATUSES, uniqueCategories } from '../../utils/helpers'
import { Search, SlidersHorizontal, FileText } from 'lucide-react'

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')
  const [search, setSearch]   = useState('')

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

  const STATUS_LABELS = { ALL:'All', PENDING:'Pending', UNDER_PROCESS:'In Progress', RESOLVED:'Resolved', REJECTED:'Rejected' }

  return (
    <Layout>
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
          {visible.map(c => <ComplaintCard key={c.id} complaint={c} />)}
        </div>
      )}
    </Layout>
  )
}
