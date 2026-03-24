import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <AuthLayout heading="Welcome back" sub="Sign in to your Fairway Gives account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            name="email" type="email" required
            value={form.email} onChange={handleChange}
            placeholder="you@example.com"
            className="input"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            name="password" type="password" required
            value={form.password} onChange={handleChange}
            placeholder="••••••••"
            className="input"
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-sage-500">
        No account?{' '}
        <Link to="/signup" className="text-sage-700 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}

export function AuthLayout({ heading, sub, children }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center animate-fade-in">
        <span className="inline-flex items-center gap-2">
          <GolfIcon />
          <span className="font-display text-2xl font-light text-charcoal">Fairway Gives</span>
        </span>
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        <div className="card">
          <h1 className="font-display text-2xl font-light text-charcoal mb-1">{heading}</h1>
          <p className="text-sm text-sage-500 mb-6">{sub}</p>
          {children}
        </div>
      </div>

      <p className="mt-6 text-xs text-sage-400">© {new Date().getFullYear()} Fairway Gives</p>
    </div>
  )
}

function GolfIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#2b502e" />
      <path d="M14 7v14M10 18c0 0 2-2 4-2s4 2 4 2" stroke="#FAF8F3" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="14" cy="10" r="1.5" fill="#FAF8F3"/>
    </svg>
  )
}