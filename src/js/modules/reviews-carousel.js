/**
 * reviews-carousel.js — arrow + dot navigation for the client reviews strip,
 * plus a ~3s autoplay. The strip itself is a native overflow-x scroll-snap
 * track (see [data-reviews-track] in index.html), so touch/trackpad
 * swiping and keyboard scrolling already work with zero JS; this module
 * syncs the prev/next buttons and dot indicators to whichever card is
 * currently in view, lets clicking either drive the scroll position, and
 * advances to the next card on a timer. Dots are built here (one per card)
 * rather than hand-written in the markup, so adding or removing a review
 * card doesn't require also editing a dot list.
 *
 * Autoplay pauses on hover/focus/touch anywhere in the carousel (track,
 * arrows, or dots) and resumes when the pointer/focus leaves, so it never
 * fights a reader who's actually looking at a card or navigating manually.
 * It also pauses while the tab isn't visible, and is skipped entirely under
 * prefers-reduced-motion.
 */
window.Affinity = window.Affinity || {};

Affinity.initReviewsCarousel = function initReviewsCarousel() {
  var track = document.querySelector('[data-reviews-track]');
  var prevBtn = document.querySelector('[data-reviews-prev]');
  var nextBtn = document.querySelector('[data-reviews-next]');
  var dotsWrap = document.querySelector('[data-reviews-dots]');
  if (!track) return;

  var cards = Array.prototype.slice.call(track.children);
  if (!cards.length) return;

  var dots = cards.map(function (_, index) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'h-2 w-2 rounded-full bg-ink/20 transition-all duration-300';
    dot.setAttribute('data-dot', '');
    dot.setAttribute('aria-label', 'Go to review ' + (index + 1));
    if (dotsWrap) dotsWrap.appendChild(dot);
    return dot;
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var activeIndex = 0;
  var scrollRaf = null;

  function cardOffset(card) {
    return card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  }

  function setActive(index) {
    activeIndex = index;
    dots.forEach(function (dot, i) {
      var active = i === index;
      dot.classList.toggle('bg-accent', active);
      dot.classList.toggle('w-6', active);
      dot.classList.toggle('w-2', !active);
      dot.classList.toggle('bg-ink/20', !active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === cards.length - 1;
  }

  function goTo(index) {
    var clamped = Math.max(0, Math.min(cards.length - 1, index));
    track.scrollTo({ left: cardOffset(cards[clamped]), behavior: reduceMotion ? 'auto' : 'smooth' });
    setActive(clamped);
  }

  // Figure out which card is closest to the track's left edge (i.e.
  // currently "in view") after a swipe, trackpad scroll, or keyboard nudge,
  // and sync the dots/arrows to it. rAF-debounced since scroll fires fast.
  function onScroll() {
    if (scrollRaf) return;
    scrollRaf = window.requestAnimationFrame(function () {
      scrollRaf = null;
      var closest = 0;
      var closestDist = Infinity;
      cards.forEach(function (card, i) {
        var dist = Math.abs(cardOffset(card) - track.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      if (closest !== activeIndex) setActive(closest);
    });
  }

  track.addEventListener('scroll', onScroll, { passive: true });

  var AUTOPLAY_DELAY = 3000;
  var autoplayId = null;
  var autoplayEnabled = !reduceMotion && cards.length > 1;

  function stopAutoplay() {
    if (!autoplayId) return;
    window.clearInterval(autoplayId);
    autoplayId = null;
  }

  function startAutoplay() {
    if (!autoplayEnabled || autoplayId) return;
    autoplayId = window.setInterval(function () {
      goTo((activeIndex + 1) % cards.length);
    }, AUTOPLAY_DELAY);
  }

  // Any manual navigation (arrow, dot, or a drag/swipe that lands on a new
  // card) resets the countdown instead of letting autoplay jump again a
  // moment later.
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(activeIndex - 1); restartAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(activeIndex + 1); restartAutoplay(); });

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () { goTo(index); restartAutoplay(); });
  });

  [track.parentElement, dotsWrap].forEach(function (root) {
    if (!root) return;
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);
    root.addEventListener('touchstart', stopAutoplay, { passive: true });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  setActive(0);
  startAutoplay();
};
