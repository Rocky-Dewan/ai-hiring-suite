import { Router } from 'express'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })
import * as storageSvc from '../services/storage'
import * as sttSvc from '../services/stt'
import * as airtableSvc from '../services/airtable'
import * as scoringSvc from '../services/scoring'

const router = Router()

// Upload interview audio (applicantId form field + file)
router.post('/upload-audio', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    const { applicantId } = req.body
    if (!file || !applicantId) return res.status(400).json({ error: 'missing file or applicantId' })
    const url = await storageSvc.putBuffer(file.buffer, file.mimetype, `interviews/${applicantId}`)
    // transcribe with Whisper (service)
    const transcript = await sttSvc.transcribeWithWhisper(file.buffer, file.mimetype)
    // update applicant record with transcript
    await airtableSvc.updateApplicant(applicantId, { transcript_text: transcript, transcript_url: url })
    // optional: scoring pipeline (placeholder)
    const score = await scoringSvc.evaluateTranscript(applicantId, transcript)
    res.json({ audioUrl: url, transcript, score })
  } catch (e) {
    next(e)
  }
})

// finalize interview / mark status
router.post('/finalize', async (req, res, next) => {
  try {
    const { applicantId, verdict } = req.body
    if (!applicantId) return res.status(400).json({ error: 'missing applicantId' })
    await airtableSvc.updateApplicant(applicantId, { status: verdict || 'interviewed' })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
