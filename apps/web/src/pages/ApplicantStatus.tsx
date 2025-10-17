import React, { useEffect, useState } from 'react'
import { apiBase } from '../lib/api'
import ScoreBadge from '../components/ScoreBadge'

type StatusResp = {
  status: 'applied' | 'screened' | 'interview' | 'offer' | 'rejected'
  matches?: { jobId: string; title: string; score: number }[]
  notes?: string
}

export default function ApplicantStatus() {
  const [applicantId, setApplicantId] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<StatusResp | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('applicantId') || ''
    setApplicantId(id)
  }, [])

  async function fetchStatus() {
    if (!applicantId) return setError('Missing applicantId.')
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/applicants/${applicantId}/status`)
      if (!res.ok) throw new Error('Failed to fetch status')
      const json = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantId])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Application Status</h2>
      {!applicantId && <p className="text-red-600">Missing applicantId in URL (?applicantId=...)</p>}
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {data && (
        <>
          <div className="text-lg">
            Current Status:{' '}
            <span className="font-semibold capitalize">{data.status}</span>
          </div>
          {data.notes && (
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{data.notes}</div>
          )}
          {data.matches && data.matches.length > 0 && (
            <div>
              <h3 className="font-medium mt-4 mb-2">Top Matches</h3>
              <ul className="divide-y border rounded">
                {data.matches.map((m, i) => (
                  <li key={i} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{m.title}</div>
                      <div className="text-sm text-gray-600">Job ID: {m.jobId}</div>
                    </div>
                    <ScoreBadge score={m.score} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
