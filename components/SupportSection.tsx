'use client'

import { usePathname } from 'next/navigation'

/**
 * Single concise support section. Only shown on the landing page (`/`).
 * Lesson and module pages have their own prev/next navigation and don't
 * need the tip-jar clutter.
 */

const HANDLES = {
  github: 'jvoltci',
  paypalEmail: 'sonoojai@gmail.com',
  githubSponsor: 'jvoltci',
}

export function SupportSection() {
  const pathname = usePathname() || '/'
  if (pathname !== '/') return null

  const paypalUrl = `https://www.paypal.com/donate/?business=${encodeURIComponent(HANDLES.paypalEmail)}&item_name=${encodeURIComponent('Mosaic course')}&currency_code=USD`

  return (
    <section className="m-support">
      <div className="m-support-inner">
        <p className="m-support-eyebrow">If Mosaic helped you</p>
        <h2 className="m-support-title">
          The course is free. The author runs on{' '}
          <span className="m-support-italic">tips and stars</span>.
        </h2>

        <div className="m-support-buttons">
          <a
            className="m-support-btn m-support-btn-primary"
            href={`https://github.com/${HANDLES.github}/mosaic`}
            target="_blank"
            rel="noreferrer"
          >
            Star on GitHub
            <span className="m-support-btn-sub">Free · 5 seconds</span>
          </a>
          <a className="m-support-btn" href={paypalUrl} target="_blank" rel="noreferrer">
            PayPal
            <span className="m-support-btn-sub">{HANDLES.paypalEmail}</span>
          </a>
          <a
            className="m-support-btn"
            href={`https://github.com/sponsors/${HANDLES.githubSponsor}`}
            target="_blank"
            rel="noreferrer"
          >
            GitHub Sponsors
            <span className="m-support-btn-sub">Monthly</span>
          </a>
        </div>

        <p className="m-support-fine">
          MIT licensed ·{' '}
          <a href={`https://github.com/${HANDLES.github}/mosaic`} target="_blank" rel="noreferrer">
            jvoltci/mosaic
          </a>
        </p>
      </div>
    </section>
  )
}
