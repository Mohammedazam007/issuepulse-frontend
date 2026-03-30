import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Zap, User, Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap, Shield, Hash, BookOpen } from 'lucide-react'

const DEPARTMENTS = [
  'CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'IT', 'AIDS', 'CSBS', 'Other'
]

export default function RegisterPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]         = useState({ name: '', email: '', password: '', role: 'STUDENT', rollNo: '', department: '' })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const { data } = await authAPI.register(form)
      login({ userId: data.userId, name: data.name, email: data.email, role: data.role }, data.token)
      toast.success('Account created! Welcome to IssuePulse 🎉')
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  const isStudent = form.role === 'STUDENT'

  return (
    <div className="min-h-screen flex land-bg">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center w-[44%] p-12 border-r border-white/8 relative overflow-hidden"
        style={{background:'linear-gradient(160deg,#0A1022 0%,#0D1535 100%)'}}>
        <div className="orb-2 orb" style={{opacity:0.18}} />
        <div className="grid-pattern absolute inset-0 opacity-40" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-glow-sm">
              <Zap size={17} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>IssuePulse</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>
            Join the campus<br />
            <span style={{color:'#34D399'}}>revolution.</span>
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-sm mb-10 text-sm">
            Over 2,000 students and staff are already using IssuePulse to keep Anurag University at its best.
          </p>
          <div className="space-y-3">
            {[
              { icon: GraduationCap, text: 'Students — report issues instantly',       color: '#818CF8' },
              { icon: Shield,        text: 'Admins — manage and resolve efficiently',  color: '#34D399' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <Icon size={15} style={{color}} />
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <div className="flex items-center gap-2.5 justify-center mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="text-white font-bold" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>IssuePulse</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>Create account</h1>
          <p className="text-slate-500 text-sm mb-7">Join IssuePulse and start making a difference.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Role toggle */}
          <div className="flex bg-white/6 rounded-xl p-1 mb-6 border border-white/10">
            {[
              { value: 'STUDENT', label: 'Student',       icon: GraduationCap },
              { value: 'ADMIN',   label: 'Administrator', icon: Shield        },
            ].map(({ value, label, icon: Icon }) => (
              <button key={value} type="button"
                onClick={() => setForm(f => ({ ...f, role: value, rollNo: '', department: '' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  form.role === value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'}`}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="name" type="text" required placeholder="Rahul Sharma"
                  value={form.name} onChange={handleChange}
                  className="w-full bg-white/6 border border-white/12 text-black placeholder-slate-600
                    rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2
                    focus:ring-primary/40 focus:border-primary/50 transition-all" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="email" type="email" required placeholder="you@anurag.edu.in"
                  value={form.email} onChange={handleChange}
                  className="w-full bg-white/6 border border-white/12 text-black placeholder-slate-600
                    rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2
                    focus:ring-primary/40 focus:border-primary/50 transition-all" />
              </div>
            </div>

            {/* Roll No + Department — only for students */}
            {isStudent && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Roll Number</label>
                  <div className="relative">
                    <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input name="rollNo" type="text" placeholder="e.g. 22CS045"
                      value={form.rollNo} onChange={handleChange}
                      className="w-full bg-white/6 border border-white/12 text-black placeholder-slate-600
                        rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2
                        focus:ring-primary/40 focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Department</label>
                  <div className="relative">
                    <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <select name="department" value={form.department} onChange={handleChange}
                      className="w-full bg-white/6 border border-white/12 text-black
                        rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2
                        focus:ring-primary/40 focus:border-primary/50 transition-all appearance-none cursor-pointer">
                      <option value="">Select department…</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="password" type={showPass ? 'text' : 'password'} required minLength={6}
                  placeholder="Min 6 characters"
                  value={form.password} onChange={handleChange}
                  className="w-full bg-white/6 border border-white/12 text-black placeholder-slate-600
                    rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2
                    focus:ring-primary/40 focus:border-primary/50 transition-all" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-glow-sm hover:shadow-glow disabled:opacity-50 active:scale-[0.97] mt-2">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Create Account <ArrowRight size={14} />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
