import { useEffect, useState } from 'react'
import { complaintAPI } from '../../services/api'
import Layout from '../../components/layout/Layout'
import { categoryColor } from '../../utils/helpers'
import { TrendingUp, Flame, Trophy, BarChart2 } from 'lucide-react'

const RANK_ICONS = [Trophy, Flame, TrendingUp]

export default function TrendingIssues() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintAPI.trending().then(r => setItems(r.data)).finally(() => setLoading(false))
  }, [])

  const max = items[0]?.count || 1

  return (
    <Layout>
      <div className="page-header">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{background:'#FFF7ED', border:'1px solid #FED7AA'}}>
            <TrendingUp size={19} className="text-orange-500" />
          </div>
          <div>
            <h1 className="page-title">Trending Issues</h1>
            <p className="page-subtitle">Most reported campus problems right now.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 max-w-2xl">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-24 max-w-2xl border-dashed border-2 border-slate-200">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BarChart2 size={26} className="text-slate-400" />
          </div>
          <p className="font-semibold text-slate-600">No trending data yet</p>
          <p className="text-sm text-slate-400 mt-1">Complaints will appear here once submitted.</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-3">
          {items.map((item, idx) => {
            const color   = categoryColor(item.label)
            const pct     = Math.round((item.count / max) * 100)
            const RankIcon = RANK_ICONS[idx] || null
            const isTop   = idx === 0

            return (
              <div key={item.label || idx}
                className={`card animate-fade-up hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300
                  ${isTop ? 'border-l-4' : ''}`}
                style={isTop ? {borderLeftColor: color} : {}}
                style={{animationDelay:`${idx * 70}ms`}}>

                <div className="flex items-center gap-4 mb-3">
                  {/* Rank badge */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 border"
                    style={{
                      background: color + '18',
                      borderColor: color + '35',
                      color,
                    }}>
                    {RankIcon ? <RankIcon size={15} /> : <span>{idx + 1}</span>}
                  </div>

                  {/* Label + count */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate">{item.label || 'Uncategorized'}</span>
                      {isTop && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                          style={{background: color+'15', borderColor: color+'30', color}}>
                          #1 Trending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.count} complaint{item.count !== 1 ? 's' : ''} reported
                    </p>
                  </div>

                  {/* Count bubble */}
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 stat-num"
                    style={{background: color + '15', color}}>
                    {item.count}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full progress-fill"
                    style={{width:`${pct}%`, background:`linear-gradient(90deg, ${color}, ${color}99)`}} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-slate-400">0</span>
                  <span className="text-xs font-semibold" style={{color}}>{pct}% of peak</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
