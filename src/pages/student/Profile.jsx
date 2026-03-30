import { useState, useEffect, useRef } from "react"
import { userAPI, complaintAPI } from "../../services/api"
import Layout from "../../components/layout/Layout"
import toast from "react-hot-toast"
import {
  ShieldCheck, HelpCircle, Mail, Lock, Eye, EyeOff,
  ChevronDown, CheckCircle2, Clock, FileText, AlertCircle,
} from "lucide-react"

/* ── Lush palette ── */
const LUSH = {
  black:  "#000000",
  ink:    "#062F4F",
  posy:   "#813772",
  embers: "#B82601",
}

const helpTopics = [
  { icon: "📋", title: "Submitting a Complaint", description: "Go to 'Raise Complaint' from the sidebar. Fill in the title, category, location, and description. Attach a photo if needed. Click 'Submit' — your complaint is logged instantly with a unique ID." },
  { icon: "🔍", title: "Tracking Your Issue", description: "Visit 'My Complaints' to see all submitted complaints. Each issue shows its current status — Pending, In Review, or Resolved. Click any issue to see detailed progress notes from the admin." },
  { icon: "🔔", title: "Notifications", description: "You'll receive in-app notifications whenever your issue status changes. Make sure notifications are enabled in your browser. Admins may also leave comments in your issue thread." },
  { icon: "🛡️", title: "Admin Responses", description: "All complaints are reviewed by the concerned department admin. Response timelines depend on category and priority — typically within 2 business days." },
  { icon: "📁", title: "Issue Categories", description: "Issues are grouped: IT & Connectivity, Infrastructure, Academics, Canteen, Transport, Library, Sports & Medical, Security, and Other. Right category = faster resolution." },
  { icon: "✅", title: "Closing an Issue", description: "Once marked Resolved, you can close it from the issue detail page. You may re-open it within 7 days if the problem persists." },
]

/* ── Animated ink canvas — vivid Lush style on white ── */
function InkCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    class Blob {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x  = Math.random() * canvas.width
        this.y  = initial ? Math.random() * canvas.height : (Math.random() < 0.5 ? -150 : canvas.height + 150)
        this.r  = 80 + Math.random() * 160
        this.dx = (Math.random() - 0.5) * 0.35
        this.dy = (Math.random() - 0.5) * 0.35
        /* rich ink colours — red, deep blue, purple, dark crimson */
        this.color = [
          "#B82601", // embers red
          "#8B1A00", // dark red
          "#062F4F", // ink blue
          "#0a3d6b", // deeper blue
          "#813772", // posy purple
          "#5c1f5c", // dark purple
          "#c0392b", // vivid red
          "#1a0a3e", // near black blue
        ][Math.floor(Math.random() * 8)]
        this.alpha = 0.55 + Math.random() * 0.35   // very opaque — vivid ink
        this.dr    = (Math.random() - 0.5) * 0.12
      }
      update() {
        this.x += this.dx
        this.y += this.dy
        this.r += this.dr
        if (this.r < 40 || this.r > 240) this.dr *= -1
        if (
          this.x < -300 || this.x > canvas.width  + 300 ||
          this.y < -300 || this.y > canvas.height + 300
        ) this.reset()
      }
      draw() {
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r)
        const a1 = Math.round(this.alpha * 255).toString(16).padStart(2, "0")
        const a2 = Math.round(this.alpha * 0.6 * 255).toString(16).padStart(2, "0")
        const a3 = Math.round(this.alpha * 0.15 * 255).toString(16).padStart(2, "0")
        g.addColorStop(0,    this.color + a1)
        g.addColorStop(0.45, this.color + a2)
        g.addColorStop(0.75, this.color + a3)
        g.addColorStop(1,    this.color + "00")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const blobs = Array.from({ length: 28 }, () => new Blob())
    let raf

    const draw = () => {
      /* pure white base every frame */
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      /* draw all blobs with multiply-like layering */
      ctx.globalCompositeOperation = "multiply"
      blobs.forEach(b => { b.update(); b.draw() })
      ctx.globalCompositeOperation = "source-over"

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
      }}
    />
  )
}

