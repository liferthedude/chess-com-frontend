import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/lib/db'
import { getSession } from '@/app/lib/session'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const puzzleId = parseInt(id, 10)
  if (isNaN(puzzleId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const { action } = await request.json()
  if (action !== 'solve') {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }

  await pool.query(
    'UPDATE puzzles SET solved = 1 WHERE id = ? AND solved = 0',
    [puzzleId]
  )

  return NextResponse.json({ ok: true })
}
