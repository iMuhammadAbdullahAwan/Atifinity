/**
 * video-modal.js — Lightbox modal player for portfolio videos.
 * Opens full-screen video player with sound, playback controls, and title.
 */
window.Affinity = window.Affinity || {};

Affinity.initVideoModal = function initVideoModal() {
  var modal = document.getElementById('videoModal');
  if (!modal) return;

  var modalVideo = document.getElementById('modalVideo');
  var modalTitle = document.getElementById('modalVideoTitle');
  var closeBtn = document.getElementById('closeVideoModal');
  var backdrop = document.getElementById('modalBackdrop');
  var triggers = document.querySelectorAll('[data-video-modal]');

  function openModal(src, title) {
    if (!modalVideo) return;

    // Pause all preview videos on the page
    document.querySelectorAll('#portfolio video').forEach(function (v) {
      v.pause();
    });

    modalVideo.src = src;
    if (modalTitle) modalTitle.textContent = title || 'Project Video';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Small delay to allow DOM render before playing
    setTimeout(function () {
      modalVideo.play().catch(function () {
        // Autoplay policy might require user interaction; controls are available
      });
    }, 50);
  }

  function closeModal() {
    if (!modal) return;
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideo.removeAttribute('src');
      modalVideo.load();
    }
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var src = trigger.getAttribute('data-video-modal') || trigger.querySelector('video')?.getAttribute('src');
      var title = trigger.getAttribute('data-video-title') || trigger.querySelector('p')?.textContent || 'Project Video';
      if (src) openModal(src, title);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};
