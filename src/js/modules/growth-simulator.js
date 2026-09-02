/**
 * growth-simulator.js — "Growth Simulator: Users can simulate potential
 * growth of their channel." Two sliders (current subscribers, uploads per
 * month) drive a live, deliberately simple/illustrative 90-day projection —
 * it's a marketing engagement tool, not an analytics product, so the model
 * favors a satisfying, monotonic curve over statistical rigor.
 */
window.Affinity = window.Affinity || {};

Affinity.initGrowthSimulator = function initGrowthSimulator() {
  var subsInput = document.getElementById('simSubs');
  var uploadsInput = document.getElementById('simUploads');
  if (!subsInput || !uploadsInput) return;

  var subsValueEl = document.getElementById('simSubsValue');
  var uploadsValueEl = document.getElementById('simUploadsValue');
  var resultSubsEl = document.getElementById('simResultSubs');
  var resultViewsEl = document.getElementById('simResultViews');
  var resultMultiplierEl = document.getElementById('simResultMultiplier');
  var barsEl = document.getElementById('simBars');

  var BAR_COUNT = 12;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build the bar elements once; only their height is updated afterwards.
  var bars = [];
  if (barsEl) {
    for (var i = 0; i < BAR_COUNT; i++) {
      var bar = document.createElement('div');
      bar.className = 'flex-1 min-w-[3px] rounded-t-sm bg-gradient-to-t from-primary to-accent';
      bar.style.height = '4%';
      bar.style.transition = reduceMotion ? 'none' : 'height 0.6s cubic-bezier(0.16,1,0.3,1)';
      barsEl.appendChild(bar);
      bars.push(bar);
    }
  }

  function formatCompact(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
    return String(Math.round(n));
  }

  function project(subs, uploads) {
    // Illustrative 90-day growth model: more frequent uploads compound a
    // higher effective monthly rate, applied against a healthy floor so the
    // simulator still feels alive at 0 subscribers.
    var base = Math.max(subs, 800);
    var monthlyRate = 0.05 + uploads * 0.018; // 1 upload/mo ≈ 6.8%, 30 ≈ 59%
    var newSubs = Math.round(base * (Math.pow(1 + monthlyRate, 3) - 1) + uploads * 120);
    var projectedViews = Math.round(newSubs * 13.5 + subs * 0.6);
    var multiplier = Math.max(1, (subs + newSubs) / Math.max(subs, 1));
    return { newSubs: newSubs, projectedViews: projectedViews, multiplier: multiplier };
  }

  function renderBars() {
    if (!bars.length) return;
    // A gently accelerating curve across the 12 weeks so the chart reads as
    // "growth ramping up" rather than a flat wall of equal bars.
    for (var i = 0; i < bars.length; i++) {
      var week = (i + 1) / bars.length;
      var eased = Math.pow(week, 1.6);
      var heightPct = 12 + eased * 88;
      bars[i].style.height = heightPct.toFixed(0) + '%';
    }
  }

  // The result numeral gets a brief scale "pulse" whenever a slider moves —
  // motion that fires only when the value actually changes, not on a timer.
  var isFirstRun = true;
  var pulseTimeout = null;

  function pulse(el) {
    if (reduceMotion || !el) return;
    window.clearTimeout(pulseTimeout);
    el.style.transform = 'scale(1.08)';
    pulseTimeout = window.setTimeout(function () {
      el.style.transform = 'scale(1)';
    }, 140);
  }

  function update() {
    var subs = parseInt(subsInput.value, 10) || 0;
    var uploads = parseInt(uploadsInput.value, 10) || 1;

    subsValueEl.textContent = subs.toLocaleString();
    uploadsValueEl.textContent = String(uploads);

    var result = project(subs, uploads);
    resultSubsEl.textContent = formatCompact(result.newSubs);
    resultViewsEl.textContent = formatCompact(result.projectedViews);
    resultMultiplierEl.textContent = result.multiplier.toFixed(1) + 'x';

    renderBars();

    if (!isFirstRun) pulse(resultSubsEl.parentElement);
    isFirstRun = false;
  }

  subsInput.addEventListener('input', update);
  uploadsInput.addEventListener('input', update);

  update();
};
