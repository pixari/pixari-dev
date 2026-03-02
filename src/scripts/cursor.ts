export function initCursor() {
  // Only on fine-pointer devices (mouse/trackpad, not touch)
  if (!window.matchMedia('(pointer: fine)').matches) return;
  // Don't init twice (View Transitions)
  if (document.querySelector('.cursor-dot')) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  document.documentElement.classList.add('custom-cursor');

  let mouseX = -200, mouseY = -200;
  let ringX  = -200, ringY  = -200;
  let hovering = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseover', (e) => {
    hovering = !!(e.target as Element).closest('a, button, [role="button"], label, input, textarea, select, [data-tilt]');
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '';
  });

  (function tick() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    dot.style.transform  = `translate(${mouseX}px, ${mouseY}px)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(${hovering ? 2 : 1})`;
    ring.style.opacity   = hovering ? '0.25' : '';

    requestAnimationFrame(tick);
  })();
}
