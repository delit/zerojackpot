/** Basnivåer i SEK (Sverige); EUR härleds för en/es/de */
const PRIZE_TIERS_SEK = [
    { main: 5, stars: 2, name: '5+2', prize: 400000000, odds: '1:139 838 160' },
    { main: 5, stars: 1, name: '5+1', prize: 2000000, odds: '1:6 991 908' },
    { main: 5, stars: 0, name: '5+0', prize: 400000, odds: '1:3 107 515' },
    { main: 4, stars: 2, name: '4+2', prize: 16000, odds: '1:621 503' },
    { main: 4, stars: 1, name: '4+1', prize: 900, odds: '1:31 075' },
    { main: 3, stars: 2, name: '3+2', prize: 500, odds: '1:14 125' },
    { main: 4, stars: 0, name: '4+0', prize: 400, odds: '1:13 811' },
    { main: 2, stars: 2, name: '2+2', prize: 175, odds: '1:985' },
    { main: 3, stars: 1, name: '3+1', prize: 150, odds: '1:706' },
    { main: 3, stars: 0, name: '3+0', prize: 120, odds: '1:314' },
    { main: 1, stars: 2, name: '1+2', prize: 90, odds: '1:188' },
    { main: 2, stars: 1, name: '2+1', prize: 65, odds: '1:49' }
];

const SEK_PER_EUR = 11.25;

let prizeTiersEURCache = null;

function getMeta() {
    if (typeof window !== 'undefined' && window.ZeroJackpotI18n && typeof window.ZeroJackpotI18n.getMeta === 'function') {
        return window.ZeroJackpotI18n.getMeta();
    }
    return {
        locale: 'sv',
        htmlLang: 'sv',
        intlLocale: 'sv-SE',
        currency: 'SEK',
        ticketPrice: 25,
        ogLocale: 'sv_SE'
    };
}

function getPrizeTiersEUR() {
    if (!prizeTiersEURCache) {
        prizeTiersEURCache = PRIZE_TIERS_SEK.map(function (tier) {
            return Object.assign({}, tier, { prize: Math.max(1, Math.round(tier.prize / SEK_PER_EUR)) });
        });
    }
    return prizeTiersEURCache;
}

function getPrizeTiers() {
    const m = getMeta();
    return m.currency === 'EUR' ? getPrizeTiersEUR() : PRIZE_TIERS_SEK;
}

function getTicketPrice() {
    const m = getMeta();
    const p = m.ticketPrice;
    return typeof p === 'number' && !isNaN(p) ? p : m.currency === 'EUR' ? 2.5 : 25;
}

