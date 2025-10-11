import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

const options: Options = {
  clean: true,
  entry: ['src/worker.ts'],
  noExternal: [/^@betterlms\/.*$/u, /^@\/.*$/u],
  external: [
    'bcrypt',
  ],
  ignoreWatch: ['../../**/{.git,node_modules,dist}/**'],
  sourcemap: true,
  splitting: false,
};

if (process.env.WATCH) {
  options.watch = ['src/**/*', '../../packages/**/*'];

  options.onSuccess = 'node --env-file=../../.env dist/worker.js';
  options.minify = false;
}

export default defineConfig(options);
