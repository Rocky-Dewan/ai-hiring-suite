export function createICS(args: {
  eventId?: string
  title: string
  description?: string
  start: string
  end: string
  location?: string
  attendees?: string[]
  method?: 'REQUEST' | 'CANCEL' | 'REPLY'
}) {
  function dtstamp(iso: string) {
    return iso.replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')
  }
  const uid = args.eventId || `evt-${Date.now()}`
  const now = dtstamp(new Date().toISOString())
  const dtStart = dtstamp(args.start)
  const dtEnd = dtstamp(args.end)
  const attendees = (args.attendees || []).map(a => `ATTENDEE;CN=${a}:MAILTO:${a}`).join('\r\n')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ai-hiring-suite//EN',
    `METHOD:${args.method || 'REQUEST'}`,
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${(args.title || '')}`,
    `DESCRIPTION:${(args.description || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${args.location || ''}`,
    attendees,
    'END:VEVENT',
    'END:VCALENDAR'
  ]
  return lines.join('\r\n')
}
