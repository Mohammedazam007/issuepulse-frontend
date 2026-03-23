import { Link } from 'react-router-dom'
import { AlertCircle, TrendingUp, CheckCircle2, Shield, ArrowRight, Zap, Star, ChevronRight } from 'lucide-react'

const features = [
  { icon: AlertCircle,  title: 'Report Instantly',  desc: 'Submit campus issues with photos in seconds.',        color: '#4F46E5', bg: '#EEF2FF' },
  { icon: TrendingUp,   title: 'Live Tracking',      desc: 'Watch your complaint move from pending to resolved.', color: '#0EA5E9', bg: '#F0F9FF' },
  { icon: CheckCircle2, title: 'Fast Resolution',    desc: 'Admins respond with evidence and updates.',           color: '#10B981', bg: '#ECFDF5' },
  { icon: Shield,       title: 'Fraud Protection',   desc: 'Smart detection filters spam automatically.',         color: '#F97316', bg: '#FFF7ED' },
]

const stats = [
  { value: '500+',   label: 'Issues Resolved'     },
  { value: '2,000+', label: 'Students Served'      },
  { value: '< 48h',  label: 'Avg Resolution Time'  },
  { value: '98%',    label: 'Satisfaction Rate'     },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen land-bg text-white overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden grid-pattern">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-glow-sm">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-white text-[15px]" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>IssuePulse</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/register"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-glow-sm hover:shadow-glow active:scale-[0.97]">
              Get Started <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-28 pb-20">
        <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 text-xs font-semibold text-primary px-3 py-1.5 rounded-full mb-8 animate-fade-in">
          <Star size={10} className="text-amber-400" fill="currentColor" />
          Anurag University's Official Campus Platform
        </div>

        <h1 className="text-[52px] sm:text-[64px] lg:text-[76px] font-extrabold leading-[1.03] tracking-tight mb-6 animate-fade-up"
          style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>
          Campus Issues,
          <br />
          <span style={{background:'linear-gradient(135deg,#818CF8,#4F46E5,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
            Resolved Faster.
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{animationDelay:'0.1s'}}>
          IssuePulse connects students and administrators to tackle infrastructure
          problems — WiFi, water, electricity, cleanliness and more.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-20 animate-fade-up" style={{animationDelay:'0.2s'}}>
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all shadow-glow hover:shadow-glow active:scale-[0.97]">
            Start Reporting <ArrowRight size={16} />
          </Link>
          <Link to="/trending"
            className="inline-flex items-center gap-2 border border-white/15 bg-white/6 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-white/10 hover:border-white/25 transition-all">
            <TrendingUp size={16} /> See Trending Issues
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-up" style={{animationDelay:'0.3s'}}>
          {stats.map((s, i) => (
            <div key={s.label} className="glass rounded-2xl p-5 hover:bg-white/10 transition-all duration-300"
              style={{animationDelay:`${i*60}ms`}}>
              <p className="text-3xl font-extrabold text-white stat-num">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>Everything you need</h2>
          <p className="text-slate-400">A complete platform for campus issue management.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <div key={title}
              className="glass rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group animate-fade-up"
              style={{animationDelay:`${i*80}ms`}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{background: color + '20', border: `1px solid ${color}30`}}>
                <Icon size={20} style={{color}} />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <div className="glass rounded-3xl p-10 text-center border border-primary/25"
          style={{background:'linear-gradient(135deg,rgba(79,70,229,0.12),rgba(8,11,24,0.2))'}}>
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary/30">
            <Zap size={22} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3" style={{fontFamily:'Bricolage Grotesque,sans-serif'}}>
            Ready to make campus better?
          </h2>
          <p className="text-slate-400 mb-7">Join thousands of students already using IssuePulse.</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-glow hover:shadow-glow active:scale-[0.97]">
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 text-center text-xs text-slate-600 pb-10">
        © 2025 IssuePulse — Anurag University Campus Management System
      </footer>
    </div>
  )
}
