import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    target: 'node12',
    outDir: 'dist',
    dts: true,
    sourcemap: true,
})