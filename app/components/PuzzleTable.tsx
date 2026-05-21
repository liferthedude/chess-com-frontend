'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Spinner from './Spinner'

const Chessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false })

interface Puzzle {
  id: number
  fen: string | null
  attempted_at: string
  solved: boolean
  tags: string[]
  rating: number | null
}

interface ApiResponse {
  puzzles: Puzzle[]
  total: number
  page: number
  pageSize: number
}

function normalizeFen(fen: string): string {
  const parts = fen.trim().split(' ')
  while (parts.length < 6) {
    parts.push(parts.length === 3 ? '-' : parts.length === 4 ? '0' : '1')
  }
  return parts.join(' ')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function BoardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0,1,2,3,4,5,6,7].map(row =>
        [0,1,2,3,4,5,6,7].map(col => (
          <rect
            key={`${row}-${col}`}
            x={col} y={row} width={1} height={1}
            fill={(row + col) % 2 === 0 ? '#7c3aed' : '#ddd6fe'}
          />
        ))
      )}
    </svg>
  )
}

const PAGE_SIZE = 25

const btnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 30,
  height: 30,
  padding: '0 8px',
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid rgba(139, 92, 246, 0.25)',
  background: 'rgba(109, 40, 217, 0.12)',
  color: '#a78bfa',
  transition: 'all 0.15s',
}

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: 'linear-gradient(90deg, #7c3aed, #9333ea)',
  color: '#fff',
  border: '1px solid rgba(139, 92, 246, 0.5)',
  boxShadow: '0 0 10px rgba(124, 58, 237, 0.35)',
}

const btnDisabled: React.CSSProperties = {
  ...btnBase,
  opacity: 0.3,
  cursor: 'default',
}

