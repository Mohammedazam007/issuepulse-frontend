import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { complaintAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import { AlertCircle, Clock, CheckCircle2, XCircle, Plus, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import ComplaintCard from '../../components/common/ComplaintCard'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintAPI.myList().then(r => setComplaints(r.data)).finally(() => setLoading(false))
  }, [])

  const count = (s) => complaints.filter(c => c.status === s).length

  const stats = [
    { label: 'Total',    value: complaints.length, icon: AlertCircle,  color: '#4F46E5', bg: '#EEF2FF' },
    { label: 'Pending',  value: count('PENDING'),   icon: Clock,        color: '#D97706', bg: '#FFFBEB' },
    { label: 'Resolved', value: count('RESOLVED'),  icon: CheckCircle2, color: '#059669', bg: '#ECFDF5' },
    { label: 'Rejected', value: count('REJECTED'),  icon: XCircle,      color: '#DC2626', bg: '#FEF2F2' },
  ]

  return (
    <Layout>
      {/* Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Student Portal</span>
          </div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">Here's an overview of your campus complaints.</p>
        </div>
        <Link to="/raise-complaint" className="btn-primary hidden sm:inline-flex">
          <Plus size={15} /> Raise Complaint
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <div key={label} className="card animate-fade-up" style={{animationDelay:`${i*60}ms`}}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:bg}}>
                <Icon size={16} style={{color}} />
              </div>
            </div>
            <p className="text-3xl stat-num text-slate-900">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link to="/raise-complaint"
          className="card border-l-4 border-l-primary hover:shadow-card-hover hover:-translate-y-0.5
            transition-all duration-200 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-glow-sm group-hover:scale-110 transition-transform">
              <Plus size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Raise New Complaint</p>
              <p className="text-sm text-slate-500 mt-0.5">Report any campus issue instantly</p>
            </div>
            <ArrowRight size={17} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link to="/trending"
          className="card border-l-4 border-l-violet-400 hover:shadow-card-hover hover:-translate-y-0.5
            transition-all duration-200 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp size={22} className="text-violet-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Trending Issues</p>
              <p className="text-sm text-slate-500 mt-0.5">See what's hot on campus</p>
            </div>
            <ArrowRight size={17} className="text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent complaints */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
          <Link to="/my-complaints" className="text-sm text-primary font-semibold hover:text-primary-hover flex items-center gap-1 transition-colors">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-48" />)}
          </div>
        ) : complaints.slice(0,3).length === 0 ? (
          <div className="card text-center py-16 border-dashed border-2 border-slate-200">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={24} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-600">No complaints yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-4">Raise your first complaint to get started.</p>
            <Link to="/raise-complaint" className="btn-primary">
              <Plus size={14} /> Raise Complaint
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {complaints.slice(0,3).map(c => <ComplaintCard key={c.id} complaint={c} />)}
          </div>
        )}
      </div>
    </Layout>
  )
}
