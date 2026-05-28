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
        this.additionNumbers[0] = Math.floor(Math.random() * max) + 1;
        this.additionNumbers[1] = Math.floor(Math.random() * max) + 1;
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

        const a = document.createElement('div'); a.className = 'number-card'; a.textContent = this.additionNumbers[0];
        const p = document.createElement('div'); p.className = 'number-card'; p.textContent = '+'; p.style.background = '#a8edea'; p.style.cursor = 'default';
        const b = document.createElement('div'); b.className = 'number-card'; b.textContent = this.additionNumbers[1];
        const e = document.createElement('div'); e.className = 'number-card'; e.textContent = '='; e.style.background = '#a8edea'; e.style.cursor = 'default';
        const q = document.createElement('div'); q.className = 'number-card'; q.textContent = '?'; q.style.background = '#ffecd2'; q.style.cursor = 'default';

        DOM.numbersContainer.append(a, p, b, e, q);
    }

    // 选择数字
    selectNumber(num, card) {
        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            this.selectedNumbers = this.selectedNumbers.filter(x => x !== num);
        } else {
            card.classList.add('selected');
            this.selectedNumbers.push(num);
        }
        this.updateUserAnswer();
    }

    // 更新答案显示
    updateUserAnswer() {
        DOM.userAnswer.innerHTML = '';
        this.selectedNumbers.forEach(num => {
            const span = document.createElement('span');
            span.className = 'number-card';
            span.textContent = num;
            DOM.userAnswer.appendChild(span);
        });
    }

    // 检查答案
    checkAnswer() {
        if (this.currentGameLevel === 1) {
            this.checkSortAnswer();
        } else {
            this.checkAdditionAnswer();
        }
    }

    // 检查排序答案
    checkSortAnswer() {
        if (this.selectedNumbers.length !== this.currentNumbers.length) {
            DOM.resultMessage.className = 'result-message incorrect';
            DOM.resultMessage.textContent = '请选择所有数字！';
            DOM.resultMessage.style.display = 'block';
            return;
        }

        const correct = JSON.stringify(this.selectedNumbers) === JSON.stringify([...this.currentNumbers].sort((a, b) => a - b));

        if (correct) {
            DOM.resultMessage.className = 'result-message correct';
            DOM.resultMessage.textContent = '恭喜你答对了！获得2颗星星';
            this.stars += 2;
            this.level++;
            DOM.starsDisplay.textContent = this.stars;
            DOM.levelDisplay.textContent = this.level;
            user.updateProgress(this.stars, this.level);
            setTimeout(() => this.generateSortNumbers(), 2000);
        } else {
            this.stars = Math.max(0, this.stars - 1);
            DOM.starsDisplay.textContent = this.stars;
            user.updateProgress(this.stars, this.level);
            DOM.resultMessage.className = 'result-message incorrect';
            DOM.resultMessage.textContent = '答错了，扣1颗星星';
            DOM.resultMessage.style.display = 'block';
        }
    }

    // 检查加法答案
    checkAdditionAnswer() {
        const val = parseInt(DOM.additionAnswer.value);
        const ans = this.additionNumbers[0] + this.additionNumbers[1];

        if (isNaN(val)) {
            DOM.resultMessage.className = 'result-message incorrect';
            DOM.resultMessage.textContent = '请输入数字！';
            DOM.resultMessage.style.display = 'block';
            return;
        }

        if (val === ans) {
            DOM.resultMessage.className = 'result-message correct';
            DOM.resultMessage.textContent = '恭喜你答对了！获得2颗星星';
            this.stars += 2;
            this.level++;
            DOM.starsDisplay.textContent = this.stars;
            DOM.levelDisplay.textContent = this.level;
            user.updateProgress(this.stars, this.level);
            setTimeout(() => {
                this.generateAdditionNumbers();
                DOM.additionAnswer.value = '';
            }, 2000);
        } else {
            this.stars = Math.max(0, this.stars - 1);
            DOM.starsDisplay.textContent = this.stars;
            user.updateProgress(this.stars, this.level);
            DOM.resultMessage.className = 'result-message incorrect';
            DOM.resultMessage.textContent = '答错了，扣1颗星星';
            DOM.resultMessage.style.display = 'block';
        }
    }

    // 重置到第一关
    resetLevel() {
        this.level = 1;
        user.updateProgress(this.stars, this.level);
        DOM.levelDisplay.textContent = 1;

        if (this.currentGameLevel === 1) {
            this.generateSortNumbers();
        } else {
            this.generateAdditionNumbers();
            DOM.additionAnswer.value = '';
        }
    }
}

const game = new Game();