export default function PuzzleTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [total, setTotal] = useState(0)
  const [failuresOnly, setFailuresOnly] = useState(() => searchParams.get('failures') !== 'false')
  const [page, setPage] = useState(() => Math.max(1, parseInt(searchParams.get('page') ?? '1', 10)))
  const [loading, setLoading] = useState(true)
  const [hoveredFen, setHoveredFen] = useState<string | null>(null)
  const [boardPos, setBoardPos] = useState({ x: 0, y: 0 })
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [solving, setSolving] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    setLoading(true)
    fetch(`/api/puzzles?failuresOnly=${failuresOnly}&page=${page}`)
      .then(r => r.json())
      .then((data: ApiResponse) => {
        setPuzzles(data.puzzles)
        setTotal(data.total)
        setLoading(false)
      })
  }, [failuresOnly, page])

  function updateUrl(nextFailures: boolean, nextPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('failures', String(nextFailures))
    params.set('page', String(nextPage))
    router.replace(`${pathname}?${params.toString()}`)
  }

  function toggleFailures() {
    const next = !failuresOnly
    setFailuresOnly(next)
    setPage(1)
    updateUrl(next, 1)
  }

  function goToPage(p: number) {
    setPage(p)
    updateUrl(failuresOnly, p)
  }

  async function handleSolveConfirm() {
    if (confirmId === null) return
    setSolving(true)
    await fetch(`/api/puzzles/${confirmId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'solve' }),
    })
    setPuzzles(prev => prev.map(p =>
      p.id === confirmId ? { ...p, solved: true } : p
    ))
    setSolving(false)
    setConfirmId(null)
  }

  function handleIconMouseEnter(e: React.MouseEvent, fen: string) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setBoardPos({ x: rect.left - 296, y: rect.top - 140 })
    setHoveredFen(fen)
  }

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(160deg, #130630 0%, #1c0a45 100%)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 8px 40px rgba(109, 40, 217, 0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
    width: '100%',
  }

  // Pagination page numbers with ellipsis
  function pageNumbers(): (number | '…')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '…')[] = [1]
    if (page > 3) pages.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('…')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="w-full lg:w-fit">
      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5">
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
      </div>

      {/* Card */}
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto', borderRadius: '16px', width: '100%' }}>
        <table className="text-sm border-collapse" style={{ minWidth: 620 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
              <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#7c3aed', minWidth: 120 }}>ID</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#7c3aed', minWidth: 72 }}>Rating</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#7c3aed', width: 280 }}>Tags</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#7c3aed', minWidth: 120 }}>Attempted</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#7c3aed', minWidth: 100 }}>Solved</th>
              <th className="py-3 px-4" style={{ minWidth: 40 }} />
            </tr>
          </thead>
          <tbody>
            {puzzles.map((puzzle, i) => (
              <tr
                key={puzzle.id}
                style={{
                  borderBottom: i < puzzles.length - 1 ? '1px solid rgba(139, 92, 246, 0.08)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124, 58, 237, 0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="py-2 px-5">
                  <a
                    href={`https://www.chess.com/puzzles/problem/${puzzle.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-medium"
                    style={{ color: '#a78bfa' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = '#ddd6fe')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = '#a78bfa')}
                  >
                    #{puzzle.id}
                  </a>
                </td>
                <td className="py-2 px-4 text-xs font-mono font-semibold" style={{ color: '#a78bfa' }}>
                  {puzzle.rating ?? '—'}
                </td>
                <td className="py-2 px-4" style={{ width: 280 }}>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(puzzle.tags) ? puzzle.tags : []).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: 'rgba(109, 40, 217, 0.25)',
                          color: '#c4b5fd',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 text-xs" style={{ color: '#9ca3af' }}>
                  {formatDate(puzzle.attempted_at)}
                </td>
                <td className="py-2 px-4">
                  {puzzle.solved ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74, 222, 128, 0.12)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      YES
                    </span>
                  ) : (
                    <span
                      onClick={() => setConfirmId(puzzle.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer"
                      style={{ background: 'rgba(248, 113, 113, 0.12)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.25)', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248, 113, 113, 0.25)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248, 113, 113, 0.12)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      NO
                    </span>
                  )}
                </td>
                <td className="py-2 px-4">
                  {puzzle.fen && (
                    <span
                      className="cursor-pointer inline-flex rounded"
                      style={{ opacity: 0.4, transition: 'all 0.15s' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.opacity = '1'
                        ;(e.currentTarget as HTMLElement).style.filter = 'drop-shadow(0 0 4px rgba(124,58,237,0.6))'
                        handleIconMouseEnter(e, normalizeFen(puzzle.fen!))
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.opacity = '0.4'
                        ;(e.currentTarget as HTMLElement).style.filter = 'none'
                        setHoveredFen(null)
                      }}
                    >
                      <BoardIcon />
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={6}><Spinner /></td>
              </tr>
            )}
            {!loading && puzzles.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs uppercase tracking-widest" style={{ color: '#4b2d8a' }}>
                  No puzzles found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        </div>{/* end overflow-x-auto */}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between gap-3 px-5 py-3"
            style={{ borderTop: '1px solid rgba(139, 92, 246, 0.12)' }}
          >
            <span className="text-xs" style={{ color: '#6d28d9' }}>
              {total} puzzles · page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                style={page === 1 ? btnDisabled : btnBase}
              >
                ‹
              </button>
              {pageNumbers().map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} style={{ color: '#4b2d8a', fontSize: 12, padding: '0 4px' }}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p as number)}
                    style={p === page ? btnActive : btnBase}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                style={page === totalPages ? btnDisabled : btnBase}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm solve modal */}
      {confirmId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => !solving && setConfirmId(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(160deg, #130630 0%, #1c0a45 100%)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(109, 40, 217, 0.4)',
              padding: '28px 32px',
              minWidth: 300,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>♟️</div>
            <div style={{ color: '#e9d5ff', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
              Mark puzzle as solved?
            </div>
            <div style={{ color: '#7c3aed', fontSize: 12, marginBottom: 24 }}>
              #{confirmId}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmId(null)}
                disabled={solving}
                style={{
                  padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: 'rgba(109, 40, 217, 0.12)', color: '#a78bfa',
                  border: '1px solid rgba(139, 92, 246, 0.25)', opacity: solving ? 0.4 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSolveConfirm}
                disabled={solving}
                style={{
                  padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: solving ? 'default' : 'pointer',
                  background: solving ? 'rgba(74, 222, 128, 0.15)' : 'linear-gradient(90deg, #16a34a, #15803d)',
                  color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.35)',
                  boxShadow: solving ? 'none' : '0 0 12px rgba(74, 222, 128, 0.2)',
                  opacity: solving ? 0.7 : 1,
                }}
              >
                {solving ? 'Saving…' : '✓ Yes, solved'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating chess board */}
      {hoveredFen && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: boardPos.x,
            top: boardPos.y,
            width: 280,
            height: 280,
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 16px 48px rgba(109, 40, 217, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.1)',
          }}
        >
          <Chessboard
            options={{
              position: hoveredFen,
              boardStyle: { width: 280, height: 280 },
              allowDragging: false,
              boardOrientation: hoveredFen.split(' ')[1] === 'w' ? 'black' : 'white',
            }}
          />
        </div>
      )}
    </div>
  )
}
