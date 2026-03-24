import { useState, useCallback } from 'react'

let _id = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = ++_id
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  return { toasts, showToast }
}

export function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-up flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-lg text-sm font-medium
            ${t.type === 'error'
              ? 'bg-red-600 text-white'
              : t.type === 'warning'
              ? 'bg-amber-500 text-white'
              : 'bg-sage-700 text-white'
            }`}
        >
          <span>{t.type === 'error' ? '✕' : '✓'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}