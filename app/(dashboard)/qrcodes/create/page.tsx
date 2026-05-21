import { redirect } from 'next/navigation'

/**
 * Purpose: Executes QRCodeCreateRedirect functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function QRCodeCreateRedirect() {
  redirect('/qrcodes/new')
}
