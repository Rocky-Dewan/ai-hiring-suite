import { OpenAI } from 'openai'
import logger from '../../services/logger'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function expandJobDescription(jdText: string) {
  try {
    const prompt = `Expand the following job description into detailed responsibilities, skills, and requirements:\n${jdText}`
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2
    })
    return response.choices[0]?.message?.content || ''
  } catch (err) {
    logger.error({ msg: 'jdExpand failed', err })
    throw err
  }
}
