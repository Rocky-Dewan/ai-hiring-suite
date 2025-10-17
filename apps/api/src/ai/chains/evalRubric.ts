import { OpenAI } from 'openai'
import logger from '../../services/logger'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function evaluateAnswer(answer: string, rubric: string) {
  try {
    const prompt = `
      Evaluate the following candidate answer against the rubric:
      Answer: ${answer}
      Rubric: ${rubric}
      Return a JSON object: { "score": number, "feedback": string }
    `
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0
    })
    return JSON.parse(response.choices[0]?.message?.content || '{}')
  } catch (err) {
    logger.error({ msg: 'evalRubric failed', err })
    throw err
  }
}
