let selectedMainNumbers = [null, null, null, null, null];
let selectedStarNumbers = [null, null];
let currentPlayerRow = null;
let isSimulating = false;
let currentPickerSlot = null;
let currentPickerType = null;

function initializeApp() {
    attachEventListeners();
    attachSlotListeners();
}

function attachSlotListeners() {
    document.querySelectorAll('.number-slot').forEach(slot => {
        slot.addEventListener('click', (e) => {
            const slotIndex = parseInt(e.target.dataset.slot);
            const type = e.target.dataset.type;
            openNumberPicker(slotIndex, type);
        });
    });
}

function openNumberPicker(slotIndex, type) {
    currentPickerSlot = slotIndex;
    currentPickerType = type;
    
    const modal = document.getElementById('numberPicker');
    const pickerGrid = document.getElementById('pickerGrid');
    const title = document.getElementById('pickerTitle');
    
    const max = type === 'main' ? 50 : 12;
    const selectedArray = type === 'main' ? selectedMainNumbers : selectedStarNumbers;
    
    title.textContent = type === 'main' 
        ? `Välj huvudnummer (1-50)` 
        : `Välj stjärnnummer (1-12)`;
    
    pickerGrid.innerHTML = '';
    
    for (let i = 1; i <= max; i++) {
        const btn = document.createElement('button');
        btn.className = 'picker-number';
        btn.textContent = i;
        btn.dataset.number = i;
        
        if (selectedArray.includes(i)) {
            btn.disabled = true;
        }
        
        btn.addEventListener('click', () => selectNumber(i));
        pickerGrid.appendChild(btn);
    }
    
    modal.style.display = 'flex';
}

