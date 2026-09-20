/* Omar Ali — Portfolio JS
 * Navbar state, mobile menu, scroll reveal, typing effect, certificate lightbox.
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
      // Build a small mobile overlay on demand
      if (open) {
        Object.assign(navLinksEl.style, {
          display: 'flex',
          position: 'fixed',
          top: '72px',
          left: '0',
          right: '0',
          flexDirection: 'column',
          background: 'rgba(10,11,20,0.97)',
          backdropFilter: 'blur(16px)',
          padding: '24px',
          gap: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          zIndex: '99'
        });
      } else {
        navLinksEl.removeAttribute('style');
      }
    });
    // Close menu on link click (mobile)
    navLinksEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          navLinksEl.classList.remove('open');
          navLinksEl.removeAttribute('style');
        }
      });
    });
  }

  /* ---------- 3. Scroll reveal via IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger slightly for siblings
          const delay = Math.min(idx * 80, 400);
          setTimeout(() => entry.target.classList.add('in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- 4. Typing / rotating role in hero ---------- */
  const roleEl = document.querySelector('[data-role]');
  if (roleEl && !prefersReducedMotion) {
    const roles = JSON.parse(roleEl.dataset.role);
    let ri = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = roles[ri];
      roleEl.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) {
        ci++;
        setTimeout(tick, 70);
      } else if (deleting && ci > 0) {
        ci--;
        setTimeout(tick, 35);
      } else if (!deleting && ci === word.length) {
        deleting = true;
        setTimeout(tick, 1600);
      } else {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(tick, 300);
      }
    };
    tick();
  }

  /* ---------- 5. Smooth active section highlight ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('id');
          navLinks.forEach(l => {
            l.style.color = l.getAttribute('href') === '#' + id ? 'var(--text)' : '';
            if (l.getAttribute('href') === '#' + id) {
              l.style.setProperty('color', 'var(--text)');
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- 6. Certificate dialog ---------- */
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

  /* ---------- 7. Subtle tilt effect on project cards ---------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-6px) perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- 8. Contact CTA: copy + confirm ---------- */
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
      // no clipboard access -> show it as selectable text instead of lying
      showToast(ok ? `Copied \u2192 ${text}` : text, !ok);
    });
  });

  /* ---------- 9. Year in footer ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
