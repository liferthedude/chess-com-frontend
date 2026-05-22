import { NextResponse } from 'next/server'
import pool from '@/app/lib/db'
import { auth } from '@/auth'

export async function GET() {
  throw new Error('Sentry test exception from solved-by-tag')

  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [rows] = await pool.query(`
    SELECT
      tag,
      COUNT(*)                                              AS total,
      SUM(solved)                                           AS solved
    FROM puzzles,
    JSON_TABLE(tags, '$[*]' COLUMNS (tag VARCHAR(100) PATH '$')) t
    WHERE JSON_LENGTH(tags) > 0
    GROUP BY tag
    ORDER BY total DESC
  `)

  return NextResponse.json(rows)
}
