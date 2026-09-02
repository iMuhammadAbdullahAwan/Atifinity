/**
 * brand-motion.js — the site's small set of signature interactions, kept
 * together in one file since each is a short, self-contained behavior
 * rather than a reusable pattern (see main.js for where each is wired up).
 * Every effect here is transform/opacity/clip-path driven (GPU-friendly),
 * skips itself under prefers-reduced-motion, and no-ops safely if its
 * target markup isn't on the page.
 */
window.Affinity = window.Affinity || {};

/**
 * Hero cursor-tilt — the brand mark drifts into a subtle 3D tilt toward
 * the pointer, echoing the way a real object would catch light. Desktop/
 * fine-pointer only, matching the existing magnetic-button/cursor-glow
 * convention for this class of effect.
 */
Affinity.initHeroTilt = function initHeroTilt() {
  var target = document.getElementById('heroVisual');
  if (!target) return;

  var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarsePointer || reduceMotion) return;

  var section = target.closest('section') || document;
  var raf = null;
  var latestX = 0;
  var latestY = 0;

  function render() {
    target.style.transform =
      'perspective(900px) rotateX(' + latestY + 'deg) rotateY(' + latestX + 'deg)';
    raf = null;
  }

  section.addEventListener(
    'mousemove',
    function (event) {
      var rect = target.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (event.clientX - cx) / (rect.width / 2);
      var dy = (event.clientY - cy) / (rect.height / 2);
      latestX = Math.max(-1, Math.min(1, dx)) * 8; // rotateY, deg
      latestY = Math.max(-1, Math.min(1, dy)) * -8; // rotateX, deg
      if (!raf) raf = window.requestAnimationFrame(render);
    },
    { passive: true }
  );

  section.addEventListener('mouseleave', function () {
    target.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    target.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    window.setTimeout(function () {
      target.style.transition = '';
    }, 600);
  });
};

/**
 * Process scroll-progress — the connecting line across the five steps
 * fills in as the section scrolls through view, so the "journey" reads as
 * continuous rather than five statically-drawn rules.
 */
Affinity.initProcessProgress = function initProcessProgress() {
  var line = document.getElementById('processLine');
  if (!line) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    line.style.width = '100%';
    return;
  }

  var section = line.closest('ol');
  var ticking = false;

  function update() {
    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = (vh - rect.top) / (rect.height + vh * 0.5);
    progress = Math.max(0, Math.min(1, progress));
    line.style.width = (progress * 100).toFixed(1) + '%';
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
