const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress span');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
let previousY = window.scrollY;

function updateChrome() {
  const y = window.scrollY;
  const maximum = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${maximum > 0 ? (y / maximum) * 100 : 0}%`;
  header.classList.toggle('scrolled', y > 24);
  header.classList.toggle('hidden', y > previousY && y > 520 && !document.body.classList.contains('menu-open'));
  previousY = y;
}

window.addEventListener('scroll', updateChrome, { passive: true });
updateChrome();

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -35px' });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 45}ms`;
  if (!window.location.hash && element.getBoundingClientRect().top > window.innerHeight * 0.8) {
    element.classList.add('will-reveal');
  }
  revealObserver.observe(element);
});

// A browser may jump to a URL fragment before IntersectionObserver settles.
// Deep links should always prioritize readable content over entrance animation.
if (window.location.hash) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -58% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
let lightboxRequest = 0;
const closeLightbox = () => {
  lightboxRequest += 1;
  lightbox.close();
  document.body.classList.remove('lightbox-open');
  lightboxImage.removeAttribute('src');
};

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    const preview = button.querySelector('img');
    const request = ++lightboxRequest;
    lightboxImage.src = preview.currentSrc || preview.src;
    lightboxImage.alt = preview.alt;
    lightbox.showModal();
    document.body.classList.add('lightbox-open');

    const fullResolution = new Image();
    fullResolution.decoding = 'async';
    fullResolution.src = button.dataset.lightbox;
    fullResolution.decode().then(() => {
      if (request === lightboxRequest && lightbox.open) {
        lightboxImage.src = fullResolution.src;
      }
    }).catch(() => {});
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener('close', () => document.body.classList.remove('lightbox-open'));

document.getElementById('year').textContent = new Date().getFullYear();
