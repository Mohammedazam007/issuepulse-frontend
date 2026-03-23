import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      login({ userId: data.userId, name: data.name, email: data.email, role: data.role }, data.token)
      toast.success(`Welcome back, ${data.name}!`)
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex land-bg">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] p-12 border-r border-white/8 relative overflow-hidden"
        style={{background:'linear-gradient(160deg,#0A1022 0%,#0D1535 100%)'}}>
        <div className="orb-1 orb" style={{opacity:0.18}} />
        <div className="grid-pattern absolute inset-0 opacity-40" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-glow-sm">
              <Zap size={17} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>IssuePulse</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>
            Your campus voice,<br />
            <span style={{color:'#818CF8'}}>amplified.</span>
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
            Report issues, track resolutions, and keep your campus running smoothly.
          </p>
        </div>
        <div className="relative z-10 glass rounded-2xl p-5 max-w-sm">
          <p className="text-slate-300 text-sm italic leading-relaxed">
            "IssuePulse fixed our hostel water issue in 24 hours. The transparency is incredible."
          </p>
          <div className="flex items-center gap-2.5 mt-4">
            <div className="w-8 h-8 rounded-xl bg-primary/30 flex items-center justify-center text-xs font-bold text-primary border border-primary/30">R</div>
            <div>
              <p className="text-white text-xs font-semibold">Rahul S.</p>
              <p className="text-slate-500 text-xs">3rd Year, CSE</p>
            </div>
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

          <h1 className="text-2xl font-bold text-white mb-1" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>Sign in</h1>
          <p className="text-slate-500 text-sm mb-8">Enter your campus credentials below.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="password" type={showPass ? 'text' : 'password'} required placeholder="••••••••"
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
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Sign In <ArrowRight size={14} />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-indigo-400 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
