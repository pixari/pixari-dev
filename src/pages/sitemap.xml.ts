import { getCollection } from 'astro:content';
import { getPostSlug } from '../utils/posts';
import type { APIContext } from 'astro';

function xmlDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const staticPages = [
    { url: `${site}/`,        lastmod: xmlDate(new Date()), priority: '1.0', changefreq: 'weekly' },
    { url: `${site}/blog/`,   lastmod: xmlDate(new Date()), priority: '0.9', changefreq: 'daily' },
    { url: `${site}/reading/`,lastmod: xmlDate(new Date()), priority: '0.5', changefreq: 'monthly' },
  ];

  const postPages = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      url: `${site}/${getPostSlug(post)}/`,
      lastmod: xmlDate(post.data.updatedDate ?? post.data.pubDate),
      priority: '0.7',
      changefreq: 'monthly' as const,
    }));

  const allPages = [...staticPages, ...postPages];

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
