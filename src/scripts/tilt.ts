export function initTilt() {
  // Disable on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll<HTMLElement>('[data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transition = 'transform 0.08s ease';
      card.style.transform  = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateZ(6px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.transform  = '';
    });
  });
}
