import cohere from 'cohere-ai'
import logger from './logger'

const COHERE_KEY = process.env.COHERE_API_KEY || ''
cohere.init(COHERE_KEY)

export async function rerank(query: string, candidates: Array<{ id?: string; text?: string }>) {
  if (!COHERE_KEY) throw new Error('COHERE_API_KEY not set')
  try {
    const docs = candidates.map(c => c.text || '')
    const res = await cohere.rerank({ query, documents: docs, top_n: Math.min(20, docs.length), model: 'rerank-english-v2.0' })
    const results = res.body.results.map((r: any) => ({ index: r.index, score: r.relevance_score }))
    // map back to candidates
    return results.map((r: any) => ({ ...candidates[r.index], score: r.score ?? r.relevance_score ?? r.score }))
  } catch (e) {
    logger.error({ msg: 'rerank error', err: e })
    throw e
  }
}
