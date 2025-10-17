import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import FileDropzone from '../components/FileDropzone'
import ScoreBadge from '../components/ScoreBadge'
import { apiBase } from '../lib/api'

type Match = { jobId: string; title: string; score: number }

export default function ApplicantUpload() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [applicantId, setApplicantId] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return setError('Please select a resume file.')
    setError(null)
    setUploading(true)
    const id = uuidv4()
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('email', email)
      fd.append('applicantId', id)
      fd.append('file', file)
      const res = await fetch(`${apiBase}/api/applicants/upload`, {
        method: 'POST',
        body: fd
      })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const json = await res.json()
      setApplicantId(json.applicant?.id || id)
      setMatches(json.matches || [])
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Apply for Open Roles</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border rounded p-2"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        <FileDropzone onFile={setFile} accept=".pdf,.doc,.docx,.txt" />

        <button
          disabled={uploading || !file}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Submit Application'}
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </form>

      {applicantId && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Applicant ID: <code className="bg-gray-50 px-2 py-0.5 rounded">{applicantId}</code>
          </div>
        </div>
      )}

      {matches?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Top Matches</h3>
          <ul className="divide-y border rounded">
            {matches.map((m, i) => (
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
    </div>
  )
}
