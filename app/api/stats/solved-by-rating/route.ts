import { NextResponse } from 'next/server'
import pool from '@/app/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [rows] = await pool.query(`
    SELECT
      FLOOR(rating / 50) * 50                               AS bucket,
      COUNT(*)                                              AS total,
      SUM(solved)                                           AS solved
    FROM puzzles
    GROUP BY bucket
    ORDER BY bucket ASC
  `)

  return NextResponse.json(rows)
}
