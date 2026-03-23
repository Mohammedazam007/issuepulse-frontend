import StatusBadge from './StatusBadge'
import { formatDate, statusBorderColor, categoryColor } from '../../utils/helpers'
import { MapPin, Calendar, AlertTriangle, Tag, MessageSquare, ImageIcon } from 'lucide-react'

export default function ComplaintCard({ complaint: c, onClick, actionSlot }) {
  const borderCls = statusBorderColor(c.status)

  return (
    <div
      onClick={onClick}
      className={`card-bordered ${borderCls} flex flex-col group
        ${onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200' : ''}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 flex-1">
          {c.title || <span className="text-slate-400 italic font-normal">Untitled complaint</span>}
        </h3>
        <StatusBadge status={c.status} />
      </div>

      {/* Description */}
      {c.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {c.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {c.category && (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg border"
            style={{
              background: categoryColor(c.category) + '12',
              borderColor: categoryColor(c.category) + '30',
              color: categoryColor(c.category),
            }}>
            <Tag size={9} />
            {c.category}
          </span>
        )}
        {c.location && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
            <MapPin size={9} className="text-slate-400" />
            {c.location}
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-xs text-slate-400 ml-auto">
          <Calendar size={9} />
          {formatDate(c.createdAt)}
        </span>
      </div>

      {/* Fraud alert */}
      {c.flaggedAsFraud && (
        <div className="flex items-start gap-2 text-xs bg-orange-50 border border-orange-200 text-orange-700 rounded-xl px-3 py-2 mb-3">
          <AlertTriangle size={12} className="mt-0.5 flex-shrink-0 fraud-pulse" />
          <span className="font-medium">{c.fraudReason || 'Flagged as potential fraud'}</span>
        </div>
      )}

      {/* Issue image */}
      {c.imageUrl && (
        <div className="relative mb-3 overflow-hidden rounded-xl">
          <img src={c.imageUrl} alt="Issue"
            className="w-full h-36 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          <span className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-xs bg-black/40 rounded-lg px-2 py-0.5 backdrop-blur-sm">
            <ImageIcon size={9} /> Photo
          </span>
        </div>
      )}

      {/* Admin response */}
      {c.adminMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mt-auto">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare size={11} className="text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-700">Admin Response</p>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">{c.adminMessage}</p>
          <p style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>
                  {c.resolvedAt && new Date(c.resolvedAt).toLocaleString()} 
               </p>
          {c.resolutionImageUrl && (
            <img src={c.resolutionImageUrl} alt="Resolution"
              className="w-full h-24 object-cover rounded-lg mt-2 border border-emerald-200" />
          )}
        </div>
      )}

      {actionSlot && <div className="mt-3">{actionSlot}</div>}
    </div>
  )
}
