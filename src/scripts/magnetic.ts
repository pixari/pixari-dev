export function initMagnetic() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll<HTMLElement>('.hero-cta .btn').forEach((btn) => {
    let animId = 0;
    let cx = 0, cy = 0, tx = 0, ty = 0;

    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      btn.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;

      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        animId = requestAnimationFrame(tick);
      } else {
        animId = 0;
        if (tx === 0 && ty === 0) btn.style.transform = '';
      }
    };

    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width  / 2) * 0.3;
      ty = (e.clientY - r.top  - r.height / 2) * 0.3;
      if (!animId) animId = requestAnimationFrame(tick);
    });

    btn.addEventListener('mouseleave', () => {
      tx = 0;
      ty = 0;
      if (!animId) animId = requestAnimationFrame(tick);
    });
  });
}
