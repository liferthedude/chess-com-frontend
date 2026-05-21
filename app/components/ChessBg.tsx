const pieces = [
  { ch: '♟', x: 12,  y: 62,  size: 48, rot: -18 },
  { ch: '♖', x: 95,  y: 104, size: 40, rot: 12  },
  { ch: '♛', x: 168, y: 45,  size: 44, rot: -8  },
  { ch: '♙', x: 248, y: 88,  size: 46, rot: 20  },
  { ch: '♚', x: 318, y: 32,  size: 42, rot: -14 },
  { ch: '♗', x: 392, y: 78,  size: 50, rot: 8   },
  { ch: '♘', x: 55,  y: 148, size: 44, rot: -22 },
  { ch: '♟', x: 138, y: 182, size: 48, rot: 16  },
  { ch: '♕', x: 208, y: 136, size: 40, rot: -6  },
  { ch: '♝', x: 282, y: 175, size: 50, rot: 14  },
  { ch: '♔', x: 355, y: 130, size: 44, rot: -18 },
  { ch: '♜', x: 418, y: 164, size: 42, rot: 10  },
  { ch: '♗', x: 22,  y: 238, size: 46, rot: -10 },
  { ch: '♔', x: 105, y: 268, size: 50, rot: 20  },
  { ch: '♘', x: 178, y: 222, size: 44, rot: -16 },
  { ch: '♜', x: 255, y: 258, size: 40, rot: 8   },
  { ch: '♙', x: 328, y: 232, size: 48, rot: -24 },
  { ch: '♛', x: 400, y: 272, size: 44, rot: 12  },
  { ch: '♚', x: 42,  y: 335, size: 42, rot: -8  },
  { ch: '♟', x: 118, y: 362, size: 48, rot: 18  },
  { ch: '♝', x: 195, y: 318, size: 44, rot: -20 },
  { ch: '♖', x: 268, y: 355, size: 40, rot: 10  },
  { ch: '♕', x: 342, y: 325, size: 50, rot: -14 },
  { ch: '♔', x: 412, y: 358, size: 46, rot: 22  },
  { ch: '♗', x: 18,  y: 432, size: 44, rot: -6  },
  { ch: '♘', x: 92,  y: 458, size: 48, rot: 14  },
  { ch: '♜', x: 165, y: 418, size: 42, rot: -18 },
  { ch: '♙', x: 240, y: 448, size: 50, rot: 8   },
  { ch: '♞', x: 315, y: 424, size: 44, rot: -12 },
  { ch: '♛', x: 388, y: 452, size: 46, rot: 16  },
]

const svgTile = `<svg xmlns='http://www.w3.org/2000/svg' width='440' height='500'>
  <style>text { font-family: serif; fill: rgba(139,92,246,0.15); }</style>
  ${pieces.map(p =>
    `<text x='${p.x}' y='${p.y}' font-size='${p.size}' transform='rotate(${p.rot},${p.x},${p.y})'>${p.ch}</text>`
  ).join('\n  ')}
</svg>`

const bgUrl = `url("data:image/svg+xml,${encodeURIComponent(svgTile)}")`

export default function ChessBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ backgroundImage: bgUrl, backgroundRepeat: 'repeat', backgroundSize: '440px 500px', zIndex: 0 }}
    />
  )
}
