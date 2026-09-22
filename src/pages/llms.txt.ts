import type { APIRoute } from 'astro';
import { content } from '../data/content';
import { locales, pageKeys, pathFor } from '../lib/i18n';

export const GET: APIRoute = ({ site }) => {
    const lines = [
        '# SerioTools',
        '',
        '> A fictional multilingual Astro demonstration. All visible text is placeholder content.',
        '',
        ...locales.flatMap((locale) => [
            `## ${locale.toUpperCase()}`,
            ...pageKeys.map(
                (page) =>
                    `- [${content[locale].nav[page]}](${new URL(pathFor(page, locale), site)})`,
            ),
            '',
        ]),
    ];

    return new Response(`${lines.join('\n')}\n`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
};
