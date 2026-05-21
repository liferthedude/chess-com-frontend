import { NextResponse } from 'next/server'
import pool from '@/app/lib/db'
import { getSession } from '@/app/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [rows] = await pool.query(`
    SELECT
      FLOOR(rating / 50) * 50                               AS bucket,
      COUNT(*)                                              AS total,
      SUM(CASE WHEN solved_at IS NOT NULL THEN 1 ELSE 0 END) AS solved
    FROM puzzles
    GROUP BY bucket
    ORDER BY bucket ASC
  `)

  return NextResponse.json(rows)
}
