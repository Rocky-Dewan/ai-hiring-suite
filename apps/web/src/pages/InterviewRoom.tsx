import React, { useEffect, useRef, useState } from 'react'
import BotBubble from '../components/BotBubble'
import VideoRecorder from '../components/VideoRecorder'
import { apiBase } from '../lib/api'

type Q = { id: string; text: string }
type TranscriptResp = { audioUrl: string; transcript: string }

const QUESTIONS: Q[] = [
  { id: 'q1', text: 'Tell me about a challenging project you led.' },
  { id: 'q2', text: 'How do you handle tight deadlines and ambiguity?' },
  { id: 'q3', text: 'Describe a time you optimized performance significantly.' }
]

export default function InterviewRoom() {
  const [applicantId, setApplicantId] = useState('')
  const [index, setIndex] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [transcripts, setTranscripts] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const mediaBlobRef = useRef<Blob | null>(null)

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('applicantId') || ''
    setApplicantId(id)
  }, [])

  // Simple TTS using Web Speech API
  function speak(text: string) {
    if (!('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(text)
    setSpeaking(true)
    u.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }

  useEffect(() => {
    if (QUESTIONS[index]) speak(QUESTIONS[index].text)
  }, [index])

  async function handleUploadAudio(blob: Blob) {
    mediaBlobRef.current = blob
  }

  async function submitAnswer() {
    if (!mediaBlobRef.current) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('applicantId', applicantId)
      fd.append('file', new File([mediaBlobRef.current], `answer-${QUESTIONS[index].id}.webm`, { type: 'audio/webm' }))
      const res = await fetch(`${apiBase}/api/interview/upload-audio`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const json: TranscriptResp = await res.json()
      setTranscripts(prev => ({ ...prev, [QUESTIONS[index].id]: json.transcript }))
      if (index < QUESTIONS.length - 1) setIndex(index + 1)
      else setDone(true)
    } catch (e) {
      alert('Audio upload failed')
      console.error(e)
    } finally {
      setUploading(false)
      mediaBlobRef.current = null
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Interview Room</h2>
      {!applicantId && <p className="text-red-600">Missing applicantId in URL (?applicantId=...)</p>}

      <div className="space-y-3">
        <BotBubble text={QUESTIONS[index]?.text || 'All questions completed.'} loading={speaking} />
        <VideoRecorder onAudioReady={handleUploadAudio} />
        <button
          onClick={submitAnswer}
          disabled={uploading || !mediaBlobRef.current || done}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : done ? 'Finished' : 'Submit Answer'}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Transcripts</h3>
        <ul className="space-y-2">
          {QUESTIONS.map(q => (
            <li key={q.id} className="border rounded p-3">
              <div className="font-medium mb-1">{q.text}</div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {transcripts[q.id] || <em>Pending…</em>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
