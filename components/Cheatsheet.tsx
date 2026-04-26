type CheatsheetProps = {
  children: React.ReactNode
}

export function Cheatsheet({ children }: CheatsheetProps) {
  return (
    <aside
      style={{
        margin: '1.5rem 0',
        padding: '0.75rem 1rem',
        borderLeft: '4px solid #f59e0b',
        background: 'rgba(245,158,11,0.08)',
        borderRadius: '0 0.375rem 0.375rem 0',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
          color: '#b45309',
          marginBottom: '0.4rem',
        }}
      >
        TL;DR · Cheatsheet
      </div>
      <div style={{ fontSize: '0.95rem' }}>{children}</div>
    </aside>
  )
}
