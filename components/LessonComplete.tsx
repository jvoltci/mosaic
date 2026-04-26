'use client'

import { usePathname } from 'next/navigation'
import { useProgress } from '../lib/use-progress'

export function LessonComplete() {
  const pathname = usePathname()
  const { isDone, toggle } = useProgress()
  const done = isDone(pathname)

  return (
    <div className="m-lesson-complete">
      <button
        className={`m-lesson-complete-btn ${done ? 'is-done' : ''}`}
        onClick={() => toggle(pathname)}
      >
        {done ? '✓ Lesson complete' : 'Mark lesson complete'}
      </button>
      {done && (
        <p className="m-lesson-complete-hint">Saved locally — keep going!</p>
      )}
    </div>
  )
}
