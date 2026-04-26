import nextra from 'nextra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// GitHub Pages: basePath = `/<repo-name>`. Override at build time:
//   NEXT_PUBLIC_BASE_PATH=/mosaic npm run build
// For root deploys (user.github.io or a custom domain), set NEXT_PUBLIC_BASE_PATH=''
const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? (process.env.NEXT_PUBLIC_BASE_PATH ?? '/mosaic') : ''

const withNextra = nextra({
  search: { codeblocks: false },
  defaultShowCopyCode: true,
  latex: true,
})

export default withNextra({
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  // Replace Nextra's bundled Mermaid component (which forces a light theme on
  // non-`html.dark` DOMs) with our brand-themed one. The remark-mermaid plugin
  // emits `import { Mermaid } from '@theguild/remark-mermaid/mermaid'`; this
  // alias redirects that import to our component.
  webpack(config) {
    config.resolve.alias['@theguild/remark-mermaid/mermaid'] = path.resolve(
      __dirname,
      'components/Mermaid.tsx',
    )
    return config
  },
})
