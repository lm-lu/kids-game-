// 游戏核心
class Game {
    constructor() {
        this.currentGameLevel = 1;
        this.currentNumbers = [];
        this.selectedNumbers = [];
        this.additionNumbers = [0, 0];
        this.stars = 0;
        this.level = 1;
    }

    // 初始化游戏
    init(gameLevel) {
        this.currentGameLevel = gameLevel;
        const userInfo = user.getInfo();
        this.stars = userInfo.stars;
        this.level = userInfo.level;

        if (gameLevel === 1) {
            this.initSortGame();
        } else if (gameLevel === 2) {
            this.initAdditionGame();
        }
    }

    // 初始化排序游戏
    initSortGame() {
        DOM.gameTitle.textContent = '第一关：数字排序';
        DOM.gameInstruction.textContent = '把下面的数字从小到大排列';
        DOM.answerContainer.style.display = 'block';
        DOM.additionInputContainer.style.display = 'none';
        this.generateSortNumbers();
    }

    // 初始化加法游戏
    initAdditionGame() {
        DOM.gameTitle.textContent = '第二关：数字加法';
        DOM.gameInstruction.textContent = '计算两个数字的和';
        DOM.answerContainer.style.display = 'none';
        DOM.additionInputContainer.style.display = 'block';
        DOM.additionAnswer.value = '';
        this.generateAdditionNumbers();
    }

    // 生成排序题目
    generateSortNumbers() {
        const count = Math.min(CONFIG.MIN_NUMBERS_COUNT + this.level - 1, CONFIG.MAX_NUMBERS_COUNT);
        this.currentNumbers = [];

        while (this.currentNumbers.length < count) {
            const num = Math.floor(Math.random() * CONFIG.MAX_NUMBER) + 1;
            if (!this.currentNumbers.includes(num)) {
                this.currentNumbers.push(num);
            }
        }
        this.renderSortNumbers();
    }

    // 生成加法题目
    generateAdditionNumbers() {
        const max = Math.min(10 + this.level * 5, 100);
        this.additionNumbers[0] = Math.floor(Math.random() * max)+1;
        this.additionNumbers[1] = Math.floor(Math.random() * max)+1;
        this.renderAdditionNumbers();
    }

    // 渲染排序题目
    renderSortNumbers() {
        DOM.numbersContainer.innerHTML = '';
        DOM.userAnswer.innerHTML = '';
        this.selectedNumbers = [];
        DOM.resultMessage.style.display = 'none';

        this.currentNumbers.forEach(num => {
            const card = document.createElement('div');
            card.className = 'number-card';
            card.textContent = num;
            card.onclick = () => this.selectNumber(num, card);
            DOM.numbersContainer.appendChild(card);
        });
    }

    // 渲染加法题目
    renderAdditionNumbers() {
        DOM.numbersContainer.innerHTML = '';
        DOM.resultMessage.style.display = 'none';

        const a = document.createElement('div'); 
        a.className = 'number-card'; 
        a.textContent = this.additionNumbers[0];
        const p = document.createElement('div'); 
        p.className = 'number-card'; 
        p.textContent = '+'; 
        p.style.background = '#a8edea'; 
        p.style.cursor = 'default';
        const b = document.createElement('div'); 
        b.className = 'number-card'; 
        b.textContent = this.additionNumbers[1];
        const eq = document.createElement('div'); 
        eq.className = 'number-card'; 
        eq.textContent = '='; 
        eq.style.background = '#a8edea'; 
        eq.style.cursor = 'default';

        DOM.numbersContainer.appendChild(a);
        DOM.numbersContainer.appendChild(p);
        DOM.numbersContainer.appendChild(b);
        DOM.numbersContainer.appendChild(eq);
    }

    // 选择数字（排序游戏）
    selectNumber(num, card) {
        if (!this.selectedNumbers.includes(num)) {
            this.selectedNumbers.push(num);
            card.style.display = 'none';
            
            const answerCard = document.createElement('div');
            answerCard.className = 'number-card answer-card';
            answerCard.textContent = num;
            answerCard.onclick = () => this.removeNumber(num, answerCard, card);
            DOM.userAnswer.appendChild(answerCard);
        }
    }

    // 移除数字（排序游戏）
    removeNumber(num, answerCard, originalCard) {
        const index = this.selectedNumbers.indexOf(num);
        if (index > -1) {
            this.selectedNumbers.splice(index, 1);
            answerCard.remove();
            originalCard.style.display = 'inline-block';
        }
    }

    // 检查答案
    checkAnswer() {
        DOM.resultMessage.style.display = 'block';
        
        if (this.currentGameLevel === 1) {
            this.checkSortAnswer();
        } else if (this.currentGameLevel === 2) {
            this.checkAdditionAnswer();
        }
    }

    // 检查排序答案
    checkSortAnswer() {
        const sortedNumbers = [...this.currentNumbers].sort((a, b) => a - b);
        
        if (JSON.stringify(this.selectedNumbers) === JSON.stringify(sortedNumbers)) {
            // 答对了
            this.stars += 1;
            DOM.resultMessage.className = 'result-message success';
            DOM.resultMessage.innerHTML = `🎉 恭喜你！答对了！获得1颗星星！<br>你的星星: ${this.stars}`;
            this.updateUserProgress();
            setTimeout(() => this.init(this.currentGameLevel), 2000);
        } else {
            // 答错了
            DOM.resultMessage.className = 'result-message error';
            DOM.resultMessage.textContent = '❌ 答案不对哦，再试试吧！';
        }
    }

    // 检查加法答案
    checkAdditionAnswer() {
        const userAnswer = parseInt(DOM.additionAnswer.value);
        const correctAnswer = this.additionNumbers[0] + this.additionNumbers[1];
        
        if (isNaN(userAnswer)) {
            DOM.resultMessage.className = 'result-message error';
            DOM.resultMessage.textContent = '❌ 请输入有效的数字！';
            return;
        }
        
        if (userAnswer === correctAnswer) {
            // 答对了
            this.stars += 1;
            DOM.resultMessage.className = 'result-message success';
            DOM.resultMessage.innerHTML = `🎉 恭喜你！答对了！获得1颗星星！<br>你的星星: ${this.stars}`;
            this.updateUserProgress();
            setTimeout(() => this.init(this.currentGameLevel), 2000);
        } else {
            // 答错了
            DOM.resultMessage.className = 'result-message error';
            DOM.resultMessage.textContent = `❌ 答案不对哦，正确答案是${correctAnswer}！`;
        }
    }

    // 更新用户进度
    updateUserProgress() {
        // 每获得5颗星星，关卡+1
        const newLevel = Math.floor(this.stars / 5)+1;
        if (newLevel > this.level) {
            this.level = newLevel;
            DOM.resultMessage.innerHTML += `<br>🌟 恭喜你升级到第${this.level}关！`;
        }
        
        user.updateProgress(this.stars, this.level);
        DOM.starsDisplay.textContent = this.stars;
        DOM.levelDisplay.textContent = this.level;
    }

    // 重置游戏
    reset() {
        if (this.currentGameLevel === 1) {
            this.generateSortNumbers();
        } else if (this.currentGameLevel === 2) {
            this.generateAdditionNumbers();
        }
        DOM.resultMessage.style.display = 'none';
    }
}

const game = new Game();
