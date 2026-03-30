import { useState, useEffect } from "react"
import { userAPI, complaintAPI } from "../../services/api"
import Layout from "../../components/layout/Layout"
import toast from "react-hot-toast"
import { ShieldCheck, HelpCircle, Mail, Lock, Eye, EyeOff, ChevronDown, CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react"

const helpTopics = [
  {
    icon: "📋",
    title: "Submitting a Complaint",
    description:
      "Go to 'Raise Complaint' from the sidebar. Fill in the title, category, location, and description. Attach a photo if needed. Click 'Submit' — your complaint is logged instantly with a unique ID.",
  },
  {
    icon: "🔍",
    title: "Tracking Your Issue",
    description:
      "Visit 'My Complaints' to see all submitted complaints. Each issue shows its current status — Pending, In Review, or Resolved. Click any issue to see detailed progress notes from the admin.",
  },
  {
    icon: "🔔",
    title: "Notifications",
    description:
      "You'll receive in-app notifications whenever your issue status changes. Make sure notifications are enabled in your browser. Admins may also leave comments in your issue thread.",
  },
  {
    icon: "🛡️",
    title: "Admin Responses",
    description:
      "All complaints are reviewed by the concerned department admin. Response timelines depend on category and priority — typically within 2 business days.",
  },
  {
    icon: "📁",
    title: "Issue Categories",
    description:
      "Issues are grouped: IT & Connectivity, Infrastructure, Academics, Canteen, Transport, Library, Sports & Medical, Security, and Other. Right category = faster resolution.",
  },
  {
    icon: "✅",
    title: "Closing an Issue",
    description:
      "Once marked Resolved, you can close it from the issue detail page. You may re-open it within 7 days if the problem persists.",
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab]       = useState("password")
  const [profile, setProfile]           = useState(null)
  const [stats, setStats]               = useState({ total: 0, resolved: 0, pending: 0, rejected: 0 })
  const [loadingProfile, setLoadingProfile] = useState(true)

  const [passwords, setPasswords]       = useState({ current: "", newPass: "", confirm: "" })
  const [show, setShow]                 = useState({ current: false, newPass: false, confirm: false })
  const [pwLoading, setPwLoading]       = useState(false)

  const [openHelp, setOpenHelp]         = useState(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody]       = useState("")

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, complaintsRes] = await Promise.all([
          userAPI.getProfile(),
          complaintAPI.myList(),
        ])
        setProfile(profileRes.data)
        const list = complaintsRes.data || []
        setStats({
          total:    list.length,
          resolved: list.filter(c => c.status === "RESOLVED").length,
          pending:  list.filter(c => c.status === "PENDING" || c.status === "UNDER_PROCESS").length,
          rejected: list.filter(c => c.status === "REJECTED").length,
        })
      } catch {
        toast.error("Failed to load profile.")
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchAll()
  }, [])

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      toast.error("All fields are required."); return
    }
    if (passwords.newPass.length < 6) {
      toast.error("New password must be at least 6 characters."); return
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error("Passwords do not match."); return
    }
    setPwLoading(true)
    try {
      await userAPI.changePassword({ currentPassword: passwords.current, newPassword: passwords.newPass })
      toast.success("Password updated successfully!")
      setPasswords({ current: "", newPass: "", confirm: "" })
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password.")
    } finally { setPwLoading(false) }
  }

  const handleSendEmail = () => {
    const mailto = `mailto:mohd.azam9676@gmail.com?subject=${encodeURIComponent(
      emailSubject || "Support Request - IssuePulse"
    )}&body=${encodeURIComponent(emailBody)}`
    window.open(mailto, "_blank")
  }

  const initials = profile?.name
    ? profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "??"

  const tabs = [
    { id: "password", label: "Change Password", icon: Lock },
    { id: "help",     label: "Help & Guide",    icon: HelpCircle },
    { id: "support",  label: "Contact Support", icon: Mail },
  ]

  const statCards = [
    { label: "Total",    value: stats.total,    icon: FileText,    color: "#4f46e5", bg: "#eef2ff" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "#059669", bg: "#ecfdf5" },
    { label: "Active",   value: stats.pending,  icon: Clock,       color: "#d97706", bg: "#fffbeb" },
    { label: "Rejected", value: stats.rejected, icon: AlertCircle, color: "#dc2626", bg: "#fef2f2" },
  ]

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">

        {/* ── Coloured banner header ── */}
        <div className="rounded-2xl overflow-hidden mb-5 shadow-sm border border-indigo-100"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #818cf8 100%)" }}>

          {/* Top: avatar + info */}
          {loadingProfile ? (
            <div className="px-6 py-6 flex items-center gap-4 animate-pulse">
              <div className="w-16 h-16 rounded-2xl bg-white/20" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-white/20 rounded" />
                <div className="h-3 w-44 bg-white/20 rounded" />
              </div>
            </div>
          ) : (
            <div className="px-6 pt-6 pb-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl text-white"
                style={{ background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-lg leading-tight truncate"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                  {profile?.name}
                </p>
                <p className="text-indigo-200 text-sm truncate mt-0.5">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                    {profile?.role}
                  </span>
                  {profile?.role === "STUDENT" && profile?.rollNo && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.15)", color: "#e0e7ff" }}>
                      {profile.rollNo} · {profile.department}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)" }}>
            {statCards.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex flex-col items-center py-3 gap-0.5"
                  style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                  <p className="text-white font-bold text-xl">{s.value}</p>
                  <p className="text-indigo-200 text-xs">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-5" style={{ borderBottom: "1.5px solid #e8edf8" }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all -mb-px"
                style={{
                  borderBottom: activeTab === tab.id ? "2px solid #4f46e5" : "2px solid transparent",
                  color: activeTab === tab.id ? "#4f46e5" : "#94a3b8",
                }}>
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ── CHANGE PASSWORD ── */}
        {activeTab === "password" && (
          <div className="card space-y-4">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Update your password</p>
              <p className="text-xs text-slate-400 mt-0.5">Choose a strong password of at least 6 characters.</p>
            </div>

            {[
              { label: "Current Password",      key: "current", placeholder: "••••••••" },
              { label: "New Password",           key: "newPass", placeholder: "Min 6 characters" },
              { label: "Confirm New Password",   key: "confirm", placeholder: "Re-enter new password" },
            ].map(field => (
              <div key={field.key}>
                <label className="input-label">{field.label}</label>
                <div className="relative">
                  <input
                    type={show[field.key] ? "text" : "password"}
                    value={passwords[field.key]}
                    onChange={e => setPasswords({ ...passwords, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="input-field pr-14"
                    style={{ borderColor: "#e8edf8" }}
                  />
                  <button type="button"
                    onClick={() => setShow(s => ({ ...s, [field.key]: !s[field.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {show[field.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}

            <button onClick={handlePasswordChange} disabled={pwLoading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}>
              {pwLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating…
                </span>
              ) : "Update Password"}
            </button>
          </div>
        )}

        {/* ── HELP & GUIDE ── */}
        {activeTab === "help" && (
          <div className="space-y-3">
            {/* Response time banner */}
            <div className="rounded-xl p-4 flex items-start gap-3 border"
              style={{ background: "#eef2ff", borderColor: "#c7d2fe" }}>
              <ShieldCheck size={16} style={{ color: "#4f46e5", marginTop: 1, flexShrink: 0 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#4338ca" }}>Admin Response Time</p>
                <p className="text-xs mt-0.5" style={{ color: "#6366f1" }}>
                  All complaints are reviewed within <strong>2 business days</strong>. Complex issues may take slightly longer.
                </p>
              </div>
            </div>

            {helpTopics.map((topic, i) => (
              <div key={i} className="card p-0 overflow-hidden">
                <button
                  onClick={() => setOpenHelp(openHelp === i ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left bg-transparent border-none cursor-pointer">
                  <span style={{ fontSize: 16 }}>{topic.icon}</span>
                  <span className="text-sm font-medium flex-1 text-slate-700">{topic.title}</span>
                  <ChevronDown size={14} className="text-slate-400 transition-transform duration-200"
                    style={{ transform: openHelp === i ? "rotate(180deg)" : "none" }} />
                </button>
                {openHelp === i && (
                  <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 ml-7">
                    <div className="pt-3">{topic.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── CONTACT SUPPORT ── */}
        {activeTab === "support" && (
          <div className="card space-y-4">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Contact Support</p>
              <p className="text-xs text-slate-400 mt-0.5">
                For technical issues or anything unresolved. We respond within 2 business days.
              </p>
            </div>

            {/* Email pill */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm"
              style={{ background: "#eef2ff", borderColor: "#c7d2fe" }}>
              <Mail size={13} style={{ color: "#4f46e5" }} />
              <span className="text-slate-500 text-xs">Support email:</span>
              <span className="font-semibold text-xs" style={{ color: "#4f46e5" }}>mohd.azam9676@gmail.com</span>
            </div>

            <div>
              <label className="input-label">Subject</label>
              <input type="text" value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                placeholder="e.g. Issue with complaint submission"
                className="input-field" />
            </div>

            <div>
              <label className="input-label">Message</label>
              <textarea rows={5} value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                placeholder="Describe your issue in detail…"
                className="input-field resize-none" />
            </div>

            <button onClick={handleSendEmail}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}>
              Open in Mail <span style={{ fontSize: 11 }}>↗</span>
            </button>
            <p className="text-xs text-slate-400 text-center">
              Opens your default mail app pre-filled with your message.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}