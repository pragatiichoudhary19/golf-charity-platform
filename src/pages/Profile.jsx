import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import { useProfile } from '../lib/useProfile'
import Navbar from '../components/Navbar'

// Avatar color generator based on email
function getAvatarColor(email) {
  const colors = [
    'bg-sage-700', 'bg-blue-600', 'bg-purple-600',
    'bg-rose-600', 'bg-amber-600', 'bg-teal-600'
  ]
  const index = email ? email.charCodeAt(0) % colors.length : 0
  return colors[index]
}

function getInitials(name, email) {
  if (name && name.trim()) {
    return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }
  return email ? email[0].toUpperCase() : '?'
}

export default function Profile() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const { profile, loading, updateProfile } = useProfile(user?.id)

  const [form, setForm]       = useState({ full_name: '', bio: '' })
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  // Fill form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        bio:       profile.bio || '',
      })
    }
  }, [profile])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    const err = await updateProfile({
      full_name: form.full_name,
      bio:       form.bio,
    })

    setSaving(false)

    if (err) {
      setError(err.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const avatarColor = getAvatarColor(user?.email)
  const initials    = getInitials(form.full_name, user?.email)

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} onSignOut={handleSignOut} />

      <main className="max-w-2xl mx-auto px-4 py-10 animate-slide-up">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-light text-charcoal">My Profile</h1>
          <p className="text-sm text-sage-500 mt-1">Manage your personal information</p>
        </div>

        <div className="card">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-sage-300 border-t-sage-700 rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 rounded-full ${avatarColor} flex items-center justify-center shrink-0`}>
                  <span className="font-display text-2xl text-white font-light">
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    {form.full_name || 'No name set'}
                  </p>
                  <p className="text-xs text-sage-400 mt-0.5">{user?.email}</p>
                  <p className="text-xs text-sage-300 mt-1">
                    Avatar is auto-generated from your name initials
                  </p>
                </div>
              </div>

              <div className="border-t border-sage-50 pt-6 space-y-4">
                {/* Full name */}
                <div>
                  <label className="label">Full Name</label>
                  <input
                    name="full_name"
                    type="text"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="e.g. John Smith"
                    className="input"
                  />
                </div>

                {/* Email (read only) */}
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-sage-300 mt-1">Email cannot be changed</p>
                </div>

                {/* Bio */}
                <div>
                  <label className="label">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little about yourself..."
                    rows={4}
                    className="input resize-none"
                  />
                </div>
              </div>

              {/* Member info */}
              <div className="bg-sage-50 rounded-xl p-4 border border-sage-100">
                <p className="text-xs font-semibold text-sage-600 uppercase tracking-wide mb-2">
                  Account Info
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-sage-400">Member since</span>
                    <span className="text-charcoal font-medium">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })
                        : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-sage-400">Subscription</span>
                    <span className="text-sage-700 font-semibold">Active ✦</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-sage-400">User ID</span>
                    <span className="text-charcoal font-mono text-xs truncate max-w-[180px]">
                      {user?.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-sage-700 bg-sage-50 border border-sage-100 rounded-lg px-3 py-2">
                  Profile updated successfully ✓
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-ghost"
                >
                  Back to dashboard
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}