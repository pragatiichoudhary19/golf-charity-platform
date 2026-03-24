import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-8xl font-light text-sage-200 select-none">404</p>
      <h1 className="font-display text-2xl font-light text-charcoal mt-2 mb-1">Page not found</h1>
      <p className="text-sm text-sage-400 mb-8">
        That shot went wide — the page you're looking for doesn't exist.
      </p>
      <Link to="/dashboard" className="btn-primary">
        Back to dashboard
      </Link>
    </div>
  )
}