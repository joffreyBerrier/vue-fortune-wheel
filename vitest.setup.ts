import { vi } from 'vitest'

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})

window.dispatchEvent = vi.fn()
