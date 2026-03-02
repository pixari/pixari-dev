export function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking = false;

  function update() {
    const curr = window.scrollY;

    // Frosted glass when scrolled past 20px
    nav!.classList.toggle('scrolled', curr > 20);

    // Hide on scroll down, reveal on scroll up
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

  // Set initial state
  update();
}
