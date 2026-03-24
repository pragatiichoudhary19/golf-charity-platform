import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

const MAX_SCORES = 5

export function useScores(userId) {
  const [scores, setScores]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchScores = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(MAX_SCORES)

    if (error) setError(error.message)
    else setScores(data ?? [])

    setLoading(false)
  }, [userId])

  useEffect(() => { fetchScores() }, [fetchScores])

  const addScore = useCallback(async (score, date) => {
    if (!userId) return { message: 'Not authenticated' }

    const { data: current, error: fetchErr } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (fetchErr) return fetchErr

    if (current && current.length >= MAX_SCORES) {
      const { error: deleteErr } = await supabase
        .from('scores')
        .delete()
        .eq('id', current[0].id)
      if (deleteErr) return deleteErr
    }

    const { error: insertErr } = await supabase.from('scores').insert({
      user_id:    userId,
      score:      Number(score),
      created_at: date ? new Date(date).toISOString() : new Date().toISOString(),
    })

    if (insertErr) return insertErr

    await fetchScores()
    return null
  }, [userId, fetchScores])

  const deleteScore = useCallback(async (scoreId) => {
    const { error } = await supabase.from('scores').delete().eq('id', scoreId)
    if (!error) await fetchScores()
    return error
  }, [fetchScores])

  return { scores, loading, error, addScore, deleteScore, refetch: fetchScores }
}