import { vi } from 'vitest'

const clipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
}

Object.defineProperty(globalThis, 'navigator', {
  value: {
    ...(typeof globalThis.navigator === 'object' ? globalThis.navigator : {}),
    clipboard,
  },
  configurable: true,
  writable: true,
})

Object.defineProperty(globalThis, 'alert', {
  value: vi.fn(),
  configurable: true,
  writable: true,
})
