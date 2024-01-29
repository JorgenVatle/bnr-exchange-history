import { defineConfig } from 'tsup';

defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    dts: true,
    sourcemap: true,
})