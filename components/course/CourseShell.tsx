import { CourseNav } from './CourseNav'
import { SupportSection } from '../SupportSection'
import { SelectionLookup } from '../SelectionLookup'

export function CourseShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-shell">
      <CourseNav />
      <main className="m-shell-main">{children}</main>
      <SupportSection />
      <SelectionLookup />
    </div>
  )
}
