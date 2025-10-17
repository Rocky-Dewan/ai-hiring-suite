import { OpenAI } from 'openai'
import logger from '../../services/logger'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function extractProfile(resumeText: string) {
  try {
    const prompt = `
      Extract a structured profile from the following resume text in JSON:
      ${resumeText}
      Format:
      {
        "name": "",
        "email": "",
        "phone": "",
        "skills": [],
        "experience": [],
        "education": []
      }
    `
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0
    })
    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')
    const profile = JSON.parse(content)
    return profile
  } catch (err) {
    logger.error({ msg: 'extractProfile failed', err })
    throw err
  }
}
