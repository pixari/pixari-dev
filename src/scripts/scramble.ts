const CHARS = '!<>-_\\/[]{}=+*^?#@';

export function initScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const el = document.querySelector<HTMLElement>('.hero-subtitle');
  if (!el) return;

  const original = el.textContent ?? '';
  let frame = 0;
  const totalFrames = 28;
  let rafId = 0;
  let timerId = 0;

  const animate = () => {
    el.textContent = original
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (frame > (i / original.length) * totalFrames) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
    frame++;
    if (frame <= totalFrames) {
      rafId = requestAnimationFrame(animate);
    } else {
      el.textContent = original;
      rafId = 0;
    }
  };

  // Start after hero fadeUp animations complete (0.6s delay + 0.8s duration ≈ 1.4s)
  timerId = window.setTimeout(() => {
    frame = 0;
    rafId = requestAnimationFrame(animate);
  }, 1500);

  document.addEventListener(
    'astro:before-preparation',
    () => {
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
      el.textContent = original;
    },
    { once: true },
  );
}
