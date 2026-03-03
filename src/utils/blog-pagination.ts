import type { CollectionEntry } from 'astro:content';

export const POSTS_PER_PAGE = 10;

export interface BlogPagination {
  featured: CollectionEntry<'blog'> | null;
  rest: CollectionEntry<'blog'>[];
  totalPages: number;
  getPostsForPage: (page: number) => CollectionEntry<'blog'>[];
}

/**
 * Given a sorted list of posts (newest first), returns pagination state.
 * Page 1 shows: featured + first (POSTS_PER_PAGE - 1) of rest.
 * Page n (n >= 2) shows: slice of rest.
 */
export function getBlogPagination(posts: CollectionEntry<'blog'>[]): BlogPagination {
  const [featured, ...rest] = posts;
  const totalPages =
    1 +
    Math.ceil(Math.max(0, rest.length - (POSTS_PER_PAGE - 1)) / POSTS_PER_PAGE);

  function getPostsForPage(page: number): CollectionEntry<'blog'>[] {
    if (page < 1) return [];
    if (page === 1) {
      return featured ? [featured, ...rest.slice(0, POSTS_PER_PAGE - 1)] : rest.slice(0, POSTS_PER_PAGE);
    }
    const start = (page - 1) * POSTS_PER_PAGE - 1;
    const end = page * POSTS_PER_PAGE - 1;
    return rest.slice(start, end);
  }

  return {
    featured: featured ?? null,
    rest,
    totalPages,
    getPostsForPage,
  };
}

/** Base path for blog pagination (no trailing slash). */
export const BLOG_PAGE_BASE = '/blog/page';
