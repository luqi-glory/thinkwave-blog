const header = document.querySelector('.lr-header');
const toggle = document.querySelector('.lr-nav-toggle');
const nav = document.querySelector('#lr-page-nav');
const navLinks = [...nav.querySelectorAll('a')];
let previousY = window.scrollY;

function updateHeader() {
  const y = window.scrollY;
  const menuOpen = toggle.getAttribute('aria-expanded') === 'true';
  header.classList.toggle('lr-hidden', y > previousY && y > 520 && !menuOpen);
  previousY = y;
}

function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('open');
  document.body.classList.remove('lr-menu-open');
}

window.addEventListener('scroll', updateHeader, { passive: true });

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  if (open) {
    closeMenu();
    return;
  }
  header.classList.remove('lr-hidden');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Close navigation');
  nav.classList.add('open');
  document.body.classList.add('lr-menu-open');
  nav.scrollTop = 0;
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
