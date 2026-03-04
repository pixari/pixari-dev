export function initToc() {
  const postBody = document.querySelector<HTMLElement>('.post-body');
  const sidebar = document.getElementById('tocSidebar');
  if (!postBody || !sidebar) return;

  const headings = [...postBody.querySelectorAll('h2, h3')] as HTMLElement[];
  if (headings.length < 3) return;

  // Ensure all headings have unique IDs
  const usedIds = new Set<string>();
  headings.forEach((h) => {
    if (!h.id) {
      const base =
        (h.textContent ?? 'heading')
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '') || 'heading';
      let id = base, n = 2;
      while (usedIds.has(id)) id = `${base}-${n++}`;
      h.id = id;
    }
    usedIds.add(h.id);
  });

  const listHtml = headings
    .map(
      (h) =>
        `<li class="toc-item${h.tagName === 'H3' ? ' toc-sub' : ''}">` +
        `<a class="toc-link" href="#${h.id}">${h.textContent}</a></li>`,
    )
    .join('');

  sidebar.innerHTML = `<p class="toc-title">On this page</p><ol class="toc-list">${listHtml}</ol>`;

  // Mobile: inject collapsible before first heading
  if (window.matchMedia('(max-width: 1279px)').matches) {
    const details = document.createElement('details');
    details.className = 'toc-mobile';
    details.innerHTML =
      `<summary class="toc-mobile-summary">On this page</summary>` +
      `<ol class="toc-list">${listHtml}</ol>`;
    headings[0].before(details);
    details.addEventListener('click', (e) => {
      if ((e.target as Element).closest('a[href^="#"]'))
        setTimeout(() => details.removeAttribute('open'), 120);
    });
  }

  // Active link via IntersectionObserver
  const linkMap = new Map<string, HTMLAnchorElement>();
  sidebar
    .querySelectorAll<HTMLAnchorElement>('.toc-link')
    .forEach((a) => linkMap.set(a.getAttribute('href')!.slice(1), a));

  let activeId = '';
  const observer = new IntersectionObserver(
    (entries) => {
      for (const { isIntersecting, target } of entries) {
        if (isIntersecting) {
          activeId = target.id;
          const activeIdx = headings.findIndex((h) => h.id === activeId);
          linkMap.forEach((a, id) => {
            const idx = headings.findIndex((h) => h.id === id);
            a.classList.toggle('toc-active', id === activeId);
            a.classList.toggle('toc-passed', idx < activeIdx);
          });
        }
      }
    },
    { rootMargin: '-10% 0% -75% 0%' },
  );
  headings.forEach((h) => observer.observe(h));

  // Smooth scroll
  sidebar.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    document.getElementById(a.getAttribute('href')!.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  });
}
