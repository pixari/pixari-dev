export function initAmbientGlow() {
  const glow = document.getElementById('glow');
  if (!glow) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let ticking = false;

  // Position the glow at screen center on load
  glow.style.transform = `translate(${targetX - 300}px, ${targetY - 300}px)`;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!ticking) {
      requestAnimationFrame(() => {
        // Use transform only — avoids forced reflow from left/top changes
        glow.style.transform = `translate(${targetX - 300}px, ${targetY - 300}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
