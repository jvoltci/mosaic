type Device = 'phone' | 'laptop' | 'gpu' | 'colab' | 'cloud'
type Level = 'foundational' | 'intermediate' | 'advanced' | 'frontier'

type Props = {
  title: string
  pitch: string
  what: string
  sota: string[]
  device: Device
  time: string
  level?: Level
  template?: string
  notebook?: string
}

const DEVICE_LABEL: Record<Device, string> = {
  phone: 'Runs on your phone',
  laptop: 'Runs on your laptop',
  gpu: 'Single-GPU rental',
  colab: 'Free Colab T4',
  cloud: 'Cloud (~$5)',
}

const LEVEL_LABEL: Record<Level, string> = {
  foundational: 'Foundational',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  frontier: 'Frontier',
}

export function Capstone({ title, pitch, what, sota, device, time, level = 'intermediate', template, notebook }: Props) {
  return (
    <aside className="m-capstone">
      <div className="m-capstone-rail" aria-hidden />
      <div className="m-capstone-body">
        <p className="m-capstone-tag">Module capstone — build it</p>
        <h3 className="m-capstone-title">{title}</h3>
        <p className="m-capstone-pitch">{pitch}</p>

        <div className="m-capstone-meta">
          <span className="m-capstone-meta-item">{LEVEL_LABEL[level]}</span>
          <span className="m-capstone-meta-dot" aria-hidden>·</span>
          <span className="m-capstone-meta-item">{time}</span>
          <span className="m-capstone-meta-dot" aria-hidden>·</span>
          <span className="m-capstone-meta-item">{DEVICE_LABEL[device]}</span>
        </div>

        <p className="m-capstone-what">{what}</p>

        <div className="m-capstone-sota">
          <span className="m-capstone-sota-label">SOTA stack</span>
          <ul>
            {sota.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        {(template || notebook) && (
          <div className="m-capstone-cta">
            {notebook && (
              <a href={notebook} target="_blank" rel="noreferrer" className="m-capstone-btn m-capstone-btn-primary">
                Open the notebook →
              </a>
            )}
            {template && (
              <a href={template} target="_blank" rel="noreferrer" className="m-capstone-btn">
                Template repo →
              </a>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
