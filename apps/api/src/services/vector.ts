import { createClient } from '@supabase/supabase-js'
import logger from './logger'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

export async function upsertVector(id: string, type: 'job' | 'resume', embedding: number[], metadata: Record<string, any> = {}) {
  const table = process.env.SUPABASE_TABLE_VECTORS || 'vectors'
  const payload = { id, type, embedding, metadata }
  const { error } = await supabase.from(table).upsert(payload).select()
  if (error) {
    logger.error({ msg: 'upsertVector error', error })
    throw error
  }
  return true
}

export async function similaritySearch(queryEmbedding: number[], type = 'job', topK = 10) {
  // expects RPC function match_vectors implemented in database/schema.sql
  const rpcName = 'match_vectors' // ensure exists
  const { data, error } = await supabase.rpc(rpcName, { query_embedding: queryEmbedding, match_count: topK, match_type: type })
  if (error) {
    logger.error({ msg: 'similaritySearch RPC error', error })
    throw error
  }
  return data || []
}
