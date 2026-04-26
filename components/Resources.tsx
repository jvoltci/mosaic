type ResourceKind = 'paper' | 'blog' | 'video' | 'repo' | 'docs' | 'book'

type Resource = {
  kind: ResourceKind
  href: string
  title: string
  author?: string
  note?: string
}

const KIND_LABEL: Record<ResourceKind, string> = {
  paper: 'Paper',
  blog: 'Blog',
  video: 'Video',
  repo: 'Repo',
  docs: 'Docs',
  book: 'Book',
}

export function Resources({ items }: { items: Resource[] }) {
  return (
    <ul className="m-resources">
      {items.map((r) => (
        <li key={r.href} className="m-resource">
          <span className="m-resource-tag">{KIND_LABEL[r.kind]}</span>
          <span className="m-resource-body">
            <a href={r.href} target="_blank" rel="noreferrer" className="m-resource-link">
              {r.title}
            </a>
            {r.author && <span className="m-resource-author"> · {r.author}</span>}
            {r.note && <span className="m-resource-note">{r.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}
