// Applied inline as is:inline in BaseLayout — duplicated here for reference only
// The actual anti-flash IIFE is in BaseLayout.astro <head>

export function initTheme() {
  const btn = document.getElementById('theme-toggle') as HTMLButtonElement | null;
  if (!btn) return;

  function update() {
    const isLight = document.documentElement.classList.contains('light');
    btn!.textContent = isLight ? '☀' : '☾';
    btn!.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    update();
  });

  update();
}
