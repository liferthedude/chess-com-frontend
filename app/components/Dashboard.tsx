'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import PuzzleTable from './PuzzleTable'
import LastParsedAt from './LastParsedAt'
import ErrorIcon from './ErrorIcon'

export default function Dashboard() {
  const [totalPuzzles, setTotalPuzzles] = useState<number | null>(null)
  const [totalsError, setTotalsError] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/stats/totals')
      .then(r => { if (!r.ok) { setTotalsError(r.status); return null } return r.json() })
      .then(data => { if (data) setTotalPuzzles(data.total_puzzles) })
      .catch(() => setTotalsError(0))
  }, [])

  return (
    <div className="w-full lg:w-fit">

      {/* Top row: totals + last parsed */}
      <div className="flex items-center justify-end gap-4 mb-5 w-full">
        {totalsError !== null ? (
          <span className="flex items-center gap-1.5 text-sm" style={{ color: '#f87171' }}>
            total puzzles: <ErrorIcon status={totalsError} size={14} />
          </span>
        ) : totalPuzzles !== null && (
          <span className="text-sm" style={{ color: '#6d28d9' }}>
            total puzzles: <span style={{ color: '#a78bfa' }}>{totalPuzzles.toLocaleString()}</span>
          </span>
        )}
        <LastParsedAt />
      </div>

      {/* Table */}
      <Suspense fallback={null}>
        <PuzzleTable />
      </Suspense>

    </div>
  )
}
