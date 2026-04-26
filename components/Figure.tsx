type FigureProps = {
  src: string
  alt: string
  caption?: string
}

export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure style={{ margin: '1.5rem 0' }}>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: '0.375rem' }} />
      {caption && (
        <figcaption style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', opacity: 0.7 }}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
