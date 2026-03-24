import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

export function useCharities(userId) {
  const [charities, setCharities]             = useState([])
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [loading, setLoading]                 = useState(true)

  const fetchCharities = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const { data: list } = await supabase
      .from('charities')
      .select('*')
      .order('name')
    if (list) setCharities(list)

    const { data: pick } = await supabase
      .from('user_charity')
      .select('charity_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (pick) setSelectedCharity(pick.charity_id)

    setLoading(false)
  }, [userId])

  useEffect(() => { fetchCharities() }, [fetchCharities])

  const selectCharity = useCallback(async (charityId) => {
    const { error } = await supabase
      .from('user_charity')
      .upsert({ user_id: userId, charity_id: charityId }, { onConflict: 'user_id' })

    if (!error) setSelectedCharity(charityId)
    return error
  }, [userId])

  return { charities, selectedCharity, loading, selectCharity }
}