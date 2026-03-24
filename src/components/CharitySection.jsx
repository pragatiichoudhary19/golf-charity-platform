import { useState } from 'react'
const ICONS = {
  'Junior':  '🏌️',
  'Green':   '🌱',
  'Caddie':  '🎓',
  'Veteran': '🎖️',
}

function charityIcon(name) {
  const key = Object.keys(ICONS).find((k) => name.includes(k))
  return key ? ICONS[key] : '♥'
}

export default function CharitySection({ charities, selected, onSelect }) {
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')

  async function handleSelect(id) {
    if (id === selected) return
    setSaving(true)
    setMsg('')
    const err = await onSelect(id)
    setSaving(false)
    if (err) {
      setMsg('Failed to save. Please try again.')
    } else {
      setMsg('Charity updated ✓')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  return (
    <div className="card h-fit">
      <h2 className="font-display text-xl font-light text-charcoal mb-1">Support a Cause</h2>
      <p className="text-xs text-sage-400 mb-5">Your subscription contributes to your chosen charity.</p>

      {charities.length === 0 ? (
        <p className="text-sm text-sage-400">No charities available.</p>
      ) : (
        <ul className="space-y-2">
          {charities.map((c) => {
            const isSelected = c.id === selected
            return (
              <li key={c.id}>
                <button
                  onClick={() => handleSelect(c.id)}
                  disabled={saving}
                  className={`w-full text-left rounded-xl p-3.5 border transition-all duration-150
                    ${isSelected
                      ? 'border-sage-600 bg-sage-50 ring-1 ring-sage-400'
                      : 'border-sage-100 hover:border-sage-300 hover:bg-sage-50'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{charityIcon(c.name)}</span>
                    <div>
                      <p className={`text-sm font-medium ${isSelected ? 'text-sage-800' : 'text-charcoal'}`}>
                        {c.name}
                      </p>
                      <p className="text-xs text-sage-400 mt-0.5 leading-relaxed">{c.description}</p>
                    </div>
                    {isSelected && (
                      <span className="ml-auto shrink-0 text-sage-600 text-base">✓</span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {msg && (
        <p className={`text-xs mt-3 ${msg.includes('✓') ? 'text-sage-600' : 'text-red-500'}`}>{msg}</p>
      )}
    </div>
  )
}