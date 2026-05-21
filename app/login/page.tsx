'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<{ error?: string } | undefined, FormData>(login, undefined)

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #09011a 0%, #14063a 50%, #09011a 100%)' }}
    >
      <form
        action={formAction}
        className="flex flex-col gap-4 w-72"
        style={{
          background: 'linear-gradient(160deg, #130630 0%, #1c0a45 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(109, 40, 217, 0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
          padding: '32px',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl select-none">♟</span>
          <h1 className="text-base font-semibold tracking-wide" style={{ color: '#e9d5ff' }}>
            Chess Puzzles
          </h1>
        </div>

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="text-sm px-3 py-2 rounded-lg outline-none transition-all"
          style={{
            background: 'rgba(109, 40, 217, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            color: '#e9d5ff',
          }}
        />

        {state?.error && (
          <p className="text-xs font-medium" style={{ color: '#f87171' }}>{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="text-sm font-semibold py-2 rounded-lg transition-all"
          style={{
            background: pending
              ? 'rgba(109, 40, 217, 0.3)'
              : 'linear-gradient(90deg, #7c3aed, #9333ea)',
            color: '#fff',
            boxShadow: pending ? 'none' : '0 0 16px rgba(124, 58, 237, 0.4)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          {pending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
