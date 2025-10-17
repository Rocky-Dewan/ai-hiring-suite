import { Router } from 'express'
import * as judge0 from '../services/judge0'
import * as airtableSvc from '../services/airtable'

const router = Router()

// Create an assessment record (simple)
router.post('/create', async (req, res, next) => {
  try {
    const { applicantId, taskId, language, source } = req.body
    if (!applicantId || !taskId || !language || !source) return res.status(400).json({ error: 'missing fields' })
    const record = await airtableSvc.createAssessment({ applicantId, taskId, language, source, status: 'pending' })
    res.json({ assessment: record })
  } catch (e) {
    next(e)
  }
})

// Submit code to Judge0 and return result
router.post('/submit', async (req, res, next) => {
  try {
    const { submissionId, source, language_id } = req.body
    if (!source || !language_id) return res.status(400).json({ error: 'missing' })
    const result = await judge0.submitCode({ source_code: source, language_id })
    // optionally update Airtable assessment record by submissionId
    res.json({ result })
  } catch (e) {
    next(e)
  }
})

export default router
