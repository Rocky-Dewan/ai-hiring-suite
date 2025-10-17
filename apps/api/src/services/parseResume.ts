import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import { Readable } from 'stream'
import logger from './logger'

export async function parseResumeBuffer(buffer: Buffer, filename = 'resume') {
  const lower = filename.toLowerCase()
  try {
    if (lower.endsWith('.pdf')) {
      const data = await pdf(buffer)
      const text = (data && data.text) ? data.text : ''
      return { text, raw: buffer }
    } else if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
      const result = await mammoth.extractRawText({ buffer })
      return { text: result.value || '', raw: buffer }
    } else {
      // attempt text decode
      const txt = buffer.toString('utf8')
      return { text: txt, raw: buffer }
    }
  } catch (e) {
    logger.error({ msg: 'parseResume error', err: e })
    // fallback: return a short stub
    const stub = `Could not parse ${filename}. Size: ${buffer.length}`
    return { text: stub, raw: buffer }
  }
}
