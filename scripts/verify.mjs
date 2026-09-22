import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = 'dist';
let passed = true;
const check = (label, condition, detail = '') => {
    passed &&= condition;
    console.log(
        `${condition ? 'PASS' : 'FAIL'} ${label}${!condition && detail ? ` — ${detail}` : ''}`,
    );
};
const read = (path) => readFileSync(path, 'utf8');
const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
    });

const routeGroups = [
    ['index.html', 'de/index.html', 'sl/index.html'],
    ['about/index.html', 'de/ueber-uns/index.html', 'sl/o-nas/index.html'],
    [
        'services/index.html',
        'de/leistungen/index.html',
        'sl/storitve/index.html',
    ],
    ['contact/index.html', 'de/kontakt/index.html', 'sl/kontakt/index.html'],
];
const allPages = routeGroups.flat();

check(
    'all 12 localized pages exist',
    allPages.every((path) => existsSync(join(dist, path))),
);
check(
    '404 exists and is noindexed',
    existsSync(join(dist, '404.html')) &&
        read(join(dist, '404.html')).includes('noindex,follow'),
);
check(
    'llms.txt, robots, manifest, and sitemap exist',
    ['llms.txt', 'robots.txt', 'site.webmanifest', 'sitemap-index.xml'].every(
        (path) => existsSync(join(dist, path)),
    ),
);

for (const [en, de, sl] of routeGroups) {
    const files = [en, de, sl].map((path) => read(join(dist, path)));
    const expectedPaths = [en, de, sl].map((path) =>
        path === 'index.html' ? '/' : `/${path.replace(/index\.html$/, '')}`,
    );
    check(
        `locale documents are tagged for ${en}`,
        files[0].includes('<html lang="en">') &&
            files[1].includes('<html lang="de-DE">') &&
            files[2].includes('<html lang="sl-SI">'),
    );
    check(
        `language selector preserves page concept for ${en}`,
        files.every((html) =>
            expectedPaths.every((path) => html.includes(`href="${path}"`)),
        ),
    );
    check(
        `reciprocal hreflang set exists for ${en}`,
        files.every((html) =>
            [
                'hreflang="en"',
                'hreflang="de-DE"',
                'hreflang="sl-SI"',
                'hreflang="x-default"',
            ].every((value) => html.includes(value)),
        ),
    );
}

const htmlFiles = walk(dist).filter((path) => path.endsWith('.html'));
check(
    'every content page has canonical, description, social, and JSON-LD metadata',
    allPages.every((path) => {
        const html = read(join(dist, path));
        return [
            'rel="canonical"',
            'name="description"',
            'property="og:title"',
            'name="twitter:card"',
            'application/ld+json',
            '"@type":"WebPage"',
        ].every((value) => html.includes(value));
    }),
);
check(
    'HTML output is compressed',
    allPages.every((path) => !read(join(dist, path)).includes('\n')),
);
check(
    'no framework hydration or legacy polyfills ship',
    htmlFiles.every(
        (path) =>
            !/astro-island|core-js|regenerator-runtime|nomodule/.test(
                read(path),
            ),
    ),
);
check(
    'reference branding was not copied',
    walk(dist).every((path) => !/\bKUEM\b/i.test(read(path))),
);

const home = read(join(dist, 'index.html'));
const headerSource = read('src/components/Header.astro');
const cssSource = read('src/styles/global.css');
check(
    'compact menu exposes accessible state and controls',
    home.includes('class="menu-toggle"') &&
        home.includes('aria-expanded="false"') &&
        home.includes('aria-controls="site-navigation"') &&
        home.includes('data-open-label="Open menu"') &&
        home.includes('data-close-label="Close menu"'),
);
check(
    'compact menu covers dismissal, resize, inert, and focus behavior',
    [
        'pointerdown',
        "event.key === 'Escape'",
        "compact.addEventListener('change'",
        'navigation.inert',
        'toggle.focus()',
    ].every((value) => headerSource.includes(value)),
);
check(
    'navigation remains available without JavaScript',
    cssSource.includes('.js .main-nav') &&
        cssSource.includes('.js .menu-toggle') &&
        !cssSource.includes('html:not(.js) .main-nav'),
);
check(
    'responsive CSS covers touch, compact, pointer, reduced-motion, and ultra-wide layouts',
    [
        '@media (max-width: 48rem)',
        '@media (pointer: coarse)',
        '@media (hover: hover) and (pointer: fine)',
        '@media (min-width: 90rem)',
        '@media (prefers-reduced-motion: reduce)',
        'min-height: 2.75rem',
        'min-width: 2.75rem',
    ].every((value) => cssSource.includes(value)),
);

const sitemap = walk(dist)
    .filter((path) => /sitemap-\d+\.xml$/.test(path))
    .map(read)
    .join('');
check(
    'sitemap has reciprocal language alternates',
    [
        'hreflang="en"',
        'hreflang="de-DE"',
        'hreflang="sl-SI"',
        'hreflang="x-default"',
    ].every((value) => sitemap.includes(value)),
);

const resolveTarget = (href) => {
    const pathname = href.split(/[?#]/)[0];
    if (!pathname.startsWith('/')) return null;
    const candidate = join(dist, pathname.slice(1));
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    const index = join(candidate, 'index.html');
    return existsSync(index) ? index : null;
};
const broken = [];
for (const file of htmlFiles) {
    for (const match of read(file).matchAll(/\b(?:href|src)="([^"]+)"/g)) {
        const href = match[1];
        if (/^(?:https?:|mailto:|tel:|data:|#)/.test(href)) continue;
        if (!resolveTarget(href))
            broken.push(`${relative(dist, file)} -> ${href}`);
    }
}
check(
    'all internal links and assets resolve',
    broken.length === 0,
    broken.slice(0, 5).join(', '),
);

if (!passed) process.exitCode = 1;
else console.log('\nALL CHECKS PASSED');
