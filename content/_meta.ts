export default {
  index: {
    title: 'Welcome',
    display: 'hidden',
    theme: {
      layout: 'full',
      sidebar: false,
      toc: false,
      breadcrumb: false,
      pagination: false,
      footer: false,
    },
  },
  '---': { type: 'separator', title: 'Tracks' },
  foundations: 'Systems Foundations',
  'ml-execution': 'ML Execution & Quantization',
  training: 'Training & RLHF',
  'llm-architecture': 'LLM Architecture',
  compilers: 'ML Compilers & Hardware',
  applied: 'Applied AI · Build & Ship',
  'edge-ai': 'Edge AI · On-Device',
  '-- links': { type: 'separator', title: 'Reference' },
  'learning-paths': 'Learning Paths',
  cheatsheet: {
    title: 'Cheatsheet',
    theme: { layout: 'full', sidebar: false, toc: false, breadcrumb: false, pagination: false },
  },
  map: {
    title: 'Map',
    theme: { layout: 'full', sidebar: false, toc: false, breadcrumb: false, pagination: false },
  },
}
