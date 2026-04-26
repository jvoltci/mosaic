'use client'

import { useMemo, useState } from 'react'
import {
  GPUS,
  WORKLOADS,
  estimate,
  LAST_REVIEWED,
  type Gpu,
} from '../lib/hardware-canon'

type Props = {
  /** Preset workload id from WORKLOADS, or 'custom'. Defaults to first preset. */
  workload?: string
  /** Hardware id list to compare side-by-side. Defaults to flagship 4. */
  hardware?: string[]
  /** Override fleet size. Default 1024 GPUs (a typical frontier cluster). */
  gpus?: number
}

const DEFAULT_HW = ['b200', 'mi355x', 'tpu-v6', 'h100']

function fmtHours(h: number): string {
  if (h < 1) return `${(h * 60).toFixed(1)} min`
  if (h < 48) return `${h.toFixed(1)} h`
  return `${(h / 24).toFixed(1)} days`
}

function fmtUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`
  return `$${n.toFixed(0)}`
}

function fmtMwh(n: number): string {
  if (n < 1) return `${(n * 1000).toFixed(0)} kWh`
  if (n >= 1000) return `${(n / 1000).toFixed(2)} GWh`
  return `${n.toFixed(1)} MWh`
}

export function CostCalc({
  workload: initialWorkload,
  hardware,
  gpus = 1024,
}: Props) {
  const presetId = initialWorkload ?? WORKLOADS[0].id
  const initial = WORKLOADS.find((w) => w.id === presetId) ?? WORKLOADS[0]

  const [paramsB, setParamsB] = useState(initial.paramsB)
  const [tokensT, setTokensT] = useState(initial.tokensT)
  const [mfu, setMfu] = useState(initial.mfu)
  const [nGpus, setNGpus] = useState(gpus)

  const compareIds = hardware && hardware.length > 0 ? hardware : DEFAULT_HW
  const compareGpus = compareIds
    .map((id) => GPUS.find((g) => g.id === id))
    .filter((g): g is Gpu => Boolean(g))

  const rows = useMemo(() => {
    const wl = { id: 'custom', label: 'custom', paramsB, tokensT, mfu }
    return compareGpus.map((g) => ({ gpu: g, est: estimate(wl, g, nGpus) }))
  }, [compareGpus, paramsB, tokensT, mfu, nGpus])

  const cheapest = rows.reduce(
    (best, r) => (r.est.costUsd < best.est.costUsd ? r : best),
    rows[0],
  )
  const fastest = rows.reduce(
    (best, r) => (r.est.hours < best.est.hours ? r : best),
    rows[0],
  )

  function applyPreset(id: string) {
    const w = WORKLOADS.find((x) => x.id === id)
    if (!w) return
    setParamsB(w.paramsB)
    setTokensT(w.tokensT)
    setMfu(w.mfu)
  }

  return (
    <div className="m-cost-calc">
      <div className="m-cost-header">
        <span>Training cost · latency · energy</span>
        <span className="m-cost-stamp">canon: {LAST_REVIEWED}</span>
      </div>

      <div className="m-cost-presets">
        {WORKLOADS.map((w) => (
          <button
            key={w.id}
            className="m-cost-preset"
            onClick={() => applyPreset(w.id)}
            type="button"
          >
            {w.label}
          </button>
        ))}
      </div>

      <div className="m-cost-inputs">
        <label className="m-cost-input">
          <span>Parameters (B)</span>
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={paramsB}
            onChange={(e) => setParamsB(Number(e.target.value) || 0)}
          />
        </label>
        <label className="m-cost-input">
          <span>Tokens (T)</span>
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={tokensT}
            onChange={(e) => setTokensT(Number(e.target.value) || 0)}
          />
        </label>
        <label className="m-cost-input">
          <span>MFU</span>
          <input
            type="number"
            min={0.05}
            max={0.7}
            step={0.05}
            value={mfu}
            onChange={(e) => setMfu(Number(e.target.value) || 0)}
          />
        </label>
        <label className="m-cost-input">
          <span>GPUs</span>
          <input
            type="number"
            min={1}
            step={1}
            value={nGpus}
            onChange={(e) => setNGpus(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
          />
        </label>
      </div>

      <div className="m-cost-table-wrap">
        <table className="m-cost-table">
          <thead>
            <tr>
              <th>Hardware</th>
              <th>Time</th>
              <th>Cost</th>
              <th>Energy</th>
              <th>$/hr · GPU</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ gpu, est }) => (
              <tr key={gpu.id}>
                <td>
                  <span className="m-cost-gpu-name">{gpu.name}</span>
                  <span className="m-cost-gpu-meta">
                    {gpu.fp8Tflops.toLocaleString()} TF/s · {gpu.hbmGb} GB
                  </span>
                </td>
                <td>
                  {fmtHours(est.hours)}
                  {gpu.id === fastest.gpu.id && rows.length > 1 && (
                    <span className="m-cost-badge">fastest</span>
                  )}
                </td>
                <td>
                  {fmtUsd(est.costUsd)}
                  {gpu.id === cheapest.gpu.id && rows.length > 1 && (
                    <span className="m-cost-badge">cheapest</span>
                  )}
                </td>
                <td>{fmtMwh(est.energyMWh)}</td>
                <td className="m-cost-rate">${gpu.pricePerHr.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="m-cost-footer">
        FLOPs ≈ 6 × N × D · MFU is the fraction of peak you actually achieve ·
        Numbers are on-demand cloud rates and will be lower under reservation.
      </div>
    </div>
  )
}
