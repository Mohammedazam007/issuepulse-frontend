import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Plus, FileText, CheckCircle2, TrendingUp,
  Users, BarChart3, LogOut, Menu, X, Zap, Shield,UserCircle
} from 'lucide-react'
import { useState } from 'react'

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const studentLinks = [
  { to: '/dashboard',       label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/raise-complaint', label: 'Raise Complaint', icon: Plus           },
  { to: '/my-complaints',   label: 'My Complaints',   icon: FileText       },
  { to: '/resolved-issues', label: 'Resolved Issues', icon: CheckCircle2   },
  { to: '/trending',        label: 'Trending',        icon: TrendingUp     },
  { to: '/profile',         label: 'Profile',         icon: UserCircle     }, // ← add this
]

const adminLinks = [
  { to: '/admin/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/admin/complaints', label: 'Complaints',  icon: Users           },
  { to: '/admin/analytics',  label: 'Analytics',   icon: BarChart3       },
  { to: '/admin/profile',    label: 'Profile',     icon: UserCircle      }, // ← add this
]
  const links = isAdmin() ? adminLinks : studentLinks
  const isActive = (path) => location.pathname === path

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/7">
        <Link to={isAdmin() ? '/admin/dashboard' : '/dashboard'}
          className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-glow-sm flex-shrink-0">
            <Zap size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-none" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>IssuePulse</p>
            <p className="text-slate-500 text-xs mt-0.5 font-normal">Campus Management</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="section-title">{isAdmin() ? 'Admin Panel' : 'Student Portal'}</p>
        {links.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} onClick={() => setMobileOpen(false)}
            className={isActive(to) ? 'nav-link-active' : 'nav-link'}>
            <Icon size={16} className="flex-shrink-0" />
            <span>{label}</span>
            {isActive(to) && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/7">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
            <span className="text-xs font-bold text-white">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <span className={`text-xs ${isAdmin() ? 'text-violet-400' : 'text-primary'} font-medium`}>
              {user?.role}
            </span>
          </div>
          {isAdmin() && <Shield size={12} className="text-violet-400 flex-shrink-0" />}
        </div>
        <button onClick={handleLogout}
          className="w-full nav-link text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-1">
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-64 sidebar-gradient fixed inset-y-0 left-0 z-40 border-r border-white/7">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 sidebar-gradient border-b border-white/7 px-4 h-14 flex items-center justify-between">
        <Link to={isAdmin() ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>IssuePulse</span>
        </Link>
        <button onClick={() => setMobileOpen(o => !o)} className="text-white p-1">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 sidebar-gradient h-full shadow-modal">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Mobile spacer */}
      <div className="md:hidden h-14" />
    </>
  )
}
