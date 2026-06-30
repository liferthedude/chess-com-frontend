import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/lib/db'
import { auth } from '@/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const puzzleId = parseInt(id, 10)
  if (isNaN(puzzleId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const { action } = await request.json()

  if (action === 'solved') {
    await pool.query(
      'UPDATE puzzles SET solved = 1, attempted_at = NOW() WHERE id = ?',
      [puzzleId]
    )
    return NextResponse.json({ ok: true })
  }

  if (action === 'not_solved') {
    await pool.query('UPDATE puzzles SET attempted_at = NOW() WHERE id = ?', [puzzleId])
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
