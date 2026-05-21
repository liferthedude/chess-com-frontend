import { NextResponse } from 'next/server'
import pool from '@/app/lib/db'
import { getSession } from '@/app/lib/session'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function GET() {
  await sleep(Math.random() * 1500)
  const session = await getSession()
  if (!session.isLoggedIn) {
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
