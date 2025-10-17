import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Lightweight hash router to avoid extra deps
function useHashRoute() {
  const [hash, setHash] = React.useState(window.location.hash || '#/')
  React.useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return hash
}

import ApplicantUpload from './pages/ApplicantUpload'
import InterviewRoom from './pages/InterviewRoom'
import ApplicantStatus from './pages/ApplicantStatus'
import AdminDashboard from './pages/AdminDashboard'
import AdminCalendar from './pages/AdminCalendar'

function App() {
  const hash = useHashRoute()

  function renderRoute() {
    if (hash.startsWith('#/upload')) return <ApplicantUpload />
    if (hash.startsWith('#/interview')) return <InterviewRoom />
    if (hash.startsWith('#/status')) return <ApplicantStatus />
    if (hash.startsWith('#/admin/dashboard')) return <AdminDashboard />
    if (hash.startsWith('#/admin/calendar')) return <AdminCalendar />
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">AI Hiring Suite</h1>
        <p className="text-gray-700">
          Choose an action below. This is a lightweight demo router using URL hashes.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <NavCard href="#/upload" title="Apply (Upload Resume)" />
          <NavCard href="#/interview" title="Interview Room" />
          <NavCard href="#/status" title="Check Application Status" />
          <NavCard href="#/admin/dashboard" title="Admin Dashboard" />
          <NavCard href="#/admin/calendar" title="Admin Calendar" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {renderRoute()}
      <footer className="mt-16 text-xs text-gray-500">
        API base: <code className="bg-gray-50 px-1 rounded">{import.meta.env.VITE_API_URL || 'http://localhost:4000'}</code>
      </footer>
    </div>
  )
}

function NavCard({ href, title }: { href: string; title: string }) {
  return (
    <a href={href} className="border rounded p-4 hover:bg-gray-50 transition block">
      <div className="font-medium">{title}</div>
    </a>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
