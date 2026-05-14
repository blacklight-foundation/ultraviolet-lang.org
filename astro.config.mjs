import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { CHAPTERS } from './scripts/spec-utils.mjs';
import {
  siteDescription,
  socialImageAlt,
  socialImageHeight,
  socialImagePath,
  socialImageType,
  socialImageWidth,
} from './src/data/siteMetadata.mjs';

const description = siteDescription;
const socialImageUrl = `https://ultraviolet-lang.org${socialImagePath}`;

const specificationSidebarItems = [
  { label: 'Overview', slug: 'docs/specification' },
  { label: 'Reading guide', slug: 'docs/reference/specification-reading-guide' },
  ...CHAPTERS.map((chapter) => ({
    label: chapter.heading,
    slug: `docs/specification/${chapter.slug}`,
  })),
];

export default defineConfig({
  site: 'https://ultraviolet-lang.org',
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
            { label: 'Why Ultraviolet', slug: 'docs/why-ultraviolet' },
            { label: 'Quickstart', slug: 'docs/quickstart' },
            { label: 'First program', slug: 'docs/first-program' },
            {
              label: 'Build the compiler',
              slug: 'docs/build-the-compiler',
            },
          ],
        },
        {
          label: 'AI-written code review',
          items: [
            {
              label: 'Review model',
              slug: 'docs/ai-written-code-review',
            },
            { label: 'Language tour', slug: 'docs/language-tour' },
          ],
        },
        {
          label: 'Specification',
          items: specificationSidebarItems,
        },
        {
          label: 'Modal programming',
          items: [
            { label: 'Overview', slug: 'docs/modal-programming' },
          ],
        },
        {
          label: 'Core language',
          items: [
            { label: 'Overview', slug: 'docs/core-language' },
            { label: 'Contracts', slug: 'docs/core-language/contracts' },
            { label: 'Permissions', slug: 'docs/core-language/permissions' },
            { label: 'Key system', slug: 'docs/core-language/key-system' },
            {
              label: 'Structured concurrency',
              slug: 'docs/core-language/structured-concurrency',
            },
            {
              label: 'CPU/GPU programming',
              slug: 'docs/core-language/cpu-gpu-programming',
            },
            {
              label: 'Explicit effects',
              slug: 'docs/core-language/explicit-effects',
            },
          ],
        },
        {
          label: 'Using the toolchain',
          items: [
            { label: 'Overview', slug: 'docs/toolchain' },
            {
              label: 'Project manifests',
              slug: 'docs/toolchain/project-manifests',
            },
            { label: 'Command line', slug: 'docs/toolchain/command-line' },
            { label: 'Diagnostics', slug: 'docs/toolchain/diagnostics' },
            {
              label: 'Source-native tests',
              slug: 'docs/toolchain/source-native-tests',
            },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Overview', slug: 'docs/reference' },
            {
              label: 'Documentation audit',
              slug: 'docs/reference/documentation-audit',
            },
            {
              label: 'Runtime and built-ins',
              slug: 'docs/reference/runtime-and-builtins',
            },
            {
              label: 'Target profiles and ABI',
              slug: 'docs/reference/target-profiles-and-abi',
            },
            {
              label: 'Compiler architecture',
              slug: 'docs/reference/compiler-architecture',
            },
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
