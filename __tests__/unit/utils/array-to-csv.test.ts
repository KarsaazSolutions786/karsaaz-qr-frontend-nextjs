import { describe, it, expect, vi, beforeEach } from 'vitest'
import { arrayToCSV, downloadCSV } from '@/lib/utils/array-to-csv'

describe('arrayToCSV', () => {
  it('returns empty string for empty array', () => {
    expect(arrayToCSV([])).toBe('')
  })

  it('generates header row from object keys', () => {
    const data = [{ name: 'Alice', age: 30 }]
    const csv = arrayToCSV(data)
    expect(csv.split('\n')[0]).toBe('name,age')
  })

  it('generates data rows', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]
    const csv = arrayToCSV(data)
    const lines = csv.split('\n')
    expect(lines).toHaveLength(3)
    expect(lines[1]).toBe('Alice,30')
    expect(lines[2]).toBe('Bob,25')
  })

  it('escapes cells containing separator', () => {
    const data = [{ value: 'a,b' }]
    expect(arrayToCSV(data)).toContain('"a,b"')
  })

  it('escapes cells containing double quotes', () => {
    const data = [{ value: 'say "hello"' }]
    expect(arrayToCSV(data)).toContain('"say ""hello"""')
  })

  it('escapes cells containing newlines', () => {
    const data = [{ value: 'line1\nline2' }]
    expect(arrayToCSV(data)).toContain('"line1\nline2"')
  })

  it('handles null/undefined values as empty strings', () => {
    const data = [{ a: null, b: undefined }]
    const csv = arrayToCSV(data)
    expect(csv.split('\n')[1]).toBe(',')
  })

  it('supports custom separator', () => {
    const data = [{ x: 1, y: 2 }]
    const csv = arrayToCSV(data, { separator: ';' })
    expect(csv).toBe('x;y\n1;2')
  })
})

describe('downloadCSV', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn(),
    })
  })

  it('creates and clicks a download link', () => {
    const clickSpy = vi.fn()
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLElement)

    downloadCSV([{ a: 1 }], 'test.csv')
    expect(clickSpy).toHaveBeenCalled()
  })
})
