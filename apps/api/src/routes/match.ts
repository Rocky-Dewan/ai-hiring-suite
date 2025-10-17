import { Router } from 'express'
import * as embedSvc from '../services/embeddings'
import * as vectorSvc from '../services/vector'
import * as rerankSvc from '../services/rerank'

const router = Router()

router.post('/preview', async (req, res, next) => {
  try {
    const { resumeText, topK = 10 } = req.body
    if (!resumeText) return res.status(400).json({ error: 'resumeText required' })
    const [qEmb] = await embedSvc.embed([resumeText])
    const sims = await vectorSvc.similaritySearch(qEmb, 'job', topK)
    res.json({ candidates: sims })
  } catch (e) {
    next(e)
  }
})

router.post('/rerank', async (req, res, next) => {
  try {
    const { resumeText, candidates } = req.body
    if (!resumeText || !Array.isArray(candidates)) return res.status(400).json({ error: 'invalid payload' })
    const ranked = await rerankSvc.rerank(resumeText, candidates)
    res.json({ ranked })
  } catch (e) {
    next(e)
  }
})

export default router
