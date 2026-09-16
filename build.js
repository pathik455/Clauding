const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/extension.js'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node16',
  sourcemap: false,
  minify: false
}).catch(() => process.exit(1));
