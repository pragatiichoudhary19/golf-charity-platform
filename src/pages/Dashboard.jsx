import { useNavigate } from 'react-router-dom'
import { supabase }    from '../lib/supabase'
import { useAuth }     from '../App'
import { useScores }    from '../lib/useScores'
import { useCharities } from '../lib/useCharities'
import { useDraw }      from '../lib/useDraw'

import Navbar         from '../components/Navbar'
import ScoreSection   from '../components/ScoreSection'
import CharitySection from '../components/CharitySection'
import DrawSection    from '../components/DrawSection'
import Skeleton       from '../components/Skeleton'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { scores, loading: scoresLoading, addScore, deleteScore } = useScores(user?.id)
  const { charities, selectedCharity, loading: charLoading, selectCharity } = useCharities(user?.id)
  const { latestDraw, loading: drawLoading, refetch: refetchDraw } = useDraw()

  const loading = scoresLoading || charLoading

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} onSignOut={handleSignOut} />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-light text-charcoal">
              Good to see you<span className="text-sage-400">,</span>
            </h1>
            <p className="text-sm text-sage-500 mt-0.5 truncate max-w-xs">{user?.email}</p>
          </div>
          <span className="badge bg-sage-100 text-sage-700 px-3 py-1.5">
            ✦ Active member
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-80" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ScoreSection
                scores={scores}
                onAddScore={addScore}
                onDeleteScore={deleteScore}
              />
              <DrawSection
                scores={scores}
                draw={latestDraw}
                drawLoading={drawLoading}
                onRefresh={refetchDraw}
              />
            </div>
            <div>
              <CharitySection
                charities={charities}
                selected={selectedCharity}
                onSelect={selectCharity}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}