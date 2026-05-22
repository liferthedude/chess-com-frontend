'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Suspense } from 'react'
import PuzzleTable from './PuzzleTable'
import TagStats from './TagStats'
import RatingStats from './RatingStats'
import LastParsedAt from './LastParsedAt'

export default function Dashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [failuresOnly, setFailuresOnly] = useState(() => searchParams.get('failures') === 'true')
  const [totalPuzzles, setTotalPuzzles] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/stats/totals')
      .then(r => r.json())
      .then(data => setTotalPuzzles(data.total_puzzles))
  }, [])

  function toggleFailures() {
    const next = !failuresOnly
    setFailuresOnly(next)
    const params = new URLSearchParams(searchParams.toString())
    params.set('failures', String(next))
    params.set('page', '1')
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full lg:w-fit">

      {/* Top row: filter + last parsed */}
      <div className="flex items-center gap-3 mb-5 w-full">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#a78bfa' }}>
          Failures only &gt;30 days
        </span>
        <button
          onClick={toggleFailures}
          className="relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200"
          style={{
            background: failuresOnly ? 'linear-gradient(90deg, #7c3aed, #9333ea)' : 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: failuresOnly ? '0 0 12px rgba(124, 58, 237, 0.4)' : 'none',
          }}
        >
          <span
            className="inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200"
            style={{
              background: failuresOnly ? '#fff' : 'rgba(167, 139, 250, 0.6)',
              transform: failuresOnly ? 'translateX(18px)' : 'translateX(2px)',
              boxShadow: failuresOnly ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
            }}
          />
        </button>
        <span className="text-xs font-semibold" style={{ color: failuresOnly ? '#a78bfa' : '#4b5563' }}>
          {failuresOnly ? 'ON' : 'OFF'}
        </span>
        <div className="ml-auto flex items-center gap-4">
          {totalPuzzles !== null && (
            <span className="text-sm" style={{ color: '#6d28d9' }}>
              total puzzles: <span style={{ color: '#a78bfa' }}>{totalPuzzles.toLocaleString()}</span>
            </span>
          )}
          <LastParsedAt />
        </div>
      </div>

      {/* Bottom: table + stats */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <Suspense fallback={null}>
          <PuzzleTable failuresOnly={failuresOnly} />
        </Suspense>
        <div className="w-full lg:w-96 lg:flex-shrink-0 flex flex-col gap-6">
          <TagStats />
          <RatingStats />
        </div>
      </div>

    </div>
  )
}
