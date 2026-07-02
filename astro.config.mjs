import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { handbookSidebarItems } from './scripts/handbook-utils.mjs';
import {
  siteDescription,
  socialImageAlt,
  socialImageHeight,
  socialImagePath,
  socialImageType,
  socialImageWidth,
} from './src/data/siteMetadata.mjs';
import { documentationRedirects } from './src/data/documentationRedirects.mjs';

const description = siteDescription;
const socialImageUrl = `https://ultraviolet-lang.org${socialImagePath}`;
const handbookItems = handbookSidebarItems();

export default defineConfig({
  site: 'https://ultraviolet-lang.org',
  redirects: documentationRedirects,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
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
            { label: 'First program', slug: 'docs/first-program' },
            {
              label: 'Build the compiler',
              slug: 'docs/build-the-compiler',
            },
          ],
        },
        {
          label: 'Handbook',
          collapsed: true,
          items: handbookItems,
        },
        {
          label: 'Project',
          items: [
            { label: 'Roadmap', link: '/roadmap/' },
            { label: 'Benchmarks', link: '/benchmarks/' },
            { label: 'Community', link: '/community/' },
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
          tag: 'script',
          attrs: {
            src: '/header-scroll-progress.js',
            defer: true,
          },
        },
        {
          tag: 'script',
          attrs: {
            src: '/release-status.js',
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
            content: socialImageUrl,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:secure_url',
            content: socialImageUrl,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:type',
            content: socialImageType,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:width',
            content: socialImageWidth,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:height',
            content: socialImageHeight,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:alt',
            content: socialImageAlt,
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: socialImageUrl,
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image:alt',
            content: socialImageAlt,
          },
        },
      ],
    }),
  ],
});
