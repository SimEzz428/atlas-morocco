import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default [
  ...nextVitals,
  ...nextTs,
  {
    ignores: ['.next/**', 'node_modules/**', 'playwright-report/**', 'test-results/**', 'public/sw.js', 'next-env.d.ts'],
  },
  {
    rules: {
      // Route handlers log failures server-side; keep warnings for stray client logs.
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },
];
