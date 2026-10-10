import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Activatus Code Standards',
  tagline: 'Shared code standards for every Activatus project.',
  favicon: 'img/favicon.svg',

  // TODO: set to the production URL once the site has a home
  url: 'https://code-standards.example.com',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    ['@getcanary/docusaurus-theme-search-pagefind', {}],
    '@docusaurus/theme-mermaid',
  ],

  themeConfig: {
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    metadata: [
      {name: 'description', content: 'Code Standards for Activatus'},
      {name: 'author', content: 'Activatus'},
      {name: 'og:site_name', content: 'Activatus Code Standards'},
      {name: 'og:locale', content: 'en_AU'},
      {name: 'og:type', content: 'website'},
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Activatus Code Standards',
      logo: {
        alt: 'Activatus Logo',
        src: 'img/logo.svg',
      },
      items: [],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Activatus. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
