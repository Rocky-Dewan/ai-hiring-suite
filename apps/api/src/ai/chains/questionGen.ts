import { OpenAI } from 'openai'
import logger from '../../services/logger'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateInterviewQuestions(jobDesc: string, skills: string[]) {
  try {
    const prompt = `
      Generate 5-10 interview questions based on the job description:
      ${jobDesc}
      Required skills: ${skills.join(', ')}
      Return as a JSON array: ["Q1", "Q2", ...]
    `
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    })
    const content = response.choices[0]?.message?.content
    return JSON.parse(content)
  } catch (err) {
    logger.error({ msg: 'questionGen failed', err })
    throw err
  }
}
