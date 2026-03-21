(function () {
    'use strict';

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function () {});
        });
    }

    var box = document.getElementById('about-pwa-download');
    if (!box) return;

    var browserNote = document.getElementById('pwa-install-browser-note');
    var standaloneNote = document.getElementById('pwa-standalone-note');
    var instructions = box.querySelector('[data-pwa-instructions]');
    var androidLink = box.querySelector('[data-pwa-android-cta]');

    var isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true;

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
        if (isStandalone) {
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

    if (isStandalone) {
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
