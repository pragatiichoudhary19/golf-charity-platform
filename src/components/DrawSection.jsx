import { useState } from 'react'

export default function DrawSection({ scores, draw, drawLoading, onRefresh }) {
  const [animating, setAnimating] = useState(false)

  const userScoreValues = new Set(scores.map((s) => Number(s.score)))

  const matches = draw
    ? draw.numbers.filter((n) => userScoreValues.has(Number(n)))
    : []
  const matchCount = matches.length

  const resultLabel =
    matchCount >= 5 ? '5 Matches - Jackpot!' :
    matchCount === 4 ? '4 Matches - Excellent!' :
    matchCount === 3 ? '3 Matches - Great!' :
    matchCount >= 1 ? (matchCount + ' Match' + (matchCount > 1 ? 'es!' : '!')) :
    draw ? 'No matches this draw' : null

  const resultColor =
    matchCount >= 5 ? 'text-amber-600 bg-amber-50 border-amber-200' :
    matchCount >= 3 ? 'text-sage-700 bg-sage-50 border-sage-200' :
    matchCount >= 1 ? 'text-blue-600 bg-blue-50 border-blue-200' :
    'text-sage-400 bg-sage-50 border-sage-100'

  const handleRefresh = async () => {
    setAnimating(true)
    await onRefresh()
    setTimeout(() => setAnimating(false), 500)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-xl font-light text-charcoal">Latest Draw</h2>
          {draw && (
            <p className="text-xs text-sage-400 mt-0.5">
              {new Date(draw.created_at).toLocaleString()}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={drawLoading || animating}
          className="btn-ghost text-xs py-1.5 px-3"
        >
          {drawLoading || animating ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {!draw ? (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🎲</p>
          <p className="text-sm text-sage-400">No draw has been run yet.</p>
          <p className="text-xs text-sage-300 mt-1">
            Go to Admin panel and click Run Draw first.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-xs text-sage-400 mb-3 uppercase tracking-wide font-semibold">
            Draw Numbers
          </p>
          <div className="flex flex-wrap gap-3 mb-5">
            {draw.numbers.map((n) => {
              const hit = userScoreValues.has(Number(n))
              return (
                <div
                  key={n}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-display text-xl font-medium transition-all duration-300 ${hit ? 'bg-sage-700 text-white ring-2 ring-sage-400 ring-offset-2 scale-110' : 'bg-sage-50 text-sage-500 border border-sage-200'}`}
                >
                  {n}
                </div>
              )
            })}
          </div>

          {scores.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-sage-400 mb-2 uppercase tracking-wide font-semibold">
                Your Scores
              </p>
              <div className="flex flex-wrap gap-2">
                {scores.map((s) => {
                  const matched = draw.numbers.map(Number).includes(Number(s.score))
                  return (
                    <span
                      key={s.id}
                      className={`badge px-3 py-1 text-sm font-medium ${matched ? 'bg-sage-700 text-white' : 'bg-sage-50 text-sage-600'}`}
                    >
                      {s.score}{matched ? ' ✓' : ''}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {scores.length === 0 ? (
            <p className="text-xs text-sage-400 bg-sage-50 rounded-lg px-3 py-2">
              Add scores above to see how you match up with the draw.
            </p>
          ) : (
            <div className={`rounded-xl border px-4 py-3 ${resultColor}`}>
              <p className="text-base font-semibold">{resultLabel}</p>
              {matchCount >= 1 && (
                <p className="text-xs mt-1 opacity-70">
                  Matched numbers: {matches.join(', ')}
                </p>
              )}
              {matchCount === 0 && (
                <p className="text-xs mt-1 opacity-70">
                  None of your scores matched. Try again next time!
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}