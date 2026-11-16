/* Omar Ali — Portfolio JS
 * Navbar state, mobile menu, active-link highlight, copy buttons, certificate dialog.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Navbar scroll state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile burger menu ---------- */
  const burger = document.querySelector('.burger');
  const navLinksEl = document.querySelector('.nav-links');
  if (burger && navLinksEl) {
    burger.addEventListener('click', () => {
      const open = navLinksEl.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close menu on link click (mobile)
    navLinksEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          navLinksEl.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ---------- 3. Active section in the nav ---------- */
  /* A class plus aria-current, not an inline colour write: the underline the hover
     state already draws is the honest marker for "this is where you are". */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const byId = new Map(navLinks.map(l => [l.getAttribute('href').slice(1), l]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const link = byId.get(e.target.id);
        if (!link) return;
        navLinks.forEach((l) => { l.classList.remove('current'); l.removeAttribute('aria-current'); });
        link.classList.add('current');
        link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- 4. Certificate dialog ---------- */
  // The rows are real <button>s, so this is reachable by keyboard, not only by the
  // hover-zoom it replaces. Escape, the close button and a click on the backdrop all
  // dismiss the dialog, and focus goes back to the row that opened it.
  document.querySelectorAll('.cred-row[data-cert]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cap = btn.getAttribute('data-caption') || 'Certificate scan';
      const prev = document.activeElement;

      const box = document.createElement('div');
      box.className = 'cert-lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', cap);

      const img = document.createElement('img');
      img.src = btn.getAttribute('data-cert');
      img.alt = 'Certificate: ' + cap;

      const label = document.createElement('p');
      label.className = 'lb-cap';
      label.textContent = cap;

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'lb-close';
      close.setAttribute('aria-label', 'Close certificate');
      close.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

      box.append(img, label, close);
      document.body.appendChild(box);
      document.body.style.overflow = 'hidden';
      close.focus();

      const onKey = (e) => { if (e.key === 'Escape') kill(); };
      function kill() {
        box.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKey);
        if (prev && prev.focus) prev.focus();
      }
      close.addEventListener('click', kill);
      box.addEventListener('click', (e) => { if (e.target === box) kill(); });
      document.addEventListener('keydown', onKey);
    });
  });

  /* ---------- 5. Contact CTA: copy + confirm ---------- */
  // A bare mailto: link is silent when the OS has no default mail client, and
  // inside a sandboxed iframe it is blocked outright -- both read as a broken
  // button. So every [data-copy-email] control also copies the address and
  // confirms it, without preventDefault: anyone who does have a mail app still
  // gets their composer opening with the subject pre-filled.
  const toastEl = document.querySelector('[data-toast]');
  let toastTimer;

  function showToast(msg, selectable) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.toggle('toast--selectable', !!selectable);
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2800);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) { /* fall through to the legacy path */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return !!ok;
    } catch (err) {
      return false;
    }
  }

  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', async () => {
      const text = el.getAttribute('data-copy');
      const ok = await copyText(text);
      // no clipboard access -> say so and hand the user the text, still selectable
      showToast(ok ? `Copied ${text}` : `Clipboard blocked. Select this and copy it yourself: ${text}`, !ok);
    });
  });

  /* ---------- 6. Year in footer ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
