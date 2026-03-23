import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import Layout from '../../components/layout/Layout'
import { categoryColor } from '../../utils/helpers'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, RadialBarChart, RadialBar
} from 'recharts'
import { TrendingUp, CheckCircle, Clock, AlertTriangle, BarChart2 } from 'lucide-react'

const STATUS_COLORS = {
  PENDING:       '#F59E0B',
  UNDER_PROCESS: '#4F46E5',
  RESOLVED:      '#10B981',
  REJECTED:      '#EF4444',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-card text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label || payload[0]?.name}</p>
      <p className="text-primary font-bold">{payload[0]?.value} complaints</p>
    </div>
  )
}

export default function AdminAnalytics() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.analytics().then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Layout>
      <div className="space-y-4">
        <div className="skeleton h-10 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-28" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="skeleton h-72" />
          <div className="skeleton h-72" />
        </div>
      </div>
    </Layout>
  )

  if (!data) return (
    <Layout>
      <div className="card text-center py-16">
        <p className="text-red-500 font-semibold">Failed to load analytics.</p>
      </div>
    </Layout>
  )

  const statusData = [
    { name:'Pending',       value: data.pendingCount      || 0, color: STATUS_COLORS.PENDING       },
    { name:'Under Process', value: data.underProcessCount || 0, color: STATUS_COLORS.UNDER_PROCESS },
    { name:'Resolved',      value: data.resolvedCount     || 0, color: STATUS_COLORS.RESOLVED      },
    { name:'Rejected',      value: data.rejectedCount     || 0, color: STATUS_COLORS.REJECTED      },
  ]

  const categoryData = (data.categoryBreakdown || []).map(i => ({
    name:  i.label || 'Unknown',
    count: i.count,
    color: categoryColor(i.label),
  }))

  const locationData = (data.locationBreakdown || []).slice(0, 8).map(i => ({
    name:     (i.label || 'Unknown').length > 22 ? (i.label || '').slice(0, 20) + '…' : (i.label || 'Unknown'),
    fullName: i.label || 'Unknown',
    count:    i.count,
  }))

  const summaryCards = [
    { label:'Total Complaints', value: data.totalComplaints,   icon: BarChart2,    color:'#4F46E5', bg:'#EEF2FF' },
    { label:'Resolved',         value: data.resolvedCount,     icon: CheckCircle,  color:'#059669', bg:'#ECFDF5' },
    { label:'Pending',          value: data.pendingCount,      icon: Clock,        color:'#D97706', bg:'#FFFBEB' },
    { label:'Fraud Flags',      value: data.fraudCount,        icon: AlertTriangle,color:'#EA580C', bg:'#FFF7ED' },
  ]

  return (
    <Layout>
      <div className="page-header">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-primary-light flex items-center justify-center border border-primary/20">
            <TrendingUp size={19} className="text-primary" />
          </div>
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Campus complaint insights and trends.</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }, i) => (
          <div key={label} className="card animate-fade-up" style={{animationDelay:`${i*60}ms`}}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:bg}}>
                <Icon size={16} style={{color}} />
              </div>
            </div>
            <p className="text-3xl stat-num" style={{color}}>{value || 0}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Status pie */}
        <div className="card">
          <h2 className="font-bold text-slate-900 mb-5">Complaints by Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={95} innerRadius={45}
                paddingAngle={3}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}>
                {statusData.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category bar */}
        <div className="card">
          <h2 className="font-bold text-slate-900 mb-5">Complaints by Category</h2>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-60 text-slate-400 text-sm">
              No category data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData} margin={{ top:4, right:8, left:-16, bottom:4 }}>
                <XAxis dataKey="name" tick={{ fontSize:11, fill:'#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(79,70,229,0.05)' }} />
                <Bar dataKey="count" radius={[6,6,0,0]} maxBarSize={52}>
                  {categoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top locations */}
      <div className="card">
        <h2 className="font-bold text-slate-900 mb-5">Top Reported Locations</h2>
        {locationData.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
            No location data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(240, locationData.length * 44)}>
            <BarChart data={locationData} layout="vertical"
              margin={{ top:4, right:32, left:8, bottom:4 }}>
              <XAxis type="number" tick={{ fontSize:11, fill:'#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={148} tick={{ fontSize:11, fill:'#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(79,70,229,0.05)' }} />
              <Bar dataKey="count" radius={[0,6,6,0]} maxBarSize={28}>
                {locationData.map((_, i) => (
                  <Cell key={i} fill={`hsl(${240 + i * 15}, 75%, ${58 + i * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Layout>
  )
}
