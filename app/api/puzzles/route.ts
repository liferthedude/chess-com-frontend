import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/lib/db'
import { getSession } from '@/app/lib/session'

const PAGE_SIZE = 25

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const failuresOnly = searchParams.get('failuresOnly') !== 'false'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const offset = (page - 1) * PAGE_SIZE

  const where = failuresOnly
    ? 'WHERE solved_at IS NULL AND attempted_at < DATE_SUB(NOW(), INTERVAL 30 DAY)'
    : ''

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM puzzles ${where}`
  ) as any

  const [rows] = await pool.query(
    `SELECT id, fen, attempted_at, solved_at, tags, rating FROM puzzles ${where} ORDER BY attempted_at DESC LIMIT ? OFFSET ?`,
    [PAGE_SIZE, offset]
  )

  return NextResponse.json({ puzzles: rows, total, page, pageSize: PAGE_SIZE })
}
