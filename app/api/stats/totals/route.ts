import { NextResponse } from 'next/server'
import pool from '@/app/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM puzzles') as any
  return NextResponse.json({ total_puzzles: total })
}
