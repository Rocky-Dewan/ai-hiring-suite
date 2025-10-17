import { Router } from 'express'
import * as calendarMailer from '../services/calendarMailer'
import * as airtableSvc from '../services/airtable'

const router = Router()

router.post('/schedule', async (req, res, next) => {
  try {
    const payload = req.body // applicantId, applicantEmail, recruiterEmail, title, start, end, timezone, location, description
    if (!payload.applicantEmail || !payload.recruiterEmail || !payload.start || !payload.end) {
      return res.status(400).json({ error: 'missing fields' })
    }
    // store event in Airtable (calendar table)
    const record = await airtableSvc.createCalendarEvent(payload)
    // send ICS invite email
    await calendarMailer.sendCalendarInvite({ eventId: record.id, ...payload })
    res.json({ ok: true, event: record })
  } catch (e) {
    next(e)
  }
})

router.post('/reschedule', async (req, res, next) => {
  try {
    const { eventId, start, end, reason } = req.body
    if (!eventId || !start || !end || !reason) return res.status(400).json({ error: 'missing fields' })
    const updated = await airtableSvc.updateCalendarEvent(eventId, { start, end, reason, status: 'rescheduled' })
    await calendarMailer.sendCalendarUpdate({ eventId, title: updated.payload?.title || 'Interview', start, end, attendees: [updated.payload.applicantEmail, updated.payload.recruiterEmail], reason })
    res.json({ ok: true, event: updated })
  } catch (e) {
    next(e)
  }
})

router.post('/cancel', async (req, res, next) => {
  try {
    const { eventId, reason } = req.body
    if (!eventId || !reason) return res.status(400).json({ error: 'missing fields' })
    const rec = await airtableSvc.updateCalendarEvent(eventId, { status: 'cancelled', reason })
    await calendarMailer.sendCalendarCancel({ eventId, title: rec.payload?.title || 'Interview', attendees: [rec.payload?.applicantEmail, rec.payload?.recruiterEmail], reason })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
