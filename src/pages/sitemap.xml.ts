import { getCollection } from 'astro:content';
import { getPostSlug } from '../utils/posts';
import type { APIContext } from 'astro';

function xmlDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const latestPostDate = sorted[0] ? xmlDate(sorted[0].data.pubDate) : xmlDate(new Date());

  const staticPages = [
    { url: `${site}/`,         lastmod: latestPostDate, priority: '1.0', changefreq: 'weekly' },
    { url: `${site}/blog/`,    lastmod: latestPostDate, priority: '0.9', changefreq: 'daily' },
    { url: `${site}/reading/`, lastmod: '2025-01-01',   priority: '0.5', changefreq: 'monthly' },
    { url: `${site}/now/`,     lastmod: '2026-03-01',   priority: '0.6', changefreq: 'monthly' },
  ];

  const postPages = sorted.map((post) => ({
    url: `${site}/${getPostSlug(post)}/`,
    lastmod: xmlDate(post.data.updatedDate ?? post.data.pubDate),
    priority: '0.7',
    changefreq: 'monthly' as const,
  }));

  // Tag pages — lastmod = most recent post for that tag
  const allTags = [...new Set(posts.flatMap((p) => p.data.tags))];
  const tagPages = allTags.map((tag) => {
    const tagPosts = posts.filter((p) => p.data.tags.includes(tag));
    const newest = tagPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())[0];
    return {
      url: `${site}/blog/${tag.toLowerCase()}/`,
      lastmod: xmlDate(newest.data.updatedDate ?? newest.data.pubDate),
      priority: '0.6',
      changefreq: 'weekly' as const,
    };
  });

  const allPages = [...staticPages, ...postPages, ...tagPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
