import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { runInNewContext } from 'node:vm';
import { createThemeController } from '../src/lib/theme-controller.mjs';

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
const layoutSource = read('src/layouts/Layout.astro');
const notFoundSource = read('src/pages/404.astro');
const builtPages = [...allPages, '404.html'].map((path) =>
    read(join(dist, path)),
);
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
        '@media (max-width: 22rem)',
        '@media (pointer: coarse)',
        '@media (hover: hover) and (pointer: fine)',
        '@media (min-width: 90rem)',
        '@media (prefers-reduced-motion: reduce)',
        'min-height: 2.75rem',
        'min-width: 2.75rem',
    ].every((value) => cssSource.includes(value)),
);
check(
    'dual theme tokens use native scheme integration',
    cssSource.includes('color-scheme: light dark') &&
        cssSource.includes('light-dark(#101820, #f4f1ea)') &&
        cssSource.includes(":root[data-theme='light']") &&
        cssSource.includes(":root[data-theme='dark']"),
);
check(
    'theme bootstrap runs in the head with guarded allow-listed storage',
    layoutSource.indexOf("localStorage.getItem('theme')") <
        layoutSource.indexOf('</head>') &&
        layoutSource.includes("t==='light'||t==='dark'") &&
        layoutSource.includes('try{') &&
        layoutSource.includes('catch{}'),
);
check(
    'theme control is localized and exposes accessible state',
    allPages.every((path) => {
        const html = read(join(dist, path));
        return (
            html.includes('class="theme-toggle"') &&
            html.includes('aria-pressed="false"') &&
            html.includes('data-light-label=') &&
            html.includes('data-dark-label=')
        );
    }) &&
        read(join(dist, 'index.html')).includes(
            'data-dark-label="Use dark theme"',
        ) &&
        read(join(dist, 'de/index.html')).includes(
            'data-dark-label="Dunkles Design verwenden"',
        ) &&
        read(join(dist, 'sl/index.html')).includes(
            'data-dark-label="Uporabi temno temo"',
        ),
);
check(
    'theme control is hidden without JavaScript and enabled progressively',
    cssSource.includes('.theme-toggle {') &&
        cssSource.includes('display: none') &&
        cssSource.includes('.js .theme-toggle') &&
        cssSource.includes('display: grid'),
);
check(
    'every built document has bootstrap and exact dual-scheme metadata in head',
    builtPages.every((html) => {
        const head = html.slice(
            html.indexOf('<head>'),
            html.indexOf('</head>'),
        );
        const metas = [
            ...head.matchAll(
                /<meta name="theme-color" content="([^"]+)" media="([^"]+)"\s*\/?>/g,
            ),
        ];
        return (
            head.includes("localStorage.getItem('theme')") &&
            head.includes("t==='light'||t==='dark'") &&
            head.includes('try{') &&
            head.includes('catch{}') &&
            metas.length === 2 &&
            metas.some(
                ([, content, media]) =>
                    content === '#f4f1ea' &&
                    media === '(prefers-color-scheme: light)',
            ) &&
            metas.some(
                ([, content, media]) =>
                    content === '#101820' &&
                    media === '(prefers-color-scheme: dark)',
            )
        );
    }),
);
check(
    'standalone 404 restores and renders both themes',
    notFoundSource.includes("localStorage.getItem('theme')") &&
        notFoundSource.includes('color-scheme: light dark') &&
        notFoundSource.includes('light-dark(') &&
        notFoundSource.includes(":global(:root[data-theme='dark'])"),
);
check(
    'scheme-safe contrast tokens and reduced-motion override are present',
    cssSource.includes('--signal-ink: #101820') &&
        cssSource.includes('--hero-mark-background: light-dark(') &&
        cssSource.includes('color: var(--signal-ink)') &&
        cssSource.includes('@media (prefers-reduced-motion: reduce)'),
);

