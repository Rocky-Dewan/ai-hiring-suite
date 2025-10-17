import Airtable from 'airtable'
import { upsertVector } from '../apps/api/src/services/vector'
import logger from '../apps/api/src/services/logger'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID || '')

async function seedJobs() {
  try {
    const jobs: any[] = []
    await base('Jobs').select().eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        jobs.push({
          id: record.id,
          title: record.get('Title'),
          description: record.get('Description'),
          requirements: record.get('Requirements')?.split(',') || [],
          skills: record.get('Skills')?.split(',') || []
        })
      })
      fetchNextPage()
    })

    for (const job of jobs) {
      await upsertVector({ id: job.id, type: 'job', embedding: [], metadata: job })
    }
    logger.info(`Seeded ${jobs.length} jobs`)
  } catch (err) {
    logger.error({ msg: 'seedJobs failed', err })
  }
}

seedJobs()
