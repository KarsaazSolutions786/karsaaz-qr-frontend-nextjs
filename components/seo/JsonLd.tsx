interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * Render a JSON-LD script tag for structured data.
 * Place inside <head> or at the top of a page component.
 *
 * @example
 * <JsonLd data={blogPostSchema(post)} />
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

export default JsonLd
