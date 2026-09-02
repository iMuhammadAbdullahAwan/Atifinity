/**
 * nav.js — mobile menu toggle, sticky header shrink-on-scroll, and
 * scrollspy that keeps the active nav link in sync with the section
 * currently in view.
 */
window.Affinity = window.Affinity || {};

Affinity.initNav = function initNav() {
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  var iconBurger = document.getElementById('iconBurger');
  var iconClose = document.getElementById('iconClose');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(isOpen));
      iconBurger.classList.toggle('hidden', isOpen);
      iconClose.classList.toggle('hidden', !isOpen);
    });

    // Close the mobile menu whenever a nav link inside it is clicked.
    menu.querySelectorAll('a[data-nav]').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        iconBurger.classList.remove('hidden');
        iconClose.classList.add('hidden');
      });
    });
  }

  // Shrink/condense the floating header once the page scrolls a little.
  if (header) {
    var onScroll = function () {
      header.classList.toggle('drop-shadow-2xl', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Scrollspy: highlight the nav link for whichever section is centered
  // in the viewport.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('a[data-nav]'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var setActive = function (id) {
      navLinks.forEach(function (link) {
        var match = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', match);
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      if (section.id) observer.observe(section);
    });
  }
};
