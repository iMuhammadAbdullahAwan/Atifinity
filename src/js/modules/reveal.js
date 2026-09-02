/**
 * reveal.js — lightweight scroll-triggered fade/slide-in for any element
 * marked with [data-reveal]. Honors an optional [data-reveal-delay] (ms)
 * for staggered groups, and no-ops entirely under prefers-reduced-motion.
 *
 * Elements already sitting in the initial viewport (the hero content, most
 * often) are shown at full opacity immediately instead of being animated in
 * — they're the first thing a visitor sees, so hiding them and fading them
 * back in only delays visual completeness (Speed Index) without helping
 * first paint. The fade/slide treatment is reserved for content that's
 * actually below the fold when the page loads, which is the case the
 * animation was designed for.
 */
window.Affinity = window.Affinity || {};

Affinity.initReveal = function initReveal() {
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!items.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  var offscreen = [];
  items.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    var alreadyVisible = rect.top < viewportHeight && rect.bottom > 0;
    if (alreadyVisible || reduceMotion) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }
    offscreen.push(el);
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    var delay = el.getAttribute('data-reveal-delay');
    if (delay) el.style.transitionDelay = delay + 'ms';
  });

  if (!offscreen.length) return;

  if (!('IntersectionObserver' in window)) {
    offscreen.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  offscreen.forEach(function (el) {
    observer.observe(el);
  });
};
