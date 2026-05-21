import { signIn } from '@/auth'
import ChessBg from '@/app/components/ChessBg'

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #09011a 0%, #14063a 50%, #09011a 100%)' }}
    >
      <ChessBg />

      <div
        className="relative flex flex-col gap-6 w-72"
        style={{
          background: 'linear-gradient(160deg, #130630 0%, #1c0a45 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(109, 40, 217, 0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
          padding: '32px',
        }}
      >
        <div className="flex flex-col items-center gap-1 py-2">
          <span className="select-none" style={{ fontSize: 64, lineHeight: 1, color: '#a78bfa', textShadow: '0 0 32px rgba(139,92,246,0.5)' }}>♟</span>
          <h1 className="text-2xl font-bold tracking-wide mt-3" style={{ color: '#e9d5ff' }}>Chess Puzzles</h1>
          <p className="text-sm" style={{ color: '#7c3aed' }}>Sign in to continue</p>
        </div>

        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/' })
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 text-sm font-semibold py-3 rounded-xl transition-all"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #9333ea)',
              color: '#fff',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.35)',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#fff" fillOpacity=".9" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#fff" fillOpacity=".75" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#fff" fillOpacity=".6" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#fff" fillOpacity=".85" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
            </svg>
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  )
}
