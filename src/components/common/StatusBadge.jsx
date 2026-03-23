const CONFIG = {
  PENDING:       { label: 'Pending',     cls: 'badge-pending',  dot: 'bg-amber-500'   },
  UNDER_PROCESS: { label: 'In Progress', cls: 'badge-process',  dot: 'bg-blue-500'    },
  RESOLVED:      { label: 'Resolved',    cls: 'badge-resolved', dot: 'bg-emerald-500' },
  REJECTED:      { label: 'Rejected',    cls: 'badge-rejected', dot: 'bg-red-500'     },
}

export default function StatusBadge({ status }) {
  const c = CONFIG[status] || CONFIG.PENDING
  return (
    <span className={c.cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />
      {c.label}
    </span>
  )
}
