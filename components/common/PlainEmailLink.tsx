/**
 * Cloudflare email obfuscation bypass (F-10): render addresses with <!--email_off--> wrappers.
 * @see https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/
 */

export function getPlainEmailLinkInnerHtml(email: string, className?: string): string {
  const safeEmail = email.replace(/"/g, '')
  const cls = className ? ` class="${className.replace(/"/g, '')}"` : ''
  return `<!--email_off--><a href="mailto:${safeEmail}"${cls}>${safeEmail}</a><!--/email_off-->`
}

type PlainEmailLinkProps = {
  email: string
  className?: string
}

export function PlainEmailLink({ email, className }: PlainEmailLinkProps) {
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: getPlainEmailLinkInnerHtml(email, className) }} />
      <noscript>{email}</noscript>
    </>
  )
}
