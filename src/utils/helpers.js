export const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const statusLabel = (status) => {
  const map = {
    PENDING:       'Pending',
    UNDER_PROCESS: 'In Progress',
    RESOLVED:      'Resolved',
    REJECTED:      'Rejected',
  }
  return map[status] || status
}

export const STATUSES = ['PENDING', 'UNDER_PROCESS', 'RESOLVED', 'REJECTED']

// Status → left-border color class for complaint cards
export const statusBorderColor = (status) => {
  const map = {
    PENDING:       'border-l-amber-400',
    UNDER_PROCESS: 'border-l-blue-400',
    RESOLVED:      'border-l-emerald-400',
    REJECTED:      'border-l-red-400',
  }
  return map[status] || 'border-l-slate-300'
}

// Status → badge CSS class
export const statusBadge = (status) => {
  const map = {
    PENDING:       'badge-pending',
    UNDER_PROCESS: 'badge-process',
    RESOLVED:      'badge-resolved',
    REJECTED:      'badge-rejected',
  }
  return map[status] || 'badge-pending'
}

// Extract unique non-null categories from a list of complaints
export const uniqueCategories = (complaints) =>
  [...new Set(complaints.map(c => c.category).filter(Boolean))]

// Generate a stable color for any free-text category label
const PALETTE = [
  '#4F46E5','#0EA5E9','#10B981','#F59E0B',
  '#EF4444','#8B5CF6','#F97316','#06B6D4',
  '#EC4899','#14B8A6',
]
export const categoryColor = (label) => {
  if (!label) return '#94A3B8'
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}
