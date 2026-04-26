/**
 * Hardware canon — single source of truth for "what's on the floor today."
 *
 * Numbers are intentionally rounded and represent realistic dense-FP8
 * throughput at typical MFU, plus on-demand cloud pricing as of
 * 2026-04-26. Update this file quarterly. Lessons import from here so
 * a single edit propagates everywhere.
 */

export type Gpu = {
  id: string
  name: string
  vendor: 'NVIDIA' | 'AMD' | 'Google' | 'Cerebras' | 'Groq'
  /** Dense FP8 peak in TFLOPS (sparsity NOT included). */
  fp8Tflops: number
  /** HBM capacity per device in GB. */
  hbmGb: number
  /** HBM bandwidth in TB/s. */
  hbmBandwidthTbs: number
  /** TDP in watts (typical configured max). */
  tdpW: number
  /** Approximate on-demand price in USD per GPU-hour (April 2026, cloud avg). */
  pricePerHr: number
  /** Year of broad availability for the chip. */
  year: number
}

export const GPUS: Gpu[] = [
  {
    id: 'b200',
    name: 'NVIDIA B200',
    vendor: 'NVIDIA',
    fp8Tflops: 4500,
    hbmGb: 192,
    hbmBandwidthTbs: 8.0,
    tdpW: 1000,
    pricePerHr: 6.0,
    year: 2025,
  },
  {
    id: 'gb200',
    name: 'NVIDIA GB200 (per-GPU)',
    vendor: 'NVIDIA',
    fp8Tflops: 5000,
    hbmGb: 192,
    hbmBandwidthTbs: 8.0,
    tdpW: 1200,
    pricePerHr: 8.0,
    year: 2025,
  },
  {
    id: 'h100',
    name: 'NVIDIA H100 (SXM5)',
    vendor: 'NVIDIA',
    fp8Tflops: 1979,
    hbmGb: 80,
    hbmBandwidthTbs: 3.35,
    tdpW: 700,
    pricePerHr: 2.5,
    year: 2023,
  },
  {
    id: 'mi355x',
    name: 'AMD MI355X',
    vendor: 'AMD',
    fp8Tflops: 5000,
    hbmGb: 288,
    hbmBandwidthTbs: 8.0,
    tdpW: 1400,
    pricePerHr: 5.5,
    year: 2025,
  },
  {
    id: 'mi300x',
    name: 'AMD MI300X',
    vendor: 'AMD',
    fp8Tflops: 2615,
    hbmGb: 192,
    hbmBandwidthTbs: 5.3,
    tdpW: 750,
    pricePerHr: 3.5,
    year: 2024,
  },
  {
    id: 'tpu-v6',
    name: 'Google TPU v6 (Trillium)',
    vendor: 'Google',
    fp8Tflops: 4500,
    hbmGb: 96,
    hbmBandwidthTbs: 7.4,
    tdpW: 700,
    pricePerHr: 4.0,
    year: 2024,
  },
]

/** Default presets so a lesson doesn't have to spec everything. */
export type Workload = {
  id: string
  label: string
  /** Total trainable parameters in billions. */
  paramsB: number
  /** Tokens to train, in trillions. */
  tokensT: number
  /** Realistic MFU at this scale on modern hardware. */
  mfu: number
}

export const WORKLOADS: Workload[] = [
  { id: 'train-7b',  label: 'Train 7B dense',          paramsB: 7,   tokensT: 2,    mfu: 0.45 },
  { id: 'train-70b', label: 'Train 70B dense',         paramsB: 70,  tokensT: 5,    mfu: 0.45 },
  { id: 'train-r1',  label: 'Train DeepSeek-R1 size',  paramsB: 671, tokensT: 14.8, mfu: 0.40 },
]

/**
 * Total training FLOPs ≈ 6 × N × D (Hoffmann et al., "Chinchilla").
 * Returns FLOPs as a plain number (large; expect ~1e22+ for frontier models).
 */
export function trainFlops(paramsB: number, tokensT: number): number {
  return 6 * paramsB * 1e9 * tokensT * 1e12
}

export type Estimate = {
  hours: number
  costUsd: number
  energyMWh: number
}

/**
 * Estimate training time, cost, and energy for a given workload on a fixed
 * fleet of one GPU type. Compute is FLOPs / (peak × MFU × n_gpus).
 */
export function estimate(
  workload: Workload,
  gpu: Gpu,
  nGpus: number,
): Estimate {
  const flops = trainFlops(workload.paramsB, workload.tokensT)
  const peakFlopsPerSec = gpu.fp8Tflops * 1e12 * workload.mfu * nGpus
  const seconds = flops / peakFlopsPerSec
  const hours = seconds / 3600
  return {
    hours,
    costUsd: hours * gpu.pricePerHr * nGpus,
    energyMWh: (hours * gpu.tdpW * nGpus) / 1_000_000,
  }
}

/** Last time this canon was reviewed. CI lints stale entries against this. */
export const LAST_REVIEWED = '2026-04-26'
