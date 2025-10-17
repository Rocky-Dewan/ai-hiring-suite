import { Router } from 'express'
import * as airtableSvc from '../services/airtable'
const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const jobs = await airtableSvc.listJobs()
    res.json({ jobs })
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const j = await airtableSvc.getJobById(req.params.id)
    if (!j) return res.status(404).json({ error: 'job not found' })
    res.json({ job: j })
  } catch (e) {
    next(e)
  }
})

export default router
