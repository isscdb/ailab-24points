// 游戏状态管理
const gameState = {
    mode: null, // 'calculation' 或 'challenge'
    selectedCards: [],
    randomCards: [],
    timerInterval: null,
    startTime: null,
    score: 0,
    solutions: []
};

// DOM 元素
const elements = {
    gameModeSelection: document.querySelector('.game-mode-selection'),
    gameArea: document.getElementById('game-area'),
    calculationArea: document.getElementById('calculation-area'),
    challengeArea: document.getElementById('challenge-area'),
    backButton: document.getElementById('back-button'),
    calculationResult: document.getElementById('calculation-result'),
    challengeResult: document.getElementById('challenge-result'),
    timer: document.getElementById('timer'),
    score: document.getElementById('score'),
    calculationInput: document.getElementById('calculation-input'),
    virtualKeyboard: document.querySelector('.virtual-keyboard'),
    cardButtons: document.querySelectorAll('.card-btn'),
    operatorButtons: document.querySelectorAll('.op-btn'),
    bracketButtons: document.querySelectorAll('.bracket-btn'),
    backspaceButton: document.getElementById('backspace-btn'),
    clearButton: document.getElementById('clear-btn')
};

// 按钮事件监听
document.getElementById('calculation-mode').addEventListener('click', () => setGameMode('calculation'));
document.getElementById('challenge-mode').addEventListener('click', () => setGameMode('challenge'));
document.getElementById('calculate-btn').addEventListener('click', calculateSolutions);
document.getElementById('new-challenge').addEventListener('click', startNewChallenge);
document.getElementById('show-solution').addEventListener('click', showSolution);
document.getElementById('submit-calculation').addEventListener('click', checkUserSolution);
elements.backButton.querySelector('button').addEventListener('click', backToModeSelection);

// 清空已选牌按钮事件监听
document.addEventListener('DOMContentLoaded', function() {
    const clearSelectedCardsBtn = document.getElementById('clear-selected-cards');
    if (clearSelectedCardsBtn) {
        clearSelectedCardsBtn.addEventListener('click', resetCalculationMode);
    }
});

// 虚拟键盘事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 卡片按钮点击事件
    document.querySelectorAll('.card-btn').forEach(button => {
        button.addEventListener('click', () => handleVirtualKeyboardInput('card', button.dataset.value));
    });
    
    // 运算符按钮点击事件
    document.querySelectorAll('.op-btn').forEach(button => {
        button.addEventListener('click', () => handleVirtualKeyboardInput('operator', button.dataset.op));
    });
    
    // 括号按钮点击事件
    document.querySelectorAll('.bracket-btn').forEach(button => {
        button.addEventListener('click', () => handleVirtualKeyboardInput('bracket', button.dataset.bracket));
    });
    
    // 退格按钮点击事件
    document.getElementById('backspace-btn').addEventListener('click', handleBackspace);
    
    // 清空按钮点击事件
    document.getElementById('clear-btn').addEventListener('click', clearCalculationInput);
});

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);

// 初始化作者信息模态框
document.addEventListener('DOMContentLoaded', function() {
    const authorLink = document.getElementById('author-link');
    const authorModal = document.getElementById('author-modal');
    const closeModal = document.getElementById('close-modal');
    
    // 点击作者名称显示模态框
    if (authorLink) {
        authorLink.addEventListener('click', function() {
            authorModal.classList.remove('hidden');
        });
    }
    
    // 点击关闭按钮隐藏模态框
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            authorModal.classList.add('hidden');
        });
    }
    
    // 点击模态框背景隐藏模态框
    if (authorModal) {
        authorModal.addEventListener('click', function(e) {
            if (e.target === authorModal) {
                authorModal.classList.add('hidden');
            }
        });
    }
});

// 初始化游戏
function initGame() {
    // 生成所有可能的牌
    const cardSelectionGrid = document.querySelector('.card-selection .grid');
    if (cardSelectionGrid) {
        generateAllCards(cardSelectionGrid);
    }
    
    // 添加卡片点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.card')) {
            const card = e.target.closest('.card');
            handleCardClick(card);
        }
    });
    
    // 初始化计算按钮状态
    updateCalculateButtonState();
}

