type Props = {
  href: string
  label?: string
  description?: string
}

export function ColabLink({ href, label = 'Open the runnable notebook', description }: Props) {
  return (
    <a className="m-colab-link" href={href} target="_blank" rel="noreferrer">
      <span className="m-colab-link-tag">Notebook</span>
      <span className="m-colab-link-body">
        <strong>{label}</strong>
        {description && <span>{description}</span>}
      </span>
      <span className="m-colab-link-arrow" aria-hidden>↗</span>
    </a>
  )
}
