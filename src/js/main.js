/**
 * main.js — entry point. Waits for the DOM, then boots every module
 * registered on the shared `Affinity` namespace (see src/js/modules/).
 * Plain <script> includes (not ES modules) are used deliberately so the
 * page still runs when opened directly from disk via file://, where
 * module imports are blocked by CORS.
 */
(function () {
  function boot() {
    document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

    Affinity.initWhatsApp && Affinity.initWhatsApp();
    Affinity.initNav && Affinity.initNav();
    Affinity.initReveal && Affinity.initReveal();
    Affinity.initMagneticButtons && Affinity.initMagneticButtons();
    Affinity.initLogoParticles && Affinity.initLogoParticles();
    Affinity.initParallax && Affinity.initParallax();
    Affinity.initCursorGlow && Affinity.initCursorGlow();
    Affinity.initHeroTilt && Affinity.initHeroTilt();
    Affinity.initProcessProgress && Affinity.initProcessProgress();
    Affinity.initVideoModal && Affinity.initVideoModal();
    Affinity.initPortfolioLoadMore && Affinity.initPortfolioLoadMore();
    Affinity.initReviewsCarousel && Affinity.initReviewsCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
