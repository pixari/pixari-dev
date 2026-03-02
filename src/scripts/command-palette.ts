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
    // If section not on current page, go to homepage first
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
      { icon: '👤', label: 'About',         desc: 'Building products & growing teams',   action: () => scrollTo('about') },
      { icon: '🧭', label: 'Values',        desc: 'Principles I lead by',                action: () => scrollTo('values') },
      { icon: '💼', label: 'Experience',    desc: "Where I've made an impact",           action: () => scrollTo('experience') },
      { icon: '🔨', label: 'Fun Projects',  desc: "Things I build for the love of it",  action: () => scrollTo('projects') },
      { icon: '🎮', label: 'Career Climber',desc: 'Play the platformer game',            action: () => scrollTo('game') },
      { icon: '📝', label: 'Blog',          desc: 'All writing',                         action: () => go('/blog/') },
      { icon: '📚', label: 'Publications',  desc: 'Academic work & research',            action: () => scrollTo('publications') },
      { icon: '🎓', label: 'Education',     desc: 'Background & certifications',         action: () => scrollTo('education') },
      { icon: '💬', label: 'Testimonials',  desc: 'What colleagues say',                 action: () => scrollTo('testimonials') },
      { icon: '✉️', label: 'Contact',       desc: "Let's build something together",      action: () => scrollTo('contact') },
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

function renderResults(groups: CmdGroup[], query: string) {
  const container = document.getElementById('cmdResults');
  if (!container) return;
  const q = query.toLowerCase().trim();
  let html = '';

  for (const group of groups) {
    const filtered = group.items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
    );
    if (filtered.length === 0) continue;
    html += `<div class="cmd-group-label">${group.group}</div>`;
    for (const item of filtered) {
      const gIdx = groups.indexOf(group);
      const iIdx = group.items.indexOf(item);
      html += `<div class="cmd-item" onclick="window.__execCmd(${gIdx},${iIdx})">
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

export function initCommandPalette() {
  const overlay = document.getElementById('cmdPalette');
  const input = document.getElementById('cmdInput') as HTMLInputElement | null;

  // Merge static groups + blog posts
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
    renderResults(allGroups, '');
  }

  function close_() {
    overlay?.classList.remove('active');
  }

  (window as any).openCmdPalette = open_;
  (window as any).closeCmdPalette = close_;
  (window as any).__execCmd = (gIdx: number, iIdx: number) => {
    const item = allGroups[gIdx]?.items[iIdx];
    if (item) { close_(); item.action(); }
  };

  input?.addEventListener('input', (e) => {
    renderResults(allGroups, (e.target as HTMLInputElement).value);
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
