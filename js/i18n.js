/**
 * ZeroJackpot i18n: egna språkfiler under i18n/<locale>.json
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'zerojackpot-lang';
    const SUPPORTED = ['sv', 'en', 'de', 'es'];

    /** Produktions-orig för canonical/JSON-LD (localhost använder eget origin) */
    const SEO_ORIGIN = 'https://delit.github.io';

    let flatMessages = {};
    let meta = {
        locale: 'sv',
        htmlLang: 'sv',
        intlLocale: 'sv-SE',
        currency: 'SEK',
        ticketPrice: 25,
        ogLocale: 'sv_SE'
    };

    function normalizeLang(tag) {
        if (!tag || typeof tag !== 'string') return null;
        const base = tag.split('-')[0].toLowerCase();
        return SUPPORTED.includes(base) ? base : null;
    }

    function langFromUrl() {
        try {
            return normalizeLang(new URLSearchParams(window.location.search).get('lang'));
        } catch (e) {
            return null;
        }
    }

    function detectLocale() {
        const fromUrl = langFromUrl();
        if (fromUrl) return fromUrl;

        const saved = localStorage.getItem(STORAGE_KEY);
        const fromSaved = normalizeLang(saved);
        if (fromSaved) return fromSaved;

        if (typeof navigator !== 'undefined' && navigator.languages) {
            for (const lang of navigator.languages) {
                const n = normalizeLang(lang);
                if (n) return n;
            }
        }
        if (typeof navigator !== 'undefined' && navigator.language) {
            const n = normalizeLang(navigator.language);
            if (n) return n;
        }
        return 'sv';
    }

    /** Canonical URL för aktiv sida + språk (sv = utan ?lang) */
    function getSeoPageUrl() {
        let path = window.location.pathname || '/';
        if (/\/index\.html?$/i.test(path)) {
            path = path.replace(/\/?index\.html?$/i, '/') || '/';
        }
        const useDev = /^localhost$|^127\.0\.0\.1$/.test(window.location.hostname || '');
        const origin = useDev ? window.location.origin : SEO_ORIGIN;
        const u = new URL(path, origin);
        if (meta.locale && meta.locale !== 'sv') {
            u.searchParams.set('lang', meta.locale);
        }
        return u.href;
    }

    /** Synka adressfältet med valt språk (SEO/delning) */
    function syncUrlBarToLocale() {
        try {
            const path = window.location.pathname || '/';
            const u = new URL(path, window.location.origin);
            if (meta.locale === 'sv') {
                u.searchParams.delete('lang');
            } else {
                u.searchParams.set('lang', meta.locale);
            }
            const q = u.searchParams.toString();
            const next = u.pathname + (q ? '?' + q : '') + (window.location.hash || '');
            if (next !== window.location.pathname + window.location.search + window.location.hash) {
                window.history.replaceState({}, '', next);
            }
        } catch (e) {
            console.warn('[i18n] syncUrlBarToLocale', e);
        }
    }

    function flatten(obj, prefix, out) {
        out = out || {};
        if (!obj || typeof obj !== 'object') return out;
        for (const k of Object.keys(obj)) {
            if (k === 'meta') continue;
            const v = obj[k];
            const key = prefix ? prefix + '.' + k : k;
            if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
                flatten(v, key, out);
            } else {
                out[key] = v;
            }
        }
        return out;
    }

    function getI18nBaseUrl() {
        const path = window.location.pathname || '/';
        const idx = path.lastIndexOf('/');
        const dir = idx >= 0 ? path.slice(0, idx + 1) : '/';
        return new URL('i18n/', window.location.origin + dir);
    }

    async function loadLocale(locale) {
        const base = getI18nBaseUrl();
        const url = new URL(locale + '.json', base);
        const res = await fetch(url.href, { cache: 'no-cache' });
        if (!res.ok) throw new Error('i18n fetch failed: ' + url.href);
        const data = await res.json();
        if (data.meta && typeof data.meta === 'object') {
            meta = Object.assign({}, meta, data.meta);
            meta.locale = locale;
        }
        flatMessages = flatten(data);
        document.documentElement.lang = meta.htmlLang || locale;
        return locale;
    }

    function t(key, params) {
        let s = flatMessages[key];
        if (s === undefined || s === null) {
            console.warn('[i18n] missing key:', key);
            return key;
        }
        if (typeof s !== 'string') s = String(s);
        if (params && typeof params === 'object') {
            s = s.replace(/\{\{(\w+)\}\}/g, function (_, name) {
                return params[name] != null ? String(params[name]) : '';
            });
        }
        return s;
    }

    function applyDomI18n(root) {
        root = root || document;
        root.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            const attr = el.getAttribute('data-i18n-attr');
            const val = t(key);
            if (attr) {
                el.setAttribute(attr, val);
            } else if (el.tagName === 'TITLE') {
                el.textContent = val;
            } else {
                el.textContent = val;
            }
        });
        root.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-html');
            if (!key) return;
            el.innerHTML = t(key);
        });
    }

    function pagePrefix() {
        const p = (window.location.pathname || '').toLowerCase();
        if (p.indexOf('about') !== -1) return 'about';
        if (p.indexOf('jackpot.html') !== -1 || p.indexOf('jakten') !== -1) return 'jakten';
        return 'index';
    }

    function pageT(suffix) {
        return t(pagePrefix() + '.page.' + suffix);
    }

    function updateMetaTags() {
        const setMeta = function (sel, content) {
            const el = document.querySelector(sel);
            if (el && content) el.setAttribute('content', content);
        };
        setMeta('meta[name="description"]', pageT('description'));
        setMeta('meta[property="og:title"]', pageT('ogTitle'));
        setMeta('meta[property="og:description"]', pageT('ogDescription'));
        setMeta('meta[property="og:locale"]', meta.ogLocale || 'sv_SE');
        setMeta('meta[name="twitter:title"]', pageT('twitterTitle'));
        setMeta('meta[name="twitter:description"]', pageT('twitterDescription'));
        const titleEl = document.querySelector('title');
        if (titleEl) titleEl.textContent = pageT('title');

        const pageUrl = getSeoPageUrl();
        setMeta('meta[property="og:url"]', pageUrl);
        const can = document.querySelector('link[rel="canonical"]');
        if (can) {
            can.setAttribute('href', pageUrl);
        }
    }

    function injectJsonLdFAQ() {
        const script = document.getElementById('faq-jsonld');
        if (!script) return;
        try {
            const data = {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                url: getSeoPageUrl(),
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: t('faq.q1.question'),
                        acceptedAnswer: { '@type': 'Answer', text: t('faq.q1.answer') }
                    },
                    {
                        '@type': 'Question',
                        name: t('faq.q2.question'),
                        acceptedAnswer: { '@type': 'Answer', text: t('faq.q2.answer') }
                    },
                    {
                        '@type': 'Question',
                        name: t('faq.q3.question'),
                        acceptedAnswer: { '@type': 'Answer', text: t('faq.q3.answer') }
                    },
                    {
                        '@type': 'Question',
                        name: t('faq.q4.question'),
                        acceptedAnswer: { '@type': 'Answer', text: t('faq.q4.answer') }
                    }
                ]
            };
            script.textContent = JSON.stringify(data, null, 2);
        } catch (e) {
            console.warn('[i18n] FAQ JSON-LD', e);
        }
    }

    function injectIndexJsonLd() {
        const script = document.getElementById('app-jsonld');
        if (!script) return;
        try {
            const siteHome = SEO_ORIGIN + '/zerojackpot/';
            const webApp = {
                '@type': 'WebApplication',
                name: 'ZeroJackpot',
                description: pageT('jsonldDescription'),
                url: getSeoPageUrl(),
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Any',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: meta.currency || 'SEK'
                },
                inLanguage: meta.intlLocale || 'sv-SE',
                creator: { '@type': 'Organization', name: 'ZeroJackpot' },
                isPartOf: { '@type': 'WebSite', '@id': siteHome + '#website' }
            };
            const data = {
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'WebSite',
                        '@id': siteHome + '#website',
                        name: 'ZeroJackpot',
                        url: siteHome,
                        description: pageT('jsonldDescription'),
                        inLanguage: ['sv-SE', 'en-GB', 'de-DE', 'es-ES'],
                        publisher: { '@type': 'Organization', name: 'ZeroJackpot' }
                    },
                    webApp
                ]
            };
            script.textContent = JSON.stringify(data, null, 2);
        } catch (e) {
            console.warn('[i18n] app JSON-LD', e);
        }
    }

    /** Filnamn under grafik/flags/ (SVG – fungerar i Chrome på Windows där emoji-flaggor ofta saknas) */
    const LANG_TO_FLAG_FILE = { sv: 'sv', en: 'gb', de: 'de', es: 'es' };

    function flagSvgUrl(fileCode) {
        try {
            return new URL('grafik/flags/' + fileCode + '.svg', window.location.href).href;
        } catch (e) {
            return 'grafik/flags/' + fileCode + '.svg';
        }
    }

    function wireLanguageSwitcher() {
        document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang-set');
                if (!normalizeLang(lang)) return;
                localStorage.setItem(STORAGE_KEY, lang);
                try {
                    const path = window.location.pathname || '/';
                    const u = new URL(path, window.location.origin);
                    if (lang === 'sv') {
                        u.searchParams.delete('lang');
                    } else {
                        u.searchParams.set('lang', lang);
                    }
                    const q = u.searchParams.toString();
                    window.location.href = u.pathname + (q ? '?' + q : '') + (window.location.hash || '');
                } catch (err) {
                    window.location.reload();
                }
            });
        });
    }

    let footerLangDocWired = false;

    function wireFooterLang() {
        document.querySelectorAll('[data-footer-lang]').forEach(function (wrap) {
            const trigger = wrap.querySelector('.footer-lang-trigger');
            const current = wrap.querySelector('[data-footer-lang-current]');

            function syncFlag() {
                if (!current) return;
                const file = LANG_TO_FLAG_FILE[meta.locale] || 'sv';
                const url = flagSvgUrl(file);
                let img = current.querySelector('img.footer-lang-flag-img');
                if (!img) {
                    img = document.createElement('img');
                    img.className = 'footer-lang-flag-img';
                    img.alt = '';
                    img.width = 28;
                    img.height = 21;
                    img.decoding = 'async';
                    current.textContent = '';
                    current.appendChild(img);
                }
                img.src = url;
            }
            syncFlag();

            function setExpanded(open) {
                wrap.classList.toggle('is-open', open);
                if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
            }

            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
                trigger.addEventListener('click', function (e) {
                    e.preventDefault();
                    setExpanded(!wrap.classList.contains('is-open'));
                });
            }
        });

        if (!footerLangDocWired) {
            footerLangDocWired = true;
            document.addEventListener('click', function (e) {
                document.querySelectorAll('[data-footer-lang]').forEach(function (wrap) {
                    if (!wrap.contains(e.target)) {
                        wrap.classList.remove('is-open');
                        const t = wrap.querySelector('.footer-lang-trigger');
                        if (t) t.setAttribute('aria-expanded', 'false');
                    }
                });
            });
            document.addEventListener('keydown', function (e) {
                if (e.key !== 'Escape') return;
                document.querySelectorAll('[data-footer-lang]').forEach(function (wrap) {
                    wrap.classList.remove('is-open');
                    const t = wrap.querySelector('.footer-lang-trigger');
                    if (t) t.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }

    function fillAboutOddsTable() {
        const tbody = document.getElementById('oddsTableBody');
        if (!tbody || typeof window.getPrizeTiers !== 'function' || typeof window.formatCurrency !== 'function') return;
        const tiers = window.getPrizeTiers();
        const rows = tiers.map(function (tier) {
            return (
                '<tr><td>' +
                tier.name +
                '</td><td>' +
                window.formatCurrency(tier.prize) +
                '</td><td>' +
                tier.odds +
                '</td><td>' +
                t('oddsProb.' + tier.name) +
                '</td></tr>'
            );
        });
        tbody.innerHTML = rows.join('');
    }

    async function init() {
        const locale = detectLocale();
        try {
            await loadLocale(locale);
        } catch (err) {
            console.error('[i18n] load failed, fallback sv', err);
            try {
                await loadLocale('sv');
            } catch (e2) {
                console.error('[i18n] sv fallback failed', e2);
            }
        }
        if (langFromUrl()) {
            localStorage.setItem(STORAGE_KEY, meta.locale);
        }
        window.ZeroJackpotI18n = window.ZeroJackpotI18n || {};
        window.ZeroJackpotI18n.t = t;
        window.ZeroJackpotI18n.getMeta = function () {
            return Object.assign({}, meta);
        };
        window.ZeroJackpotI18n.locale = function () {
            return meta.locale;
        };
        window.ZeroJackpotI18n.setLocalePreference = function (code) {
            if (normalizeLang(code)) localStorage.setItem(STORAGE_KEY, code);
        };

        applyDomI18n(document.body);
        syncUrlBarToLocale();
        updateMetaTags();
        injectJsonLdFAQ();
        injectIndexJsonLd();
        wireLanguageSwitcher();
        wireFooterLang();

        if (typeof window.refreshFormattingAfterI18n === 'function') {
            window.refreshFormattingAfterI18n();
        }
        fillAboutOddsTable();

        if (typeof window.formatCurrency === 'function') {
            const z = window.formatCurrency(0);
            [
                'totalCost',
                'totalWin',
                'netResult',
                'investedAmount',
                'investmentValue',
                'investmentProfit',
                'comparisonValue',
                'bestWin'
            ].forEach(function (id) {
                const el = document.getElementById(id);
                if (el) el.textContent = z;
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        init()
            .then(function () {
                if (typeof window.__zjAfterI18n === 'function') {
                    window.__zjAfterI18n();
                }
            })
            .catch(function (e) {
                console.error(e);
                if (typeof window.__zjAfterI18n === 'function') {
                    window.__zjAfterI18n();
                }
            });
    });

    window.ZeroJackpotI18n = window.ZeroJackpotI18n || {
        init: init,
        t: function () {
            return '';
        },
        getMeta: function () {
            return meta;
        }
    };
})();
