export default function Skeleton({ className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-sage-100 overflow-hidden ${className}`}>
      <div className="animate-pulse p-6 space-y-4">
        <div className="h-4 bg-sage-100 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-3 bg-sage-50 rounded w-full" />
          <div className="h-3 bg-sage-50 rounded w-5/6" />
          <div className="h-3 bg-sage-50 rounded w-4/6" />
        </div>
        <div className="h-9 bg-sage-50 rounded-lg w-1/2 mt-4" />
      </div>
    </div>
  )
}