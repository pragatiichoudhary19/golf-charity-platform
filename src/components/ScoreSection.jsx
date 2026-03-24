import { useState } from 'react'

export default function ScoreSection({ scores, onAddScore, onDeleteScore }) {
  const [form, setForm]           = useState({ score: '', date: todayISO() })
  const [formError, setFormError] = useState('')
  const [saving, setSaving]       = useState(false)
  const [success, setSuccess]     = useState(false)
  const [deleting, setDeleting]   = useState(null)

  function todayISO() {
    return new Date().toISOString().split('T')[0]
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setFormError('')
    setSuccess(false)

    const val = Number(form.score)
    if (!val || val < 1 || val > 45) {
      return setFormError('Score must be a whole number between 1 and 45.')
    }

    setSaving(true)
    const err = await onAddScore(val, form.date)
    setSaving(false)

    if (err) {
      setFormError(err.message)
    } else {
      setSuccess(true)
      setForm({ score: '', date: todayISO() })
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    await onDeleteScore(id)
    setDeleting(null)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-light text-charcoal">My Scores</h2>
        <span className="text-xs text-sage-400 tabular-nums">{scores.length} / 5 stored</span>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 min-w-0">
          <label className="label">Score (1–45)</label>
          <input
            type="number" min="1" max="45" step="1" required
            value={form.score}
            onChange={(e) => setForm({ ...form, score: e.target.value })}
            placeholder="e.g. 27"
            className="input"
          />
        </div>
        <div className="flex-1 min-w-0">
          <label className="label">Date played</label>
          <input
            type="date" required
            value={form.date}
            max={todayISO()}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input"
          />
        </div>
        <div className="flex items-end shrink-0">
          <button type="submit" disabled={saving} className="btn-primary h-[42px] px-6 whitespace-nowrap">
            {saving ? 'Saving…' : '+ Add score'}
          </button>
        </div>
      </form>

      {formError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
          {formError}
        </p>
      )}
      {success && (
        <p className="text-sm text-sage-700 bg-sage-50 border border-sage-100 rounded-lg px-3 py-2 mb-4">
          Score added successfully ✓
        </p>
      )}

      {scores.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">⛳</p>
          <p className="text-sm text-sage-400">No scores yet. Add your first round above.</p>
        </div>
      ) : (
        <ul className="divide-y divide-sage-50">
          {scores.map((s, i) => (
            <li key={s.id} className="flex items-center justify-between py-3 group">
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0
                  ${i === 0 ? 'bg-sage-700 text-white' : 'bg-sage-50 text-sage-500'}`}>
                  {i + 1}
                </span>
                <div>
                  <span className="font-display text-2xl font-light text-charcoal leading-none">{s.score}</span>
                  <span className="text-xs text-sage-400 ml-2">pts</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-sage-400">
                  {new Date(s.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deleting === s.id}
                  aria-label="Remove score"
                  className="opacity-0 group-hover:opacity-100 text-sage-300 hover:text-red-400
                             transition-all duration-150 text-xl leading-none disabled:cursor-wait"
                >
                  {deleting === s.id ? '…' : '×'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-sage-300 mt-4 border-t border-sage-50 pt-3">
        A maximum of 5 scores are kept. Adding a new one automatically removes the oldest.
      </p>
    </div>
  )
}