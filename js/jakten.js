/**
 * Live-sida: synkad dragning. Kräver logic.js + i18n (formatCurrency efter init).
 */
(function () {
    'use strict';

    function T(key, params) {
        if (window.ZeroJackpotI18n && window.ZeroJackpotI18n.t) {
            return window.ZeroJackpotI18n.t(key, params);
        }
        return key;
    }

    const START_DATE = new Date('2026-03-19T16:08:00Z');

    const MY_NUMBERS = {
        main: [7, 14, 21, 35, 42],
        stars: [3, 9]
    };

    const WIN_HISTORY_RECENT = 5;
    const WIN_HISTORY_TOP = 5;

    let totalWinnings = 0;
    let bestWin = { amount: 0, category: null, drawNumber: 0 };
    let currentDrawNumber = 0;
    let recentWins = [];
    let topWins = [];

    function getCostPerDraw() {
        return typeof getTicketPrice === 'function' ? getTicketPrice() : 25;
    }

    function cloneDraw(draw) {
        return { main: draw.main.slice(), stars: draw.stars.slice() };
    }

    function recordWin(draw, win, secondIndex) {
        const entry = {
            draw: cloneDraw(draw),
            amount: win.amount,
            name: win.name,
            secondIndex: secondIndex
        };
        recentWins.unshift(entry);
        recentWins = recentWins.slice(0, WIN_HISTORY_RECENT);
        topWins.push(entry);
        topWins.sort(function (a, b) {
            return b.amount - a.amount || b.secondIndex - a.secondIndex;
        });
        topWins = topWins.slice(0, WIN_HISTORY_TOP);
    }

    function renderHistoryPanels() {
        const recentEl = document.getElementById('recentWinsList');
        const topEl = document.getElementById('topWinsList');
        if (!recentEl || !topEl) return;
        recentEl.innerHTML = '';
        topEl.innerHTML = '';

        if (recentWins.length === 0) {
            const p = document.createElement('p');
            p.className = 'win-history-empty';
            p.textContent = T('jakten.historyEmptyRecent');
            recentEl.appendChild(p);
        } else {
            recentWins.forEach(function (entry) {
                recentEl.appendChild(buildWinHistoryRow(entry));
            });
        }

        if (topWins.length === 0) {
            const p = document.createElement('p');
            p.className = 'win-history-empty';
            p.textContent = T('jakten.historyEmptyTop');
            topEl.appendChild(p);
        } else {
            topWins.forEach(function (entry) {
                topEl.appendChild(buildWinHistoryRow(entry));
            });
        }

        requestAnimationFrame(function () {
            requestAnimationFrame(syncWinHistoryLayout);
        });
    }

    function syncWinHistoryLayout() {
        const section = document.querySelector('.win-history-section');
        if (!section) return;
        const rows = section.querySelectorAll('.win-history-row');
        if (rows.length === 0) {
            section.style.removeProperty('--win-history-amount-fs');
            section.style.removeProperty('--win-history-ball-size');
            section.style.removeProperty('--win-history-ball-fs');
            return;
        }

        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const maxBall = isMobile ? 32 : 36;
        const maxBallFs = isMobile ? 0.8 : 0.9;
        const minBall = 20;
        const maxAmtRem = 0.95;
        const minAmtRem = 0.46;
        const stepAmt = 0.03;
        const ballStep = 2;

        function fits() {
            let ok = true;
            rows.forEach(function (row) {
                if (row.scrollWidth > row.clientWidth + 2) ok = false;
            });
            return ok;
        }

        for (let ball = maxBall; ball >= minBall; ball -= ballStep) {
            const ballFs = Math.max(0.55, (ball / maxBall) * maxBallFs);
            for (let amt = maxAmtRem; amt >= minAmtRem - 0.001; amt -= stepAmt) {
                section.style.setProperty('--win-history-amount-fs', amt.toFixed(3) + 'rem');
                section.style.setProperty('--win-history-ball-size', ball + 'px');
                section.style.setProperty('--win-history-ball-fs', ballFs.toFixed(3) + 'rem');
                void section.offsetHeight;
                if (fits()) return;
            }
        }
    }

    function buildWinHistoryRow(entry) {
        const row = document.createElement('div');
        row.className = 'win-history-row';
        const ballsWrap = document.createElement('div');
        ballsWrap.className = 'win-history-balls';
        entry.draw.main.forEach(function (num) {
            ballsWrap.appendChild(createBall(num, 'main', MY_NUMBERS.main.includes(num)));
        });
        entry.draw.stars.forEach(function (num) {
            ballsWrap.appendChild(createBall(num, 'star', MY_NUMBERS.stars.includes(num)));
        });
        const amt = document.createElement('div');
        amt.className = 'win-history-amount';
        amt.textContent = formatCurrency(entry.amount);
        row.appendChild(ballsWrap);
        row.appendChild(amt);
        return row;
    }

    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function generateNumbersFromSeed(seed, min, max, count) {
        const numbers = [];
        let currentSeed = seed;

        while (numbers.length < count) {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            const num = min + Math.floor(seededRandom(currentSeed) * (max - min + 1));

            if (numbers.indexOf(num) === -1) {
                numbers.push(num);
            }
        }

        return numbers.sort(function (a, b) {
            return a - b;
        });
    }

    function generateDrawFromTimestamp(timestamp) {
        const main = generateNumbersFromSeed(timestamp, 1, 50, 5);
        const stars = generateNumbersFromSeed(timestamp * 2, 1, 12, 2);
        return { main: main, stars: stars };
    }

    function checkMatches(myRow, drawnRow) {
        const mainMatches = myRow.main.filter(function (num) {
            return drawnRow.main.includes(num);
        }).length;
        const starMatches = myRow.stars.filter(function (num) {
            return drawnRow.stars.includes(num);
        }).length;
        return { mainMatches: mainMatches, starMatches: starMatches };
    }

    function getWinAmount(mainMatches, starMatches) {
        const tiers = getPrizeTiers();
        const category = tiers.find(function (tier) {
            return tier.main === mainMatches && tier.stars === starMatches;
        });
        return category ? { amount: category.prize, name: category.name } : { amount: 0, name: null };
    }

    function createBall(number, type, isMatch) {
        const ball = document.createElement('div');
        ball.className = 'live-ball ' + type + (isMatch ? ' match' : '');
        ball.textContent = String(number);
        return ball;
    }

    function displayMyNumbers() {
        const mainContainer = document.getElementById('myMainNumbers');
        const starContainer = document.getElementById('myStarNumbers');
        if (!mainContainer || !starContainer) return;

        mainContainer.innerHTML = '';
        starContainer.innerHTML = '';

        MY_NUMBERS.main.forEach(function (num) {
            mainContainer.appendChild(createBall(num, 'main'));
        });

        MY_NUMBERS.stars.forEach(function (num) {
            starContainer.appendChild(createBall(num, 'star'));
        });
    }

    function displayLiveDraw(draw, matches) {
        const mainContainer = document.getElementById('liveMainNumbers');
        const starContainer = document.getElementById('liveStarNumbers');
        if (!mainContainer || !starContainer) return;

        if (mainContainer.children.length === 0) {
            draw.main.forEach(function () {
                mainContainer.appendChild(createBall(0, 'main'));
            });
        }
        if (starContainer.children.length === 0) {
            draw.stars.forEach(function () {
                starContainer.appendChild(createBall(0, 'star'));
            });
        }

        const mainBalls = Array.from(mainContainer.children);
        const starBalls = Array.from(starContainer.children);

        const animationDuration = 400;
        const intervalTime = 40;
        const steps = animationDuration / intervalTime;
        let currentStep = 0;

        const interval = setInterval(function () {
            currentStep++;
            const progress = currentStep / steps;

            if (progress < 0.85) {
                mainBalls.forEach(function (ball) {
                    ball.textContent = String(Math.floor(Math.random() * 50) + 1);
                    ball.className = 'live-ball main';
                });

                starBalls.forEach(function (ball) {
                    ball.textContent = String(Math.floor(Math.random() * 12) + 1);
                    ball.className = 'live-ball star';
                });
            } else {
                clearInterval(interval);

                mainBalls.forEach(function (ball, index) {
                    ball.textContent = String(draw.main[index]);
                    const isMatch = MY_NUMBERS.main.includes(draw.main[index]);
                    ball.className = 'live-ball main' + (isMatch ? ' match' : '');
                });

                starBalls.forEach(function (ball, index) {
                    ball.textContent = String(draw.stars[index]);
                    const isMatch = MY_NUMBERS.stars.includes(draw.stars[index]);
                    ball.className = 'live-ball star' + (isMatch ? ' match' : '');
                });

                const matchText = T('jakten.matchLine', {
                    main: String(matches.mainMatches),
                    stars: String(matches.starMatches)
                });
                const matchEl = document.getElementById('currentMatch');
                if (matchEl) matchEl.textContent = matchText;

                const win = getWinAmount(matches.mainMatches, matches.starMatches);
                const winText =
                    win.amount > 0
                        ? win.name + ': ' + formatCurrency(win.amount)
                        : T('jakten.noWinThisDraw');
                const winEl = document.getElementById('currentWin');
                if (winEl) {
                    winEl.textContent = winText;
                    if (win.amount > 0) {
                        winEl.classList.remove('is-loss');
                        winEl.style.color = 'var(--success)';
                    } else {
                        winEl.classList.add('is-loss');
                        winEl.style.color = '';
                    }
                }
            }
        }, intervalTime);
    }

    function simulateHistoricalDraws(secondsElapsed) {
        totalWinnings = 0;
        bestWin = { amount: 0, category: null, drawNumber: 0 };
        recentWins = [];
        topWins = [];

        for (let i = 0; i < secondsElapsed; i++) {
            const timestamp = Math.floor(START_DATE.getTime() / 1000) + i;
            const draw = generateDrawFromTimestamp(timestamp);
            const matches = checkMatches(MY_NUMBERS, draw);
            const win = getWinAmount(matches.mainMatches, matches.starMatches);

            if (win.amount > 0) {
                totalWinnings += win.amount;
                if (win.amount > bestWin.amount) {
                    bestWin = {
                        amount: win.amount,
                        category: win.name,
                        drawNumber: i + 1
                    };
                }
                recordWin(draw, win, i);
            }
        }
    }

    function updateStats(secondsElapsed) {
        const days = Math.floor(secondsElapsed / 86400);
        const totalDrawsCount = secondsElapsed;
        const totalCost = totalDrawsCount * getCostPerDraw();
        const netResult = totalWinnings - totalCost;

        const daysEl = document.getElementById('daysElapsed');
        const drawsEl = document.getElementById('totalDraws');
        if (daysEl) daysEl.textContent = formatNumber(days);
        if (drawsEl) drawsEl.textContent = formatNumber(totalDrawsCount);

        const tc = document.getElementById('totalCost');
        const tw = document.getElementById('totalWin');
        const bw = document.getElementById('bestWin');
        const nr = document.getElementById('netResult');
        if (tc) tc.textContent = formatCurrency(totalCost);
        if (tw) tw.textContent = formatCurrency(totalWinnings);
        if (bw) bw.textContent = formatCurrency(bestWin.amount);
        if (nr) nr.textContent = formatCurrency(netResult);

        const maxValue = Math.max(totalCost, totalWinnings, Math.abs(netResult), bestWin.amount);
        const statValues = document.querySelectorAll('.live-stat-value');
        let fontSize = '1.1rem';
        if (maxValue >= 100000000000) fontSize = '0.8rem';
        else if (maxValue >= 10000000000) fontSize = '0.9rem';
        else if (maxValue >= 1000000000) fontSize = '1.0rem';

        statValues.forEach(function (element) {
            element.style.fontSize = fontSize;
        });
    }

    function tick() {
        const now = Math.floor(Date.now() / 1000);
        const startTimestamp = Math.floor(START_DATE.getTime() / 1000);
        const secondsElapsed = now - startTimestamp;

        if (secondsElapsed < 0) {
            return;
        }

        currentDrawNumber = secondsElapsed;

        const currentDraw = generateDrawFromTimestamp(now);
        const matches = checkMatches(MY_NUMBERS, currentDraw);
        const win = getWinAmount(matches.mainMatches, matches.starMatches);

        displayLiveDraw(currentDraw, matches);

        if (win.amount > 0) {
            totalWinnings += win.amount;

            if (win.amount > bestWin.amount) {
                bestWin = {
                    amount: win.amount,
                    category: win.name,
                    drawNumber: currentDrawNumber
                };
            }

            recordWin(currentDraw, win, currentDrawNumber);
        }

        updateStats(secondsElapsed);

        if (win.amount > 0) {
            renderHistoryPanels();
        }
    }

    function initJakten() {
        if (!document.getElementById('liveMainNumbers')) return;

        displayMyNumbers();

        const now = Math.floor(Date.now() / 1000);
        const startTimestamp = Math.floor(START_DATE.getTime() / 1000);
        const secondsElapsed = now - startTimestamp;

        if (secondsElapsed > 0) {
            simulateHistoricalDraws(secondsElapsed);
        }

        renderHistoryPanels();
        tick();
        setInterval(tick, 1000);

        let winHistoryResizeT;
        window.addEventListener('resize', function () {
            clearTimeout(winHistoryResizeT);
            winHistoryResizeT = setTimeout(syncWinHistoryLayout, 150);
        });
    }

    window.__zjAfterI18n = (function (prev) {
        return function () {
            if (typeof prev === 'function') prev();
            initJakten();
        };
    })(window.__zjAfterI18n);
})();
