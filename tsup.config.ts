import type { Options } from 'tsup';

import { defineConfig } from 'tsup';

export default defineConfig((options: Options) => ({
  ...options,

  cjsInterop: true,
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  minify: false,
  shims: true,
  silent: !options.watch,
  sourcemap: true,
  splitting: true,
  treeshake: true,
}));
