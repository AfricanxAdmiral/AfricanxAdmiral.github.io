// ── Theme toggle with CRT transition ──────────────────────────
const themeToggleBtn = document.getElementById('theme-toggle');
const themeOverlay   = document.getElementById('theme-overlay');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }
}

// Sync aria-pressed on load
if (themeToggleBtn) {
  const saved = localStorage.getItem('theme') || 'dark';
  themeToggleBtn.setAttribute('aria-pressed', saved === 'light' ? 'true' : 'false');
}

function triggerCRTSwitch() {
  if (!themeOverlay) return;
  const next = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark'
    ? 'light' : 'dark';

  // Phase 1 — collapse screen to line
  themeOverlay.classList.add('crt-off');

  themeOverlay.addEventListener('animationend', () => {
    themeOverlay.classList.remove('crt-off');

    // Swap theme while screen is "off"
    applyTheme(next);

    // Phase 2 — expand from line with new theme
    themeOverlay.classList.add('crt-on');
    themeOverlay.addEventListener('animationend', () => {
      themeOverlay.classList.remove('crt-on');
    }, { once: true });

  }, { once: true });
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', triggerCRTSwitch);
}

// ── Nav mobile toggle ─────────────────────────────────────────
const menuToggle = document.querySelector('.nav-toggle');
const navLinks   = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Scroll fade-in observer ───────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── Skill bar animation ───────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.level;
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-grid').forEach(el => {
  el.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = '0'; });
  skillObserver.observe(el);
});

// ── Drag-to-scroll for project rows ──────────────────────────
document.querySelectorAll('.preview-cards, .projects-grid').forEach(el => {
  let isDown = false, startX = 0, scrollStart = 0, dragged = false;
  let velX = 0, lastX = 0, lastT = 0, rafId = null;

  const momentum = () => {
    if (Math.abs(velX) < 0.5) return;
    el.scrollLeft -= velX;
    velX *= 0.94;
    rafId = requestAnimationFrame(momentum);
  };

  el.addEventListener('mousedown', e => {
    isDown = true;
    dragged = false;
    startX = e.pageX;
    scrollStart = el.scrollLeft;
    lastX = e.pageX;
    lastT = Date.now();
    velX = 0;
    if (rafId) cancelAnimationFrame(rafId);
    el.style.cursor = 'grabbing';
    e.preventDefault();
  });

  el.addEventListener('mouseleave', () => {
    if (isDown) { isDown = false; el.style.cursor = 'grab'; requestAnimationFrame(momentum); }
  });
  el.addEventListener('mouseup', () => {
    isDown = false;
    el.style.cursor = 'grab';
    requestAnimationFrame(momentum);
  });

  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    const now = Date.now();
    const dt = Math.max(now - lastT, 1);
    velX = (lastX - e.pageX) / dt * 16;
    lastX = e.pageX;
    lastT = now;
    if (Math.abs(e.pageX - startX) > 5) dragged = true;
    el.scrollLeft = scrollStart - (e.pageX - startX);
  });

  // Suppress the click that follows a drag so cards don't navigate on release
  el.addEventListener('click', e => {
    if (dragged) { e.preventDefault(); e.stopPropagation(); }
  }, true);
});

// ── Deep-link to a card (e.g. /portfolio/#proj_02) ────────────
// Scrolls the page to the card AND scrolls its horizontal row so a card
// parked off-screen in the carousel is actually visible on arrival.
function focusHashTarget() {
  const hash = window.location.hash;
  if (hash.length < 2) return;

  let target;
  try { target = document.querySelector(hash); } catch (e) { return; }
  if (!target) return;

  // The row is opacity:0 until the fade observer fires — reveal it now so
  // the card isn't invisible when we land on it.
  const faded = target.closest('.fade-in');
  if (faded) faded.classList.add('visible');

  if (target.closest('.projects-grid, .preview-cards')) {
    target.classList.add('card-target');
    setTimeout(() => target.classList.remove('card-target'), 2000);
  }

  // One call scrolls every scrollable ancestor: the page vertically (offset by
  // the card's scroll-margin-top so the fixed nav doesn't cover it) and the
  // horizontal carousel so an off-screen card is brought into view. Doing the
  // maths by hand instead races the browser's own in-flight anchor jump.
  target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
}

// Run after layout settles (the native anchor jump may still be in flight at
// `load`), and on any later hash change.
window.addEventListener('load', () => setTimeout(focusHashTarget, 100));
window.addEventListener('hashchange', focusHashTarget);

// ── Typewriter for hero tagline ───────────────────────────────
const typeEl = document.querySelector('.typewriter');
if (typeEl) {
  const text = typeEl.dataset.text || typeEl.textContent;
  typeEl.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      typeEl.textContent += text[i++];
      setTimeout(type, 60);
    }
  };
  setTimeout(type, 500);
}
