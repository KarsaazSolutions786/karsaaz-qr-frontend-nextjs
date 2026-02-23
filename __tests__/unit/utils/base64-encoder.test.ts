import { describe, it, expect } from 'vitest'
import {
  encodeBase64,
  decodeBase64,
  encodeBase64Url,
  decodeBase64Url,
} from '@/lib/utils/base64-encoder'

describe('base64-encoder', () => {
  it('encodes and decodes ASCII strings', () => {
    const input = 'Hello, World!'
    expect(decodeBase64(encodeBase64(input))).toBe(input)
  })

  it('encodes to valid base64', () => {
    expect(encodeBase64('abc')).toBe('YWJj')
  })

  it('handles Unicode characters', () => {
    const input = '你好世界 🚀'
    expect(decodeBase64(encodeBase64(input))).toBe(input)
  })

  it('handles empty string', () => {
    expect(encodeBase64('')).toBe('')
    expect(decodeBase64('')).toBe('')
  })

  it('encodeBase64Url produces URL-safe output', () => {
    // A string that produces +, /, or = in standard base64
    const input = '>>>???'
    const encoded = encodeBase64Url(input)
    expect(encoded).not.toMatch(/[+/=]/)
  })

  it('decodeBase64Url reverses encodeBase64Url', () => {
    const input = 'Hello, URL-safe base64!'
    expect(decodeBase64Url(encodeBase64Url(input))).toBe(input)
  })

  it('decodeBase64Url handles padding correctly', () => {
    // 1 char → base64 length 4, 2 chars → pad ==, 3 chars → pad =
    expect(decodeBase64Url(encodeBase64Url('ab'))).toBe('ab')
    expect(decodeBase64Url(encodeBase64Url('abc'))).toBe('abc')
    expect(decodeBase64Url(encodeBase64Url('abcd'))).toBe('abcd')
  })
})