function selectNumber(number) {
    if (currentPickerType === 'main') {
        selectedMainNumbers[currentPickerSlot] = number;
    } else {
        selectedStarNumbers[currentPickerSlot] = number;
    }
    
    updateSlotDisplay();
    closeNumberPicker();
    updateSimulationButtons();
    
    const mainValid = selectedMainNumbers.every(n => n !== null);
    const starsValid = selectedStarNumbers.every(n => n !== null);
    if (mainValid && starsValid && window.innerWidth <= 767) {
        const simulationPanel = document.querySelector('.simulation-panel');
        simulationPanel.classList.add('visible');
        setTimeout(() => {
            simulationPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

function closeNumberPicker() {
    document.getElementById('numberPicker').style.display = 'none';
}

function updateSlotDisplay() {
    selectedMainNumbers.forEach((num, index) => {
        const slot = document.querySelector(`.number-slot[data-slot="${index}"][data-type="main"]`);
        if (num !== null) {
            slot.textContent = num;
            slot.classList.remove('empty');
        } else {
            slot.textContent = '+';
            slot.classList.add('empty');
        }
    });
    
    selectedStarNumbers.forEach((num, index) => {
        const slot = document.querySelector(`.number-slot[data-slot="${index}"][data-type="star"]`);
        if (num !== null) {
            slot.textContent = num;
            slot.classList.remove('empty');
        } else {
            slot.textContent = '+';
            slot.classList.add('empty');
        }
    });
}

function attachEventListeners() {
    document.getElementById('generateBtn').addEventListener('click', handleGenerateRow);
    document.getElementById('resetBtn').addEventListener('click', handleReset);
    document.getElementById('sim100').addEventListener('click', () => handleSimulation(100));
    document.getElementById('sim1000').addEventListener('click', () => handleSimulation(1000));
    document.getElementById('sim10000').addEventListener('click', () => handleSimulation(10000));
    document.getElementById('sim100000').addEventListener('click', () => handleSimulation(100000));
    document.getElementById('sim1000000').addEventListener('click', () => handleSimulation(1000000));
    document.getElementById('sim10000000').addEventListener('click', () => handleSimulation(10000000));
    document.getElementById('closePickerBtn').addEventListener('click', closeNumberPicker);
    document.getElementById('modalOverlay').addEventListener('click', closeNumberPicker);
}

function handleGenerateRow() {
    hideResults();
    
    const row = generateRow();
    const finalMainNumbers = [...row.main];
    const finalStarNumbers = [...row.stars];
    
    const animationDuration = 500;
    const intervalTime = 50;
    const steps = animationDuration / intervalTime;
    let currentStep = 0;
    
    const mainSlots = document.querySelectorAll('.number-slot[data-type="main"]');
    const starSlots = document.querySelectorAll('.number-slot[data-type="star"]');
    
    mainSlots.forEach(slot => slot.classList.remove('empty'));
    starSlots.forEach(slot => slot.classList.remove('empty'));
    
    const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const slowDownFactor = Math.pow(progress, 2);
        
        if (progress < 0.9) {
            mainSlots.forEach((slot, index) => {
                const randomNum = Math.floor(Math.random() * 50) + 1;
                slot.textContent = randomNum;
            });
            
            starSlots.forEach((slot, index) => {
                const randomNum = Math.floor(Math.random() * 12) + 1;
                slot.textContent = randomNum;
            });
        } else {
            mainSlots.forEach((slot, index) => {
                slot.textContent = finalMainNumbers[index];
            });
            
            starSlots.forEach((slot, index) => {
                slot.textContent = finalStarNumbers[index];
            });
            
            clearInterval(interval);
            
            selectedMainNumbers = finalMainNumbers;
            selectedStarNumbers = finalStarNumbers;
            updateSimulationButtons();
            
            const simulationPanel = document.querySelector('.simulation-panel');
            if (window.innerWidth <= 767) {
                simulationPanel.classList.add('visible');
            }
        }
    }, intervalTime);
}

function handleReset() {
    selectedMainNumbers = [null, null, null, null, null];
    selectedStarNumbers = [null, null];
    updateSlotDisplay();
    updateSimulationButtons();
    hideResults();
}

function updateSimulationButtons() {
    const mainValid = selectedMainNumbers.every(n => n !== null);
    const starsValid = selectedStarNumbers.every(n => n !== null);
    const isValid = mainValid && starsValid;
    
    document.getElementById('sim100').disabled = !isValid;
    document.getElementById('sim1000').disabled = !isValid;
    document.getElementById('sim10000').disabled = !isValid;
    document.getElementById('sim100000').disabled = !isValid;
    document.getElementById('sim1000000').disabled = !isValid;
    document.getElementById('sim10000000').disabled = !isValid;
    
    const simulationPanel = document.querySelector('.simulation-panel');
    
    if (window.innerWidth <= 767) {
        if (isValid) {
            simulationPanel.classList.add('visible');
        } else {
            simulationPanel.classList.remove('visible');
        }
    } else {
        if (isValid) {
            simulationPanel.classList.remove('inactive');
            simulationPanel.classList.add('active');
        } else {
            simulationPanel.classList.remove('active');
            simulationPanel.classList.add('inactive');
        }
    }
    
    if (isValid) {
        currentPlayerRow = {
            main: [...selectedMainNumbers].sort((a, b) => a - b),
            stars: [...selectedStarNumbers].sort((a, b) => a - b)
        };
    } else {
        currentPlayerRow = null;
    }
}

async function handleSimulation(numberOfDraws) {
    if (isSimulating || !currentPlayerRow) return;
    
    document.querySelectorAll('.btn-sim').forEach(btn => btn.classList.remove('active'));
    const activeButton = document.getElementById('sim' + numberOfDraws);
    if (activeButton) activeButton.classList.add('active');
    
    isSimulating = true;
    disableSimulationButtons(true);
    showProgress();
    hideResults();
    updateProgress(0, numberOfDraws);
    
    const costPerRow = 25;
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const simulation = await simulateDrawingsAsync(currentPlayerRow, numberOfDraws, updateProgress);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    displayResults(simulation, numberOfDraws, costPerRow);
    hideProgress();
    isSimulating = false;
    disableSimulationButtons(false);
}

function updateProgress(current, total) {
    const percent = Math.floor((current / total) * 100);
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${percent}% (${formatNumber(current)} / ${formatNumber(total)})`;
}

function showProgress() {
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressText').textContent = '0%';
}

function hideProgress() {
    setTimeout(() => {
        document.getElementById('progressContainer').style.display = 'none';
    }, 1000);
}

function disableSimulationButtons(disable) {
    document.getElementById('sim100').disabled = disable;
    document.getElementById('sim1000').disabled = disable;
    document.getElementById('sim10000').disabled = disable;
    document.getElementById('sim100000').disabled = disable;
    document.getElementById('sim1000000').disabled = disable;
    document.getElementById('sim10000000').disabled = disable;
}

function displayResults(simulation, numberOfDraws, costPerRow) {
    const { results, winsByCategory } = simulation;
    const totalWinnings = calculateTotalWinnings(winsByCategory);
    const totalCost = numberOfDraws * costPerRow;
    const netResult = totalWinnings - totalCost;
    
    document.getElementById('totalDraws').textContent = formatNumber(numberOfDraws);
    document.getElementById('totalCost').textContent = formatCurrency(totalCost);
    document.getElementById('totalWin').textContent = formatCurrency(totalWinnings);
    
    const netElement = document.getElementById('netResult');
    netElement.textContent = formatCurrency(netResult);
    
    const netCard = netElement.closest('.summary-card.highlight');
    netCard.classList.remove('positive', 'negative');
    if (netResult > 0) {
        netCard.classList.add('positive');
    }
    
    displayWinsByCategory(winsByCategory, numberOfDraws);
    
    if (results && results.length > 0) {
        displayBestResult(results[0]);
    }
    
    if (numberOfDraws < 100000) {
        displayInvestmentComparison(numberOfDraws, costPerRow, netResult);
    } else {
        document.getElementById('investmentComparison').style.display = 'none';
    }
    
    document.getElementById('resultsPanel').style.display = 'block';
    document.getElementById('promoSection').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('resultsPanel').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
}

function displayWinsByCategory(winsByCategory, totalDraws) {
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';
    
    PRIZE_TIERS.forEach(tier => {
        const categoryData = winsByCategory[tier.name];
        const row = document.createElement('tr');
        
        if (categoryData.count > 0) {
            row.classList.add('highlight-row');
        }
        
        const probability = ((categoryData.count / totalDraws) * 100).toFixed(4);
        
        row.innerHTML = `
            <td class="category-cell">${tier.name}</td>
            <td>${formatNumber(categoryData.count)} (${probability}%)</td>
            <td>${formatCurrency(categoryData.prize)}</td>
            <td style="${categoryData.totalPrize > 0 ? 'font-weight: 700; color: var(--success)' : ''}">
                ${formatCurrency(categoryData.totalPrize)}
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    const noWinCount = totalDraws - Object.values(winsByCategory).reduce((sum, cat) => sum + cat.count, 0);
    const noWinRow = document.createElement('tr');
    const noWinProbability = ((noWinCount / totalDraws) * 100).toFixed(2);
    noWinRow.innerHTML = `
        <td class="category-cell">Ej vinst</td>
        <td>${formatNumber(noWinCount)} (${noWinProbability}%)</td>
        <td>0 kr</td>
        <td>0 kr</td>
    `;
    tbody.appendChild(noWinRow);
}

function displayBestResult(bestResult) {
    if (!bestResult || (bestResult.mainMatches === 0 && bestResult.starMatches === 0)) {
        document.getElementById('bestResult').style.display = 'none';
        return;
    }
    
    const bestResultElement = document.getElementById('bestResult');
    const bestResultTitle = document.getElementById('bestResultTitle');
    const bestResultContent = document.getElementById('bestResultContent');
    
    const category = getWinCategory(bestResult.mainMatches, bestResult.starMatches);
    const categoryText = category ? category.name : 'Ingen vinst';
    const winnings = bestResult.winnings || 0;
    
    bestResultTitle.textContent = `Bästa dragning #${bestResult.drawNumber}`;
    
    const oddsText = category && category.odds ? ` | <strong>Odds:</strong> ${category.odds}` : '';
    
    bestResultContent.innerHTML = `
        <div class="draw-display">
            ${bestResult.draw.main.map(num => 
                `<div class="draw-number ${bestResult.matchedMainNumbers.includes(num) ? 'match' : ''}">${num}</div>`
            ).join('')}
            <span style="margin: 0 10px;">⭐</span>
            ${bestResult.draw.stars.map(num => 
                `<div class="draw-number ${bestResult.matchedStarNumbers.includes(num) ? 'match' : ''}">${num}</div>`
            ).join('')}
        </div>
        <p style="margin-top: 15px; text-align: center;">
            <strong>Vinst:</strong> ${formatCurrency(winnings)}${oddsText}
        </p>
    `;
    
    bestResultElement.style.display = 'block';
}

function displayInvestmentComparison(numberOfDraws, costPerRow, lotteryNetResult) {
    const dailyInvestment = costPerRow;
    const totalDays = numberOfDraws;
    const yearsDecimal = totalDays / 365;
    
    let yearsFormatted;
    if (yearsDecimal >= 10) {
        yearsFormatted = formatNumber(Math.round(yearsDecimal));
    } else {
        yearsFormatted = yearsDecimal.toFixed(1);
    }
    
    const annualReturn = 0.07;
    const dailyReturn = Math.pow(1 + annualReturn, 1/365) - 1;
    
    let futureValue = 0;
    for (let day = 0; day < totalDays; day++) {
        const daysRemaining = totalDays - day;
        futureValue += dailyInvestment * Math.pow(1 + dailyReturn, daysRemaining);
    }
    
    const totalInvested = dailyInvestment * totalDays;
    const investmentProfit = futureValue - totalInvested;
    
    const descriptionElement = document.querySelector('.investment-description');
    descriptionElement.textContent = `Om du investerat 25 kr per dag i ${yearsFormatted} år i en global indexfond med 7% årlig avkastning:`;
    
    document.getElementById('investedAmount').textContent = formatLargeNumber(totalInvested);
    document.getElementById('investmentValue').textContent = formatLargeNumber(futureValue);
    document.getElementById('investmentProfit').textContent = formatLargeNumber(investmentProfit);
    
    const difference = investmentProfit - lotteryNetResult;
    const comparisonLabel = document.getElementById('comparisonLabel');
    const comparisonValue = document.getElementById('comparisonValue');
    const comparisonCard = document.querySelector('.comparison-card');
    
    comparisonCard.classList.remove('positive', 'negative');
    
    if (difference > 0) {
        comparisonLabel.textContent = 'Skillnad mot lotto';
        comparisonValue.textContent = '+' + formatLargeNumber(difference);
        comparisonCard.classList.add('positive');
    } else {
        comparisonLabel.textContent = 'Skillnad mot lotto';
        comparisonValue.textContent = formatLargeNumber(difference);
        comparisonCard.classList.remove('positive', 'negative');
    }
    
    document.getElementById('investmentComparison').style.display = 'block';
}

function hideResults() {
    document.getElementById('resultsPanel').style.display = 'none';
    document.getElementById('investmentComparison').style.display = 'none';
    document.getElementById('promoSection').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', initializeApp);
