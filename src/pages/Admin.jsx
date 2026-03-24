import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth }  from '../App'
import Navbar       from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [users, setUsers]           = useState([])
  const [draws, setDraws]           = useState([])
  const [running, setRunning]       = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    await Promise.all([fetchUsersWithScores(), fetchDraws()])
    setLoading(false)
  }

  async function fetchUsersWithScores() {
    const { data, error } = await supabase
      .from('scores')
      .select('user_id, score, created_at')
      .order('created_at', { ascending: false })

    if (!error && data) {
      const grouped = data.reduce((acc, row) => {
        if (!acc[row.user_id]) acc[row.user_id] = { user_id: row.user_id, scores: [] }
        if (acc[row.user_id].scores.length < 5) acc[row.user_id].scores.push(row)
        return acc
      }, {})
      setUsers(Object.values(grouped))
    }
  }

  async function fetchDraws() {
    const { data } = await supabase
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    if (data) setDraws(data)
  }

  async function runDraw() {
    setRunning(true)
    const nums = new Set()
    while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1)
    const numbers = [...nums]

    const { data, error } = await supabase
      .from('draws')
      .insert({ numbers })
      .select()
      .single()

    if (!error && data) {
      setLastResult(data)
      await fetchDraws()
    }
    setRunning(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} onSignOut={handleSignOut} adminMode />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-light text-charcoal">Admin Panel</h1>
            <p className="text-sm text-sage-500 mt-0.5">Manage draws and view participant data</p>
          </div>
          <button onClick={runDraw} disabled={running} className="btn-primary">
            {running ? 'Drawing…' : '🎲 Run Draw'}
          </button>
        </div>

        {lastResult && (
          <div className="card bg-sage-700 text-white border-sage-600 animate-slide-up">
            <p className="text-xs font-semibold tracking-widest uppercase text-sage-200 mb-2">
              Latest Draw — {new Date(lastResult.created_at).toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-2">
              {lastResult.numbers.map((n) => (
                <span key={n} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-sage-800 font-display text-lg font-medium">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {draws.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-charcoal mb-4">Draw History</h2>
            <div className="space-y-3">
              {draws.map((d) => (
                <div key={d.id} className="flex items-center gap-4 text-sm">
                  <span className="text-sage-400 w-36 shrink-0">
                    {new Date(d.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {d.numbers.map((n) => (
                      <span key={n} className="badge bg-sage-100 text-sage-700 font-mono">{n}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="font-semibold text-charcoal mb-4">Participants ({users.length})</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-sage-300 border-t-sage-700 rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-sage-400 py-4">No scores submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.user_id} className="border border-sage-100 rounded-xl p-4">
                  <p className="text-xs font-mono text-sage-400 mb-2 truncate">{u.user_id}</p>
                  <div className="flex flex-wrap gap-2">
                    {u.scores.map((s) => (
                      <span key={s.created_at} className="badge bg-sage-50 text-sage-700">
                        {s.score} <span className="ml-1 text-sage-400">on {new Date(s.created_at).toLocaleDateString()}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}