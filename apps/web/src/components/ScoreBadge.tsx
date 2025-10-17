import React from 'react'

export default function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const color =
    pct >= 80 ? 'bg-green-600' :
      pct >= 60 ? 'bg-yellow-500' :
        pct >= 40 ? 'bg-orange-500' :
          'bg-gray-500'
  return (
    <div className={`text-white text-sm px-3 py-1 rounded-full ${color}`}>{pct}%</div>
  )
}
