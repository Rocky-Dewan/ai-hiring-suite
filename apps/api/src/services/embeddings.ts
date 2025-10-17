import { createICS } from './ics'
import { sendMail } from './mailer'
import logger from './logger'

export async function sendCalendarInvite(evt: {
  eventId?: string
  title: string
  description?: string
  start: string
  end: string
  location?: string
  attendees?: string[]
  timezone?: string
}) {
  const ics = createICS({ ...evt, method: 'REQUEST' })
  const to = evt.attendees || []
  const subject = `Invite: ${evt.title}`
  const html = `<p>You're invited: <strong>${evt.title}</strong></p><p>${evt.description || ''}</p>`
  try {
    await sendMail({ to, subject, html, text: `${evt.title}\n\n${evt.description || ''}` })
    logger.info({ msg: 'calendar invite sent', title: evt.title, to })
    // note: some mail clients want the ICS attached - nodemailer can attach as alternative if desired
    return true
  } catch (e) {
    logger.error({ msg: 'calendar invite failed', err: e })
    throw e
  }
}

export async function sendCalendarUpdate(evt: { eventId?: string; title: string; start: string; end: string; attendees?: string[]; reason?: string }) {
  const ics = createICS({ ...evt, method: 'REQUEST' })
  const subject = `Updated: ${evt.title}`
  await sendMail({ to: evt.attendees || [], subject, html: `<p>Updated: ${evt.title}</p><p>Reason: ${evt.reason || ''}</p>` })
  logger.info({ msg: 'calendar update sent', eventId: evt.eventId })
}

export async function sendCalendarCancel(evt: { eventId?: string; title: string; start?: string; end?: string; attendees?: string[]; reason?: string }) {
  const ics = createICS({ ...evt, method: 'CANCEL' })
  const subject = `Cancelled: ${evt.title}`
  await sendMail({ to: evt.attendees || [], subject, html: `<p>Cancelled: ${evt.title}</p><p>Reason: ${evt.reason || ''}</p>` })
  logger.info({ msg: 'calendar cancel sent', eventId: evt.eventId })
}
