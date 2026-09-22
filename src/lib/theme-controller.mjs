export const createThemeController = ({
    root,
    toggle,
    darkScheme,
    win,
    doc,
}) => {
    const themeKey = 'theme';
    const initialTheme = root.dataset.theme;
    let explicitTheme =
        initialTheme === 'light' || initialTheme === 'dark'
            ? initialTheme
            : null;

    const activeTheme = () =>
        root.dataset.theme ?? (darkScheme.matches ? 'dark' : 'light');

    const syncControl = () => {
        const dark = activeTheme() === 'dark';
        toggle.setAttribute('aria-pressed', String(dark));
        toggle.setAttribute(
            'aria-label',
            dark
                ? (toggle.dataset.lightLabel ?? '')
                : (toggle.dataset.darkLabel ?? ''),
        );
    };

    const applyTheme = (theme) => {
        if (theme) root.dataset.theme = theme;
        else delete root.dataset.theme;
        doc.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
            meta.content = theme
                ? theme === 'dark'
                    ? '#101820'
                    : '#f4f1ea'
                : meta.media.includes('dark')
                  ? '#101820'
                  : '#f4f1ea';
        });
        syncControl();
    };

    syncControl();
    toggle.addEventListener('click', () => {
        const theme = activeTheme() === 'dark' ? 'light' : 'dark';
        explicitTheme = theme;
        applyTheme(theme);
        try {
            win.localStorage.setItem(themeKey, theme);
        } catch {}
    });
    darkScheme.addEventListener('change', () => {
        if (!explicitTheme) applyTheme(null);
    });
    win.addEventListener('storage', (event) => {
        try {
            if (event.storageArea !== win.localStorage) return;
        } catch {
            return;
        }
        if (event.key !== themeKey && event.key !== null) return;
        if (event.key === null || event.newValue === null) {
            explicitTheme = null;
            applyTheme(null);
            return;
        }
        if (event.newValue !== 'light' && event.newValue !== 'dark') return;
        explicitTheme = event.newValue;
        applyTheme(explicitTheme);
    });
};
