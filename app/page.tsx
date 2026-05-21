import { Suspense } from 'react'
import { logout } from '@/app/actions/auth'
import PuzzleTable from '@/app/components/PuzzleTable'
import TagStats from '@/app/components/TagStats'
import RatingStats from '@/app/components/RatingStats'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #09011a 0%, #14063a 50%, #09011a 100%)' }}>
      <header style={{
        background: 'linear-gradient(90deg, #0f0626 0%, #1a0840 100%)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.18)',
        boxShadow: '0 2px 24px rgba(109, 40, 217, 0.12)',
      }} className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl select-none">♟</span>
          <h1 className="text-base font-semibold tracking-wide" style={{ color: '#e9d5ff' }}>
            Chess Puzzles
          </h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: '#9ca3af',
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
            }}
          >
            Sign out
          </button>
        </form>
      </header>
      <main className="px-8 py-8 flex justify-center">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <Suspense fallback={null}>
            <PuzzleTable />
          </Suspense>
          <div className="w-full lg:w-96 lg:flex-shrink-0 lg:mt-10 flex flex-col gap-6">
            <TagStats />
            <RatingStats />
          </div>
        </div>
      </main>
    </div>
  )
}
