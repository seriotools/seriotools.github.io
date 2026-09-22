export const locales = ['en', 'de', 'sl'] as const;
export type Locale = (typeof locales)[number];
export const pageKeys = ['home', 'about', 'services', 'contact'] as const;
export type PageKey = (typeof pageKeys)[number];

export const languageTags: Record<Locale, string> = {
    en: 'en',
    de: 'de-DE',
    sl: 'sl-SI',
};

export const languageNames: Record<Locale, string> = {
    en: 'English',
    de: 'Deutsch',
    sl: 'Slovenščina',
};

const routes: Record<PageKey, Record<Locale, string>> = {
    home: { en: '/', de: '/de/', sl: '/sl/' },
    about: { en: '/about/', de: '/de/ueber-uns/', sl: '/sl/o-nas/' },
    services: {
        en: '/services/',
        de: '/de/leistungen/',
        sl: '/sl/storitve/',
    },
    contact: { en: '/contact/', de: '/de/kontakt/', sl: '/sl/kontakt/' },
};

export function pathFor(page: PageKey, locale: Locale): string {
    return routes[page][locale];
}

export function alternatesFor(page: PageKey) {
    return locales.map((locale) => ({
        locale,
        languageTag: languageTags[locale],
        path: pathFor(page, locale),
    }));
}

export function pageForPath(pathname: string): PageKey | undefined {
    const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
    return pageKeys.find((page) =>
        locales.some((locale) => routes[page][locale] === normalized),
    );
}

export function staticPagePaths(locale: Exclude<Locale, 'en'>) {
    return pageKeys
        .filter((page): page is Exclude<PageKey, 'home'> => page !== 'home')
        .map((page) => ({
            params: {
                page: pathFor(page, locale).split('/').filter(Boolean).at(-1),
            },
            props: { locale, page },
        }));
}

export function staticEnglishPaths() {
    return pageKeys
        .filter((page): page is Exclude<PageKey, 'home'> => page !== 'home')
        .map((page) => ({
            params: {
                page: pathFor(page, 'en').split('/').filter(Boolean).at(-1),
            },
            props: { locale: 'en' as const, page },
        }));
}
