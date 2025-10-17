import { Router } from 'express'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })

import * as parseSvc from '../services/parseResume'
import * as storageSvc from '../services/storage'
import * as airtableSvc from '../services/airtable'
import * as matchingSvc from '../services/matching'

const router = Router()

// Upload a resume: form-data { name, email, file }
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    const { name, email, applicantId } = req.body
    if (!file) return res.status(400).json({ error: 'file required' })

    // 1. store resume file
    const storedUrl = await storageSvc.putBuffer(file.buffer, file.mimetype, `resumes`)

    // 2. parse resume text
    const parsed = await parseSvc.parseResumeBuffer(file.buffer, file.originalname)

    // 3. create applicant record in Airtable
    const applicant = await airtableSvc.createApplicant({
      name,
      email,
      resume_url: storedUrl,
      resume_text: parsed.text,
      external_id: applicantId
    })

    // 4. match candidate to jobs
    const matches = await matchingSvc.matchResumeToJobs(parsed.text)

    // 5. optionally update Airtable with matches
    await airtableSvc.updateApplicantMatches(applicant.id, matches)

    res.json({ applicant, matches })
  } catch (err) {
    next(err)
  }
})

// Get applicant status directly from Airtable
router.get('/:id/status', async (req, res, next) => {
  try {
    const id = req.params.id

    // 1. fetch applicant from Airtable
    const applicant = await airtableSvc.findApplicantById(id)
    if (!applicant) return res.status(404).json({ error: 'not found' })

    // 2. fetch matches stored in Airtable
    const matches = applicant.matches || []

    res.json({
      status: applicant.status || 'Pending',
      matches,
      notes: applicant.notes || null
    })
  } catch (err) {
    next(err)
  }
})

export default router
