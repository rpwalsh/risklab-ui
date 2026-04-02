import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['packages/ui/src/**/*.ts', 'packages/workbench/src/**/*.{ts,tsx}', 'ui/**/*.{ts,tsx}'],
      exclude: [
        'packages/ui/src/index.ts',
        'packages/workbench/src/index.ts',
        'ui/**/src/index.ts',
        'ui/**/dist/**',
      ],
    },
    setupFiles: ['tests/setup.ts'],
  },
});
