export function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking = false;

  function update() {
    const curr = window.scrollY;

    nav!.classList.toggle('scrolled', curr > 20);

    if (curr > lastScroll && curr > 80) {
      nav!.style.transform = 'translateY(-100%)';
    } else {
      nav!.style.transform = 'translateY(0)';
    }

    lastScroll = curr;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();

  // Mobile menu
  const btn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('mobileMenuOverlay');
  const closeBtn = document.getElementById('mobileMenuClose');

  if (!btn || !overlay) return;

  function openMenu() {
    overlay!.classList.add('active');
    requestAnimationFrame(() => overlay!.classList.add('visible'));
    btn!.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay!.classList.remove('visible');
    btn!.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    overlay!.addEventListener('transitionend', () => {
      if (!overlay!.classList.contains('visible')) {
        overlay!.classList.remove('active');
      }
    }, { once: true });
  }

  btn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  overlay.querySelectorAll('.mobile-menu-links a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });
}
