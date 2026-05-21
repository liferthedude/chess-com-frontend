export default function AuthErrorPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #09011a 0%, #14063a 50%, #09011a 100%)' }}
    >
      <div
        className="flex flex-col items-center gap-5 w-80 text-center"
        style={{
          background: 'linear-gradient(160deg, #130630 0%, #1c0a45 100%)',
          border: '1px solid rgba(248, 113, 113, 0.25)',
          borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(220, 38, 38, 0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
          padding: '36px 32px',
        }}
      >
        <div style={{ fontSize: 48, lineHeight: 1, color: '#f87171', textShadow: '0 0 24px rgba(248,113,113,0.5)' }}>♟</div>

        <div className="flex flex-col gap-2">
          <div
            className="text-2xl font-bold"
            style={{ color: '#fca5a5', textShadow: '0 0 20px rgba(248,113,113,0.4)' }}
          >
            Access Denied
          </div>
          <div className="text-sm font-medium" style={{ color: '#f87171' }}>
            This account is not authorised to access Chess Puzzles.
          </div>
        </div>

        <a
          href="/login"
          className="text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          style={{
            background: 'rgba(248, 113, 113, 0.1)',
            color: '#f87171',
            border: '1px solid rgba(248, 113, 113, 0.25)',
          }}
        >
          ← Back to login
        </a>
      </div>
    </div>
  )
}
