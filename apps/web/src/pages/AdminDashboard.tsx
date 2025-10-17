import React, { useEffect, useState } from 'react'
import { apiBase } from '../lib/api'

type Summary = {
  totals: {
    applicants: number
    interviews: number
    offers: number
    rejected: number
  }
  fairness?: {
    male_vs_female_selection_rate?: number
    min_vs_maj_selection_rate?: number
  }
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/api/admin/summary`)
      if (!res.ok) throw new Error('Failed to load')
      const json = await res.json()
      setSummary(json)
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashCard title="Applicants" value={summary.totals.applicants} />
            <DashCard title="Interviews" value={summary.totals.interviews} />
            <DashCard title="Offers" value={summary.totals.offers} />
            <DashCard title="Rejected" value={summary.totals.rejected} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium mt-4">Fairness (Placeholder)</h3>
            <p className="text-sm text-gray-700">
              Female vs Male Selection Rate: {summary.fairness?.male_vs_female_selection_rate ?? 'n/a'}
            </p>
            <p className="text-sm text-gray-700">
              Minority vs Majority Selection Rate: {summary.fairness?.min_vs_maj_selection_rate ?? 'n/a'}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function DashCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="border rounded p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
