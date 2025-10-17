import { OpenAI } from 'openai'
import logger from '../../services/logger'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function draftEmail(candidateName: string, type: 'interview' | 'rejection' | 'offer', jobTitle: string) {
  try {
    const prompt = `Draft a polite and professional ${type} email to ${candidateName} for the position of ${jobTitle}.`
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    })
    return response.choices[0]?.message?.content || ''
  } catch (err) {
    logger.error({ msg: 'emailDrafts failed', err })
    throw err
  }
}
