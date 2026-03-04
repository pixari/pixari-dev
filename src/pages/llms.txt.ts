import { getCollection } from 'astro:content';
import { getPostSlug } from '../utils/posts';
import type { APIContext } from 'astro';

export async function GET(_context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const lines: string[] = [
    '# pixari.dev',
    '> Engineering manager in Munich. Writing about software, teams, and AI.',
    '',
    '## About',
    '',
    '- Author: Raffaele Pizzari',
    '- Location: Munich, Germany',
    '- Role: Senior Engineering Manager at Quantilope',
    '- Topics: Engineering leadership, AI, product engineering, team dynamics',
    '',
    '## Pages',
    '',
    '- [Home](https://pixari.dev/): About and work history',
    '- [Blog](https://pixari.dev/blog/): All blog posts',
    '- [RSS Feed](https://pixari.dev/rss.xml): RSS feed',
    '',
    '## Blog Posts',
    '',
  ];

  for (const post of sorted) {
    const slug = getPostSlug(post);
    const excerpt = post.data.excerpt ?? post.data.description ?? '';
    lines.push(`- [${post.data.title}](https://pixari.dev/${slug}/): ${excerpt}`);
  }

  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