// 设置游戏模式
function setGameMode(mode) {
    gameState.mode = mode;
    elements.gameModeSelection.classList.add('hidden');
    elements.gameArea.classList.remove('hidden');
    elements.backButton.classList.remove('hidden');
    
    if (mode === 'calculation') {
        elements.calculationArea.classList.remove('hidden');
        elements.challengeArea.classList.add('hidden');
        resetCalculationMode();
    } else if (mode === 'challenge') {
        elements.calculationArea.classList.add('hidden');
        elements.challengeArea.classList.remove('hidden');
        startNewChallenge();
    }
}

// 返回模式选择
function backToModeSelection() {
    // 停止计时器
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // 重置游戏状态
    gameState.selectedCards = [];
    gameState.randomCards = [];
    gameState.solutions = [];
    
    // 隐藏游戏区域，显示模式选择
    elements.gameArea.classList.add('hidden');
    elements.calculationArea.classList.add('hidden');
    elements.challengeArea.classList.add('hidden');
    elements.backButton.classList.add('hidden');
    elements.gameModeSelection.classList.remove('hidden');
    
    // 隐藏结果区域
    elements.calculationResult.classList.add('hidden');
    elements.challengeResult.classList.add('hidden');
}

// 生成所有可能的牌
function generateAllCards(container) {
    // 按照方块(♦)、梅花(♣)、红心(♥)、黑桃(♠)的顺序排列
    const suits = [
        { symbol: '♦', color: 'red' },
        { symbol: '♣', color: 'black' },
        { symbol: '♥', color: 'red' },
        { symbol: '♠', color: 'black' }
    ];
    
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    suits.forEach(suit => {
        values.forEach(value => {
            const card = createCardElement(value, suit.symbol, suit.color);
            container.appendChild(card);
        });
    });
}

// 创建卡片元素
function createCardElement(value, suit, color) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = value;
    card.dataset.suit = suit;
    
    const valueElement = document.createElement('div');
    valueElement.className = 'card-value';
    valueElement.textContent = value;
    
    const suitElement = document.createElement('div');
    suitElement.className = `card-suit ${color}`;
    suitElement.textContent = suit;
    
    card.appendChild(valueElement);
    card.appendChild(suitElement);
    
    return card;
}

// 处理卡片点击事件
function handleCardClick(card) {
    // 只在计算模式下处理卡片选择
    if (gameState.mode !== 'calculation') return;
    
    const value = card.dataset.value;
    const suit = card.dataset.suit;
    
    // 检查卡片是否已经被选中
    const isSelected = card.classList.contains('selected');
    
    if (isSelected) {
        // 取消选中
        card.classList.remove('selected');
        gameState.selectedCards = gameState.selectedCards.filter(c => !(c.value === value && c.suit === suit));
    } else {
        // 如果已经选了4张牌，不能再选
        if (gameState.selectedCards.length >= 4) return;
        
        // 选中卡片
        card.classList.add('selected');
        gameState.selectedCards.push({ value, suit });
    }
    
    // 更新已选牌区域
    updateSelectedCardsDisplay();
    
    // 更新计算按钮状态
    updateCalculateButtonState();
}

// 更新已选牌展示
function updateSelectedCardsDisplay() {
    const selectedCardsContainer = document.querySelector('.selected-cards > div:last-child');
    if (!selectedCardsContainer) return;
    
    selectedCardsContainer.innerHTML = '';
    
    gameState.selectedCards.forEach(card => {
        const cardElement = createCardElement(card.value, card.suit, card.suit === '♥' || card.suit === '♦' ? 'red' : 'black');
        selectedCardsContainer.appendChild(cardElement);
    });
}

// 更新计算按钮状态
function updateCalculateButtonState() {
    const calculateBtn = document.getElementById('calculate-btn');
    calculateBtn.disabled = gameState.selectedCards.length !== 4;
}

