'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

export interface BillingAddress {
  full_name: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal_code: string
  country: string
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'SG', name: 'Singapore' },
]

interface BillingAddressFormProps {
  value: BillingAddress
  onChange: (address: BillingAddress) => void
}

export function BillingAddressForm({ value, onChange }: BillingAddressFormProps) {
  const update = (field: keyof BillingAddress, val: string) => {
    onChange({ ...value, [field]: val })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Billing Address</h3>

      <div>
        <Label htmlFor="billing-name">Full Name</Label>
        <Input
          id="billing-name"
          value={value.full_name}
          onChange={(e) => update('full_name', e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div>
        <Label htmlFor="billing-line1">Address Line 1</Label>
        <Input
          id="billing-line1"
          value={value.address_line_1}
          onChange={(e) => update('address_line_1', e.target.value)}
          placeholder="123 Main Street"
        />
      </div>

      <div>
        <Label htmlFor="billing-line2">Address Line 2</Label>
        <Input
          id="billing-line2"
          value={value.address_line_2}
          onChange={(e) => update('address_line_2', e.target.value)}
          placeholder="Apt 4B (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="billing-city">City</Label>
          <Input
            id="billing-city"
            value={value.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="New York"
          />
        </div>
        <div>
          <Label htmlFor="billing-state">State / Province</Label>
          <Input
            id="billing-state"
            value={value.state}
            onChange={(e) => update('state', e.target.value)}
            placeholder="NY"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="billing-postal">Postal Code</Label>
          <Input
            id="billing-postal"
            value={value.postal_code}
            onChange={(e) => update('postal_code', e.target.value)}
            placeholder="10001"
          />
        </div>
        <div>
          <Label>Country</Label>
          <Select value={value.country} onValueChange={(val) => update('country', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export const DEFAULT_BILLING_ADDRESS: BillingAddress = {
  full_name: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
}
