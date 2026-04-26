'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * FocusScroll — the signature reading mode.
 *
 * Wraps lesson prose. Discovers h2 headings, observes them via
 * IntersectionObserver, and highlights the active one + drives the
 * section-dots stepper and reading progress bar.
 *
 * Important: this component never mutates the lesson DOM. It only
 * reads heading positions and toggles classes on existing nodes.
 */

type SectionInfo = {
  id: string
  title: string
}

const SECTION_CLASS = 'm-focus-h2'
const ACTIVE_CLASS = 'is-active'

export function FocusScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [sections, setSections] = useState<SectionInfo[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Discover h2s. No DOM wrapping — just tag with id + a class for styling.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const headings = Array.from(wrapper.querySelectorAll('h2')) as HTMLElement[]
    const secs: SectionInfo[] = headings.map((h2, i) => {
      if (!h2.id) h2.id = `section-${i}`
      h2.classList.add(SECTION_CLASS)
      h2.dataset.sectionIndex = String(i)
      return { id: h2.id, title: h2.textContent?.trim() || `Section ${i + 1}` }
    })
    setSections(secs)
  }, [])

  // Observe h2 visibility — pick the topmost in-view heading as active.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || sections.length === 0) return

    const headings = wrapper.querySelectorAll<HTMLElement>(`h2.${SECTION_CLASS}`)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        let topMost: { idx: number; top: number } | null = null
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = Number((entry.target as HTMLElement).dataset.sectionIndex ?? 0)
          const top = entry.boundingClientRect.top
          if (!topMost || top < topMost.top) topMost = { idx, top }
        })
        if (topMost !== null) setActiveIndex((topMost as { idx: number; top: number }).idx)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 1] },
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  // Toggle the active class on the active h2 only.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const headings = wrapper.querySelectorAll<HTMLElement>(`h2.${SECTION_CLASS}`)
    headings.forEach((el, i) => {
      el.classList.toggle(ACTIVE_CLASS, i === activeIndex)
    })
  }, [activeIndex, sections])

  // Reading progress bar.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect()
      const totalHeight = wrapper.scrollHeight - window.innerHeight
      if (totalHeight <= 0) {
        setProgress(0)
        return
      }
      const scrolled = -rect.top
      setProgress(Math.max(0, Math.min(1, scrolled / totalHeight)))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (index: number) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const heading = wrapper.querySelector<HTMLElement>(
      `h2.${SECTION_CLASS}[data-section-index="${index}"]`,
    )
    heading?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="m-reading-progress" aria-hidden>
        <div
          className="m-reading-progress-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {sections.length > 1 && (
        <nav className="m-section-dots" aria-label="Lesson sections">
          {sections.map((sec, i) => (
            <button
              key={sec.id}
              className={`m-section-dot ${i === activeIndex ? 'is-active' : ''} ${i < activeIndex ? 'is-done' : ''}`}
              onClick={() => scrollToSection(i)}
              title={sec.title}
              aria-label={`Jump to: ${sec.title}`}
            >
              <span className="m-section-dot-pip" />
            </button>
          ))}
        </nav>
      )}

      <div ref={wrapperRef} className="m-focus-wrapper">
        {children}
      </div>
    </>
  )
}
