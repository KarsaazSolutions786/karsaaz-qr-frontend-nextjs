// lib/utils/__tests__/playground-helpers.test.ts
import { describe, it, expect } from 'vitest'
import {
  buildUrl,
  buildQueryString,
  buildFullUrl,
  buildCurlSnippet,
  buildFetchSnippet,
  buildPythonSnippet,
  buildPhpSnippet,
} from '../playground-helpers'

describe('buildUrl', () => {
  it('substitutes a single path param', () => {
    expect(buildUrl('/qrcodes/{id}', { id: '42' })).toBe('/qrcodes/42')
  })

  it('leaves unset path params as placeholder', () => {
    expect(buildUrl('/qrcodes/{id}', {})).toBe('/qrcodes/{id}')
  })

  it('handles paths with no params', () => {
    expect(buildUrl('/account', {})).toBe('/account')
  })

  it('handles multiple path params', () => {
    expect(buildUrl('/orgs/{orgId}/keys/{keyId}', { orgId: '1', keyId: '5' })).toBe(
      '/orgs/1/keys/5'
    )
  })
})

describe('buildQueryString', () => {
  it('returns empty string for empty params', () => {
    expect(buildQueryString({})).toBe('')
  })

  it('skips empty string values', () => {
    expect(buildQueryString({ period: '', page: '1' })).toBe('?page=1')
  })

  it('encodes special characters', () => {
    expect(buildQueryString({ search: 'hello world' })).toBe('?search=hello+world')
  })

  it('builds multiple params', () => {
    const qs = buildQueryString({ page: '1', per_page: '15' })
    expect(qs).toBe('?page=1&per_page=15')
  })
})

describe('buildFullUrl', () => {
  it('combines base, basePath, path, and query', () => {
    const url = buildFullUrl('http://localhost:8000', '/v1', '/qrcodes', {}, { page: '2' })
    expect(url).toBe('http://localhost:8000/api/v1/qrcodes?page=2')
  })

  it('resolves path params', () => {
    const url = buildFullUrl('http://localhost:8000', '/v1', '/qrcodes/{id}', { id: '5' }, {})
    expect(url).toBe('http://localhost:8000/api/v1/qrcodes/5')
  })
})

describe('buildCurlSnippet', () => {
  it('produces a GET curl without -d flag', () => {
    const result = buildCurlSnippet({
      method: 'GET',
      fullUrl: 'https://api.example.com/v1/qrcodes',
      apiKey: 'sk_test_abc',
      body: '',
    })
    expect(result).toContain('curl -X GET')
    expect(result).toContain('"https://api.example.com/v1/qrcodes"')
    expect(result).toContain('Authorization: Bearer sk_test_abc')
    expect(result).not.toContain('-d ')
  })

  it('includes -d flag for POST with body', () => {
    const result = buildCurlSnippet({
      method: 'POST',
      fullUrl: 'https://api.example.com/v1/qrcodes',
      apiKey: 'sk_test_abc',
      body: '{"title":"test"}',
    })
    expect(result).toContain("-d '")
    expect(result).toContain('"title":"test"')
  })

  it('does not include body for DELETE', () => {
    const result = buildCurlSnippet({
      method: 'DELETE',
      fullUrl: 'https://api.example.com/v1/qrcodes/1',
      apiKey: 'sk_test_abc',
      body: '{"some":"data"}',
    })
    expect(result).not.toContain('-d ')
  })
})

describe('buildFetchSnippet', () => {
  it('produces valid JS for GET request', () => {
    const result = buildFetchSnippet({
      method: 'GET',
      fullUrl: 'https://api.example.com/v1/account',
      apiKey: 'sk_abc',
      body: '',
    })
    expect(result).toContain("fetch('https://api.example.com/v1/account'")
    expect(result).toContain("method: 'GET'")
    expect(result).toContain('Bearer sk_abc')
    expect(result).not.toContain('body:')
  })

  it('includes body for POST', () => {
    const result = buildFetchSnippet({
      method: 'POST',
      fullUrl: 'https://api.example.com/v1/qrcodes',
      apiKey: 'sk_abc',
      body: '{"title":"x"}',
    })
    expect(result).toContain('body: JSON.stringify(')
    expect(result).toContain('Content-Type')
  })
})

describe('buildPythonSnippet', () => {
  it('uses requests.get for GET', () => {
    const result = buildPythonSnippet({
      method: 'GET',
      fullUrl: 'https://api.example.com/v1/account',
      apiKey: 'sk_abc',
      body: '',
    })
    expect(result).toContain('import requests')
    expect(result).toContain('requests.get(')
    expect(result).toContain('Bearer sk_abc')
    expect(result).not.toContain('json=payload')
  })

  it('includes payload for POST', () => {
    const result = buildPythonSnippet({
      method: 'POST',
      fullUrl: 'https://api.example.com/v1/qrcodes',
      apiKey: 'sk_abc',
      body: '{"title":"test"}',
    })
    expect(result).toContain('import json')
    expect(result).toContain('requests.post(')
    expect(result).toContain('json=payload')
    expect(result).toContain("json.loads('")
  })
})

describe('buildPhpSnippet', () => {
  it('produces PHP curl code', () => {
    const result = buildPhpSnippet({
      method: 'GET',
      fullUrl: 'https://api.example.com/v1/account',
      apiKey: 'sk_abc',
      body: '',
    })
    expect(result).toContain('<?php')
    expect(result).toContain('curl_init()')
    expect(result).toContain('CURLOPT_CUSTOMREQUEST => "GET"')
    expect(result).toContain('Bearer sk_abc')
  })
})
