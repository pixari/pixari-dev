import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostSlug } from '../utils/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const siteUrl = context.site!.toString().replace(/\/$/, '');

  return rss({
    title: 'pixari.dev',
    description:
      'Writing about engineering, AI, and leadership.',
    site: context.site!,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.excerpt ?? post.data.description ?? '',
      link: `/${getPostSlug(post)}/`,
      ...(post.data.tags.length > 0
        ? { categories: post.data.tags }
        : {}),
    })),
    customData: [
      `<language>en-us</language>`,
      `<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
      `<managingEditor>hello@pixari.dev (Raffaele Pizzari)</managingEditor>`,
      `<webMaster>hello@pixari.dev (Raffaele Pizzari)</webMaster>`,
      `<image><url>${siteUrl}/images/raffaele-pizzari-200.jpg</url><title>pixari.dev</title><link>${siteUrl}</link></image>`,
    ].join('\n'),
  });
}
