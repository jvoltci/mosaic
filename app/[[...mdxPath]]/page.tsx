import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { PageWrapper } from '../../components/course/PageWrapper'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: { params: Promise<{ mdxPath: string[] }> }) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

export default async function Page(props: { params: Promise<{ mdxPath: string[] }> }) {
  const params = await props.params
  const result = await importPage(params.mdxPath)
  const { default: MDXContent } = result

  const segments = params.mdxPath ?? []
  const pathname = '/' + segments.join('/')
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

  return (
    <PageWrapper pathname={normalized}>
      <MDXContent {...props} params={params} />
    </PageWrapper>
  )
}
