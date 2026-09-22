import type { Locale, PageKey } from '../lib/i18n';

interface PageContent {
    eyebrow: string;
    title: string;
    description: string;
    intro: string;
    sections: readonly { title: string; body: string }[];
}

interface SiteContent {
    skip: string;
    navigationLabel: string;
    languageLabel: string;
    openMenu: string;
    closeMenu: string;
    nav: Record<PageKey, string>;
    footer: string;
    cta: string;
    pages: Record<PageKey, PageContent>;
}

export const content: Record<Locale, SiteContent> = {
    en: {
        skip: 'Skip to content',
        navigationLabel: 'Main navigation',
        languageLabel: 'Language',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        nav: {
            home: 'Home',
            about: 'About',
            services: 'Services',
            contact: 'Contact',
        },
        footer: 'A multilingual Astro demonstration with deliberately fictional content.',
        cta: 'Explore the demo',
        pages: {
            home: {
                eyebrow: 'A modern multilingual foundation',
                title: 'Small tools. Serious clarity.',
                description:
                    'SerioTools is a fictional multilingual demonstration built with Astro.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel sem at arcu fermentum feugiat, crafted here as neutral demonstration copy.',
                sections: [
                    {
                        title: 'Focused by design',
                        body: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur. Donec sed odio dui, vitae facilisis neque.',
                    },
                    {
                        title: 'Ready to grow',
                        body: 'Aenean lacinia bibendum nulla sed consectetur. Maecenas faucibus mollis interdum, sed posuere consectetur est.',
                    },
                    {
                        title: 'Built for the web',
                        body: 'Cras mattis consectetur purus sit amet fermentum. Vestibulum id ligula porta felis euismod semper.',
                    },
                ],
            },
            about: {
                eyebrow: 'About this demonstration',
                title: 'A thoughtful starting point.',
                description:
                    'Learn about the fictional SerioTools multilingual website demonstration.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor, with every sentence serving only as placeholder content.',
                sections: [
                    {
                        title: 'Our premise',
                        body: 'Nullam quis risus eget urna mollis ornare vel eu leo. Sed posuere consectetur est at lobortis.',
                    },
                    {
                        title: 'Our principles',
                        body: 'Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
                    },
                ],
            },
            services: {
                eyebrow: 'Fictional capabilities',
                title: 'Useful shapes for future ideas.',
                description:
                    'An example services page containing neutral placeholder copy.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.',
                sections: [
                    {
                        title: 'Discovery',
                        body: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nulla vitae elit libero, a pharetra augue.',
                    },
                    {
                        title: 'Structure',
                        body: 'Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla.',
                    },
                    {
                        title: 'Delivery',
                        body: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean eu leo quam.',
                    },
                ],
            },
            contact: {
                eyebrow: 'Example contact page',
                title: 'Begin with a simple hello.',
                description:
                    'A fictional contact page for the SerioTools demonstration.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. This demonstration intentionally contains no active form or external data service.',
                sections: [
                    {
                        title: 'Write',
                        body: 'hello@example.com — a reserved example address that does not accept real enquiries.',
                    },
                    {
                        title: 'Visit',
                        body: '123 Example Lane, Sample City — a fictional address included only to demonstrate page structure.',
                    },
                ],
            },
        },
    },
    de: {
        skip: 'Zum Inhalt springen',
        navigationLabel: 'Hauptnavigation',
        languageLabel: 'Sprache',
        openMenu: 'Menü öffnen',
        closeMenu: 'Menü schließen',
        nav: {
            home: 'Start',
            about: 'Über uns',
            services: 'Leistungen',
            contact: 'Kontakt',
        },
        footer: 'Eine mehrsprachige Astro-Demonstration mit bewusst fiktiven Inhalten.',
        cta: 'Demo entdecken',
        pages: {
            home: {
                eyebrow: 'Eine moderne mehrsprachige Grundlage',
                title: 'Kleine Werkzeuge. Klare Gedanken.',
                description:
                    'SerioTools ist eine fiktive mehrsprachige Demonstration mit Astro.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel sem at arcu fermentum feugiat – neutraler Blindtext für diese Demonstration.',
                sections: [
                    {
                        title: 'Bewusst gestaltet',
                        body: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur. Donec sed odio dui und facilisis neque.',
                    },
                    {
                        title: 'Bereit zu wachsen',
                        body: 'Aenean lacinia bibendum nulla sed consectetur. Maecenas faucibus mollis interdum und posuere consectetur est.',
                    },
                    {
                        title: 'Für das Web gebaut',
                        body: 'Cras mattis consectetur purus sit amet fermentum. Vestibulum id ligula porta felis euismod semper.',
                    },
                ],
            },
            about: {
                eyebrow: 'Über diese Demonstration',
                title: 'Ein durchdachter Ausgangspunkt.',
                description:
                    'Mehr über die fiktive mehrsprachige SerioTools-Demonstration.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor; jeder Satz ist ausschließlich Beispieltext.',
                sections: [
                    {
                        title: 'Unsere Idee',
                        body: 'Nullam quis risus eget urna mollis ornare vel eu leo. Sed posuere consectetur est at lobortis.',
                    },
                    {
                        title: 'Unsere Grundsätze',
                        body: 'Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
                    },
                ],
            },
            services: {
                eyebrow: 'Fiktive Leistungen',
                title: 'Nützliche Formen für neue Ideen.',
                description:
                    'Eine beispielhafte Leistungsseite mit neutralem Blindtext.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.',
                sections: [
                    {
                        title: 'Entdecken',
                        body: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nulla vitae elit libero, a pharetra augue.',
                    },
                    {
                        title: 'Strukturieren',
                        body: 'Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla.',
                    },
                    {
                        title: 'Umsetzen',
                        body: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean eu leo quam.',
                    },
                ],
            },
            contact: {
                eyebrow: 'Beispiel-Kontaktseite',
                title: 'Beginnen wir mit einem Hallo.',
                description:
                    'Eine fiktive Kontaktseite für die SerioTools-Demonstration.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diese Demonstration enthält bewusst kein aktives Formular und keinen externen Datendienst.',
                sections: [
                    {
                        title: 'Schreiben',
                        body: 'hello@example.com – eine reservierte Beispieladresse, die keine echten Anfragen annimmt.',
                    },
                    {
                        title: 'Besuchen',
                        body: 'Beispielweg 123, Musterstadt – eine fiktive Adresse ausschließlich zur Demonstration der Seitenstruktur.',
                    },
                ],
            },
        },
    },
    sl: {
        skip: 'Preskoči na vsebino',
        navigationLabel: 'Glavna navigacija',
        languageLabel: 'Jezik',
        openMenu: 'Odpri meni',
        closeMenu: 'Zapri meni',
        nav: {
            home: 'Domov',
            about: 'O nas',
            services: 'Storitve',
            contact: 'Kontakt',
        },
        footer: 'Večjezična predstavitev Astro z namensko izmišljeno vsebino.',
        cta: 'Raziščite predstavitev',
        pages: {
            home: {
                eyebrow: 'Sodobna večjezična osnova',
                title: 'Majhna orodja. Resna jasnost.',
                description:
                    'SerioTools je izmišljena večjezična predstavitev, izdelana z Astro.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel sem at arcu fermentum feugiat – nevtralno predstavitveno besedilo.',
                sections: [
                    {
                        title: 'Premišljena zasnova',
                        body: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur. Donec sed odio dui in facilisis neque.',
                    },
                    {
                        title: 'Pripravljeno na rast',
                        body: 'Aenean lacinia bibendum nulla sed consectetur. Maecenas faucibus mollis interdum in posuere consectetur est.',
                    },
                    {
                        title: 'Ustvarjeno za splet',
                        body: 'Cras mattis consectetur purus sit amet fermentum. Vestibulum id ligula porta felis euismod semper.',
                    },
                ],
            },
            about: {
                eyebrow: 'O tej predstavitvi',
                title: 'Premišljeno izhodišče.',
                description:
                    'Spoznajte izmišljeno večjezično spletno predstavitev SerioTools.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor; vsak stavek je zgolj nadomestno besedilo.',
                sections: [
                    {
                        title: 'Naša zamisel',
                        body: 'Nullam quis risus eget urna mollis ornare vel eu leo. Sed posuere consectetur est at lobortis.',
                    },
                    {
                        title: 'Naša načela',
                        body: 'Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
                    },
                ],
            },
            services: {
                eyebrow: 'Izmišljene zmogljivosti',
                title: 'Uporabne oblike za prihodnje ideje.',
                description:
                    'Vzorčna stran storitev z nevtralnim nadomestnim besedilom.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.',
                sections: [
                    {
                        title: 'Raziskovanje',
                        body: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nulla vitae elit libero, a pharetra augue.',
                    },
                    {
                        title: 'Struktura',
                        body: 'Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla.',
                    },
                    {
                        title: 'Izvedba',
                        body: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean eu leo quam.',
                    },
                ],
            },
            contact: {
                eyebrow: 'Vzorčna kontaktna stran',
                title: 'Začnimo s preprostim pozdravom.',
                description:
                    'Izmišljena kontaktna stran za predstavitev SerioTools.',
                intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Predstavitev namenoma ne vsebuje aktivnega obrazca ali zunanje podatkovne storitve.',
                sections: [
                    {
                        title: 'Pišite',
                        body: 'hello@example.com – rezerviran vzorčni naslov, ki ne sprejema resničnih povpraševanj.',
                    },
                    {
                        title: 'Obiščite',
                        body: 'Vzorčna ulica 123, Vzorčno mesto – izmišljen naslov, namenjen le prikazu strukture strani.',
                    },
                ],
            },
        },
    },
};
