import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { alternatesFor, pageForPath } from './src/lib/i18n';

const modernTargets = {
    chrome: 153 << 16,
    edge: 153 << 16,
    firefox: 156 << 16,
    safari: 27 << 16,
    ios_saf: 27 << 16,
};

export default defineConfig({
    output: 'static',
    site: 'https://www.seriotools.com',
    trailingSlash: 'always',
    compressHTML: true,
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'de', 'sl'],
        routing: 'manual',
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'hover',
    },
    integrations: [
        sitemap({
            serialize(item) {
                const page = pageForPath(new URL(item.url).pathname);
                if (!page) return item;
                return {
                    ...item,
                    links: [
                        ...alternatesFor(page).map(({ languageTag, path }) => ({
                            lang: languageTag,
                            url: new URL(path, item.url).href,
                        })),
                        {
                            lang: 'x-default',
                            url: new URL(alternatesFor(page)[0].path, item.url)
                                .href,
                        },
                    ],
                };
            },
        }),
    ],
    vite: {
        build: {
            target: ['chrome153', 'edge153', 'firefox156', 'safari27'],
            cssMinify: 'lightningcss',
        },
        css: {
            transformer: 'lightningcss',
            lightningcss: { targets: modernTargets },
        },
    },
});
