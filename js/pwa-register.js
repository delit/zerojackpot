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

    function syncInstallChrome() {
        if (isStandalone) return;
        var hasPrompt = !!deferredPrompt;
        setHidden(btn, !hasPrompt);
        setHidden(browserNote, hasPrompt);
    }

    if (isStandalone) {
        setHidden(instructions, true);
        setHidden(btn, true);
        setHidden(browserNote, true);
        setHidden(standaloneNote, false);
        return;
    }

    setHidden(standaloneNote, true);
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
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.finally(function () {
                deferredPrompt = null;
                syncInstallChrome();
            });
        });
    }
})();
