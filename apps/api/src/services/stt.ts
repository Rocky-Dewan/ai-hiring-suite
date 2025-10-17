import fetch from 'node-fetch'
import FormData from 'form-data'
import logger from './logger'

const OPENAI_KEY = process.env.OPENAI_API_KEY || ''

export async function transcribeWithWhisper(audioBuffer: Buffer, mimeType = 'audio/webm') {
  if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY not set')
  try {
    const form = new FormData()
    form.append('file', audioBuffer, { filename: 'audio.webm', contentType: mimeType })
    form.append('model', 'whisper-1')
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_KEY}` },
      body: form as any
    })
    const data = await res.json()
    if (!res.ok) {
      logger.error({ msg: 'whisper transcript failed', status: res.status, body: data })
      throw new Error(data.error?.message || 'transcription failed')
    }
    return data.text as string
  } catch (e) {
    logger.error({ msg: 'transcribeWithWhisper error', err: e })
    throw e
  }
}
