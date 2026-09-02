/**
 * reveal.js — lightweight scroll-triggered fade/slide-in for any element
 * marked with [data-reveal]. Honors an optional [data-reveal-delay] (ms)
 * for staggered groups, and no-ops entirely under prefers-reduced-motion.
 */
window.Affinity = window.Affinity || {};

Affinity.initReveal = function initReveal() {
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!items.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = reduceMotion ? 'none' : 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    var delay = el.getAttribute('data-reveal-delay');
    if (delay) el.style.transitionDelay = delay + 'ms';
  });

  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(function (el) {
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

  items.forEach(function (el) {
    observer.observe(el);
  });
};
