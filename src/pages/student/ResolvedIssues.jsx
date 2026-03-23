import { useEffect, useState } from 'react'
import { complaintAPI } from '../../services/api'
import Layout from '../../components/layout/Layout'
import ComplaintCard from '../../components/common/ComplaintCard'
import { uniqueCategories } from '../../utils/helpers'
import { CheckCircle2, Search } from 'lucide-react'

export default function ResolvedIssues() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('ALL')
  const [search, setSearch]         = useState('')

  useEffect(() => {
    complaintAPI.resolved().then(r => setComplaints(r.data)).finally(() => setLoading(false))
  }, [])

  // Build category list dynamically from actual data — no hardcoded CATEGORIES
  const categories = uniqueCategories(complaints)

  const visible = complaints.filter(c => {
    const matchCat    = filter === 'ALL' || c.category === filter
    const matchSearch = !search ||
      (c.title    || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <Layout>
      <div className="page-header">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 size={19} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="page-title">Resolved Issues</h1>
            <p className="page-subtitle">
              {complaints.length} campus issue{complaints.length !== 1 ? 's' : ''} successfully resolved.
            </p>
          </div>
        </div>
      </div>

      {/* Search + category filter */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search resolved issues…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-10" />
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {['ALL', ...categories].map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                    filter === cat
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-400 hover:text-emerald-600'}`}>
                  {cat === 'ALL' ? 'All' : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-48" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="card text-center py-20 border-dashed border-2 border-slate-200">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={24} className="text-slate-400" />
          </div>
          <p className="font-semibold text-slate-600">No resolved issues here yet</p>
          <p className="text-sm text-slate-400 mt-1">
            {filter !== 'ALL' ? 'Try selecting a different category.' : 'Check back soon.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(c => <ComplaintCard key={c.id} complaint={c} />)}
        </div>
      )}
    </Layout>
  )
}
