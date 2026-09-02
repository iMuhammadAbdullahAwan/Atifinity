/**
 * case-study-carousel.js — dot navigation that swaps the example-engagement
 * copy (challenge, title, niche, approach, stats) beside the before/after
 * slider. This section is explicitly framed on the page as an illustrative
 * example of a typical engagement, not a claim about a specific verified
 * client — see the "Illustrative example" microcopy in index.html. Four
 * scenarios ship by default; add more by extending CASE_STUDIES and the dot
 * buttons in index.html.
 */
window.Affinity = window.Affinity || {};

Affinity.initCaseStudyCarousel = function initCaseStudyCarousel() {
  var dots = Array.prototype.slice.call(document.querySelectorAll('#caseDots [data-dot]'));
  if (!dots.length) return;

  var CASE_STUDIES = [
    {
      title: 'Finance Simplified',
      niche: 'Finance Education',
      challenge: "Solid financial knowledge, but uploads were inconsistent and thumbnails weren't earning clicks.",
      approach: 'We rebuilt the entire content strategy, revamped thumbnails, optimized SEO and improved editing.',
      stats: ['+1.2M', '+245K', '+732%'],
    },
    {
      title: 'Fitness Reboot',
      niche: 'Health & Fitness',
      challenge: "Good workout content that wasn't translating into watch time or subscriber growth.",
      approach: 'We repositioned the channel around transformation stories and tightened every hook in the first 5 seconds.',
      stats: ['+860K', '+180K', '+512%'],
    },
    {
      title: 'Tech Reviews Turnaround',
      niche: 'Technology',
      challenge: 'Well-produced reviews getting buried by inconsistent titles and thumbnails.',
      approach: 'A full thumbnail and title overhaul paired with a faster upload cadence unlocked consistent recommendations.',
      stats: ['+2.1M', '+390K', '+644%'],
    },
    {
      title: 'Lifestyle Vlog Scale',
      niche: 'Lifestyle & Vlogging',
      challenge: 'A loyal but small audience, with no repeatable format to build on.',
      approach: 'We introduced a repeatable series format and optimized retention editing to keep viewers watching longer.',
      stats: ['+975K', '+210K', '+488%'],
    },
  ];

  var titleEl = document.getElementById('caseTitle');
  var nicheEl = document.getElementById('caseNiche');
  var challengeEl = document.getElementById('caseChallenge');
  var descEl = document.getElementById('caseDesc');
  var stat1El = document.getElementById('caseStat1');
  var stat2El = document.getElementById('caseStat2');
  var stat3El = document.getElementById('caseStat3');
  var panel = descEl ? descEl.closest('[data-case-panel]') : null;

  function render(index) {
    var data = CASE_STUDIES[index];
    if (!data) return;

    dots.forEach(function (dot, i) {
      var active = i === index;
      dot.classList.toggle('bg-accent', active);
      dot.classList.toggle('w-6', active);
      dot.classList.toggle('w-2', !active);
      dot.classList.toggle('bg-ink/20', !active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });

    if (panel) {
      panel.style.transition = 'opacity 0.25s ease';
      panel.style.opacity = '0';
    }

    window.setTimeout(function () {
      titleEl.textContent = data.title;
      nicheEl.textContent = data.niche;
      if (challengeEl) challengeEl.textContent = data.challenge;
      descEl.textContent = data.approach;
      stat1El.textContent = data.stats[0];
      stat2El.textContent = data.stats[1];
      stat3El.textContent = data.stats[2];
      if (panel) panel.style.opacity = '1';
    }, panel ? 150 : 0);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      render(index);
    });
  });
};
