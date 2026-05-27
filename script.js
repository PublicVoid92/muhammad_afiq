/**
 * Portfolio – Muhammad Afiq
 * Interactive JS: theme toggle, smooth scroll, reveal animations,
 * skill filter, accordion timeline, sticky nav highlight.
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     Theme Toggle (Dark / Light)
  ────────────────────────────────────────────── */
  const THEME_KEY = 'ma-theme';

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* noop */ }
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function initTheme() {
    const stored = getStoredTheme();
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    setTheme(stored || preferred);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ──────────────────────────────────────────────
     Sticky Navbar + Section Highlighting
  ────────────────────────────────────────────── */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const navLinks = navbar.querySelectorAll('.nav-links a[data-section]');
    const sections = Array.from(document.querySelectorAll('section[id]'));

    function onScroll() {
      // Scrolled class for background
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Highlight active section
      let currentId = '';
      const offset = window.innerHeight * 0.3;
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= offset) {
          currentId = sec.id;
        }
      }
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === currentId);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ──────────────────────────────────────────────
     Mobile Menu
  ────────────────────────────────────────────── */
  function initMobileMenu() {
    const btn = document.querySelector('.nav-menu-btn');
    const overlay = document.querySelector('.nav-mobile-overlay');
    if (!btn || !overlay) return;

    let open = false;

    function toggle() {
      open = !open;
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      btn.setAttribute('aria-expanded', String(open));
      const spans = btn.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    }

    btn.addEventListener('click', toggle);

    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (open) toggle();
      });
    });
  }

  /* ──────────────────────────────────────────────
     Scroll Reveal Animation
  ────────────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    els.forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────
     Skill Filter
  ────────────────────────────────────────────── */
  function initSkillFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    const skillGroups = document.querySelectorAll('.skill-group[data-category]');
    if (!filterBtns.length) return;

    function applyFilter(filter) {
      filterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === filter));

      skillGroups.forEach(group => {
        if (filter === 'all') {
          group.style.display = '';
        } else {
          const cats = group.getAttribute('data-category').split(' ');
          group.style.display = cats.includes(filter) ? '' : 'none';
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => applyFilter(btn.getAttribute('data-filter')));
    });

    applyFilter('all');
  }

  /* ──────────────────────────────────────────────
     Accordion Timeline
  ────────────────────────────────────────────── */
  function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
      const header = item.querySelector('.timeline-header');
      if (!header) return;

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all first
        items.forEach(i => i.classList.remove('open'));
        // Toggle current
        if (!isOpen) item.classList.add('open');
      });

      // Keyboard accessibility
      header.setAttribute('tabindex', '0');
      header.setAttribute('role', 'button');
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });

    // Open first (current role) by default
    if (items.length) items[0].classList.add('open');
  }

  /* ──────────────────────────────────────────────
     Contact Form (client-side only, mailto fallback)
  ────────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('#form-name').value.trim();
      const email = form.querySelector('#form-email').value.trim();
      const message = form.querySelector('#form-message').value.trim();
      const status = document.getElementById('form-status');

      if (!name || !email || !message) {
        status.className = 'form-status error';
        status.textContent = 'Please fill in all fields.';
        return;
      }

      const subject = encodeURIComponent('Portfolio Inquiry from ' + name);
      const body = encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message);
      window.location.href = 'mailto:muhdafiq.roslii@gmail.com?subject=' + subject + '&body=' + body;

      status.className = 'form-status success';
      status.textContent = 'Your email client should open. Thank you for reaching out!';
      form.reset();
    });
  }

  /* ──────────────────────────────────────────────
     Download CV (placeholder)
  ────────────────────────────────────────────── */
  function initDownloadCV() {
    const btn = document.getElementById('btn-download-cv');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      // If no actual CV file exists, show a message instead of a broken link
      const href = btn.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        alert('CV download will be available soon. Please reach out via email for a copy.');
      }
    });
  }

  /* ──────────────────────────────────────────────
     Smooth scroll for anchor links
  ────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ──────────────────────────────────────────────
     Boot
  ────────────────────────────────────────────── */
  function init() {
    initTheme();

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    initNavbar();
    initMobileMenu();
    initReveal();
    initSkillFilter();
    initTimeline();
    initContactForm();
    initDownloadCV();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
