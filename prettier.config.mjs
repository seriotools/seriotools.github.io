import * as astroPlugin from 'prettier-plugin-astro';

export default {
    plugins: [astroPlugin],
    overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
    singleQuote: true,
    tabWidth: 4,
};
