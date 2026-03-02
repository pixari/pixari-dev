#!/usr/bin/env node
/**
 * WordPress → Astro content migration helper
 *
 * Run AFTER wordpress-export-to-markdown has produced flat .md files:
 *   npx wordpress-export-to-markdown --post-folders=false
 *
 * Usage:
 *   node scripts/migrate-wp.mjs <input-dir> <output-dir>
 *
 * Example:
 *   node scripts/migrate-wp.mjs ~/Downloads/wp-export/posts src/content/blog
 *
 * What it does:
 *   1. Reads each .md file from <input-dir>
 *   2. Parses and normalises frontmatter (title, date → pubDate, tags, etc.)
 *   3. Fixes HTML entities (&#8217; → ', &#8220; → ", etc.)
 *   4. Strips or converts common WP shortcodes
 *   5. Writes normalised .md to <output-dir>/<slug>.md
 */

import fs from 'node:fs';
import path from 'node:path';

const [, , inputDir, outputDir] = process.argv;

if (!inputDir || !outputDir) {
  console.error('Usage: node scripts/migrate-wp.mjs <input-dir> <output-dir>');
  process.exit(1);
}

const HTML_ENTITIES = {
  '&#8217;': "'",
  '&#8216;': "'",
  '&#8220;': '"',
  '&#8221;': '"',
  '&#8230;': '…',
  '&#8212;': '—',
  '&#8211;': '–',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
};

function decodeEntities(str) {
  return Object.entries(HTML_ENTITIES).reduce(
    (s, [entity, char]) => s.replaceAll(entity, char),
    str
  );
}

function stripShortcodes(content) {
  // Remove [caption ...] ... [/caption] blocks
  content = content.replace(/\[caption[^\]]*\][\s\S]*?\[\/caption\]/gi, '');
  // Remove remaining [shortcode] and [/shortcode] tags
  content = content.replace(/\[\/?\w[^\]]*\]/g, '');
  return content;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };

  const lines = match[1].split('\n');
  const frontmatter = {};

  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      frontmatter[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }

  return { frontmatter, body: match[2] };
}

function normaliseFrontmatter(fm) {
  const out = {};

  out.title = decodeEntities(fm.title ?? fm.post_title ?? 'Untitled');
  out.pubDate = fm.date ?? fm.pubDate ?? fm.post_date ?? new Date().toISOString().split('T')[0];

  if (fm.description) out.description = decodeEntities(fm.description);
  if (fm.excerpt)     out.excerpt = decodeEntities(fm.excerpt);
  if (fm.heroImage)   out.heroImage = fm.heroImage;

  // Normalise tags
  const rawTags = fm.tags ?? fm.post_tags ?? '';
  if (rawTags) {
    out.tags = rawTags
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((t) => t.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  } else {
    out.tags = [];
  }

  if (fm.id)    out.wpId = parseInt(fm.id, 10) || undefined;
  if (fm.wp_id) out.wpId = parseInt(fm.wp_id, 10) || undefined;

  return out;
}

function toYaml(obj) {
  const lines = ['---'];
  for (const [key, val] of Object.entries(obj)) {
    if (Array.isArray(val)) {
      lines.push(`${key}: [${val.map((v) => `"${v}"`).join(', ')}]`);
    } else if (typeof val === 'number') {
      lines.push(`${key}: ${val}`);
    } else {
      const escaped = String(val).replace(/"/g, '\\"');
      lines.push(`${key}: "${escaped}"`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter((f) => /\.mdx?$/.test(f));
let count = 0;

for (const file of files) {
  const inputPath = path.join(inputDir, file);
  const raw = fs.readFileSync(inputPath, 'utf-8');

  const { frontmatter, body } = parseFrontmatter(raw);
  const normFm = normaliseFrontmatter(frontmatter);
  const cleanBody = stripShortcodes(decodeEntities(body));

  const slug = path.basename(file, path.extname(file));
  const output = toYaml(normFm) + '\n' + cleanBody;
  const outputPath = path.join(outputDir, slug + '.md');

  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`✓ ${file} → ${slug}.md`);
  count++;
}

console.log(`\nMigrated ${count} post(s) to ${outputDir}`);
