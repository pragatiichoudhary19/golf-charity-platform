import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

export function useDraw() {
  const [latestDraw, setLatestDraw] = useState(null)
  const [loading, setLoading]       = useState(true)

  const fetchLatestDraw = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    setLatestDraw(data ?? null)
    setLoading(false)
  }, [])

  useEffect(() => { fetchLatestDraw() }, [fetchLatestDraw])

  return { latestDraw, loading, refetch: fetchLatestDraw }
}