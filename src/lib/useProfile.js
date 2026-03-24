import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

export function useProfile(userId) {
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) setError(error.message)
    else setProfile(data)

    setLoading(false)
  }, [userId])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const updateProfile = useCallback(async (updates) => {
    if (!userId) return { message: 'Not authenticated' }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })

    if (!error) await fetchProfile()
    return error
  }, [userId, fetchProfile])

  return { profile, loading, error, updateProfile, refetch: fetchProfile }
}