import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FileUploadPreview from '@/components/public/file-upload/FileUploadPreview'
import { getQRCodeRedirect } from '@/lib/api/public-qrcodes'

interface FileUploadData {
  name: string
  file_url?: string
  file_name?: string
  file_size?: number
  file_type?: string
  description?: string
  expires_at?: string
  branding?: {
    primary_color?: string
    logo_url?: string
    title?: string
  }
}

async function getFileUploadData(slug: string): Promise<FileUploadData | null> {
  try {
    const qrData = await getQRCodeRedirect(slug)

    if (!qrData) return null

    const qrType = (qrData.type || '').toLowerCase()
    if (!['file-upload', 'file', 'download'].includes(qrType)) {
      return null
    }

    return qrData.data as FileUploadData
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const fileUpload = await getFileUploadData(slug)

  if (!fileUpload) {
    return {
      title: 'File Not Found',
      description: 'The requested file could not be found.',
    }
  }

  return {
    title: `${fileUpload.name || 'Download'} - File Download`,
    description: fileUpload.description || `Download ${fileUpload.name}`,
    openGraph: {
      title: fileUpload.name || 'Download File',
      description: fileUpload.description || 'Download file',
      type: 'website',
    },
  }
}

export default async function FileUploadPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const fileUpload = await getFileUploadData(slug)

  if (!fileUpload) {
    notFound()
  }

  return <FileUploadPreview fileUpload={fileUpload} />
}
