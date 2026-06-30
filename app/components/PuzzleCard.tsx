'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Spinner from './Spinner'
import ErrorIcon from './ErrorIcon'

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

const BOARD_SIZE = 420

export default function PuzzleCard() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<number | null>(null)
  const [confirm, setConfirm] = useState<'solved' | 'not_solved' | null>(null)
  const [saving, setSaving] = useState(false)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('/api/puzzles?page=1')
      .then(r => { if (!r.ok) { setError(r.status); setLoading(false); return null } return r.json() })
      .then((data: ApiResponse | null) => {
        if (data) { setPuzzle(data.puzzles[0] ?? null); setLoading(false) }
      })
      .catch(() => { setError(0); setLoading(false) })
  }, [reload])

  async function handleConfirm() {
    if (puzzle === null || confirm === null) return
    setSaving(true)
    await fetch(`/api/puzzles/${puzzle.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: confirm }),
    })
    setSaving(false)
    setConfirm(null)
    // The puzzle's attempted_at moves to now, so it leaves the >30-day failures
    // view — reload to surface the next puzzle in line.
    setReload(r => r + 1)
  }

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(160deg, #130630 0%, #1c0a45 100%)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 8px 40px rgba(109, 40, 217, 0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
    padding: 24,
  }

  const pos = puzzle?.fen ? normalizeFen(puzzle.fen) : null
  const orientation = pos && pos.split(' ')[1] === 'w' ? 'black' : 'white'

  const actionBtn = (action: 'solved' | 'not_solved') => {
    const isSolved = action === 'solved'
    return {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '12px 0',
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.15s',
      background: isSolved ? 'rgba(74, 222, 128, 0.12)' : 'rgba(248, 113, 113, 0.12)',
      color: isSolved ? '#4ade80' : '#f87171',
      border: `1px solid ${isSolved ? 'rgba(74, 222, 128, 0.25)' : 'rgba(248, 113, 113, 0.25)'}`,
    } as React.CSSProperties
  }

  return (
    <div className="w-full" style={{ maxWidth: BOARD_SIZE + 48 }}>
      <div style={cardStyle}>
        {loading ? (
          <div style={{ height: BOARD_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner />
          </div>
        ) : error !== null ? (
          <div style={{ height: BOARD_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ErrorIcon status={error} size={32} />
          </div>
        ) : puzzle === null ? (
          <div
            style={{ height: BOARD_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            className="text-xs uppercase tracking-widest"
          >
            <span style={{ color: '#4b2d8a' }}>No puzzles left 🎉</span>
          </div>
        ) : (
          <>
            {/* ID + rating */}
            <div className="flex items-center justify-between mb-4">
              <a
                href={`https://www.chess.com/puzzles/problem/${puzzle.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-semibold"
                style={{ color: '#a78bfa' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#ddd6fe')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#a78bfa')}
              >
                #{puzzle.id}
              </a>
              <span className="text-sm font-mono font-semibold" style={{ color: '#6d28d9' }}>
                rating: <span style={{ color: '#a78bfa' }}>{puzzle.rating ?? '—'}</span>
              </span>
            </div>

            {/* Board */}
            <div
              style={{
                width: '100%',
                maxWidth: BOARD_SIZE,
                aspectRatio: '1 / 1',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                boxShadow: '0 16px 48px rgba(109, 40, 217, 0.3)',
                margin: '0 auto',
              }}
            >
              {pos && (
                <Chessboard
                  options={{
                    position: pos,
                    allowDragging: false,
                    boardOrientation: orientation,
                    darkSquareStyle: { backgroundColor: '#c4b5fd' },
                    lightSquareStyle: { backgroundColor: '#f5f3ff' },
                  }}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirm('solved')}
                style={actionBtn('solved')}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74, 222, 128, 0.25)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74, 222, 128, 0.12)' }}
              >
                <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Solved
              </button>
              <button
                onClick={() => setConfirm('not_solved')}
                style={actionBtn('not_solved')}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248, 113, 113, 0.25)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248, 113, 113, 0.12)' }}
              >
                <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Not solved
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirm modal */}
      {confirm !== null && puzzle !== null && (() => {
        const isSolved = confirm === 'solved'
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => !saving && setConfirm(null)}
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
              <div style={{ fontSize: 32, marginBottom: 12 }}>{isSolved ? '♟️' : '⏱'}</div>
              <div style={{ color: '#e9d5ff', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                {isSolved ? 'Mark puzzle as solved?' : 'Mark as not solved?'}
              </div>
              <div style={{ color: '#7c3aed', fontSize: 12, marginBottom: 24 }}>
                #{puzzle.id} → attempted today{isSolved ? ', solved' : ''}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setConfirm(null)}
                  disabled={saving}
                  style={{
                    padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: 'rgba(109, 40, 217, 0.12)', color: '#a78bfa',
                    border: '1px solid rgba(139, 92, 246, 0.25)', opacity: saving ? 0.4 : 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={saving}
                  style={{
                    padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? 'default' : 'pointer',
                    background: saving
                      ? (isSolved ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)')
                      : (isSolved ? 'linear-gradient(90deg, #16a34a, #15803d)' : 'linear-gradient(90deg, #dc2626, #b91c1c)'),
                    color: isSolved ? '#4ade80' : '#fca5a5',
                    border: `1px solid ${isSolved ? 'rgba(74, 222, 128, 0.35)' : 'rgba(248, 113, 113, 0.35)'}`,
                    boxShadow: saving ? 'none' : (isSolved ? '0 0 12px rgba(74, 222, 128, 0.2)' : '0 0 12px rgba(248, 113, 113, 0.2)'),
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Saving…' : (isSolved ? '✓ Yes, solved' : '✓ Yes, not solved')}
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
