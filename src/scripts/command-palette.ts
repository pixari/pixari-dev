interface CmdItem {
  icon: string;
  label: string;
  desc: string;
  action: () => void;
}

interface CmdGroup {
  group: string;
  items: CmdItem[];
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = `/#${id}`;
  }
}

function go(path: string) {
  window.location.href = path;
}

const staticGroups: CmdGroup[] = [
  {
    group: 'Navigate',
    items: [
      { icon: '👤', label: 'About',         desc: 'Who I am',                            action: () => scrollTo('about') },
      { icon: '🧭', label: 'Values',        desc: 'How I work',                          action: () => scrollTo('values') },
      { icon: '💼', label: 'Experience',    desc: 'Work history',                        action: () => scrollTo('experience') },
      { icon: '🔨', label: 'Side Projects', desc: 'Personal projects',                   action: () => scrollTo('projects') },
      { icon: '📖', label: 'Sources',      desc: 'Recommended podcasts, books & blogs',  action: () => go('/sources/') },
      { icon: '🎮', label: 'Career Climber',desc: 'Platformer game',                     action: () => scrollTo('game') },
      { icon: '📝', label: 'Blog',          desc: 'All posts',                           action: () => go('/blog/') },
      { icon: '📚', label: 'Publications',  desc: 'Academic work',                       action: () => scrollTo('publications') },
      { icon: '🎓', label: 'Education',     desc: 'Degrees & certifications',            action: () => scrollTo('education') },
      { icon: '💬', label: 'Testimonials',  desc: 'Colleague recommendations',           action: () => scrollTo('testimonials') },
      { icon: '✉️', label: 'Contact',       desc: 'Get in touch',                        action: () => scrollTo('contact') },
    ],
  },
  {
    group: 'Actions',
    items: [
      {
        icon: '📋',
        label: 'Copy email',
        desc: 'raffaele.pizzari@gmail.com',
        action: () => {
          navigator.clipboard.writeText('raffaele.pizzari@gmail.com').then(() => {
            showToast('Email copied!');
          });
        },
      },
      { icon: '🖨️', label: 'Print resume', desc: 'Print-friendly version', action: () => window.print() },
    ],
  },
  {
    group: 'Links',
    items: [
      { icon: '🔗', label: 'LinkedIn',            desc: 'linkedin.com/in/raffaelepizzari', action: () => open('https://www.linkedin.com/in/raffaelepizzari/', '_blank') },
      { icon: '🐙', label: 'GitHub',              desc: 'github.com/pixari',               action: () => open('https://github.com/pixari', '_blank') },
      { icon: '🎙️', label: 'BlaBla Teleprompter', desc: 'blabla.pixari.dev',               action: () => open('https://blabla.pixari.dev', '_blank') },
      { icon: '📊', label: 'MarkMySlide',         desc: 'markmyslide.pixari.dev',          action: () => open('https://markmyslide.pixari.dev', '_blank') },
    ],
  },
];

function loadPostGroup(): CmdGroup | null {
  const el = document.getElementById('cmdPosts');
  if (!el) return null;
  try {
    const posts = JSON.parse(el.textContent || '[]') as {
      slug: string; title: string; desc: string; tags: string[];
    }[];
    if (posts.length === 0) return null;
    return {
      group: 'Blog Posts',
      items: posts.map((p) => ({
        icon: '📄',
        label: p.title,
        desc: p.tags.length > 0 ? `${p.tags.slice(0, 2).join(' · ')} — ${p.desc}` : p.desc,
        action: () => go(`/${p.slug}/`),
      })),
    };
  } catch {
    return null;
  }
}

// ── Pagefind full-text search ───────────────────────────────────────────────

let pagefindModule: any = null;
let pagefindState: 'idle' | 'loading' | 'ready' | 'unavailable' = 'idle';

async function loadPagefind() {
  if (pagefindState === 'ready') return pagefindModule;
  if (pagefindState === 'loading' || pagefindState === 'unavailable') return null;
  pagefindState = 'loading';
  try {
    // Use new Function to prevent Vite from analyzing this import at dev time
    const pf = await (new Function('url', 'return import(url)'))('/pagefind/pagefind.js');
    await pf.init();
    pagefindModule = pf;
    pagefindState = 'ready';
  } catch {
    pagefindState = 'unavailable'; // dev mode or not built yet
  }
  return pagefindModule;
}

