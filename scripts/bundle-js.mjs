// bundle-js.mjs — concatenates the already-minified per-module output from
// esbuild into a single dist/js/app.js. Run after `build:js`.
//
// Why: index.html used to load each module as its own <script> tag (12
// requests). On a bandwidth-constrained connection (e.g. Lighthouse's Slow
// 4G mobile profile) those requests compete for the same limited throughput
// and serialize the point at which the last one finishes, which pushes back
// DOMContentLoaded and therefore every module's init — including
// reveal.js's fade-in, which was showing up as a Speed Index regression
// well after First Contentful Paint / Largest Contentful Paint. Shipping
// one file removes that per-request tax.
//
// Order matters only in that main.js's boot() must run after every
// Affinity.init* function has been assigned, so it's concatenated last;
// the modules before it just assign functions onto the shared `Affinity`
// namespace and don't depend on each other's order.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const files = [
  'dist/js/modules/whatsapp.js',
  'dist/js/modules/nav.js',
  'dist/js/modules/reveal.js',
  'dist/js/modules/magnetic-button.js',
  'dist/js/modules/logo-particles.js',
  'dist/js/modules/parallax.js',
  'dist/js/modules/cursor-glow.js',
  'dist/js/modules/brand-motion.js',
  'dist/js/modules/video-modal.js',
  'dist/js/modules/portfolio-load-more.js',
  'dist/js/modules/reviews-carousel.js',
  'dist/js/main.js',
];

const outFile = 'dist/js/app.js';

const bundle = files
  .map((f) => readFileSync(f, 'utf8').trim())
  .join('\n');

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, bundle + '\n');

console.log(`Bundled ${files.length} files into ${outFile}`);
