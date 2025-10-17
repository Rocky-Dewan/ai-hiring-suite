import React from 'react'

export default function BotBubble({ text, loading }: { text: string; loading?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">🤖</div>
      <div className="bg-gray-100 rounded-2xl px-4 py-2">
        <div className="whitespace-pre-wrap">{text}</div>
        {loading && <div className="text-xs text-gray-500 mt-1">Speaking…</div>}
      </div>
    </div>
  )
}
