'use client'

import { useState } from 'react'

type QuizProps = {
  question: string
  options: string[]
  answer: number
  explanation?: string
}

export function Quiz({ question, options, answer, explanation }: QuizProps) {
  const [picked, setPicked] = useState<number | null>(null)
  const correct = picked === answer

  return (
    <div
      style={{
        margin: '1.5rem 0',
        padding: '1rem 1.1rem',
        border: '1px solid var(--mosaic-border, rgba(127,127,127,0.25))',
        borderRadius: '0.5rem',
        background: 'var(--mosaic-card, rgba(127,127,127,0.04))',
      }}
    >
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, marginBottom: '0.4rem' }}>
        Quick check
      </div>
      <p style={{ margin: '0 0 0.75rem 0', fontWeight: 500 }}>{question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {options.map((opt, i) => {
          const isPicked = picked === i
          const isCorrect = i === answer
          const showState = picked !== null
          let bg = 'transparent'
          let border = '1px solid rgba(127,127,127,0.3)'
          if (showState && isCorrect) {
            bg = 'rgba(34,197,94,0.12)'
            border = '1px solid rgba(34,197,94,0.6)'
          } else if (showState && isPicked && !isCorrect) {
            bg = 'rgba(239,68,68,0.12)'
            border = '1px solid rgba(239,68,68,0.6)'
          }
          return (
            <button
              key={i}
              onClick={() => setPicked(i)}
              disabled={picked !== null}
              style={{
                textAlign: 'left',
                padding: '0.55rem 0.75rem',
                borderRadius: '0.375rem',
                background: bg,
                border,
                cursor: picked === null ? 'pointer' : 'default',
                color: 'inherit',
                font: 'inherit',
                transition: 'background 0.15s',
              }}
            >
              {opt}
              {showState && isCorrect && ' ✓'}
              {showState && isPicked && !isCorrect && ' ✗'}
            </button>
          )
        })}
      </div>
      {picked !== null && explanation && (
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.875rem', opacity: 0.8 }}>
          {correct ? '✅ ' : '🔎 '}
          {explanation}
        </p>
      )}
    </div>
  )
}
