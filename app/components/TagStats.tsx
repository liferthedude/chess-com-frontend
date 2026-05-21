'use client'

import { useEffect, useState } from 'react'

interface TagStat {
  tag: string
  total: number
  solved: number
}

export default function TagStats() {
  const [stats, setStats] = useState<TagStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
  }, [])

  if (loading) return null

  const maxTotal = Math.max(...stats.map(s => s.total), 1)

  return (
    <div
      className="mb-6"
      style={{
        background: 'linear-gradient(160deg, #130630 0%, #1c0a45 100%)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: 16,
        boxShadow: '0 8px 40px rgba(109, 40, 217, 0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
        padding: '20px 24px',
        width: '100%',
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#7c3aed' }}>
        Solved % by tag
      </div>
      <div className="flex flex-col gap-2">
        {stats.map(s => {
          const pct = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0
          const barWidth = Math.round((s.total / maxTotal) * 100)
          return (
            <div key={s.tag} className="flex items-center gap-3">
              {/* Tag name */}
              <div
                className="text-xs font-medium text-right shrink-0"
                style={{ width: 140, color: '#c4b5fd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={s.tag}
              >
                {s.tag}
              </div>

              {/* Bar track */}
              <div
                className="relative flex-1 rounded-full overflow-hidden"
                style={{ height: 8, background: 'rgba(109, 40, 217, 0.15)' }}
              >
                {/* Total bar (dim, shows relative volume) */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: `${barWidth}%`,
                    background: 'rgba(109, 40, 217, 0.25)',
                    borderRadius: 9999,
                  }}
                />
                {/* Solved bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: `${barWidth * pct / 100}%`,
                    background: pct >= 70
                      ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                      : pct >= 40
                        ? 'linear-gradient(90deg, #a78bfa, #7c3aed)'
                        : 'linear-gradient(90deg, #f87171, #ef4444)',
                    borderRadius: 9999,
                    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>

              {/* % */}
              <div
                className="text-xs font-semibold shrink-0 tabular-nums"
                style={{
                  width: 36,
                  color: pct >= 70 ? '#4ade80' : pct >= 40 ? '#a78bfa' : '#f87171',
                }}
              >
                {pct}%
              </div>

              {/* Count */}
              <div className="text-xs shrink-0 tabular-nums" style={{ color: '#4b2d8a', width: 28 }}>
                {s.total}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
