import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Quiz } from './components/Quiz'
import { Figure } from './components/Figure'
import { Cheatsheet } from './components/Cheatsheet'
import { LessonComplete } from './components/LessonComplete'
import { ModuleProgress } from './components/ModuleProgress'
import { ColabLink } from './components/ColabLink'
import { Resources } from './components/Resources'
import { RunInBrowser } from './components/RunInBrowser'
import { Mermaid } from './components/Mermaid'
import { Capstone } from './components/Capstone'

const docsComponents = getDocsMDXComponents()

export const useMDXComponents = (components?: Record<string, React.ComponentType>) => ({
  ...docsComponents,
  // Override Nextra's default Mermaid (which inherits a light theme on non-dark DOMs)
  Mermaid,
  Quiz,
  Figure,
  Cheatsheet,
  LessonComplete,
  ModuleProgress,
  ColabLink,
  Resources,
  RunInBrowser,
  Capstone,
  ...components,
})
