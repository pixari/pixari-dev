import type { CollectionEntry } from 'astro:content';

/** Returns the URL slug (no extension) for a blog post. */
export function getPostSlug(post: CollectionEntry<'blog'>): string {
  return post.id.replace(/\.mdx?$/, '');
}