export default function ProfilePage() {
  const [activeTab,      setActiveTab]      = useState("password")
  const [profile,        setProfile]        = useState(null)
  const [stats,          setStats]          = useState({ total: 0, resolved: 0, pending: 0, rejected: 0 })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [passwords,      setPasswords]      = useState({ current: "", newPass: "", confirm: "" })
  const [show,           setShow]           = useState({ current: false, newPass: false, confirm: false })
  const [pwLoading,      setPwLoading]      = useState(false)
  const [openHelp,       setOpenHelp]       = useState(null)
  const [emailSubject,   setEmailSubject]   = useState("")
  const [emailBody,      setEmailBody]      = useState("")

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
      } catch { toast.error("Failed to load profile.") }
      finally  { setLoadingProfile(false) }
    }
    fetchAll()
  }, [])

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) { toast.error("All fields are required."); return }
    if (passwords.newPass.length < 6) { toast.error("New password must be at least 6 characters."); return }
    if (passwords.newPass !== passwords.confirm) { toast.error("Passwords do not match."); return }
    setPwLoading(true)
    try {
      await userAPI.changePassword({ currentPassword: passwords.current, newPassword: passwords.newPass })
      toast.success("Password updated successfully!")
      setPasswords({ current: "", newPass: "", confirm: "" })
    } catch (err) { toast.error(err.response?.data?.error || "Failed to update password.") }
    finally { setPwLoading(false) }
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
    { label: "Total",    value: stats.total,    accent: "#818cf8" },
    { label: "Resolved", value: stats.resolved, accent: "#34d399" },
    { label: "Active",   value: stats.pending,  accent: "#fbbf24" },
    { label: "Rejected", value: stats.rejected, accent: LUSH.embers },
  ]

  const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  background: "rgba(255,255,255,0.15)",   // brighter
  border: "1px solid rgba(255,255,255,0.3)", // stronger border
  color: "#ffffff",                       // pure white text
  fontSize: 13,
  outline: "none",
  transition: "border-color .2s",
}

  const cardStyle = {
  background: "rgba(6,47,79,0.80)",   // darker = better contrast
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 16,
  padding: "20px 22px",
  backdropFilter: "blur(12px)",
}

  return (
    <Layout>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* ════════════════════════════════════════════
            HERO BANNER — vivid Lush ink on white
        ════════════════════════════════════════════ */}
        <div style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 20,
          background: "#ffffff",
          boxShadow: "0 8px 40px rgba(184,38,1,0.20), 0 2px 12px rgba(0,0,0,0.10)",
        }}>
          {/* full-card animated ink canvas */}
          <InkCanvas />

          {/* thin embers/posy top border */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 3,
            background: `linear-gradient(90deg, transparent, ${LUSH.embers}, ${LUSH.posy}, transparent)`,
          }} />

          {/* ── avatar + info ── */}
          <div style={{ position: "relative", zIndex: 2, padding: "24px 24px 16px" }}>
            {loadingProfile ? (
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.3)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ width: 130, height: 14, borderRadius: 6, background: "rgba(255,255,255,0.3)" }} />
                  <div style={{ width: 180, height: 11, borderRadius: 6, background: "rgba(255,255,255,0.2)" }} />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* avatar */}
                <div style={{
                  width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 700, color: "#fff",
                  background: `linear-gradient(135deg, ${LUSH.embers}, ${LUSH.posy})`,
                  border: "2.5px solid rgba(255,255,255,0.85)",
                  boxShadow: `0 4px 24px ${LUSH.embers}88`,
                }}>
                  {initials}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* name — white with text shadow so it pops on ink */}
                  <p style={{
                    color: "#ffffff",
                    fontWeight: 800, fontSize: 20, lineHeight: 1.2, marginBottom: 4,
                    fontFamily: "Bricolage Grotesque, sans-serif",
                    textShadow: "0 1px 8px rgba(0,0,0,0.55), 0 0 20px rgba(0,0,0,0.3)",
                  }}>
                    {profile?.name}
                  </p>
                  <p style={{
                    color: "rgba(255,255,255,0.85)", fontSize: 13, marginBottom: 8,
                    textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                  }}>
                    {profile?.email}
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                      background: LUSH.embers, color: "#fff",
                      boxShadow: `0 2px 10px ${LUSH.embers}88`,
                    }}>
                      {profile?.role}
                    </span>
                    {profile?.role === "STUDENT" && profile?.rollNo && (
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                        background: LUSH.posy, color: "#fff",
                        boxShadow: `0 2px 10px ${LUSH.posy}88`,
                      }}>
                        {profile.rollNo} · {profile.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── stats row — frosted white strip at bottom ── */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            borderTop: "1px solid rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(10px)",
          }}>
            {statCards.map((s, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "14px 0", gap: 3,
                borderRight: i < 3 ? "1px solid rgba(0,0,0,0.07)" : "none",
              }}>
                <p style={{ color: "#111", fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: "rgba(0,0,0,0.5)", fontSize: 11, letterSpacing: 0.5 }}>{s.label}</p>
                <div style={{ width: 22, height: 2.5, borderRadius: 2, background: s.accent, marginTop: 3 }} />
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            TABS
        ════════════════════════════════════════════ */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 18,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: -1,
                  borderBottom: active ? `2px solid ${LUSH.embers}` : "2px solid transparent",
                  color: active ? "#B82601" : "#1f2937", // ✅ FIXED
                  transition: "color .2s",
                }}>
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ════════════════════════════════════════════
            CHANGE PASSWORD
        ════════════════════════════════════════════ */}
        {activeTab === "password" && (
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <p style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>Update your password</p>
              <p style={{color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 3 }}>Choose a strong password of at least 6 characters.</p>
            </div>

            {[
              { label: "Current Password",    key: "current", placeholder: "••••••••" },
              { label: "New Password",         key: "newPass", placeholder: "Min 6 characters" },
              { label: "Confirm New Password", key: "confirm", placeholder: "Re-enter new password" },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 500, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {field.label}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={show[field.key] ? "text" : "password"}
                    value={passwords[field.key]}
                    onChange={e => setPasswords({ ...passwords, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{ ...inputStyle, paddingRight: 44 }}
                    onFocus={e => e.target.style.borderColor = LUSH.embers}
                    onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                  <button type="button"
                    onClick={() => setShow(s => ({ ...s, [field.key]: !s[field.key] }))}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.9)" }}>
                    {show[field.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}

            <button onClick={handlePasswordChange} disabled={pwLoading} style={{
              width: "100%", padding: "12px", borderRadius: 12, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${LUSH.embers}, ${LUSH.posy})`,
              color: "#fff", fontSize: 13, fontWeight: 600,
              boxShadow: `0 4px 20px ${LUSH.embers}55`,
              opacity: pwLoading ? 0.7 : 1,
            }}>
              {pwLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Updating…
                </span>
              ) : "Update Password"}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════
            HELP & GUIDE
        ════════════════════════════════════════════ */}
        {activeTab === "help" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{
              ...cardStyle,
              display: "flex", gap: 12, padding: "14px 18px",
              background: `rgba(6,47,79,0.85)`,
              border: `1px solid ${LUSH.ink}`,
            }}>
              <ShieldCheck size={16} style={{ color: LUSH.embers, flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 14 }}>Admin Response Time</p>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 3 }}>
                  All complaints are reviewed within <strong style={{ color: "rgba(255,255,255,0.7)" }}>2 business days</strong>. Complex issues may take slightly longer.
                </p>
              </div>
            </div>

            {helpTopics.map((topic, i) => (
              <div key={i} style={{
                ...cardStyle, padding: 0, overflow: "hidden",
                border: openHelp === i ? `1px solid ${LUSH.embers}55` : "1px solid rgba(255,255,255,0.07)",
                transition: "border-color .2s",
              }}>
                <button onClick={() => setOpenHelp(openHelp === i ? null : i)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                }}>
                  <span style={{ fontSize: 16 }}>{topic.icon}</span>
                  <span style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 500, flex: 1 }}>{topic.title}</span>
                  <ChevronDown size={14} style={{
                    color: "rgba(255,255,255,0.9)",
                    transform: openHelp === i ? "rotate(180deg)" : "none",
                    transition: "transform .2s",
                  }} />
                </button>
                {openHelp === i && (
                  <div style={{
                    padding: "0 18px 16px 48px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 1.7,
                  }}>
                    <div style={{ paddingTop: 12 }}>{topic.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════════
            CONTACT SUPPORT
        ════════════════════════════════════════════ */}
        {activeTab === "support" && (
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <p style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>Contact Support</p>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 3 }}>
                For technical issues or anything unresolved. We respond within 2 business days.
              </p>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px", borderRadius: 10,
              background: `${LUSH.ink}99`, border: `1px solid ${LUSH.ink}`,
            }}>
              <Mail size={13} style={{ color: LUSH.embers, flexShrink: 0 }} />
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>Support email:</span>
              <span style={{ color: "#ffb4a2", fontSize: 12, fontWeight: 600 }}>mohd.azam9676@gmail.com</span>
            </div>

            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 500, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Subject</label>
              <input type="text" value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                placeholder="e.g. Issue with complaint submission"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = LUSH.embers}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 500, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Message</label>
              <textarea rows={5} value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                placeholder="Describe your issue in detail…"
                style={{ ...inputStyle, resize: "none" }}
                onFocus={e => e.target.style.borderColor = LUSH.embers}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <button onClick={handleSendEmail} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "12px", borderRadius: 12, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${LUSH.embers}, ${LUSH.posy})`,
              color: "#fff", fontSize: 13, fontWeight: 600,
              boxShadow: `0 4px 20px ${LUSH.embers}55`,
            }}>
              Open in Mail <span style={{ fontSize: 11 }}>↗</span>
            </button>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, textAlign: "center" }}>
              Opens your default mail app pre-filled with your message.
            </p>
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <style>{`
              input::placeholder,
              textarea::placeholder {
                color: rgba(255,255,255,0.85);
                opacity: 1;
              }
            `}</style>
      </div>
    </Layout>
  )
}