// 重置计算模式
function resetCalculationMode() {
    // 清除已选牌
    gameState.selectedCards = [];
    
    // 清除已选中的卡片样式
    document.querySelectorAll('.card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 更新已选牌区域
    updateSelectedCardsDisplay();
    
    // 更新计算按钮状态
    updateCalculateButtonState();
    
    // 隐藏结果区域
    elements.calculationResult.classList.add('hidden');
}

// 开始新的挑战
function startNewChallenge() {
    // 停止之前的计时器
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // 生成随机4张牌并确保有解
    let hasValidSolution = false;
    let attempts = 0;
    const maxAttempts = 100; // 设置最大尝试次数，防止无限循环
    
    while (!hasValidSolution && attempts < maxAttempts) {
        // 生成随机4张牌
        gameState.randomCards = generateRandomCards(4);
        
        // 计算解法
        gameState.solutions = findAllSolutions(gameState.randomCards.map(card => cardValueToNumber(card.value)));
        
        // 检查是否有解
        if (gameState.solutions.length > 0) {
            hasValidSolution = true;
        }
        
        attempts++;
    }
    
    // 显示随机牌
    displayRandomCards();
    
    // 更新虚拟键盘上的牌值按钮显示
    updateCardButtonsDisplay();
    
    // 重置计时器
    resetTimer();
    
    // 清空输入框
    clearCalculationInput();
    
    // 隐藏结果区域
    elements.challengeResult.classList.add('hidden');
    
    // 重置卡片按钮状态
    resetCardButtonsState();
}

// 处理虚拟键盘输入
function handleVirtualKeyboardInput(type, value) {
    const input = elements.calculationInput;
    
    if (type === 'card') {
        // 检查该卡片是否已被使用
        const cardButtons = document.querySelectorAll('.card-btn');
        const clickedButton = Array.from(cardButtons).find(btn => btn.dataset.value === value);
        
        if (clickedButton && !clickedButton.classList.contains('used')) {
            // 获取按钮上显示的实际牌值而非ABCD
            const actualCardValue = clickedButton.textContent;
            input.value += actualCardValue;
            clickedButton.classList.add('used');
        }
    } else if (type === 'operator') {
        // 添加运算符
        input.value += value;
    } else if (type === 'bracket') {
        // 添加括号
        input.value += value;
    }
    
    // 实时检查表达式是否完整有效
    checkExpressionCompleteness();
}

// 处理退格按钮
function handleBackspace() {
    const input = elements.calculationInput;
    if (input.value.length > 0) {
        const lastChar = input.value.charAt(input.value.length - 1);
        
        // 检查是否删除了牌值
        // 需要检查所有可能的牌值：数字、A、J、Q、K
        const cardButtons = document.querySelectorAll('.card-btn');
        const lastCharIsCard = Array.from(cardButtons).some(btn => {
            // 检查按钮上显示的文本是否与最后一个字符匹配
            if (btn.textContent === lastChar && btn.classList.contains('used')) {
                btn.classList.remove('used');
                return true;
            }
            return false;
        });
        
        // 处理多位数字的情况（如10）
        if (!lastCharIsCard && lastChar === '0' && input.value.length >= 2) {
            const lastTwoChars = input.value.slice(-2);
            if (lastTwoChars === '10') {
                const cardButton = Array.from(cardButtons).find(btn => 
                    btn.textContent === '10' && btn.classList.contains('used')
                );
                if (cardButton) {
                    cardButton.classList.remove('used');
                    // 删除两个字符（'10'）
                    input.value = input.value.slice(0, -2);
                    return;
                }
            }
        }
        
        // 删除最后一个字符
        input.value = input.value.slice(0, -1);
    }
}

// 清空计算输入
function clearCalculationInput() {
    elements.calculationInput.value = '';
    resetCardButtonsState();
}

// 检查表达式完整性并自动提交
function checkExpressionCompleteness() {
    // 只在挑战模式下启用自动提交
    if (gameState.mode !== 'challenge') return;
    
    const userInput = elements.calculationInput.value.trim();
    if (!userInput) return;
    
    try {
        // 检查是否使用了所有4张牌
        const usedCards = [];
        let checkExpression = userInput;
        let allCardsUsed = true;
        
        for (const card of gameState.randomCards) {
            const cardValue = card.value;
            // 创建一个正则表达式来匹配完整的牌值
            const cardRegex = new RegExp('\\b' + cardValue + '\\b');
            if (checkExpression.match(cardRegex)) {
                usedCards.push(cardValue);
                checkExpression = checkExpression.replace(cardRegex, 'x'); // 替换为x，防止重复计数
            }
        }
        
        // 检查是否使用了所有4张牌
        if (usedCards.length === 4) {
            // 检查表达式是否有效（括号匹配等）
            if (isValidExpression(userInput)) {
                // 自动提交
                checkUserSolution();
            }
        }
    } catch (error) {
        // 表达式不完整或无效，不进行提交
        return;
    }
}

// 重置卡片按钮状态
function resetCardButtonsState() {
    document.querySelectorAll('.card-btn').forEach(button => {
        button.classList.remove('used');
    });
}

// 更新虚拟键盘上的牌值按钮显示
function updateCardButtonsDisplay() {
    // 获取所有牌值按钮
    const cardButtons = document.querySelectorAll('.card-btn');
    
    // 更新每个按钮的显示文本为对应的牌值
    cardButtons.forEach((button, index) => {
        if (index < gameState.randomCards.length) {
            // 保持data-value属性为ABCD，但显示文本为实际牌值
            const cardValue = gameState.randomCards[index].value;
            button.textContent = cardValue;
        }
    });
}

// 生成随机牌
function generateRandomCards(count) {
    const suits = ['♥', '♦', '♠', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cards = [];
    
    for (let i = 0; i < count; i++) {
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const value = values[Math.floor(Math.random() * values.length)];
        const color = (suit === '♥' || suit === '♦') ? 'red' : 'black';
        cards.push({ value, suit, color });
    }
    
    return cards;
}

// 显示随机牌
function displayRandomCards() {
    const randomCardsContainer = document.querySelector('.random-cards > div');
    randomCardsContainer.innerHTML = '';
    
    gameState.randomCards.forEach(card => {
        const cardElement = createCardElement(card.value, card.suit, card.color);
        randomCardsContainer.appendChild(cardElement);
    });
}

// 重置计时器
function resetTimer() {
    gameState.startTime = new Date();
    elements.timer.textContent = '00:00';
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(updateTimer, 1000);
}

// 更新计时器
function updateTimer() {
    const now = new Date();
    const elapsed = Math.floor((now - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    elements.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 卡片值转数字
function cardValueToNumber(value) {
    const valueMap = {
        'A': 1,
        'J': 11,
        'Q': 12,
        'K': 13
    };
    
    return valueMap[value] || parseInt(value);
}

// 显示计算结果
function displayCalculationResult(solutions) {
    const resultContainer = elements.calculationResult;
    resultContainer.innerHTML = '';
    resultContainer.classList.remove('hidden', 'success', 'error', 'warning');
    
    if (solutions.length === 0) {
        resultContainer.classList.add('error');
        resultContainer.innerHTML = `
            <div class="flex items-start">
                <div class="text-error-color text-xl mr-3"><i class="fas fa-times-circle"></i></div>
                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-1">无解</h3>
                    <p class="text-gray-600">这组牌无法通过四则运算得到24点。</p>
                </div>
            </div>
        `;
    } else {
        resultContainer.classList.add('success');
        
        const solutionCount = solutions.length > 10 ? 10 : solutions.length;
        const hasMoreSolutions = solutions.length > 10;
        
        let html = `
            <div class="flex items-start">
                <div class="text-success-color text-xl mr-3"><i class="fas fa-check-circle"></i></div>
                <div class="w-full">
                    <h3 class="text-lg font-medium text-gray-800 mb-1">找到 ${solutions.length} 种解法</h3>
                    <p class="text-gray-600 mb-3">以下是${hasMoreSolutions ? '部分' : '所有'}可能的解法：</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        `;
        
        for (let i = 0; i < solutionCount; i++) {
            html += `<div class="solution">${solutions[i]}</div>`;
        }
        
        html += `
                    </div>
                    ${hasMoreSolutions ? `<p class="text-sm text-gray-500 mt-2">还有 ${solutions.length - 10} 种解法未显示</p>` : ''}
                </div>
            </div>
        `;
        
        resultContainer.innerHTML = html;
    }
}

// 显示挑战模式的解法
function showSolution() {
    const resultContainer = elements.challengeResult;
    resultContainer.innerHTML = '';
    resultContainer.classList.remove('hidden', 'success', 'error', 'warning');
    
    if (gameState.solutions.length === 0) {
        resultContainer.classList.add('error');
        resultContainer.innerHTML = `
            <div class="flex items-start">
                <div class="text-error-color text-xl mr-3"><i class="fas fa-times-circle"></i></div>
                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-1">无解</h3>
                    <p class="text-gray-600">这组牌无法通过四则运算得到24点。</p>
                </div>
            </div>
        `;
    } else {
        resultContainer.classList.add('warning');
        
        const solutionCount = gameState.solutions.length > 5 ? 5 : gameState.solutions.length;
        const hasMoreSolutions = gameState.solutions.length > 5;
        
        let html = `
            <div class="flex items-start">
                <div class="text-warning-color text-xl mr-3"><i class="fas fa-lightbulb"></i></div>
                <div class="w-full">
                    <h3 class="text-lg font-medium text-gray-800 mb-1">解法提示</h3>
                    <p class="text-gray-600 mb-3">以下是${hasMoreSolutions ? '部分' : '所有'}可能的解法：</p>
                    <div class="grid grid-cols-1 gap-2">
        `;
        
        for (let i = 0; i < solutionCount; i++) {
            html += `<div class="solution">${gameState.solutions[i]}</div>`;
        }
        
        html += `
                    </div>
                    ${hasMoreSolutions ? `<p class="text-sm text-gray-500 mt-2">还有 ${gameState.solutions.length - 5} 种解法未显示</p>` : ''}
                </div>
            </div>
        `;
        
        resultContainer.innerHTML = html;
    }
    
    resultContainer.classList.remove('hidden');
}

// 检查用户输入的解法
function checkUserSolution() {
    const userInput = elements.calculationInput.value.trim();
    if (!userInput) return;
    
    const resultContainer = elements.challengeResult;
    resultContainer.innerHTML = '';
    resultContainer.classList.remove('hidden', 'success', 'error', 'warning');
    
    try {
        // 用户已经直接输入了实际牌值，不需要替换ABCD
        let expression = userInput;
        
        // 替换字母牌面为对应的数值用于计算
        let evalExpression = expression.replace(/A/g, '1').replace(/J/g, '11').replace(/Q/g, '12').replace(/K/g, '13');
        
        // 检查是否使用了所有4张牌
        const usedCards = [];
        let checkExpression = expression;
        for (const card of gameState.randomCards) {
            const cardValue = card.value;
            // 创建一个正则表达式来匹配完整的牌值
            const cardRegex = new RegExp('\\b' + cardValue + '\\b');
            if (checkExpression.match(cardRegex)) {
                usedCards.push(cardValue);
                checkExpression = checkExpression.replace(cardRegex, 'x'); // 替换为x，防止重复计数
            }
        }
        
        if (usedCards.length !== 4) {
            throw new Error('必须使用所有4张牌，每张牌只能使用一次');
        }
        
        // 计算表达式
        // 注意：这里使用eval仅用于演示，实际应用中应使用更安全的方法
        const result = eval(evalExpression);
        
        if (Math.abs(result - 24) < 0.0001) {
            // 正确答案
            resultContainer.classList.add('success');
            resultContainer.innerHTML = `
                <div class="flex items-start">
                    <div class="text-success-color text-xl mr-3"><i class="fas fa-check-circle"></i></div>
                    <div>
                        <h3 class="text-lg font-medium text-gray-800 mb-1">恭喜！</h3>
                        <p class="text-gray-600">您的解法 ${userInput} = 24 是正确的！</p>
                    </div>
                </div>
            `;
            
            // 增加分数
            gameState.score += 10;
            elements.score.textContent = gameState.score;
            
            // 播放成功音效
            if (typeof playSuccessSound === 'function') {
                playSuccessSound();
            }
            
            // 显示祝贺动效
            showCongratulationEffect();
            
            // 2秒后开始新的挑战
            setTimeout(() => {
                startNewChallenge();
            }, 2000);
        } else {
            // 错误答案
            resultContainer.classList.add('error');
            resultContainer.innerHTML = `
                <div class="flex items-start">
                    <div class="text-error-color text-xl mr-3"><i class="fas fa-times-circle"></i></div>
                    <div>
                        <h3 class="text-lg font-medium text-gray-800 mb-1">计算错误</h3>
                        <p class="text-gray-600">您的解法 ${userInput} = ${result.toFixed(2)}，不等于24</p>
                    </div>
                </div>
            `;
            
            // 播放错误音效
            if (typeof playErrorSound === 'function') {
                playErrorSound();
            }
        }
    } catch (error) {
        // 处理错误
        resultContainer.classList.add('error');
        resultContainer.innerHTML = `
            <div class="flex items-start">
                <div class="text-error-color text-xl mr-3"><i class="fas fa-exclamation-circle"></i></div>
                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-1">输入错误</h3>
                    <p class="text-gray-600">${error.message || '表达式格式不正确，请检查您的输入'}</p>
                </div>
            </div>
        `;
        
        // 播放错误音效
        if (typeof playErrorSound === 'function') {
            playErrorSound();
        }
    }
    
    resultContainer.classList.remove('hidden');
}

// 计算24点解法
function calculateSolutions() {
    // 获取已选牌的数值
    const numbers = gameState.selectedCards.map(card => cardValueToNumber(card.value));
    
    // 查找所有解法
    const solutions = findAllSolutions(numbers);
    
    // 显示结果
    displayCalculationResult(solutions);
}

// 查找所有24点解法
function findAllSolutions(numbers) {
    if (numbers.length !== 4) return [];
    
    const solutions = [];
    const ops = ['+', '-', '*', '/'];
    
    // 生成所有可能的数字排列
    const permutations = generatePermutations(numbers);
    
    // 对每种排列，尝试所有可能的运算符组合
    permutations.forEach(perm => {
        // 尝试所有可能的运算符组合
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    // 尝试所有可能的括号组合
                    
                    // ((a op b) op c) op d
                    try {
                        let result = calculate(calculate(calculate(perm[0], ops[i], perm[1]), ops[j], perm[2]), ops[k], perm[3]);
                        if (Math.abs(result - 24) < 0.0001) {
                            solutions.push(`((${perm[0]} ${ops[i]} ${perm[1]}) ${ops[j]} ${perm[2]}) ${ops[k]} ${perm[3]}`);
                        }
                    } catch (e) {}
                    
                    // (a op (b op c)) op d
                    try {
                        let result = calculate(calculate(perm[0], ops[i], calculate(perm[1], ops[j], perm[2])), ops[k], perm[3]);
                        if (Math.abs(result - 24) < 0.0001) {
                            solutions.push(`(${perm[0]} ${ops[i]} (${perm[1]} ${ops[j]} ${perm[2]})) ${ops[k]} ${perm[3]}`);
                        }
                    } catch (e) {}
                    
                    // a op ((b op c) op d)
                    try {
                        let result = calculate(perm[0], ops[i], calculate(calculate(perm[1], ops[j], perm[2]), ops[k], perm[3]));
                        if (Math.abs(result - 24) < 0.0001) {
                            solutions.push(`${perm[0]} ${ops[i]} ((${perm[1]} ${ops[j]} ${perm[2]}) ${ops[k]} ${perm[3]})`);
                        }
                    } catch (e) {}
                    
                    // a op (b op (c op d))
                    try {
                        let result = calculate(perm[0], ops[i], calculate(perm[1], ops[j], calculate(perm[2], ops[k], perm[3])));
                        if (Math.abs(result - 24) < 0.0001) {
                            solutions.push(`${perm[0]} ${ops[i]} (${perm[1]} ${ops[j]} (${perm[2]} ${ops[k]} ${perm[3]}))`);
                        }
                    } catch (e) {}
                    
                    // (a op b) op (c op d)
                    try {
                        let result = calculate(calculate(perm[0], ops[i], perm[1]), ops[j], calculate(perm[2], ops[k], perm[3]));
                        if (Math.abs(result - 24) < 0.0001) {
                            solutions.push(`(${perm[0]} ${ops[i]} ${perm[1]}) ${ops[j]} (${perm[2]} ${ops[k]} ${perm[3]})`);
                        }
                    } catch (e) {}
                }
            }
        }
    });
    
    // 去除重复解法
    return [...new Set(solutions)];
}

// 生成所有可能的排列
function generatePermutations(arr) {
    const result = [];
    
    function permute(arr, m = []) {
        if (arr.length === 0) {
            result.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                const curr = arr.slice();
                const next = curr.splice(i, 1);
                permute(curr, m.concat(next));
            }
        }
    }
    
    permute(arr);
    return result;
}

// 计算两个数的四则运算
function calculate(a, op, b) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) throw new Error('除数不能为0');
            return a / b;
        default:
            throw new Error('无效的运算符');
    }
}

// 验证表达式的有效性
function isValidExpression(expression) {
    // 检查括号是否匹配
    let bracketCount = 0;
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === '(') {
            bracketCount++;
        } else if (expression[i] === ')') {
            bracketCount--;
            // 如果右括号多于左括号，表达式无效
            if (bracketCount < 0) return false;
        }
    }
    // 左右括号数量应该相等
    if (bracketCount !== 0) return false;
    
    // 检查表达式是否包含基本运算符
    if (!(/[\+\-\*\/]/.test(expression))) return false;
    
    // 尝试计算表达式，检查是否可以被解析
    try {
        // 替换字母牌面为对应的数值用于计算
        let evalExpression = expression.replace(/A/g, '1').replace(/J/g, '11').replace(/Q/g, '12').replace(/K/g, '13');
        // 尝试计算，但不关心结果，只检查是否可以计算
        eval(evalExpression);
        return true;
    } catch (error) {
        // 表达式无法计算
        return false;
    }
}