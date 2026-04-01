import { defineConfig } from 'tsdown';

export default defineConfig(options => ({
  ...options,

  cjsDefault: true,
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
