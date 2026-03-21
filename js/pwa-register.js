(function () {
    'use strict';

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function () {});
        });
    }

    // #region agent log
    (function splashManifestProbe() {
        var ep = 'http://127.0.0.1:7278/ingest/b87b8319-fe26-443a-a40f-6ca003a086d6';
        function send(msg, hypothesisId, data) {
            fetch(ep, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9bfec0' },
                body: JSON.stringify({
                    sessionId: '9bfec0',
                    hypothesisId: hypothesisId,
                    location: 'pwa-register.js:splashManifestProbe',
                    message: msg,
                    data: data || {},
                    timestamp: Date.now()
                })
            }).catch(function () {});
        }
        var dm = window.matchMedia('(display-mode: standalone)').matches
            ? 'standalone'
            : window.matchMedia('(display-mode: fullscreen)').matches
              ? 'fullscreen'
              : 'browser';
        var startupLinks = document.querySelectorAll('link[rel="apple-touch-startup-image"]');
        var startupHrefs = [];
        for (var si = 0; si < startupLinks.length; si++) {
            startupHrefs.push(startupLinks[si].getAttribute('href') || '');
        }
        send(
            'runtime context',
            'H4',
            {
                displayMode: dm,
                navStandalone: !!window.navigator.standalone,
                href: String(location.href).split('?')[0],
                path: location.pathname || '',
                appleStartupLinkCount: startupLinks.length,
                appleStartupHrefs: startupHrefs
            }
        );
        fetch(new URL('manifest.webmanifest', location.href).href, { cache: 'no-store' })
            .then(function (res) {
                return res.text().then(function (text) {
                    var j;
                    try {
                        j = JSON.parse(text);
                    } catch (e) {
                        send('manifest JSON parse error', 'H2', { status: res.status, err: String(e) });
                        return;
                    }
                    send(
                        'manifest fetched',
                        'H2',
                        {
                            status: res.status,
                            ok: res.ok,
                            background_color: j.background_color,
                            theme_color: j.theme_color,
                            iconSrcs: (j.icons || []).map(function (i) {
                                return i.src;
                            }),
                            iconPurposes: (j.icons || []).map(function (i) {
                                return i.purpose || '';
                            })
                        }
                    );
                    var base = new URL('.', location.href).href;
                    var summary = {
                        path: location.pathname || '',
                        displayMode: dm,
                        manifestStatus: res.status,
                        manifestOk: res.ok,
                        background_color: j.background_color,
                        iconResults: []
                    };
                    return Promise.all(
                        (j.icons || []).map(function (icon) {
                            var abs = new URL(icon.src, base).href;
                            return fetch(abs, { method: 'GET', cache: 'no-store' })
                                .then(function (ir) {
                                    var row = {
                                        src: icon.src,
                                        abs: abs,
                                        status: ir.status,
                                        ok: ir.ok,
                                        ct: ir.headers.get('content-type')
                                    };
                                    summary.iconResults.push(row);
                                    send('icon fetch', 'H1', row);
                                    return row;
                                })
                                .catch(function (err) {
                                    var row = { src: icon.src, abs: abs, err: String(err) };
                                    summary.iconResults.push(row);
                                    send('icon fetch fail', 'H1', row);
                                    return row;
                                });
                        })
                    ).then(function () {
                        try {
                            window.__splashProbeSummary = summary;
                        } catch (e) {}
                        send('probe complete', 'H0', summary);
                    });
                });
            })
            .catch(function (err) {
                send('manifest fetch fail', 'H2', { err: String(err) });
            });
    })();
    // #endregion

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
        window.addEventListener('pageshow', function () {
            window.requestAnimationFrame(function () {
                window.scrollTo(0, 0);
            });
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
