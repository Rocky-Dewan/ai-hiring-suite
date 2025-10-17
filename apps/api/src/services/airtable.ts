import Airtable from 'airtable'
import { v4 as uuidv4 } from 'uuid'
import logger from './logger'

const API_KEY = process.env.AIRTABLE_API_KEY || ''
const BASE_ID = process.env.AIRTABLE_BASE_ID || ''
const JOBS_TABLE = process.env.AIRTABLE_TABLE_JOBS || 'Jobs'
const APPLICANTS_TABLE = process.env.AIRTABLE_TABLE_APPLICANTS || 'Applicants'
const CALENDAR_TABLE = process.env.AIRTABLE_TABLE_CALENDAR || 'Calendar'
const ASSESSMENTS_TABLE = process.env.AIRTABLE_TABLE_ASSESSMENTS || 'Assessments'

const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID)

export async function listJobs() {
  const out: any[] = []
  await base(JOBS_TABLE).select({ pageSize: 100 }).eachPage((records, next) => {
    records.forEach(r => out.push({ id: r.id, fields: r.fields }))
    next()
  })
  return out
}

export async function getJobById(id: string) {
  const rec = await base(JOBS_TABLE).find(id)
  return rec ? { id: rec.id, ...rec.fields } : null
}

export async function createApplicant(fields: Record<string, any>) {
  const payload = { ...fields }
  if (!payload.external_id) payload.external_id = uuidv4()
  const [r] = await base(APPLICANTS_TABLE).create([{ fields: payload }])
  logger.info({ msg: 'created applicant', id: r.id })
  return { id: r.id, ...r.fields }
}

export async function findApplicantById(id: string) {
  try {
    const rec = await base(APPLICANTS_TABLE).find(id)
    return { id: rec.id, ...rec.fields }
  } catch (e: any) {
    if (e?.statusCode === 404) return null
    throw e
  }
}

export async function updateApplicant(id: string, fields: Record<string, any>) {
  const [r] = await base(APPLICANTS_TABLE).update([{ id, fields }])
  logger.info({ msg: 'updated applicant', id })
  return { id: r.id, ...r.fields }
}

export async function createCalendarEvent(payload: Record<string, any>) {
  const [r] = await base(CALENDAR_TABLE).create([{ fields: payload }])
  logger.info({ msg: 'calendar event created', id: r.id })
  return { id: r.id, payload: r.fields }
}

export async function updateCalendarEvent(eventId: string, fields: Record<string, any>) {
  const [r] = await base(CALENDAR_TABLE).update([{ id: eventId, fields }])
  logger.info({ msg: 'calendar event updated', id: eventId })
  return { id: r.id, payload: r.fields }
}

export async function createAssessment(fields: Record<string, any>) {
  const [r] = await base(ASSESSMENTS_TABLE).create([{ fields }])
  logger.info({ msg: 'assessment created', id: r.id })
  return { id: r.id, ...r.fields }
}
