/**
 * Wrap a section of MDX so it only renders when the reader's selected
 * mode matches.
 *
 *   <Mode is="learn">      ...warm walk-through voice...     </Mode>
 *   <Mode is="reference">  ...original dense reference...    </Mode>
 *
 * Both blocks are emitted into the static HTML; CSS hides the inactive one
 * based on `<html data-mode="...">` (set by the boot script in layout.tsx
 * and toggled by <ModeToggle/>). Server-component so it composes naturally
 * with the rest of the MDX pipeline.
 */
type ModeProps = {
  is: 'learn' | 'reference'
  children: React.ReactNode
}

export function Mode({ is, children }: ModeProps) {
  return (
    <div className="m-mode-block" data-mode-block={is}>
      {children}
    </div>
  )
}