const bootstrap = home.match(
    /<script>(\(\(\)=>\{try\{const t=localStorage[\s\S]*?\}\)\(\);)<\/script>/,
)?.[1];
const runBootstrap = (storage) => {
    const root = { dataset: {} };
    const metas = [{ setAttribute() {} }, { setAttribute() {} }];
    runInNewContext(bootstrap, {
        localStorage: storage,
        document: {
            documentElement: root,
            querySelectorAll: () => metas,
        },
    });
    return root.dataset.theme ?? null;
};
check(
    'bootstrap handles missing, valid, invalid, and unavailable storage',
    Boolean(bootstrap) &&
        runBootstrap({ getItem: () => null }) === null &&
        runBootstrap({ getItem: () => 'light' }) === 'light' &&
        runBootstrap({ getItem: () => 'dark' }) === 'dark' &&
        runBootstrap({ getItem: () => 'sepia' }) === null &&
        runBootstrap({
            getItem: () => {
                throw new Error('denied');
            },
        }) === null,
);

const makeHarness = ({
    systemDark = false,
    initialTheme,
    writeFails = false,
    storageInaccessible = false,
} = {}) => {
    const listeners = { click: [], change: [], storage: [] };
    const attrs = {};
    const writes = [];
    const storage = {
        setItem(key, value) {
            if (writeFails) throw new Error('denied');
            writes.push([key, value]);
        },
    };
    const root = { dataset: {} };
    if (initialTheme) root.dataset.theme = initialTheme;
    const toggle = {
        dataset: { lightLabel: 'Use light theme', darkLabel: 'Use dark theme' },
        setAttribute: (key, value) => (attrs[key] = value),
        addEventListener: (type, fn) => listeners[type].push(fn),
    };
    const darkScheme = {
        matches: systemDark,
        addEventListener: (type, fn) => listeners[type].push(fn),
    };
    const metas = [
        { media: '(prefers-color-scheme: light)', content: '#f4f1ea' },
        { media: '(prefers-color-scheme: dark)', content: '#101820' },
    ];
    const win = {
        localStorage: storage,
        addEventListener: (type, fn) => listeners[type].push(fn),
    };
    if (storageInaccessible) {
        Object.defineProperty(win, 'localStorage', {
            get() {
                throw new Error('denied');
            },
        });
    }
    createThemeController({
        root,
        toggle,
        darkScheme,
        win,
        doc: { querySelectorAll: () => metas },
    });
    return {
        root,
        attrs,
        writes,
        metas,
        storage,
        click: () => listeners.click[0](),
        system: (dark) => {
            darkScheme.matches = dark;
            listeners.change[0]();
        },
        storageEvent: (event) => listeners.storage[0](event),
    };
};

const lightHarness = makeHarness();
const darkHarness = makeHarness({ systemDark: true });
const clicks = makeHarness();
clicks.click();
const firstClick =
    clicks.root.dataset.theme === 'dark' &&
    clicks.attrs['aria-pressed'] === 'true' &&
    clicks.attrs['aria-label'] === 'Use light theme' &&
    clicks.metas.every((meta) => meta.content === '#101820') &&
    clicks.writes.at(-1)?.[1] === 'dark';
clicks.click();
const secondClick =
    clicks.root.dataset.theme === 'light' &&
    clicks.attrs['aria-pressed'] === 'false' &&
    clicks.attrs['aria-label'] === 'Use dark theme' &&
    clicks.metas.every((meta) => meta.content === '#f4f1ea') &&
    clicks.writes.at(-1)?.[1] === 'light';
check(
    'system defaults and two toggle interactions update all state',
    lightHarness.attrs['aria-pressed'] === 'false' &&
        darkHarness.attrs['aria-pressed'] === 'true' &&
        firstClick &&
        secondClick,
);

const failedWrite = makeHarness({ writeFails: true });
failedWrite.click();
failedWrite.system(false);
const systemOnly = makeHarness();
systemOnly.system(true);
check(
    'failed writes retain explicit state while system-only state follows changes',
    failedWrite.root.dataset.theme === 'dark' &&
        systemOnly.root.dataset.theme === undefined &&
        systemOnly.attrs['aria-pressed'] === 'true',
);

const synced = makeHarness();
synced.storageEvent({
    key: 'theme',
    newValue: 'dark',
    storageArea: synced.storage,
});
const validSet = synced.root.dataset.theme === 'dark';
synced.storageEvent({
    key: 'theme',
    newValue: 'sepia',
    storageArea: synced.storage,
});
const invalidIgnored = synced.root.dataset.theme === 'dark';
synced.storageEvent({ key: 'theme', newValue: 'light', storageArea: {} });
const otherStorageIgnored = synced.root.dataset.theme === 'dark';
synced.storageEvent({
    key: 'theme',
    newValue: null,
    storageArea: synced.storage,
});
const removeClears = synced.root.dataset.theme === undefined;
synced.storageEvent({
    key: 'theme',
    newValue: 'dark',
    storageArea: synced.storage,
});
synced.storageEvent({ key: null, newValue: null, storageArea: synced.storage });
const inaccessible = makeHarness({ storageInaccessible: true });
inaccessible.storageEvent({
    key: 'theme',
    newValue: 'dark',
    storageArea: {},
});
check(
    'cross-tab synchronization handles valid set, remove, clear, invalid, and foreign events',
    validSet &&
        invalidIgnored &&
        otherStorageIgnored &&
        removeClears &&
        synced.root.dataset.theme === undefined &&
        inaccessible.root.dataset.theme === undefined,
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
