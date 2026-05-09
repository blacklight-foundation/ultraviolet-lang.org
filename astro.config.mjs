import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const description =
  'A general-purpose programming language for generated source that humans can still review.';

export default defineConfig({
  site: 'https://ultraviolet-lang.org',
  integrations: [
    starlight({
      title: 'Ultraviolet',
      description,
      favicon: '/favicon.svg',
      logo: {
        dark: './src/assets/ultravioletLogoDark.ts',
        light: './src/assets/ultravioletLogoLight.ts',
        alt: 'Ultraviolet language logo',
        replacesTitle: false,
      },
      customCss: ['./src/styles/starlight.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/blacklight-foundation/ultraviolet',
        },
      ],
      editLink: {
        baseUrl:
          'https://github.com/blacklight-foundation/ultraviolet-lang.org/edit/main/',
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Overview', slug: 'docs' },
            { label: 'Quickstart', slug: 'docs/quickstart' },
            {
              label: 'Build the compiler',
              slug: 'docs/build-the-compiler',
            },
            { label: 'First program', slug: 'docs/first-program' },
          ],
        },
        {
          label: 'Language',
          items: [
            { label: 'Language tour', slug: 'docs/language-tour' },
            { label: 'Specification', slug: 'docs/specification' },
          ],
        },
        {
          label: 'Project',
          items: [
            { label: 'Roadmap', link: '/roadmap/' },
            { label: 'Support', link: '/sponsor/' },
            { label: 'Foundation', link: '/foundation/' },
          ],
        },
      ],
      head: [
        {
          tag: 'script',
          attrs: {
            src: '/newsletter-signup.js',
            defer: true,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:site_name',
            content: 'Ultraviolet',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://ultraviolet-lang.org/og.svg',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
        },
      ],
    }),
  ],
});
