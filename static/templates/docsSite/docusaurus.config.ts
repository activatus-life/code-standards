import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// TODO: set the project name
const PROJECT_NAME = 'Project Name';

const config: Config = {
  title: `${PROJECT_NAME} Docs`,
  favicon: 'img/logo.svg',

  // The docs are only ever served behind the app's /docs route, so this URL is a placeholder.
  url: 'http://localhost:3000',
  baseUrl: '/docs/',

  // Internal docs must never be indexed by search engines.
  noIndex: true,

  onBrokenLinks: 'throw',

  markdown: {
    // Plain .md files are read as CommonMark, so < and { in a doc never break the build.
    format: 'detect',
    mermaid: true,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          // The Markdown lives in the project's root docs/ folder, not inside this site.
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [['@getcanary/docusaurus-theme-search-pagefind', {}], '@docusaurus/theme-mermaid'],

  themeConfig: {
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: `${PROJECT_NAME} Docs`,
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Internal documentation. Not for public release.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
