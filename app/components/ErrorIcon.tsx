'use client'

import { useState } from 'react'

interface ErrorIconProps {
  status: number
  size?: number
}

export default function ErrorIcon({ status, size = 32 }: ErrorIconProps) {
  const [show, setShow] = useState(false)
  const label = status ? `HTTP status code: ${status}` : 'network error'

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', cursor: 'pointer' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ pointerEvents: 'none' }}>
        <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2" />
        <path d="M12 7v6" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1.2" fill="#f87171" />
      </svg>

      {show && (
        <span style={{
          position: 'absolute',
          bottom: `calc(100% + 10px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          background: 'linear-gradient(160deg, #130630 0%, #1c0a45 100%)',
          border: '1px solid rgba(248, 113, 113, 0.35)',
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: 12,
          fontWeight: 500,
          color: '#fca5a5',
          boxShadow: '0 4px 20px rgba(248, 113, 113, 0.2), 0 0 0 1px rgba(248,113,113,0.05)',
          pointerEvents: 'none',
          zIndex: 100,
        }}>
          {label}
          {/* Arrow */}
          <span style={{
            position: 'absolute',
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 8,
            height: 8,
            background: '#1c0a45',
            borderRight: '1px solid rgba(248, 113, 113, 0.35)',
            borderBottom: '1px solid rgba(248, 113, 113, 0.35)',
          }} />
        </span>
      )}
    </span>
  )
}