function generateRandomNumbers(min, max, count) {
    const numbers = new Set();
    while (numbers.size < count) {
        numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(numbers).sort(function (a, b) {
        return a - b;
    });
}

function generateRow() {
    const mainNumbers = generateRandomNumbers(1, 50, 5);
    const starNumbers = generateRandomNumbers(1, 12, 2);
    return { main: mainNumbers, stars: starNumbers };
}

function generateDraw() {
    return generateRow();
}

function checkResult(playerRow, draw) {
    const mainMatches = playerRow.main.filter(function (num) {
        return draw.main.includes(num);
    }).length;
    const starMatches = playerRow.stars.filter(function (num) {
        return draw.stars.includes(num);
    }).length;

    const matchedMainNumbers = playerRow.main.filter(function (num) {
        return draw.main.includes(num);
    });
    const matchedStarNumbers = playerRow.stars.filter(function (num) {
        return draw.stars.includes(num);
    });

    return {
        mainMatches: mainMatches,
        starMatches: starMatches,
        matchedMainNumbers: matchedMainNumbers,
        matchedStarNumbers: matchedStarNumbers,
        draw: draw
    };
}

function getWinCategory(mainMatches, starMatches) {
    return getPrizeTiers().find(function (tier) {
        return tier.main === mainMatches && tier.stars === starMatches;
    });
}

function calculateWinnings(result) {
    const category = getWinCategory(result.mainMatches, result.starMatches);
    return category ? category.prize : 0;
}

function simulateDrawings(playerRow, numberOfDraws, progressCallback) {
    const results = [];
    const winsByCategory = {};
    const tiers = getPrizeTiers();

    tiers.forEach(function (tier) {
        winsByCategory[tier.name] = {
            count: 0,
            prize: tier.prize,
            totalPrize: 0
        };
    });

    for (let i = 0; i < numberOfDraws; i++) {
        const draw = generateDraw();
        const result = checkResult(playerRow, draw);
        const winnings = calculateWinnings(result);

        results.push(
            Object.assign({}, result, {
                winnings: winnings,
                drawNumber: i + 1
            })
        );

        if (winnings > 0) {
            const category = getWinCategory(result.mainMatches, result.starMatches);
            if (category) {
                winsByCategory[category.name].count++;
                winsByCategory[category.name].totalPrize += winnings;
            }
        }

        if (progressCallback && i % Math.max(1, Math.floor(numberOfDraws / 100)) === 0) {
            progressCallback(i + 1, numberOfDraws);
        }
    }

    if (progressCallback) {
        progressCallback(numberOfDraws, numberOfDraws);
    }

    return {
        results: results,
        winsByCategory: winsByCategory
    };
}

async function simulateDrawingsAsync(playerRow, numberOfDraws, progressCallback) {
    let bestResult = null;
    let bestScore = -1;
    const winsByCategory = {};
    const tiers = getPrizeTiers();

    tiers.forEach(function (tier) {
        winsByCategory[tier.name] = {
            count: 0,
            prize: tier.prize,
            totalPrize: 0
        };
    });

    const chunkSize = numberOfDraws >= 1000000 ? 50000 : numberOfDraws >= 100000 ? 10000 : 1000;
    const updateInterval = Math.max(1, Math.floor(numberOfDraws / 200));

    for (let i = 0; i < numberOfDraws; i++) {
        const draw = generateDraw();
        const result = checkResult(playerRow, draw);
        const winnings = calculateWinnings(result);

        const currentScore = result.mainMatches * 10 + result.starMatches;
        if (currentScore > bestScore) {
            bestScore = currentScore;
            bestResult = Object.assign({}, result, {
                winnings: winnings,
                drawNumber: i + 1
            });
        }

        if (winnings > 0) {
            const category = getWinCategory(result.mainMatches, result.starMatches);
            if (category) {
                winsByCategory[category.name].count++;
                winsByCategory[category.name].totalPrize += winnings;
            }
        }

        if (progressCallback && i % updateInterval === 0) {
            progressCallback(i + 1, numberOfDraws);
        }

        if (i % chunkSize === 0 && i > 0) {
            await new Promise(function (resolve) {
                setTimeout(resolve, 0);
            });
        }
    }

    if (progressCallback) {
        progressCallback(numberOfDraws, numberOfDraws);
    }

    return {
        results: bestResult ? [bestResult] : [],
        winsByCategory: winsByCategory
    };
}

function sortResults(results) {
    return results.sort(function (a, b) {
        if (a.mainMatches !== b.mainMatches) {
            return b.mainMatches - a.mainMatches;
        }
        return b.starMatches - a.starMatches;
    });
}

function calculateTotalWinnings(winsByCategory) {
    return Object.values(winsByCategory).reduce(function (sum, category) {
        return sum + category.totalPrize;
    }, 0);
}

function formatCurrency(amount) {
    const m = getMeta();
    const loc = m.intlLocale || 'sv-SE';
    const cur = m.currency || 'SEK';
    try {
        return new Intl.NumberFormat(loc, {
            style: 'currency',
            currency: cur,
            minimumFractionDigits: cur === 'EUR' ? 2 : 0,
            maximumFractionDigits: cur === 'EUR' ? 2 : 0
        }).format(amount);
    } catch (e) {
        return new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount) + (cur === 'EUR' ? ' €' : ' kr');
    }
}

function formatLargeNumber(amount) {
    const m = getMeta();
    const loc = m.intlLocale || 'sv-SE';
    const absAmount = Math.abs(amount);
    const isNegative = amount < 0;
    const prefix = isNegative ? '-' : '';

    if (absAmount < 1e6) {
        return formatCurrency(amount);
    }

    try {
        return (
            prefix +
            new Intl.NumberFormat(loc, {
                notation: 'compact',
                compactDisplay: 'short',
                maximumFractionDigits: 2
            }).format(amount)
        );
    } catch (e) {
        return formatCurrency(amount);
    }
}

function formatNumberWithDecimals(num) {
    const loc = getMeta().intlLocale || 'sv-SE';
    if (num >= 1000) {
        return new Intl.NumberFormat(loc, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(num));
    }
    if (num >= 100) {
        return new Intl.NumberFormat(loc, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        }).format(num);
    }
    return new Intl.NumberFormat(loc, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(num);
}

function formatNumber(num) {
    const loc = getMeta().intlLocale || 'sv-SE';
    return new Intl.NumberFormat(loc).format(num);
}

function validateRow(row) {
    if (!row || !row.main || !row.stars) {
        return false;
    }
    if (row.main.length !== 5 || row.stars.length !== 2) {
        return false;
    }
    const mainValid = row.main.every(function (n) {
        return n >= 1 && n <= 50;
    });
    const starsValid = row.stars.every(function (n) {
        return n >= 1 && n <= 12;
    });
    const mainUnique = new Set(row.main).size === 5;
    const starsUnique = new Set(row.stars).size === 2;

    return mainValid && starsValid && mainUnique && starsUnique;
}

window.getPrizeTiers = getPrizeTiers;
window.getTicketPrice = getTicketPrice;
window.formatCurrency = formatCurrency;
window.formatLargeNumber = formatLargeNumber;
window.formatNumber = formatNumber;
window.refreshFormattingAfterI18n = function () {
    prizeTiersEURCache = null;
};
