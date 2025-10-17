import React, { useState } from 'react'
import dayjs from 'dayjs'

type Props = {
  onPick: (startISO: string, endISO: string) => void
}

export default function CalendarWidget({ onPick }: Props) {
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [startTime, setStartTime] = useState<string>('10:00')
  const [endTime, setEndTime] = useState<string>('11:00')

  function apply() {
    const startISO = dayjs(`${date}T${startTime}`).toISOString()
    const endISO = dayjs(`${date}T${endTime}`).toISOString()
    onPick(startISO, endISO)
  }

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="font-medium">Pick a slot</div>
      <div className="grid grid-cols-3 gap-3">
        <input
          type="date"
          className="border rounded p-2"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          type="time"
          className="border rounded p-2"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
        />
        <input
          type="time"
          className="border rounded p-2"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
        />
      </div>
      <button onClick={apply} className="bg-black text-white px-4 py-2 rounded">Apply</button>
    </div>
  )
}
