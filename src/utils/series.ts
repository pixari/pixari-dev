import type { CollectionEntry } from 'astro:content';
import { getPostSlug } from './posts';

export interface SeriesMeta {
  slug: string;
  title: string;
  description: string;
}

export const SERIES: Record<string, SeriesMeta> = {
  'engineering-leadership-playbook': {
    slug: 'engineering-leadership-playbook',
    title: 'Engineering Leadership Playbook',
    description:
      'The transition from IC to engineering leader. 1:1s, delegation, hiring, conflict, and the human side of management.',
  },
  'ai-and-engineering': {
    slug: 'ai-and-engineering',
    title: 'AI & Engineering',
    description:
      'How AI is changing the way we build software. What engineers and leaders need to know.',
  },
  'engineering-practices': {
    slug: 'engineering-practices',
    title: 'Engineering Practices That Ship',
    description:
      'Sprint planning, retrospectives, RFCs, metrics, and the practices that make teams effective.',
  },
};

export interface SeriesContext {
  meta: SeriesMeta;
  posts: CollectionEntry<'blog'>[];
  currentIndex: number;
  prev: CollectionEntry<'blog'> | null;
  next: CollectionEntry<'blog'> | null;
}

export function getSeriesContext(
  post: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
): SeriesContext | null {
  const seriesSlug = post.data.series;
  if (!seriesSlug) return null;

  const meta = SERIES[seriesSlug];
  if (!meta) return null;

  const seriesPosts = allPosts
    .filter((p) => p.data.series === seriesSlug && !p.data.draft)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));

  if (seriesPosts.length < 2) return null;

  const currentIndex = seriesPosts.findIndex(
    (p) => getPostSlug(p) === getPostSlug(post),
  );

  return {
    meta,
    posts: seriesPosts,
    currentIndex,
    prev: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next: currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null,
  };
}

export function getAllSeries(
  allPosts: CollectionEntry<'blog'>[],
): { meta: SeriesMeta; posts: CollectionEntry<'blog'>[] }[] {
  return Object.values(SERIES)
    .map((meta) => {
      const posts = allPosts
        .filter((p) => p.data.series === meta.slug && !p.data.draft)
        .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
      return { meta, posts };
    })
    .filter(({ posts }) => posts.length >= 2);
}
