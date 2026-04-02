'use strict';

(function() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  toggle.hidden = false;

  const STORAGE_KEY = 'kind-theme';
  const sunIcon = toggle.querySelector('.icon-sun');
  const moonIcon = toggle.querySelector('.icon-moon');

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'switch to light theme' : 'switch to dark theme'
    );
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
      moonIcon.style.display = theme === 'light' ? 'block' : 'none';
    }
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
  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function(link) {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-20% 0px -80% 0px' }
  );

  sections.forEach(function(section) {
    observer.observe(section);
  });
})();
