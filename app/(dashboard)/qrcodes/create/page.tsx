import { redirect } from 'next/navigation'

export default function QRCodeCreateRedirect() {
  redirect('/qrcodes/new')
}
