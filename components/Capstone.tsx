type Device = 'phone' | 'laptop' | 'gpu' | 'colab' | 'cloud'
type Level = 'foundational' | 'intermediate' | 'advanced' | 'frontier'

export type CapstoneStep = {
  /** Short imperative title, e.g. "Sketch a naive matmul kernel". */
  title: string
  /** What the learner will do in plain English. 1–3 sentences. */
  goal: string
  /** Optional: a self-check the learner can run to know they finished the step. */
  checkpoint?: string
  /** Optional: a known mistake the learner is likely to make and how to avoid it. */
  trap?: string
  /** Optional: estimated time, e.g. "30 min". */
  est?: string
}

type Props = {
  title: string
  pitch: string
  /** Short narrative paragraph — what the artifact is and why it's worth building. */
  what: string
  sota: string[]
  device: Device
  time: string
  level?: Level
  /** Optional starter-template repo URL. */
  template?: string
  /** Optional pre-built notebook URL. */
  notebook?: string
  /** Optional structured walk-through. When provided, renders a step-by-step build guide. */
  steps?: CapstoneStep[]
  /** Optional list of skills the learner walks away with. */
  outcomes?: string[]
  /** Optional: where to share the result (forum, Discord, X tag, repo template). */
  shareWith?: string
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

export function Capstone({
  title,
  pitch,
  what,
  sota,
  device,
  time,
  level = 'intermediate',
  template,
  notebook,
  steps,
  outcomes,
  shareWith,
}: Props) {
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

        {steps && steps.length > 0 && (
          <div className="m-capstone-steps">
            <p className="m-capstone-steps-label">Build it — step by step</p>
            <ol>
              {steps.map((s, i) => (
                <li key={`${i}-${s.title}`} className="m-capstone-step">
                  <div className="m-capstone-step-head">
                    <span className="m-capstone-step-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="m-capstone-step-title">{s.title}</span>
                    {s.est && <span className="m-capstone-step-est">{s.est}</span>}
                  </div>
                  <p className="m-capstone-step-goal">{s.goal}</p>
                  {s.checkpoint && (
                    <p className="m-capstone-step-checkpoint">
                      <span className="m-capstone-step-tag">checkpoint</span> {s.checkpoint}
                    </p>
                  )}
                  {s.trap && (
                    <p className="m-capstone-step-trap">
                      <span className="m-capstone-step-tag is-trap">watch out</span> {s.trap}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {outcomes && outcomes.length > 0 && (
          <div className="m-capstone-outcomes">
            <p className="m-capstone-outcomes-label">You walk away with</p>
            <ul>
              {outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="m-capstone-sota">
          <span className="m-capstone-sota-label">Tools you'll use</span>
          <ul>
            {sota.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        {shareWith && (
          <p className="m-capstone-share">
            <strong>When you're done:</strong> {shareWith}
          </p>
        )}

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
