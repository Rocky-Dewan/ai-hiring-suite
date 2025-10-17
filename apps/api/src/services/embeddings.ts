import cohere from 'cohere-ai'
import logger from './logger'

const COHERE_KEY = process.env.COHERE_API_KEY || ''
cohere.init(COHERE_KEY)

export async function embed(texts: string[]): Promise<number[][]> {
  if (!COHERE_KEY) throw new Error('COHERE_API_KEY not set')
  try {
    // model name may change; keep embed-english-v2 or v3 per cohere docs
    const res = await cohere.embed({ model: 'embed-english-v2.0', texts })
    return res.body.embeddings as number[][]
  } catch (e) {
    logger.error({ msg: 'cohere embed failed', err: e })
    throw e
  }
}
