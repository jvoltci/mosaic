import { CourseNav } from './CourseNav'
import { SupportSection } from '../SupportSection'
import { SelectionLookup } from '../SelectionLookup'

export function CourseShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-shell">
      <a href="#main-content" className="m-skip-link">
        Skip to content
      </a>
      <CourseNav />
      <main id="main-content" className="m-shell-main">{children}</main>
      <SupportSection />
      <SelectionLookup />
    </div>
  )
}
