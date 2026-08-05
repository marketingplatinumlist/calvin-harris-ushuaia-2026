/* Calvin Harris · Ushuaïa Ibiza 2026 — landing interactions */
(function () {
  'use strict';

  /* Checkout host — keep the funnel on one domain.
     On *.platinumlist.net buyers go to the Platinumlist checkout, so the
     click is same-site and GA4 does not have to treat it as cross-domain.
     Everywhere else the white-label checkout is used, same as the satellite. */
  var ON_PL    = /\.platinumlist\.net$/i.test(location.hostname);
  var PL_BASE  = 'https://ibiza.platinumlist.net/eur/event-tickets/106871/calvin-harris/casual-ticket-office';
  var WL_BASE  = 'https://checkout.ibiza-tickets.co/eur/event/02/ticket-office';
  var CHECKOUT = ON_PL ? PL_BASE : WL_BASE;
  var CO_HOST  = ON_PL ? 'ibiza.platinumlist.net' : 'checkout.ibiza-tickets.co';

  if (ON_PL) {
    document.querySelectorAll('a[href*="checkout.ibiza-tickets.co"]').forEach(function (a) {
      var q = a.href.indexOf('?');
      a.href = PL_BASE + (q > -1 ? a.href.slice(q) : '');
    });
  }

  /* ───── 1. Dates ─────────────────────────────────────────────────
     Availability + price: our checkout (checkout.ibiza-tickets.co/event/02).
     Support line-ups: the venue's own calendar, theushuaiaexperience.com.
     Only Fridays are sold through our ticket office; the venue's Tuesday run
     (to 25 Aug) is not in our inventory, so we do not list it. */
  var DATES = [
    { label: 'Fri 7 Aug',  price: 70,   show: '5361959', acts: ['MK', "Tyson O'Brien", 'Paige Tomlinson'] },
    { label: 'Fri 14 Aug', price: 70,   show: '5361960', acts: ['MK', 'Saint', "Tyson O'Brien"] },
    { label: 'Fri 21 Aug', price: 70,   show: '5361961', acts: ['MK', 'MPH', "Tyson O'Brien"] },
    { label: 'Fri 28 Aug', price: 70,   show: '5361962', acts: ['MK', "Tyson O'Brien", 'Tommy Gold'] },
    { label: 'Fri 4 Sep',  price: null, show: '5361963', acts: ['MK', 'Illyus & Barrientos', "Tyson O'Brien"] },
    { label: 'Fri 11 Sep', price: null, show: '5361964', acts: ['MK', "Tyson O'Brien", 'OFFAIAH'] },
    { label: 'Fri 18 Sep', price: null, show: '5361965', acts: ['MK', 'Eats Everything', "Tyson O'Brien"] },
    { label: 'Fri 25 Sep', price: null, show: '5361966', acts: ['MK', "Tyson O'Brien", 'Storm Mollison'] },
    { label: 'Fri 2 Oct',  price: null, show: '5361967', acts: ['MK', "Tyson O'Brien"], closing: true }
  ];

  var grid = document.getElementById('dateGrid');
  if (grid) {
    grid.innerHTML = DATES.map(function (ev) {
      return '<article class="date' + (ev.closing ? ' date--hot' : '') + '">'
        + (ev.closing ? '<span class="date__flag">Closing party</span>' : '')
        + '<h3 class="date__day">' + ev.label.toUpperCase() + '</h3>'
        + '<p class="date__acts"><b>Calvin Harris</b>'
            + ev.acts.map(function (a) { return '<i>' + a + '</i>'; }).join('') + '</p>'
        + '<p class="date__time">Doors 17:00</p>'
        + (ev.price
            ? '<p class="date__price">From <span class="px" data-eur="' + ev.price + '">€' + ev.price + '</span></p>'
            : '<p class="date__price date__price--sm">Check availability</p>')
        + '<a class="btn btn--ghost" href="' + CHECKOUT + '?id_event_show=' + ev.show + '">Book</a>'
        + '</article>';
    }).join('');
    var c = document.getElementById('dateCount');
    if (c) c.textContent = DATES.length;
  }

  /* ───── 2. Hero video — poster paints first, video arrives after ─────
     The poster is the LCP element and is preloaded. The video is only
     attached once the page has finished loading, so 6 MB of background
     footage never competes with first paint. */
  var hero = document.getElementById('heroVid');
  var heroPoster = document.getElementById('heroPoster');
  if (hero) {
    var startHero = function () {
      var mobile = window.matchMedia('(max-width: 820px)').matches;
      if (heroPoster) heroPoster.src = mobile ? '/assets/ch-hero-poster-m.webp' : '/assets/ch-hero-poster-d.webp';
      // respect the visitor's data and motion preferences
      var save = navigator.connection && (navigator.connection.saveData ||
                 /2g/.test(navigator.connection.effectiveType || ''));
      if (save || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      hero.src = mobile ? '/assets/ch-hero-mobile.mp4' : '/assets/ch-hero-desktop.mp4';
      hero.addEventListener('canplay', function () {
        hero.classList.add('is-ready');
        var p = hero.play();
        if (p && p.catch) p.catch(function () { hero.classList.remove('is-ready'); });
      }, { once: true });
      hero.load();
    };
    if (document.readyState === 'complete') startHero();
    else window.addEventListener('load', startHero);
  }

  /* ───── 3. Sticky header + mobile CTA bar ───── */
  var hdr = document.getElementById('hdr');
  var sticky = document.getElementById('sticky');
  var wasStuck = null, wasOn = null;
  function onScroll() {
    var y = window.scrollY;
    var stuck = y > 40;
    if (stuck !== wasStuck) { hdr.classList.toggle('is-stuck', stuck); wasStuck = stuck; }
    if (sticky) {
      var on = y > window.innerHeight * 0.9;
      if (on !== wasOn) { sticky.classList.toggle('is-on', on); wasOn = on; }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ───── 4. Mobile nav ───── */
  var burger = document.getElementById('burger');
  var mnav = document.getElementById('mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('is-open');
      mnav.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { mnav.classList.remove('is-open'); mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ───── 5. Currency ──────────────────────────────────────────────
     Only the 13 currencies checkout.ibiza-tickets.co actually serves.
     Rates are fetched live (open.er-api.com, ECB-sourced); if the call
     fails we stay in EUR rather than show a made-up number. */
  var CUR = {
    EUR: { label: '\u20AC EUR', sym: '\u20AC', pre: true },
    GBP: { label: '\u00A3 GBP', sym: '\u00A3', pre: true },
    USD: { label: '$ USD',       sym: '$',       pre: true },
    TRY: { label: '\u20BA TRY', sym: '\u20BA', pre: true },
    AED: { label: 'AED' }, SAR: { label: 'SAR' }, QAR: { label: 'QAR' },
    OMR: { label: 'OMR' }, BHD: { label: 'BHD' }, KWD: { label: 'KWD' },
    JOD: { label: 'JOD' }, EGP: { label: 'EGP' }, MAD: { label: 'MAD' }
  };
  var rates = { EUR: 1 };
  var active = 'EUR';

  function money(eur, code) {
    var r = rates[code];
    if (!r) return null;
    var v = eur * r;
    var n = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
    var c = CUR[code];
    return c.pre ? c.sym + n : c.label + '\u00A0' + n;
  }

  function applyCurrency(code) {
    if (!rates[code]) return;
    active = code;
    document.querySelectorAll('.px').forEach(function (el) {
      var out = money(parseFloat(el.dataset.eur), code);
      if (out) el.textContent = out;
    });
    // send the buyer to the checkout in the same currency
    document.querySelectorAll('a[href*="ticket-office"]').forEach(function (a) {
      var re = new RegExp('(' + CO_HOST.replace(/\./g, '\\.') + ')/[a-z]{3}/');
      a.href = a.href.replace(re, '$1/' + code.toLowerCase() + '/');   // query string is preserved
    });
    if (curBtn) curBtn.textContent = CUR[code].label;
  }

  var curBtn = document.getElementById('curBtn');
  var curMenu = document.getElementById('curMenu');

  fetch('https://open.er-api.com/v6/latest/EUR')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d || d.result !== 'success' || !d.rates) throw new Error('no rates');
      Object.keys(CUR).forEach(function (c) { if (d.rates[c]) rates[c] = d.rates[c]; });
      if (curMenu) curMenu.querySelectorAll('[data-cur]').forEach(function (li) {
        if (!rates[li.dataset.cur]) li.remove();
      });
    })
    .catch(function () {
      // rates unavailable — keep EUR only, never guess
      if (curMenu) curMenu.querySelectorAll('[data-cur]').forEach(function (li) {
        if (li.dataset.cur !== 'EUR') li.remove();
      });
    });

  if (curBtn && curMenu) {
    curBtn.addEventListener('click', function () {
      var open = curMenu.hidden;
      curMenu.hidden = !open;
      curBtn.setAttribute('aria-expanded', String(open));
    });
    curMenu.addEventListener('click', function (e) {
      var li = e.target.closest('[data-cur]');
      if (!li) return;
      applyCurrency(li.dataset.cur);
      curMenu.hidden = true;
      curBtn.setAttribute('aria-expanded', 'false');
    });
    curMenu.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.dataset.cur) e.target.click();
    });
    document.addEventListener('click', function (e) {
      if (!curMenu.hidden && !curMenu.contains(e.target) && e.target !== curBtn) {
        curMenu.hidden = true;
        curBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ───── 6. Line-up rail progress ───── */
  var rail = document.getElementById('lineupRail');
  var bar = document.getElementById('lineupBar');
  if (rail && bar) {
    var sync = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      var seen = rail.clientWidth / rail.scrollWidth;
      bar.style.width = Math.min(100, (seen * 100) + (max ? (rail.scrollLeft / max) * (100 - seen * 100) : 0)) + '%';
    };
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  /* ───── 6b. Rails: keep them pinned left ─────────────────────────
     No wheel handler here. Rails already carry overscroll-behavior-x:
     contain, so the browser forwards vertical wheel to the page on its
     own — and .tiers/.revs/.also are CSS grids on desktop, they are not
     scroll containers at all. Intercepting wheel took scrolling off the
     compositor thread and replaced native acceleration with a flat 1:1
     jump, which read as the page slowing down over those sections. */
  document.querySelectorAll('.rail, .tiers, .revs, .also').forEach(function (r) {
    r.scrollLeft = 0;
  });
  window.addEventListener('load', function () {
    document.querySelectorAll('.rail, .tiers, .revs, .also').forEach(function (r) { r.scrollLeft = 0; });
  });

  /* ───── 7. POV clips: only what is really on screen, max 2 at once ─────
     The six clips sit in one horizontal rail, so a single viewport
     observer fired for all six at the same instant: six preload flips,
     six range requests and six decoders on one frame. Now horizontal
     visibility is now observed against the rail itself, so clips that are
     scrolled out of the rail do not decode. All six on-screen clips still
     play together — that is intentional. */
  var ugcRail = document.querySelector('.rail--ugc');
  var clips = document.querySelectorAll('.ugc video');
  if (clips.length && ugcRail && 'IntersectionObserver' in window) {
    var sectionOn = false;
    var MAX_CONCURRENT = 6;

    var apply = function () {
      var playing = 0;
      clips.forEach(function (v) {
        var want = sectionOn && v.getAttribute('data-hv') === '1' && playing < MAX_CONCURRENT;
        if (want) {
          playing++;
          if (v.preload === 'none') v.preload = 'auto';
          var pr = v.play();
          if (pr && pr.catch) pr.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    };

    /* horizontal: is the clip inside the rail's own visible strip */
    var ho = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.setAttribute('data-hv', en.isIntersecting ? '1' : '0');
      });
      apply();
    }, { root: ugcRail, threshold: 0.6 });
    clips.forEach(function (v) { v.setAttribute('data-hv', '0'); ho.observe(v); });

    /* vertical: is the rail on screen at all */
    new IntersectionObserver(function (entries) {
      sectionOn = entries[0].isIntersecting;
      apply();
    }, { threshold: 0.2 }).observe(ugcRail);
  }

  /* ───── 8. Aftermovie — no native chrome, click to play/pause ───── */
  var play = document.getElementById('videoPlay');
  var after = document.getElementById('afterVid');
  var vbox = document.getElementById('video');
  if (play && after && vbox) {
    var toggle = function () {
      if (after.paused) {
        var p = after.play();
        if (p && p.catch) p.catch(function () {});
        vbox.classList.add('is-playing');
      } else {
        after.pause();
        vbox.classList.remove('is-playing');
      }
    };
    play.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    after.addEventListener('click', toggle);
    after.addEventListener('ended', function () { vbox.classList.remove('is-playing'); });
  }

  /* ───── 8b. Final CTA background video ───── */
  var fin = document.getElementById('finalVid');
  if (fin && 'IntersectionObserver' in window) {
    var fo = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          if (!fin.src) fin.src = '/assets/ch-hero-desktop.mp4#t=8';
          var p = fin.play(); if (p && p.catch) p.catch(function () {});
        } else { fin.pause(); }
      });
    }, { threshold: 0.15 });
    fo.observe(fin);
  }

  /* ───── 9. FAQ — animated accordion, one open at a time ─────────
     <details> cannot transition on its own, so we drive the panel
     height ourselves and keep the markup working without JS. */
  var faq = document.getElementById('faqList');
  if (faq) {
    var items = Array.prototype.slice.call(faq.querySelectorAll('details'));

    var expand = function (d) {
      var panel = d.querySelector('div');
      d.open = true;
      panel.style.height = '0px';
      panel.style.opacity = '0';
      var h = panel.scrollHeight;
      requestAnimationFrame(function () {
        panel.style.height = h + 'px';
        panel.style.opacity = '1';
      });
      window.setTimeout(function () {
        if (d.open) panel.style.height = 'auto';
      }, 340);
    };

    var collapse = function (d) {
      var panel = d.querySelector('div');
      panel.style.height = panel.scrollHeight + 'px';
      panel.style.opacity = '0';
      requestAnimationFrame(function () { panel.style.height = '0px'; });
      window.setTimeout(function () {
        if (!d.classList.contains('is-open')) { d.open = false; panel.style.height = ''; panel.style.opacity = ''; }
      }, 320);
    };

    items.forEach(function (d) {
      if (d.open) d.classList.add('is-open');
      d.querySelector('summary').addEventListener('click', function (e) {
        e.preventDefault();
        var opening = !d.classList.contains('is-open');
        items.forEach(function (o) {
          if (o !== d && o.classList.contains('is-open')) { o.classList.remove('is-open'); collapse(o); }
        });
        if (opening) { d.classList.add('is-open'); expand(d); }
        else { d.classList.remove('is-open'); collapse(d); }
      });
    });
  }


  /* ───── 11. Tracking — checkout clicks into dataLayer ─────────────
     The purchase happens off-site, so the only conversion signal this
     page can give is the hand-off. Every checkout link reports which
     date and which control sent the visitor. */
  (function () {
    if (!window.dataLayer) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="ticket-office"]');
      if (!a) return;
      var show = (a.href.match(/id_event_show=(\d+)/) || [])[1] || null;
      var cur = (a.href.match(/ibiza-tickets\.co\/([a-z]{3})\//) || [])[1] || 'eur';
      var card = a.closest('.date');
      window.dataLayer.push({
        event: 'checkout_click',
        eventName: 'Calvin Harris',
        eventId: '106871',
        showId: show,
        showDate: card ? (card.querySelector('.date__day') || {}).textContent : null,
        currency: cur.toUpperCase(),
        ctaLabel: (a.textContent || '').trim(),
        ctaSection: (a.closest('section') || {}).id || 'header',
        destination: a.href
      });
    }, true);
  })();

})();
