import { embed } from './embeddings'
import { rerank } from './rerank'
import * as airtableSvc from './airtable'
import logger from './logger'

/**
 * Evaluate a candidate's interview transcript.
 * Uses Cohere embeddings + rerank to compute a relevance or quality score.
 */
export async function evaluateTranscript(applicantId: string, transcript: string) {
  try {
    if (!transcript) throw new Error('Empty transcript')

    // Use the applicant's Airtable job or role info as a scoring prompt if available
    const applicant = await airtableSvc.getApplicant?.(applicantId)
    const prompt =
      applicant?.fields?.job_role ||
      applicant?.fields?.position ||
      'Evaluate this interview response for clarity, relevance, and confidence.'

    // Use rerank to score the transcript against the ideal prompt
    const reranked = await rerank(prompt, [{ id: applicantId, text: transcript }])
    const score = reranked[0]?.score || 0

    logger.info({ msg: 'Transcript evaluated', applicantId, score })
    return { score }
  } catch (err) {
    logger.error({ msg: 'evaluateTranscript failed', err })
    return { score: 0 }
  }
}
