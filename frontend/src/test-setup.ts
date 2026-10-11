import { vi } from 'vitest';

if (
  typeof window.matchMedia !== 'function'
) {
  Object.defineProperty(
    window,
    'matchMedia',
    {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation(
        (query: string): MediaQueryList => ({
          matches: false,
          media: query,
          onchange: null,

          addListener: vi.fn(),
          removeListener: vi.fn(),

          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),

          dispatchEvent: vi.fn(
            () => false
          )
        } as MediaQueryList)
      )
    }
  );
}
