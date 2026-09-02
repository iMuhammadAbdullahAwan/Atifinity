/**
 * before-after.js — draggable divider for the case-study before/after
 * image comparison. Works with mouse, touch and keyboard (arrow keys)
 * once the handle is focused.
 */
window.Affinity = window.Affinity || {};

Affinity.initBeforeAfter = function initBeforeAfter() {
  var slider = document.getElementById('baSlider');
  var beforeWrap = document.getElementById('baBeforeWrap');
  var handle = document.getElementById('baHandle');
  if (!slider || !beforeWrap || !handle) return;

  handle.setAttribute('tabindex', '0');
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Before / after comparison position');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');

  function setPosition(percent) {
    var clamped = Math.min(100, Math.max(0, percent));
    beforeWrap.style.width = clamped + '%';
    handle.style.left = clamped + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
  }

  function percentFromClientX(clientX) {
    var rect = slider.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  var dragging = false;

  function onMove(clientX) {
    setPosition(percentFromClientX(clientX));
  }

  slider.addEventListener('pointerdown', function (event) {
    dragging = true;
    slider.setPointerCapture(event.pointerId);
    onMove(event.clientX);
  });

  slider.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    onMove(event.clientX);
  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (evt) {
    slider.addEventListener(evt, function () {
      dragging = false;
    });
  });

  handle.addEventListener('keydown', function (event) {
    var current = parseFloat(beforeWrap.style.width) || 50;
    if (event.key === 'ArrowLeft') setPosition(current - 5);
    if (event.key === 'ArrowRight') setPosition(current + 5);
  });

  setPosition(50);
};
