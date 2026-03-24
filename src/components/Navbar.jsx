import { Link } from 'react-router-dom'

export default function Navbar({ user, onSignOut, adminMode = false }) {
  return (
    <nav className="bg-white border-b border-sage-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <BrandMark />
          <span className="font-display text-lg font-light text-charcoal hidden sm:block">
            Fairway Gives
          </span>
          {adminMode && (
            <span className="badge bg-amber-100 text-amber-700 ml-1">Admin</span>
          )}
        </Link>

        <div className="flex items-center gap-3">
          {!adminMode && (
            <>
              <Link to="/profile" className="text-xs text-sage-400 hover:text-sage-600 transition-colors">
                Profile
              </Link>
              <Link to="/admin" className="text-xs text-sage-400 hover:text-sage-600 transition-colors">
                Admin
              </Link>
            </>
          )}
          <span className="text-xs text-sage-400 truncate max-w-[140px] hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={onSignOut}
            className="text-xs text-sage-600 border border-sage-200 rounded-lg px-3 py-1.5 hover:bg-sage-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

function BrandMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#2b502e" />
      <path d="M14 7v14M10 18c0 0 2-2 4-2s4 2 4 2" stroke="#FAF8F3" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="14" cy="10" r="1.5" fill="#FAF8F3"/>
    </svg>
  )
}