interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * Purpose: Render a JSON-LD script tag for structured data. Place inside <head> or at the top of a page component. <JsonLd data={blogPostSchema(post)} />
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

export default JsonLd
