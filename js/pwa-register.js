(function () {
    'use strict';

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function () {});
        });
    }

    var box = document.getElementById('about-pwa-download');
    if (!box) return;

    var btn = document.getElementById('pwa-install-btn');
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

    function syncInstallChrome() {
        if (isStandalone) return;
        var hasPrompt = !!deferredPrompt;
        setHidden(btn, !hasPrompt);
        setHidden(browserNote, hasPrompt);
    }

    function runInstallPrompt() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function () {
            deferredPrompt = null;
            syncInstallChrome();
        });
    }

    if (isStandalone) {
        setHidden(instructions, true);
        setHidden(btn, true);
        setHidden(browserNote, true);
        setHidden(androidLink, true);
        setHidden(standaloneNote, false);
        return;
    }

    setHidden(standaloneNote, true);
    syncAndroidManualLink();
    syncInstallChrome();
    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        syncInstallChrome();
    });

    window.addEventListener('appinstalled', function () {
        deferredPrompt = null;
        setHidden(btn, true);
        setHidden(browserNote, false);
    });

    if (btn) {
        btn.addEventListener('click', function () {
            runInstallPrompt();
        });
    }

    /* Orange länk: öppna systemets PWA-installation om webbläsaren erbjudit det; annars scrolla till manuella steg */
    if (androidLink) {
        androidLink.addEventListener('click', function (e) {
            if (deferredPrompt) {
                e.preventDefault();
                runInstallPrompt();
            }
        });
    }
})();
