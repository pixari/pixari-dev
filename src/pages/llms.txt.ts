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
    '> Senior Engineering Manager in Munich. 20+ years building digital products, leading teams, and driving engineering excellence.',
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
    '- [Home](https://pixari.dev/): Resume and portfolio',
    '- [Blog](https://pixari.dev/blog/): All blog posts',
    '- [RSS Feed](https://pixari.dev/rss.xml): Subscribe to new posts',
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
