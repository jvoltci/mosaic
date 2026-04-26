'use client'

import { useEffect, useState } from 'react'

const HANDLES = {
  github: 'jvoltci',
  paypalEmail: 'sonoojai@gmail.com',
  githubSponsor: 'jvoltci',
}

const COUNTER_NAMESPACE = 'jvoltci-mosaic'
const COUNTER_KEY = 'visits'
const SESSION_FLAG = 'mosaic:counted'

function fmt(n: number) {
  return n.toLocaleString('en-US')
}

/**
 * Subtle global footer. PayPal / GitHub / visitor count, all on one line.
 * Renders on every page — keep the styling restrained.
 */
export function SupportSection() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const counted = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_FLAG)
    const path = counted ? 'get' : 'hit'
    const url = `https://abacus.jasoncameron.dev/${path}/${COUNTER_NAMESPACE}/${COUNTER_KEY}`
    fetch(url)
      .then((r) => r.json())
      .then((data: { value?: number }) => {
        if (cancelled) return
        if (typeof data.value === 'number') {
          setCount(data.value)
          if (!counted) sessionStorage.setItem(SESSION_FLAG, '1')
        }
      })
      .catch(() => { /* offline / blocked — counter just stays hidden */ })
    return () => { cancelled = true }
  }, [])

  const paypalUrl = `https://www.paypal.com/donate/?business=${encodeURIComponent(HANDLES.paypalEmail)}&item_name=${encodeURIComponent('Mosaic course')}&currency_code=USD`
  const phrase = count === null
    ? null
    : count === 1
    ? '1 curious mind has walked the mosaic'
    : `${fmt(count)} curious minds have walked the mosaic`

  return (
    <footer className="m-footer">
      <div className="m-footer-inner">
        {phrase && <span className="m-footer-count">{phrase}</span>}
        <span className="m-footer-links">
          <a href={`https://github.com/${HANDLES.github}/mosaic`} target="_blank" rel="noreferrer">★ Star</a>
          <span className="m-footer-dot" aria-hidden>·</span>
          <a href={paypalUrl} target="_blank" rel="noreferrer">Tip via PayPal</a>
          <span className="m-footer-dot" aria-hidden>·</span>
          <a href={`https://github.com/sponsors/${HANDLES.githubSponsor}`} target="_blank" rel="noreferrer">Sponsor</a>
          <span className="m-footer-dot" aria-hidden>·</span>
          <span className="m-footer-fine">MIT</span>
        </span>
      </div>
    </footer>
  )
}
