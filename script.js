/* ═══════════════════════════════════════════════════════════════
   KOVA CAPITAL — script.js
   Handles: i18n (ES/EN), scroll reveal, sticky nav, mobile menu,
            contact form validation & submission placeholder
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. Copy / i18n data ──────────────────────────────────────
   All copy lives in copy.json. We fetch it once and cache it.
   Santiago can edit copy.json without touching markup.
─────────────────────────────────────────────────────────────── */
let COPY = null;
let currentLang = localStorage.getItem('kova_lang') || 'es';

async function loadCopy() {
  try {
    const res = await fetch('copy.json');
    COPY = await res.json();
    applyLanguage(currentLang);
  } catch (err) {
    console.error('Could not load copy.json:', err);
    // Fallback: page renders with hard-coded HTML strings
  }
}

/* ── 2. Language application ─────────────────────────────────
   Walks the DOM for data-i18n attributes and replaces text.
   Also handles data-i18n-list for <ul> lists.
─────────────────────────────────────────────────────────────── */
function applyLanguage(lang) {
  if (!COPY) return;
  currentLang = lang;
  localStorage.setItem('kova_lang', lang);

  const t = COPY[lang];
  if (!t) return;

  // Set html lang attribute
  document.documentElement.lang = lang === 'es' ? 'es' : 'en';

  // Update meta tags
  setMeta('meta-title', t.meta.title, 'title');
  setMeta('meta-description', t.meta.description, 'description');
  setMeta('og-title', t.meta.og_title, 'og');
  setMeta('og-description', t.meta.og_description, 'og');
  setMeta('tw-title', t.meta.og_title, 'tw');
  setMeta('tw-description', t.meta.og_description, 'tw');

  // Text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedKey(t, key);
    if (value !== undefined) {
      el.textContent = value;
    }
  });

  // List nodes
  document.querySelectorAll('[data-i18n-list]').forEach(ul => {
    const key = ul.getAttribute('data-i18n-list');
    const items = getNestedKey(t, key);
    if (Array.isArray(items)) {
      ul.innerHTML = items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    }
  });

  // Criteria list (special DL structure)
  renderCriteriaList(t);

  // Update lang toggle buttons
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.textContent = lang === 'es' ? 'EN' : 'ES';
    btn.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
  });

  // Update form aria-labels
  updateFormLabels(t);
}

function setMeta(id, value, type) {
  if (!value) return;
  if (type === 'title') {
    document.title = value;
    const el = document.getElementById(id);
    if (el) el.content = value;
  } else if (type === 'description') {
    const el = document.getElementById(id);
    if (el) el.content = value;
  } else if (type === 'og' || type === 'tw') {
    const el = document.getElementById(id);
    if (el) el.content = value;
  }
}

function getNestedKey(obj, keyPath) {
  return keyPath.split('.').reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCriteriaList(t) {
  const dl = document.getElementById('criteria-list');
  if (!dl || !t.sectors || !t.sectors.criteria) return;
  dl.innerHTML = t.sectors.criteria.map(item => `
    <div>
      <dt>${escapeHtml(item.label)}</dt>
      <dd>${escapeHtml(item.value)}</dd>
    </div>
  `).join('');
}

function updateFormLabels(t) {
  const form = document.getElementById('contact-form');
  if (!form || !t.contact) return;
  const map = {
    'f-name':    t.contact.form_name,
    'f-company': t.contact.form_company,
    'f-sector':  t.contact.form_sector,
    'f-contact': t.contact.form_contact,
    'f-message': t.contact.form_message,
  };
  Object.entries(map).forEach(([id, label]) => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('placeholder', label || '');
    }
  });
}

/* ── 3. Language toggle ──────────────────────────────────────── */
function initLangToggle() {
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = currentLang === 'es' ? 'en' : 'es';
      applyLanguage(next);
    });
  });
}

/* ── 4. Sticky header ────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ── 5. Mobile nav ───────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}

/* ── 6. Scroll reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ── 7. Contact form ─────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearErrors(form);
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    // Validate
    const errors = validateForm(form);
    if (errors.length > 0) {
      errors.forEach(({ field, message }) => {
        const input = form.querySelector(`#${field}`);
        if (input) {
          input.classList.add('error');
          const errorEl = input.closest('.form-group')?.querySelector('.field-error');
          if (errorEl) errorEl.textContent = message;
        }
      });
      form.querySelector('.error')?.focus();
      return;
    }

    // Collect data
    const data = {
      nombre:   form.querySelector('#f-name')?.value.trim(),
      empresa:  form.querySelector('#f-company')?.value.trim(),
      sector:   form.querySelector('#f-sector')?.value.trim(),
      contacto: form.querySelector('#f-contact')?.value.trim(),
      mensaje:  form.querySelector('#f-message')?.value.trim(),
      lang:     currentLang,
    };

    // Disable submit
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'es' ? 'Enviando…' : 'Sending…';

    try {
      // TODO: Replace '/api/contact' with the real form endpoint.
      // Options: Formspree, Netlify Forms, a serverless function, or direct email API.
      // Example Formspree: action="https://formspree.io/f/YOUR_FORM_ID"
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const t = COPY?.[currentLang]?.contact;
        feedback.textContent = t?.form_success || 'Mensaje enviado.';
        feedback.className = 'form-feedback success';
        form.reset();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      // In development or when endpoint is not configured, show a friendly message
      const t = COPY?.[currentLang]?.contact;
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        // Likely no backend configured yet — show placeholder message
        feedback.textContent = currentLang === 'es'
          ? 'El formulario aún no está conectado. Por favor escríbanos directamente a santiago@kova.capital'
          : 'The form is not yet connected. Please write directly to santiago@kova.capital';
      } else {
        feedback.textContent = t?.form_error || 'Error al enviar.';
      }
      feedback.className = 'form-feedback error';
    } finally {
      submitBtn.disabled = false;
      const t = COPY?.[currentLang]?.contact;
      submitBtn.textContent = t?.form_submit || 'Enviar mensaje';
    }
  });

  // Clear error on input
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errorEl = input.closest('.form-group')?.querySelector('.field-error');
      if (errorEl) errorEl.textContent = '';
    });
  });
}

function validateForm(form) {
  const errors = [];
  const lang = currentLang;

  const name = form.querySelector('#f-name');
  const company = form.querySelector('#f-company');
  const contact = form.querySelector('#f-contact');

  const required = lang === 'es' ? 'Este campo es obligatorio.' : 'This field is required.';
  const invalidContact = lang === 'es'
    ? 'Por favor ingrese un correo o teléfono válido.'
    : 'Please enter a valid email or phone number.';

  if (!name?.value.trim()) errors.push({ field: 'f-name', message: required });
  if (!company?.value.trim()) errors.push({ field: 'f-company', message: required });

  const contactVal = contact?.value.trim() || '';
  if (!contactVal) {
    errors.push({ field: 'f-contact', message: required });
  } else {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[\d\s\+\-\(\)]{7,20}$/;
    if (!emailRe.test(contactVal) && !phoneRe.test(contactVal)) {
      errors.push({ field: 'f-contact', message: invalidContact });
    }
  }

  return errors;
}

function clearErrors(form) {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}

/* ── 8. Smooth anchor scroll with header offset ─────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();

      const headerH = document.getElementById('site-header')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── 9. Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadCopy();
  initLangToggle();
  initStickyHeader();
  initMobileNav();
  initScrollReveal();
  initContactForm();
  initSmoothScroll();
});
