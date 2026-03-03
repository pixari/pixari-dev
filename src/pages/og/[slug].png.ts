import { getCollection } from 'astro:content';
import { getPostSlug } from '../../utils/posts';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { GetStaticPaths } from 'astro';

const font = readFileSync(
  join(process.cwd(), 'node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff')
);

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: getPostSlug(post) },
    props: { title: post.data.title, tags: post.data.tags },
  }));
};

export async function GET({ props }: { props: { title: string; tags: string[] } }) {
  const { title, tags } = props;

  const fontSize = title.length > 70 ? 44 : title.length > 50 ? 52 : title.length > 35 ? 60 : 68;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          background: '#0a0a0c',
          fontFamily: '"DM Sans", sans-serif',
        },
        children: [
          // Top: site label
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '18px', fontWeight: 400, color: '#7eb8ff', letterSpacing: '0.02em' },
                    children: 'pixari.dev',
                  },
                },
              ],
            },
          },
          // Middle: title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                paddingTop: '24px',
                paddingBottom: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: `${fontSize}px`,
                      fontWeight: 400,
                      color: '#e8e6e3',
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      maxWidth: '960px',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          // Bottom: tags + author
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              },
              children: [
                // Tags
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: '8px' },
                    children: tags.slice(0, 3).map((tag) => ({
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#7eb8ff',
                          background: 'rgba(126,184,255,0.1)',
                          border: '1px solid rgba(126,184,255,0.25)',
                          borderRadius: '100px',
                          padding: '5px 14px',
                          letterSpacing: '0.07em',
                          textTransform: 'uppercase',
                        },
                        children: tag,
                      },
                    })),
                  },
                },
                // Author
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '16px', fontWeight: 400, color: '#8a8a8e' },
                    children: 'Raffaele Pizzari',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'DM Sans', data: font, weight: 400, style: 'normal' }],
    }
  );

  const resvg = new Resvg(svg);
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
}
