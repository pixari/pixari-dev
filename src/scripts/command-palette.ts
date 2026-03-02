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

const cmdItems: CmdGroup[] = [
  {
    group: 'Navigation',
    items: [
      { icon: '👤', label: 'About', desc: 'Building products & growing teams', action: () => scrollTo('about') },
      { icon: '🧭', label: 'Values', desc: 'Principles I lead by', action: () => scrollTo('values') },
      { icon: '💼', label: 'Experience', desc: "Where I've made an impact", action: () => scrollTo('experience') },
      { icon: '⚡', label: 'Skills', desc: 'Technologies & expertise', action: () => scrollTo('skills') },
      { icon: '🔨', label: 'Projects', desc: "Things I'm building for fun", action: () => scrollTo('projects') },
      { icon: '🎮', label: 'Career Climber', desc: 'Play the platformer game', action: () => scrollTo('game') },
      { icon: '📝', label: 'Blog', desc: 'Recent writing from pixari.dev', action: () => scrollTo('blog') },
      { icon: '📄', label: 'Publications', desc: 'Academic work & research', action: () => scrollTo('publications') },
      { icon: '🎓', label: 'Education', desc: 'Background & certifications', action: () => scrollTo('education') },
      { icon: '💬', label: 'Testimonials', desc: 'What colleagues say', action: () => scrollTo('testimonials') },
      { icon: '✉️', label: 'Contact', desc: "Let's build something together", action: () => scrollTo('contact') },
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
          navigator.clipboard.writeText('raffaele.pizzari@gmail.com');
          // eslint-disable-next-line no-alert
          alert('Email copied!');
        },
      },
      { icon: '🖨️', label: 'Print resume', desc: 'Print-friendly version', action: () => window.print() },
    ],
  },
  {
    group: 'Links',
    items: [
      { icon: '🔗', label: 'LinkedIn', desc: 'linkedin.com/in/raffaelepizzari', action: () => open('https://www.linkedin.com/in/raffaelepizzari/', '_blank') },
      { icon: '🌐', label: 'pixari.dev', desc: 'Personal blog & writing', action: () => open('https://pixari.dev', '_blank') },
      { icon: '🐙', label: 'GitHub', desc: 'github.com/pixari', action: () => open('https://github.com/pixari', '_blank') },
      { icon: '🎙️', label: 'BlaBla Teleprompter', desc: 'blabla.pixari.dev', action: () => open('https://blabla.pixari.dev', '_blank') },
      { icon: '📊', label: 'MarkMySlide', desc: 'markmyslide.pixari.dev', action: () => open('https://markmyslide.pixari.dev', '_blank') },
    ],
  },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function renderResults(query: string) {
  const container = document.getElementById('cmdResults');
  if (!container) return;
  const q = query.toLowerCase().trim();
  let html = '';

  for (const group of cmdItems) {
    const filtered = group.items.filter(
      (item) => item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );
    if (filtered.length > 0) {
      html += `<div class="cmd-group-label">${group.group}</div>`;
      for (const item of filtered) {
        const gIdx = cmdItems.indexOf(group);
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
  }

  if (!html) {
    html = '<div style="padding:1.5rem;text-align:center;color:var(--text-secondary);font-size:0.85rem;">No results found</div>';
  }

  container.innerHTML = html;
}

export function initCommandPalette() {
  const overlay = document.getElementById('cmdPalette');
  const input = document.getElementById('cmdInput') as HTMLInputElement | null;

  function open_() {
    if (!overlay) return;
    overlay.classList.add('active');
    if (input) {
      input.value = '';
      input.focus();
    }
    renderResults('');
  }

  function close_() {
    overlay?.classList.remove('active');
  }

  (window as any).openCmdPalette = open_;
  (window as any).closeCmdPalette = close_;
  (window as any).__execCmd = (gIdx: number, iIdx: number) => {
    const item = cmdItems[gIdx]?.items[iIdx];
    if (item) { close_(); item.action(); }
  };

  input?.addEventListener('input', (e) => {
    renderResults((e.target as HTMLInputElement).value);
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close_();
  });

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) close_();
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
}
