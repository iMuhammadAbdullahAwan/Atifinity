/**
 * magnetic-button.js — makes [data-magnetic] buttons drift a few pixels
 * toward the cursor while hovered, matching the "Magnetic Button"
 * animation idea from the design sketch. Skipped on touch/coarse
 * pointers and under prefers-reduced-motion, where it would add
 * nothing but jitter.
 */
window.Affinity = window.Affinity || {};

Affinity.initMagneticButtons = function initMagneticButtons() {
  var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarsePointer || reduceMotion) return;

  var strength = 0.35;

  document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
    btn.addEventListener('mousemove', function (event) {
      var rect = btn.getBoundingClientRect();
      var x = event.clientX - rect.left - rect.width / 2;
      var y = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + x * strength + 'px, ' + y * strength + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'translate(0, 0)';
    });
  });
};
