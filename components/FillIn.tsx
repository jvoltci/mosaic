'use client'

import { useState } from 'react'

type Props = {
  /** Optional question / instruction shown above the blank. */
  prompt?: string
  /** The canonical correct answer (case-insensitive by default). */
  answer: string
  /** Additional accepted answers (variants, abbreviations). */
  accept?: string[]
  /** Code shown before the blank. Triggers code-style layout. */
  prefix?: string
  /** Code shown after the blank. */
  suffix?: string
  /** Hint shown alongside the input (always visible). */
  hint?: string
  /** Explanation revealed once correct or shown. */
  explanation?: string
  /** Default: false — answers are normalized to lowercase. */
  caseSensitive?: boolean
}

type State = 'idle' | 'wrong' | 'correct' | 'revealed'

function normalize(s: string, caseSensitive: boolean) {
  return caseSensitive ? s.trim() : s.trim().toLowerCase()
}

export function FillIn({
  prompt,
  answer,
  accept = [],
  prefix,
  suffix,
  hint,
  explanation,
  caseSensitive = false,
}: Props) {
  const [value, setValue] = useState('')
  const [state, setState] = useState<State>('idle')

  const valid = [answer, ...accept].map((a) => normalize(a, caseSensitive))

  function check() {
    if (!value.trim()) return
    if (valid.includes(normalize(value, caseSensitive))) setState('correct')
    else setState('wrong')
  }

  function reveal() {
    setValue(answer)
    setState('revealed')
  }

  function reset() {
    setValue('')
    setState('idle')
  }

  const isLocked = state === 'correct' || state === 'revealed'
  const isCode = prefix !== undefined || suffix !== undefined

  return (
    <div className={`m-fillin ${isCode ? 'is-code' : ''}`}>
      <div className="m-fillin-header">Fill in the blank</div>

      {prompt && <div className="m-fillin-prompt">{prompt}</div>}

      <div className={`m-fillin-row ${isCode ? 'is-code-row' : ''}`}>
        {prefix !== undefined && <code className="m-fillin-fixed">{prefix}</code>}
        <input
          className={`m-fillin-input ${state === 'wrong' ? 'is-wrong' : ''} ${
            isLocked ? 'is-locked' : ''
          }`}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (state === 'wrong') setState('idle')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLocked) check()
          }}
          disabled={isLocked}
          placeholder={isCode ? '___' : 'type your answer'}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label={prompt ?? 'Fill in the blank'}
        />
        {suffix !== undefined && <code className="m-fillin-fixed">{suffix}</code>}
      </div>

      <div className="m-fillin-actions">
        {!isLocked && (
          <>
            <button className="m-fillin-btn" onClick={check} disabled={!value.trim()}>
              Check
            </button>
            <button className="m-fillin-btn is-ghost" onClick={reveal}>
              Show answer
            </button>
          </>
        )}
        {isLocked && (
          <button className="m-fillin-btn is-ghost" onClick={reset}>
            Try again
          </button>
        )}
        {hint && <span className="m-fillin-hint">{hint}</span>}
      </div>

      {state !== 'idle' && (
        <div
          className={`m-fillin-feedback is-${state}`}
          role="status"
          aria-live="polite"
        >
          {state === 'correct' && (
            <>✅ Correct{explanation && ` — ${explanation}`}</>
          )}
          {state === 'wrong' && <>✗ Not quite. Try again or reveal.</>}
          {state === 'revealed' && (
            <>
              Answer: <code>{answer}</code>
              {explanation && ` — ${explanation}`}
            </>
          )}
        </div>
      )}
    </div>
  )
}
