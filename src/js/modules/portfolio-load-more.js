/**
 * portfolio-load-more.js — reveals the portfolio grid in batches instead of
 * shipping all 17 videos (and their <video> elements) on first paint. Cards
 * past the initial batch carry [data-portfolio-hidden] + Tailwind's
 * `hidden` in the markup itself (see index.html) so there's no flash of
 * the full grid before this module runs; each click un-hides the next
 * batch with a short staggered fade, matching the [data-reveal] motion
 * used elsewhere on the page.
 */
window.Affinity = window.Affinity || {};

Affinity.initPortfolioLoadMore = function initPortfolioLoadMore() {
  var grid = document.querySelector('[data-portfolio-grid]');
  var btn = document.querySelector('[data-portfolio-load-more]');
  if (!grid || !btn) return;

  var BATCH_SIZE = 6;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-video-modal]'));
  var pending = cards.filter(function (card) {
    return card.hasAttribute('data-portfolio-hidden');
  });
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateButton() {
    if (!pending.length) btn.hidden = true;
  }

  function revealBatch() {
    var batch = pending.splice(0, BATCH_SIZE);

    batch.forEach(function (card, i) {
      card.removeAttribute('data-portfolio-hidden');
      card.classList.remove('hidden');

      if (reduceMotion) return;

      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      window.setTimeout(function () {
        card.style.opacity = '1';
        card.style.transform = 'none';
      }, i * 70 + 20);
    });

    updateButton();
  }

  updateButton();
  if (!pending.length) return;

  btn.addEventListener('click', revealBatch);
};
