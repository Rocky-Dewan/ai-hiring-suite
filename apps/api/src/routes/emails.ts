import { Router } from 'express'
import * as mailer from '../services/mailer'
import * as airtableSvc from '../services/airtable'

const router = Router()

router.post('/invite', async (req, res, next) => {
  try {
    const { applicantId, subject, body } = req.body
    if (!applicantId || !subject || !body) return res.status(400).json({ error: 'missing fields' })
    const applicant = await airtableSvc.findApplicantById(applicantId)
    if (!applicant) return res.status(404).json({ error: 'applicant not found' })
    await mailer.sendMail({ to: applicant.email, subject, html: body })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

router.post('/reject', async (req, res, next) => {
  try {
    const { applicantId, reason } = req.body
    if (!applicantId) return res.status(400).json({ error: 'missing applicantId' })
    const applicant = await airtableSvc.findApplicantById(applicantId)
    if (!applicant) return res.status(404).json({ error: 'applicant not found' })
    const subject = 'Update on your application'
    const body = `<p>Hi ${applicant.name},</p><p>Thank you for applying. After careful review we will not be moving forward — ${reason || ''}</p>`
    await mailer.sendMail({ to: applicant.email, subject, html: body })
    await airtableSvc.updateApplicant(applicantId, { status: 'rejected', notes: reason || '' })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
