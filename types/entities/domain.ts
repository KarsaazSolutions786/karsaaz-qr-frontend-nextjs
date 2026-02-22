export type DomainStatus = 'pending' | 'verified' | 'failed'

export interface Domain {
  id: string // UUID
  userId: string
  domain: string // e.g., "qr.example.com"
  status: DomainStatus
  isDefault: boolean // Whether this is the default domain for new QR codes
  dnsRecords: DNSRecord[] // DNS records to verify
  verifiedAt?: string // ISO 8601 (when verified)
  createdAt: string
  updatedAt: string
}

export interface DNSRecord {
  type: 'A' | 'CNAME' | 'TXT'
  name: string // e.g., "@" or "qr"
  value: string // Expected value
  status: 'pending' | 'verified' | 'failed' | 'valid' | 'invalid'
}

export interface DomainConnectivity {
  is_connected: boolean
  dns_records: DNSRecord[]
  ssl_status: 'pending' | 'active' | 'expired' | 'error'
  last_checked_at: string
}
