/* eslint-disable @next/next/no-html-link-for-pages */
import { describe, it, expect } from 'vitest'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import { render } from '@testing-library/react'
import React from 'react'

expect.extend(toHaveNoViolations)

const axe = configureAxe({
  rules: {
    // Disable color-contrast in jsdom (unreliable without real rendering)
    'color-contrast': { enabled: false },
  },
})

async function checkA11y(ui: React.ReactElement) {
  const { container } = render(ui)
  const results = await axe(container)
  return results
}

describe('Accessibility: Critical Components', () => {
  it('renders an empty page shell without a11y violations', async () => {
    const results = await checkA11y(
      <main>
        <h1>Karsaaz QR</h1>
        <nav aria-label="Main navigation">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
          </ul>
        </nav>
      </main>
    )
    expect(results).toHaveNoViolations()
  })

  it('renders a form without a11y violations', async () => {
    const results = await checkA11y(
      <form aria-label="QR Code Generator">
        <label htmlFor="url-input">URL</label>
        <input id="url-input" type="url" placeholder="https://example.com" />
        <button type="submit">Generate QR Code</button>
      </form>
    )
    expect(results).toHaveNoViolations()
  })

  it('renders an image with alt text without violations', async () => {
    const results = await checkA11y(
      <div role="img" aria-label="QR Code preview">
        <img src="/placeholder.png" alt="Generated QR code" />
      </div>
    )
    expect(results).toHaveNoViolations()
  })
})
