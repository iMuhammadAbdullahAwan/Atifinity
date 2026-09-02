/**
 * cursor-glow.js — soft radial light that trails the pointer across the
 * page, reinforcing the "Interactive Elements: hover effects, cursor
 * interactions" feature from the design brief. Desktop/fine-pointer only;
 * skipped on touch devices and under prefers-reduced-motion.
 */
window.Affinity = window.Affinity || {};

Affinity.initCursorGlow = function initCursorGlow() {
  var glow = document.getElementById('cursorGlow');
  if (!glow) return;

  var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarsePointer || reduceMotion) return;

  var size = glow.offsetWidth || 288;
  var raf = null;
  var latestX = 0;
  var latestY = 0;

  function render() {
    glow.style.transform = 'translate3d(' + (latestX - size / 2) + 'px,' + (latestY - size / 2) + 'px,0)';
    raf = null;
  }

  window.addEventListener(
    'pointermove',
    function (event) {
      latestX = event.clientX;
      latestY = event.clientY;
      glow.style.opacity = '1';
      if (!raf) raf = window.requestAnimationFrame(render);
    },
    { passive: true }
  );

  document.addEventListener('mouseleave', function () {
    glow.style.opacity = '0';
  });
};