async function pagefindSearch(query: string): Promise<CmdGroup | null> {
  if (!query.trim()) return null;
  const pf = await loadPagefind();
  if (!pf) return null;
  try {
    const results = await pf.search(query);
    if (!results?.results?.length) return null;
    const items: CmdItem[] = [];
    for (const result of results.results.slice(0, 6)) {
      const data = await result.data();
      const excerpt = (data.excerpt ?? '').replace(/<[^>]*>/g, '').trim();
      items.push({
        icon: '🔍',
        label: data.meta?.title ?? 'Post',
        desc: excerpt,
        action: () => go(data.url),
      });
    }
    return items.length > 0 ? { group: 'Search results', items } : null;
  } catch {
    return null;
  }
}

// ── Rendering ───────────────────────────────────────────────────────────────

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(1rem);
    background:var(--surface);border:1px solid var(--border);color:var(--text);
    padding:0.6rem 1.2rem;border-radius:100px;font-size:0.85rem;
    opacity:0;transition:all 0.2s ease;z-index:9999;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, 2000);
}

// Registered actions array — built once per init so onclick indices stay stable
let registeredActions: (() => void)[] = [];

function renderGroups(groups: CmdGroup[]) {
  const container = document.getElementById('cmdResults');
  if (!container) return;
  registeredActions = [];
  let html = '';
  for (const group of groups) {
    if (group.items.length === 0) continue;
    html += `<div class="cmd-group-label">${group.group}</div>`;
    for (const item of group.items) {
      const idx = registeredActions.length;
      registeredActions.push(item.action);
      html += `<div class="cmd-item" onclick="window.__execCmd(${idx})">
        <div class="cmd-item-icon">${item.icon}</div>
        <div class="cmd-item-text">
          <strong>${item.label}</strong>
          <span>${item.desc}</span>
        </div>
      </div>`;
    }
  }
  if (!html) {
    html = '<div style="padding:1.5rem;text-align:center;color:var(--text-secondary);font-size:0.85rem;">No results found</div>';
  }
  container.innerHTML = html;
}

function filterGroups(groups: CmdGroup[], query: string): CmdGroup[] {
  const q = query.toLowerCase().trim();
  if (!q) return groups;
  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q),
      ),
    }))
    .filter((g) => g.items.length > 0);
}

// ── Init ─────────────────────────────────────────────────────────────────────

export function initCommandPalette() {
  const overlay = document.getElementById('cmdPalette');
  const input = document.getElementById('cmdInput') as HTMLInputElement | null;

  const postGroup = loadPostGroup();
  const allGroups: CmdGroup[] = postGroup
    ? [...staticGroups, postGroup]
    : staticGroups;

  function open_() {
    if (!overlay) return;
    overlay.classList.add('active');
    if (input) {
      input.value = '';
      input.focus();
    }
    renderGroups(allGroups);
    // Pre-load pagefind in the background
    loadPagefind();
  }

  function close_() {
    overlay?.classList.remove('active');
  }

  (window as any).openCmdPalette = open_;
  (window as any).closeCmdPalette = close_;
  (window as any).__execCmd = (idx: number) => {
    const action = registeredActions[idx];
    if (action) { close_(); action(); }
  };

  // Input: immediate static filter + debounced Pagefind
  let searchTimer = 0;

  input?.addEventListener('input', (e) => {
    const q = (e.target as HTMLInputElement).value;
    clearTimeout(searchTimer);

    if (!q.trim()) {
      renderGroups(allGroups);
      return;
    }

    // Immediate: show static results filtered
    renderGroups(filterGroups(allGroups, q));

    // Debounced: replace blog posts group with Pagefind full-text results
    searchTimer = window.setTimeout(async () => {
      const pfGroup = await pagefindSearch(q);
      if (!pfGroup) return; // no results or unavailable — keep static filter
      const staticFiltered = filterGroups(staticGroups, q);
      renderGroups([...staticFiltered, pfGroup]);
    }, 220);
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      open_();
    }
    if (e.key === 'Escape' && overlay?.classList.contains('active')) {
      close_();
    }
  });

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) close_();
  });
}
