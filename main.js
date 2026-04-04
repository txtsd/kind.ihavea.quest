'use strict';

document.documentElement.style.setProperty('--dpr', window.devicePixelRatio);

(function() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  toggle.hidden = false;

  const STORAGE_KEY = 'kind-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  applyTheme(getPreferredTheme());

  toggle.addEventListener('click', function() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });
})();

(function() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        header.classList.toggle('scrolled', !entry.isIntersecting);
      });
    },
    { threshold: 0 }
  );

  observer.observe(sentinel);
})();

(function() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const hero = document.querySelector('.hero');
  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          if (entry.target === hero) {
            navLinks.forEach(function(link) {
              link.classList.remove('active');
            });
          } else {
            navLinks.forEach(function(link) {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + entry.target.id
              );
            });
          }
        }
      });
    },
    { rootMargin: '-20% 0px -80% 0px' }
  );

  if (hero) observer.observe(hero);
  sections.forEach(function(section) {
    observer.observe(section);
  });
})();

(function() {
  var overlays = document.querySelectorAll('.screenshot-overlay');
  if (!overlays.length) return;

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && location.hash.startsWith('#ss-')) {
      e.preventDefault();
      location.hash = '#screenshots';
    }
  });

  var lastTrigger = null;

  window.addEventListener('hashchange', function() {
    var hash = location.hash;
    if (hash.startsWith('#ss-')) {
      var overlay = document.querySelector(hash);
      if (overlay) {
        var close = overlay.querySelector('.screenshot-close');
        if (close) close.focus();
      }
    } else if (hash === '#screenshots' && lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  });

  overlays.forEach(function(overlay) {
    var id = overlay.id;
    var trigger = document.querySelector('a[href="#' + id + '"]');
    if (trigger) {
      trigger.addEventListener('click', function() {
        lastTrigger = trigger;
      });
    }
  });
})();
