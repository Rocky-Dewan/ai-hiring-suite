import React, { useEffect, useRef, useState } from 'react'

type Props = {
  onAudioReady: (blob: Blob) => void
}

export default function VideoRecorder({ onAudioReady }: Props) {
  const [recording, setRecording] = useState(false)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach(t => t.stop())
      mediaRecorderRef.current?.stop()
    }
  }, [])

  const start = async () => {
    setPermissionError(null)
    try {
      // audio-only to reduce size; browsers still allow video MIME in filename later
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onAudioReady(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mediaRecorderRef.current = mr
      mr.start()
      setRecording(true)
    } catch (e: any) {
      setPermissionError(e.message || 'Microphone permission denied')
    }
  }

  const stop = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="font-medium">Answer Recorder</div>
      <div className="text-sm text-gray-600">Use your mic to record an answer, then press Stop to upload.</div>
      <div className="flex items-center gap-3">
        {!recording ? (
          <button onClick={start} className="bg-black text-white px-4 py-2 rounded">Start</button>
        ) : (
          <button onClick={stop} className="bg-red-600 text-white px-4 py-2 rounded">Stop</button>
        )}
        <span className={`text-sm ${recording ? 'text-green-700' : 'text-gray-500'}`}>
          {recording ? 'Recording…' : 'Idle'}
        </span>
      </div>
      {permissionError && <p className="text-red-600 text-sm">{permissionError}</p>}
    </div>
  )
}
