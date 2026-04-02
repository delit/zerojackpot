(function () {
    'use strict';

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function () {});
        });
    }

    function isStandalone() {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.navigator.standalone === true
        );
    }

    function isIndexPage() {
        var path = window.location.pathname || '';
        if (path === '/' || path === '') return true;
        var pl = path.toLowerCase();
        if (pl.endsWith('/index.html') || pl.endsWith('/index.htm') || pl === '/index.html') return true;
        if (path.endsWith('/')) return true;
        var parts = path.split('/').filter(Boolean);
        var last = parts.length ? parts[parts.length - 1] : '';
        if (/^index\.html?$/i.test(last)) return true;
        if (last && !/\.html?$/i.test(last)) return true;
        return false;
    }

    if (isStandalone() && isIndexPage()) {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        function scrollIndexToTop() {
            window.scrollTo(0, 0);
            if (document.documentElement) {
                document.documentElement.scrollTop = 0;
            }
            if (document.body) {
                document.body.scrollTop = 0;
            }
        }
        function scrollIndexToTopAfterLayout() {
            scrollIndexToTop();
            window.requestAnimationFrame(function () {
                scrollIndexToTop();
                window.requestAnimationFrame(function () {
                    scrollIndexToTop();
                });
            });
        }
        window.addEventListener('pageshow', function () {
            scrollIndexToTopAfterLayout();
        });
        window.addEventListener('load', function () {
            scrollIndexToTopAfterLayout();
        });
    }

    var box = document.getElementById('about-pwa-download');
    if (!box) return;

    var browserNote = document.getElementById('pwa-install-browser-note');
    var standaloneNote = document.getElementById('pwa-standalone-note');
    var instructions = box.querySelector('[data-pwa-instructions]');
    var androidLink = box.querySelector('[data-pwa-android-cta]');

    var deferredPrompt = null;

    function setHidden(el, on) {
        if (!el) return;
        if (on) el.setAttribute('hidden', '');
        else el.removeAttribute('hidden');
    }

    function isAndroidPhoneOrTablet() {
        var ua = navigator.userAgent || '';
        if (/iPhone|iPad|iPod/i.test(ua)) return false;
        return /Android/i.test(ua);
    }

    function syncAndroidManualLink() {
        if (!androidLink) return;
        androidLink.classList.remove('about-pwa-android-visible');
        if (isStandalone()) {
            setHidden(androidLink, true);
            return;
        }
        var show = isAndroidPhoneOrTablet();
        if (show) {
            androidLink.classList.add('about-pwa-android-visible');
            setHidden(androidLink, false);
        } else {
            setHidden(androidLink, true);
        }
    }

    function runInstallPrompt() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function () {
            deferredPrompt = null;
        });
    }

    if (isStandalone()) {
        setHidden(instructions, true);
        setHidden(browserNote, true);
        setHidden(androidLink, true);
        setHidden(standaloneNote, false);
        return;
    }

    setHidden(standaloneNote, true);
    setHidden(browserNote, false);
    syncAndroidManualLink();

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
    });

    window.addEventListener('appinstalled', function () {
        deferredPrompt = null;
    });

    /* Android CTA: prompt() när webbläsaren erbjudit installation; annars mjuk scroll till steg */
    if (androidLink) {
        androidLink.addEventListener('click', function () {
            if (deferredPrompt) {
                runInstallPrompt();
                return;
            }
            var target = document.getElementById('download-android-steps');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
})();
