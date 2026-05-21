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
