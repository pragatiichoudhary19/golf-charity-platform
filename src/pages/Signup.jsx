import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AuthLayout } from './Login'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')

    setLoading(true)

    const { error } = await supabase.auth.signUp({
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
    <AuthLayout heading="Create account" sub="Join Fairway Gives and support a cause you love">
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
            placeholder="Min. 6 characters"
            className="input"
          />
        </div>
        <div>
          <label className="label">Confirm password</label>
          <input
            name="confirm" type="password" required
            value={form.confirm} onChange={handleChange}
            placeholder="••••••••"
            className="input"
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-sage-500">
        Already have an account?{' '}
        <Link to="/login" className="text-sage-700 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}