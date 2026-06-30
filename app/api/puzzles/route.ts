import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/lib/db'
import { auth } from '@/auth'

const PAGE_SIZE = 25

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const offset = (page - 1) * PAGE_SIZE

  // Always restrict to unsolved puzzles attempted more than 30 days ago.
  const where = 'WHERE solved = 0 AND attempted_at < DATE_SUB(NOW(), INTERVAL 30 DAY)'

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM puzzles ${where}`
  ) as any

  const [rows] = await pool.query(
    `SELECT id, fen, attempted_at, solved, tags, rating FROM puzzles ${where} ORDER BY rating IS NULL, rating ASC LIMIT ? OFFSET ?`,
    [PAGE_SIZE, offset]
  )

  return NextResponse.json({ puzzles: rows, total, page, pageSize: PAGE_SIZE })
}
