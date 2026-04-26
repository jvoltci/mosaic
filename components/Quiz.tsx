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

  const reset = () => setPicked(null)

  return (
    <div className="m-quiz">
      <div className="m-quiz-header">Quick check</div>

      <div className="m-quiz-question">{question}</div>

      <div className="m-quiz-options" role="radiogroup" aria-label={question}>
        {options.map((opt, i) => {
          const isPicked = picked === i
          const isCorrect = i === answer
          const showState = picked !== null

          let className = 'm-quiz-option'
          if (showState && isCorrect) className += ' is-correct is-answer'
          else if (showState && isPicked && !isCorrect) className += ' is-wrong'

          return (
            <button
              key={`${i}-${opt}`}
              className={className}
              onClick={() => setPicked(i)}
              disabled={picked !== null}
              role="radio"
              aria-checked={isPicked}
            >
              {opt}
              {showState && isCorrect && ' ✓'}
              {showState && isPicked && !isCorrect && ' ✗'}
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div className="m-quiz-footer" role="status" aria-live="polite">
          {explanation && (
            <div className="m-quiz-explanation">
              {correct ? '✅ ' : '🔎 '}
              {explanation}
            </div>
          )}
          <button className="m-quiz-retry" onClick={reset}>
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
