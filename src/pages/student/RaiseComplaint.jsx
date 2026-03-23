import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintAPI } from '../../services/api'
import Layout from '../../components/layout/Layout'
import { Upload, X, CheckCircle2, Camera, Lightbulb, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

const SUGGESTED = ['WiFi','Water Supply','Electricity','Cleanliness','Infrastructure','Canteen','Parking','Other']

export default function RaiseComplaint() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ title:'', description:'', category:'', location:'' })
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImage = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10 MB'); return }
    setImage(file); setPreview(URL.createObjectURL(file))
  }
  const removeImage = () => { setImage(null); setPreview(null) }

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('category', form.category)
      fd.append('location', form.location)
      if (image) fd.append('image', image)
      await complaintAPI.create(fd)
      setSuccess(true)
      toast.success('Complaint submitted!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit.')
    } finally { setLoading(false) }
  }

  if (success) return (
    <Layout>
      <div className="max-w-lg mx-auto text-center py-20 animate-fade-up">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-200">
          <CheckCircle2 size={36} className="text-emerald-500" />
        </div>
        <h2 className="page-title mb-2">Complaint Submitted!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
          Your complaint has been recorded and is now under review.<br />
          You'll see updates in <strong className="text-slate-700">My Complaints</strong>.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSuccess(false); setForm({title:'',description:'',category:'',location:''}); removeImage() }}
            className="btn-secondary">Raise Another</button>
          <button onClick={() => navigate('/my-complaints')} className="btn-primary">View My Complaints</button>
        </div>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="page-header">
          <h1 className="page-title">Raise a Complaint</h1>
          <p className="page-subtitle">All fields are optional. Describe as much or as little as you like.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="card">
            <label className="input-label">Complaint Title</label>
            <input name="title"
              placeholder="e.g. Wi-Fi not working in Library Block"
              value={form.title} onChange={handleChange}
              className="input-field" />
          </div>

          {/* Category + Location */}
          <div className="card space-y-4">
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Tag size={11} /> Category <span className="text-slate-400 normal-case tracking-normal font-normal">(free text)</span>
              </label>
              <input name="category"
                placeholder="Type any category…"
                value={form.category} onChange={handleChange}
                className="input-field mb-2.5" />
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED.map(s => (
                  <button key={s} type="button"
                    onClick={() => setForm(f => ({ ...f, category: s }))}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      form.category === s
                        ? 'bg-primary text-white border-primary shadow-glow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="input-label">Location</label>
              <input name="location"
                placeholder="e.g. Block A – Room 204, Hostel B"
                value={form.location} onChange={handleChange}
                className="input-field" />
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <label className="input-label">Description</label>
            <textarea name="description" rows={5}
              placeholder="Describe the issue — what happened, when, how severe…"
              value={form.description} onChange={handleChange}
              className="input-field resize-none" />
            <div className="flex items-start gap-2 mt-3 p-3 bg-primary-light border border-primary/15 rounded-xl">
              <Lightbulb size={13} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-primary/80 leading-relaxed">
                More detail = faster resolution. Include timing and severity when possible.
              </p>
            </div>
          </div>

          {/* Image upload */}
          <div className="card">
            <label className="input-label">
              <Camera size={11} className="inline mr-1" />
              Photo Evidence <span className="text-slate-400 normal-case tracking-normal font-normal">(optional)</span>
            </label>
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview"
                  className="w-full max-h-64 object-cover rounded-xl border border-slate-200" />
                <button type="button" onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
                  <X size={13} className="text-slate-700" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2
                border-dashed border-slate-200 rounded-xl cursor-pointer
                hover:border-primary/50 hover:bg-primary-light transition-all group">
                <Upload size={22} className="text-slate-300 group-hover:text-primary mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-400 group-hover:text-primary transition-colors">Click to upload photo</p>
                <p className="text-xs text-slate-300 mt-0.5">PNG, JPG up to 10 MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </span>
            ) : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
