/**
 * logo-particles.js — reveals the hero brand mark (#heroGraphic) as a plain
 * static image. The canvas element (#logoParticles) is still present in the
 * markup for backward compatibility but is left hidden and unused — this
 * module used to animate scattered particles converging into the mark
 * shape on page load, plus a continuous float/bob afterward; both were
 * removed so the hero image is fully static.
 */
window.Affinity = window.Affinity || {};

Affinity.initLogoParticles = function initLogoParticles() {
  var canvas = document.getElementById('logoParticles');
  var heroGraphic = document.getElementById('heroGraphic');
  if (!heroGraphic) return;

  if (canvas) canvas.style.display = 'none';
  heroGraphic.classList.remove('opacity-0');
};
