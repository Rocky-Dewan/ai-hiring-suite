import fetch from 'node-fetch'
import logger from './logger'

const JUDGE0_URL = process.env.JUDGE0_BASE_URL || 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || ''

export async function submitCode({ source_code, language_id }: { source_code: string; language_id: number }) {
  const url = `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (JUDGE0_KEY) headers['X-RapidAPI-Key'] = JUDGE0_KEY
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ source_code, language_id })
    })
    const data = await resp.json()
    if (!resp.ok) {
      logger.error({ msg: 'judge0 submit failed', status: resp.status, body: data })
      throw new Error(data?.message || 'judge0 submission failed')
    }
    return data
  } catch (e) {
    logger.error({ msg: 'judge0 error', err: e })
    throw e
  }
}
