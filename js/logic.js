const PRIZE_TIERS = [
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

function generateRandomNumbers(min, max, count) {
    const numbers = new Set();
    while (numbers.size < count) {
        numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(numbers).sort((a, b) => a - b);
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
    const mainMatches = playerRow.main.filter(num => draw.main.includes(num)).length;
    const starMatches = playerRow.stars.filter(num => draw.stars.includes(num)).length;
    
    const matchedMainNumbers = playerRow.main.filter(num => draw.main.includes(num));
    const matchedStarNumbers = playerRow.stars.filter(num => draw.stars.includes(num));
    
    return {
        mainMatches,
        starMatches,
        matchedMainNumbers,
        matchedStarNumbers,
        draw
    };
}

function getWinCategory(mainMatches, starMatches) {
    return PRIZE_TIERS.find(tier => 
        tier.main === mainMatches && tier.stars === starMatches
    );
}

function calculateWinnings(result) {
    const category = getWinCategory(result.mainMatches, result.starMatches);
    return category ? category.prize : 0;
}

function simulateDrawings(playerRow, numberOfDraws, progressCallback) {
    const results = [];
    const winsByCategory = {};
    
    PRIZE_TIERS.forEach(tier => {
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
        
        results.push({
            ...result,
            winnings,
            drawNumber: i + 1
        });
        
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
        results,
        winsByCategory
    };
}

async function simulateDrawingsAsync(playerRow, numberOfDraws, progressCallback) {
    let bestResult = null;
    let bestScore = -1;
    const winsByCategory = {};
    
    PRIZE_TIERS.forEach(tier => {
        winsByCategory[tier.name] = {
            count: 0,
            prize: tier.prize,
            totalPrize: 0
        };
    });
    
    const chunkSize = numberOfDraws >= 1000000 ? 50000 : (numberOfDraws >= 100000 ? 10000 : 1000);
    const updateInterval = Math.max(1, Math.floor(numberOfDraws / 200));
    
    for (let i = 0; i < numberOfDraws; i++) {
        const draw = generateDraw();
        const result = checkResult(playerRow, draw);
        const winnings = calculateWinnings(result);
        
        const currentScore = result.mainMatches * 10 + result.starMatches;
        if (currentScore > bestScore) {
            bestScore = currentScore;
            bestResult = {
                ...result,
                winnings,
                drawNumber: i + 1
            };
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
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    
    if (progressCallback) {
        progressCallback(numberOfDraws, numberOfDraws);
    }
    
    return {
        results: bestResult ? [bestResult] : [],
        winsByCategory
    };
}

function sortResults(results) {
    return results.sort((a, b) => {
        if (a.mainMatches !== b.mainMatches) {
            return b.mainMatches - a.mainMatches;
        }
        return b.starMatches - a.starMatches;
    });
}

function calculateTotalWinnings(winsByCategory) {
    return Object.values(winsByCategory).reduce((sum, category) => sum + category.totalPrize, 0);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('sv-SE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' kr';
}

function formatLargeNumber(amount) {
    const absAmount = Math.abs(amount);
    const isNegative = amount < 0;
    const prefix = isNegative ? '-' : '';
    
    if (absAmount >= 1e81) {
        const value = absAmount / 1e81;
        return prefix + formatNumberWithDecimals(value) + ' tredeciljarder kr';
    } else if (absAmount >= 1e78) {
        const value = absAmount / 1e78;
        return prefix + formatNumberWithDecimals(value) + ' tredeciljoner kr';
    } else if (absAmount >= 1e75) {
        const value = absAmount / 1e75;
        return prefix + formatNumberWithDecimals(value) + ' duodeciljarder kr';
    } else if (absAmount >= 1e72) {
        const value = absAmount / 1e72;
        return prefix + formatNumberWithDecimals(value) + ' duodeciljoner kr';
    } else if (absAmount >= 1e69) {
        const value = absAmount / 1e69;
        return prefix + formatNumberWithDecimals(value) + ' undeciljarder kr';
    } else if (absAmount >= 1e66) {
        const value = absAmount / 1e66;
        return prefix + formatNumberWithDecimals(value) + ' undeciljoner kr';
    } else if (absAmount >= 1e63) {
        const value = absAmount / 1e63;
        return prefix + formatNumberWithDecimals(value) + ' deciljarder kr';
    } else if (absAmount >= 1e60) {
        const value = absAmount / 1e60;
        return prefix + formatNumberWithDecimals(value) + ' deciljoner kr';
    } else if (absAmount >= 1e57) {
        const value = absAmount / 1e57;
        return prefix + formatNumberWithDecimals(value) + ' noniljarder kr';
    } else if (absAmount >= 1e54) {
        const value = absAmount / 1e54;
        return prefix + formatNumberWithDecimals(value) + ' noniljoner kr';
    } else if (absAmount >= 1e51) {
        const value = absAmount / 1e51;
        return prefix + formatNumberWithDecimals(value) + ' oktiljarder kr';
    } else if (absAmount >= 1e48) {
        const value = absAmount / 1e48;
        return prefix + formatNumberWithDecimals(value) + ' oktiljoner kr';
    } else if (absAmount >= 1e45) {
        const value = absAmount / 1e45;
        return prefix + formatNumberWithDecimals(value) + ' septiljarder kr';
    } else if (absAmount >= 1e42) {
        const value = absAmount / 1e42;
        return prefix + formatNumberWithDecimals(value) + ' septiljoner kr';
    } else if (absAmount >= 1e39) {
        const value = absAmount / 1e39;
        return prefix + formatNumberWithDecimals(value) + ' sextiljarder kr';
    } else if (absAmount >= 1e36) {
        const value = absAmount / 1e36;
        return prefix + formatNumberWithDecimals(value) + ' sextiljoner kr';
    } else if (absAmount >= 1e33) {
        const value = absAmount / 1e33;
        return prefix + formatNumberWithDecimals(value) + ' kvintiljarder kr';
    } else if (absAmount >= 1e30) {
        const value = absAmount / 1e30;
        return prefix + formatNumberWithDecimals(value) + ' kvintiljoner kr';
    } else if (absAmount >= 1e27) {
        const value = absAmount / 1e27;
        return prefix + formatNumberWithDecimals(value) + ' kvadriljarder kr';
    } else if (absAmount >= 1e24) {
        const value = absAmount / 1e24;
        return prefix + formatNumberWithDecimals(value) + ' kvadriljoner kr';
    } else if (absAmount >= 1e21) {
        const value = absAmount / 1e21;
        return prefix + formatNumberWithDecimals(value) + ' triljarder kr';
    } else if (absAmount >= 1e18) {
        const value = absAmount / 1e18;
        return prefix + formatNumberWithDecimals(value) + ' triljoner kr';
    } else if (absAmount >= 1e15) {
        const value = absAmount / 1e15;
        return prefix + formatNumberWithDecimals(value) + ' biljarder kr';
    } else if (absAmount >= 1e12) {
        const value = absAmount / 1e12;
        return prefix + formatNumberWithDecimals(value) + ' biljoner kr';
    } else if (absAmount >= 1e9) {
        const value = absAmount / 1e9;
        return prefix + formatNumberWithDecimals(value) + ' miljarder kr';
    } else if (absAmount >= 1e6) {
        const value = absAmount / 1e6;
        return prefix + formatNumberWithDecimals(value) + ' miljoner kr';
    } else {
        return formatCurrency(amount);
    }
}

function formatNumberWithDecimals(num) {
    if (num >= 1000) {
        return new Intl.NumberFormat('sv-SE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(num));
    } else if (num >= 100) {
        return new Intl.NumberFormat('sv-SE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        }).format(num);
    } else {
        return new Intl.NumberFormat('sv-SE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(num);
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat('sv-SE').format(num);
}

function validateRow(row) {
    if (!row || !row.main || !row.stars) {
        return false;
    }
    if (row.main.length !== 5 || row.stars.length !== 2) {
        return false;
    }
    const mainValid = row.main.every(n => n >= 1 && n <= 50);
    const starsValid = row.stars.every(n => n >= 1 && n <= 12);
    const mainUnique = new Set(row.main).size === 5;
    const starsUnique = new Set(row.stars).size === 2;
    
    return mainValid && starsValid && mainUnique && starsUnique;
}
