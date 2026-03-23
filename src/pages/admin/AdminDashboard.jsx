import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI, complaintAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/helpers'
import { AlertCircle, Clock, CheckCircle, XCircle, AlertTriangle, BarChart2, List, Zap, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchData = async () => {
    try {
      const c = await complaintAPI.all();
      setRecent(c.data.slice(0, 6));
    } catch (err) {
      console.error("Complaints error:", err);
    }

    try {
      const s = await adminAPI.analytics();
      setSummary(s.data);
    } catch (err) {
      console.error("Analytics error:", err);
    }

    setLoading(false);
  };

  fetchData();
}, []);

  const stats = summary ? [
    { label: 'Total',         value: summary.totalComplaints,   icon: AlertCircle,  color: '#4F46E5', bg: '#EEF2FF' },
    { label: 'Pending',       value: summary.pendingCount,      icon: Clock,        color: '#D97706', bg: '#FFFBEB' },
    { label: 'Under Process', value: summary.underProcessCount, icon: BarChart2,    color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Resolved',      value: summary.resolvedCount,     icon: CheckCircle,  color: '#059669', bg: '#ECFDF5' },
    { label: 'Rejected',      value: summary.rejectedCount,     icon: XCircle,      color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Fraud Flags',   value: summary.fraudCount,        icon: AlertTriangle,color: '#EA580C', bg: '#FFF7ED' },
  ] : []

  return (
    <Layout>
      <div className="page-header flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={13} className="text-primary" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {loading
          ? Array(6).fill(0).map((_,i) => <div key={i} className="skeleton h-28" />)
          : stats.map(({ label, value, icon: Icon, color, bg }, i) => (
            <div key={label} className="card text-center animate-fade-up" style={{animationDelay:`${i*50}ms`}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{background: bg}}>
                <Icon size={17} style={{color}} />
              </div>
              <p className="text-2xl stat-num text-slate-900">{value ?? 0}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
      </div>

      {/* Quick nav */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link to="/admin/complaints"
          className="card border-l-4 border-l-primary hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-glow-sm group-hover:scale-110 transition-transform">
              <List size={19} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Manage Complaints</p>
              <p className="text-sm text-slate-500">Update statuses and respond</p>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
        <Link to="/admin/analytics"
          className="card border-l-4 border-l-violet-400 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart2 size={19} className="text-violet-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Analytics</p>
              <p className="text-sm text-slate-500">Charts and complaint trends</p>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent table */}
      <div className="card overflow-x-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900">Recent Complaints</h2>
          <Link to="/admin/complaints" className="text-sm text-primary font-semibold hover:text-primary-hover flex items-center gap-1 transition-colors">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-12" />)}
          </div>
        ) : (
          <table className="data-table min-w-[580px]">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400">No complaints yet.</td></tr>
              ) : recent.map(c => (
                <tr key={c.id}>
                  <td className="text-slate-400 font-mono text-xs">#{c.id}</td>
                  <td className="font-medium text-slate-800">{c.userName || '—'}</td>
                  <td className="max-w-[180px] truncate text-slate-700">{c.title || <span className="italic text-slate-400">Untitled</span>}</td>
                  <td className="text-slate-600">{c.category || '—'}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="text-xs text-slate-400 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}
