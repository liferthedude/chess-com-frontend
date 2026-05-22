'use client'

import { useEffect, useState } from 'react'

function timeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function LastParsedAt() {
  const [lastParsedAt, setLastParsedAt] = useState<string | null>(null)
  const [display, setDisplay] = useState<string>('')

  useEffect(() => {
    fetch('/api/stats/last-parsed')
      .then(r => r.json())
      .then(data => setLastParsedAt(data.last_parsed_at))
  }, [])

  useEffect(() => {
    if (!lastParsedAt) return
    setDisplay(timeAgo(lastParsedAt))
    const interval = setInterval(() => setDisplay(timeAgo(lastParsedAt)), 30_000)
    return () => clearInterval(interval)
  }, [lastParsedAt])

  if (!lastParsedAt) return null

  const isStale = Date.now() - new Date(lastParsedAt).getTime() > 86_400_000
  const color = isStale ? '#f87171' : '#4ade80'
  const dotColor = isStale ? 'rgba(248,113,113,0.5)' : 'rgba(74,222,128,0.5)'

  return (
    <div className="flex items-center gap-1.5 text-sm" style={{ color }}>
      <span
        style={{
          width: 6, height: 6, borderRadius: '50%',
          background: color,
          boxShadow: `0 0 6px ${dotColor}`,
          flexShrink: 0,
        }}
      />
      last parsed: {display}
    </div>
  )
}
