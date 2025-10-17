import React, { useEffect, useState } from 'react'
import CalendarWidget from '../components/CalendarWidget'
import { apiBase } from '../lib/api'

type EventReq = {
  applicantId: string
  applicantEmail: string
  recruiterEmail: string
  title: string
  start: string
  end: string
  location?: string
  description?: string
  timezone?: string
  reason?: string
}

export default function AdminCalendar() {
  const [form, setForm] = useState<EventReq>({
    applicantId: '',
    applicantEmail: '',
    recruiterEmail: 'recruiter@company.com',
    title: 'Interview',
    start: '',
    end: '',
    location: 'Google Meet',
    description: 'Round 1 interview',
    timezone: 'Asia/Dhaka',
    reason: ''
  })
  const [result, setResult] = useState<any>(null)
  const [mode, setMode] = useState<'schedule' | 'reschedule' | 'cancel'>('schedule')

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('applicantId') || ''
    setForm(f => ({ ...f, applicantId: id }))
  }, [])

  function onPick(startISO: string, endISO: string) {
    setForm(f => ({ ...f, start: startISO, end: endISO }))
  }

  async function call(path: string, body: any) {
    const res = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(`Request failed ${res.status}`)
    return res.json()
  }

  async function submit() {
    const base = { ...form }
    try {
      if (mode === 'schedule') setResult(await call('/api/calendar/schedule', base))
      if (mode === 'reschedule') setResult(await call('/api/calendar/reschedule', base))
      if (mode === 'cancel') setResult(await call('/api/calendar/cancel', base))
    } catch (e) {
      alert('Calendar request failed')
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Interview Calendar</h2>

      <div className="flex gap-3">
        <button
          onClick={() => setMode('schedule')}
          className={`px-3 py-1 rounded border ${mode === 'schedule' ? 'bg-black text-white' : ''}`}
        >Schedule</button>
        <button
          onClick={() => setMode('reschedule')}
          className={`px-3 py-1 rounded border ${mode === 'reschedule' ? 'bg-black text-white' : ''}`}
        >Reschedule</button>
        <button
          onClick={() => setMode('cancel')}
          className={`px-3 py-1 rounded border ${mode === 'cancel' ? 'bg-black text-white' : ''}`}
        >Cancel</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <input
            className="border rounded p-2 w-full"
            placeholder="Applicant ID"
            value={form.applicantId}
            onChange={e => setForm(f => ({ ...f, applicantId: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="border rounded p-2"
              placeholder="Applicant Email"
              value={form.applicantEmail}
              onChange={e => setForm(f => ({ ...f, applicantEmail: e.target.value }))}
            />
            <input
              className="border rounded p-2"
              placeholder="Recruiter Email"
              value={form.recruiterEmail}
              onChange={e => setForm(f => ({ ...f, recruiterEmail: e.target.value }))}
            />
          </div>
          <input
            className="border rounded p-2 w-full"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <input
            className="border rounded p-2 w-full"
            placeholder="Location"
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
          />
          <textarea
            className="border rounded p-2 w-full"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <input
            className="border rounded p-2 w-full"
            placeholder="Timezone (e.g., Asia/Dhaka)"
            value={form.timezone}
            onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
          />
          <input
            className="border rounded p-2 w-full"
            placeholder="Reason (required for reschedule/cancel)"
            value={form.reason}
            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
          />
          <button onClick={submit} className="bg-black text-white rounded px-4 py-2">
            {mode === 'schedule' ? 'Schedule' : mode === 'reschedule' ? 'Reschedule' : 'Cancel'}
          </button>
        </div>

        <div>
          <CalendarWidget onPick={onPick} />
          <div className="text-sm text-gray-600 mt-2">
            Start: <code className="bg-gray-50 px-2 py-0.5 rounded">{form.start || '—'}</code><br />
            End: <code className="bg-gray-50 px-2 py-0.5 rounded">{form.end || '—'}</code>
          </div>
        </div>
      </div>

      {result && (
        <div className="border rounded p-3 bg-gray-50">
          <div className="font-medium mb-1">Server Response</div>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
