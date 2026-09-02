/**
 * parallax.js — "Parallax Glow: background elements move with scroll."
 * Any element carrying [data-parallax="<speed>"] drifts vertically as it
 * passes through the viewport. Speed is a small multiplier (e.g. 0.08); the
 * offset is derived from the element's own distance from viewport-center,
 * so it's naturally bounded — no runaway translation on long pages.
 *
 * Each parallax element must be a "clean" positioning wrapper with no other
 * inline-competing transform/animation of its own (nest the animated/centered
 * visual inside it instead) — see the CTA glow in index.html for the pattern.
 */
window.Affinity = window.Affinity || {};

Affinity.initParallax = function initParallax() {
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (!els.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ticking = false;

  function update() {
    var viewportCenter = window.innerHeight / 2;
    els.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
      var rect = el.getBoundingClientRect();
      var elCenter = rect.top + rect.height / 2;
      var offset = (viewportCenter - elCenter) * speed;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
};
