/**
 * whatsapp.js — single source of truth for every WhatsApp conversion link on
 * the site. The number and the URL-encoding logic live here exactly once;
 * every CTA in index.html just carries a `data-wa-text="<message>"`
 * attribute and gets its href built by initWhatsApp() on load.
 *
 * Markup contract: `<a href="https://wa.me/<NUMBER>" data-wa-text="…">`.
 * The bare href is a real, working fallback (opens a chat with no prefilled
 * text) if JS fails to run — no CTA on the page is ever a dead end.
 */
window.Affinity = window.Affinity || {};

(function () {
  var WHATSAPP_NUMBER = '923488164928';

  function buildLink(message) {
    var base = 'https://wa.me/' + WHATSAPP_NUMBER;
    return message ? base + '?text=' + encodeURIComponent(message) : base;
  }

  Affinity.waLink = buildLink;

  Affinity.initWhatsApp = function initWhatsApp() {
    document.querySelectorAll('a[data-wa-text]').forEach(function (link) {
      link.setAttribute('href', buildLink(link.getAttribute('data-wa-text')));
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    });
  };
})();
