// Nav toggle (mobile)
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Scroll fade-in observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Skill bar animation — triggered on scroll into view
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

// Typewriter for hero tagline
const typeEl = document.querySelector('.typewriter');
if (typeEl) {
  const text = typeEl.dataset.text || typeEl.textContent;
  typeEl.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      typeEl.textContent += text[i++];
      setTimeout(type, 60);
    } else {
      typeEl.style.borderRight = 'none';
    }
  };
  setTimeout(type, 500);
}
