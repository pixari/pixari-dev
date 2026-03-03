export function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const inner = document.querySelector<HTMLElement>('.hero-inner');
  if (!inner) return;

  const hero = inner.closest<HTMLElement>('.hero');
  if (!hero) return;

  let rafId = 0;

  const update = () => {
    const y = window.scrollY;
    const heroH = hero.offsetHeight;
    if (y <= heroH) {
      inner.style.transform = `translateY(${(y * 0.2).toFixed(2)}px)`;
    }
    rafId = 0;
  };

  window.addEventListener(
    'scroll',
    () => { if (!rafId) rafId = requestAnimationFrame(update); },
    { passive: true },
  );
}
