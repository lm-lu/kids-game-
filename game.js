class Game {
    constructor() {
        this.currentLevel = 1;
        this.numbers = [];
        this.userAnswer = [];
        this.stars = parseInt(localStorage.getItem('stars')) || 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStarsDisplay();
    }

    startLevel(level) {
        this.currentLevel = level;
        this.userAnswer = [];
        this.numbers = [];
        document.getElementById('level').textContent = level;
        document.getElementById('resultMessage').textContent = '';
        document.getElementById('resultMessage').className = 'result-message';
        document.getElementById('userAnswer').innerHTML = '';
        
        if (level === 1) {
            this.setupSortingGame();
        } else if (level === 2) {
            this.setupAdditionGame();
        }
    }

    setupSortingGame() {
        document.getElementById('gameTitle').textContent = '第一关：数字排序';
        document.getElementById('gameInstruction').textContent = '把下面的数字从小到大排列：';
        document.getElementById('numbersContainer').style.display = 'flex';
        document.getElementById('answerContainer').style.display = 'block';
        document.getElementById('additionInputContainer').style.display = 'none';
        
        // 生成4个1-20的随机数，确保不重复
        while (this.numbers.length < 4) {
            const num = Math.floor(Math.random()*20)+1;
            if (!this.numbers.includes(num)) {
                this.numbers.push(num);
            }
        }
        
        const numbersContainer = document.getElementById('numbersContainer');
        numbersContainer.innerHTML = '';
        
        // 打乱数字顺序并创建按钮
        const shuffledNumbers = [...this.numbers].sort(() => Math.random()-0.5);
        shuffledNumbers.forEach(num => {
            const numberBtn = document.createElement('button');
            numberBtn.className = 'number-btn';
            numberBtn.textContent = num;
            numberBtn.dataset.value = num;
            numberBtn.addEventListener('click', () => this.selectNumber(num, numberBtn));
            numbersContainer.appendChild(numberBtn);
        });
    }

    setupAdditionGame() {
        document.getElementById('gameTitle').textContent = '第二关：数字加法';
        document.getElementById('gameInstruction').textContent = '计算下面两个数字的和：';
        document.getElementById('numbersContainer').style.display = 'flex';
        document.getElementById('answerContainer').style.display = 'none';
        document.getElementById('additionInputContainer').style.display = 'block';
        
        // 生成两个10-50的随机数
        const num1 = Math.floor(Math.random()*41)+10;
        const num2 = Math.floor(Math.random()*41)+10;
        this.numbers = [num1, num2];
        
        const numbersContainer = document.getElementById('numbersContainer');
        numbersContainer.innerHTML = '';
        
        // 显示两个数字
        const num1Btn = document.createElement('div');
        num1Btn.className = 'addition-number';
        num1Btn.textContent = num1;
        numbersContainer.appendChild(num1Btn);
        
        const plusSign = document.createElement('div');
        plusSign.className = 'addition-operator';
        plusSign.textContent = '+';
        numbersContainer.appendChild(plusSign);
        
        const num2Btn = document.createElement('div');
        num2Btn.className = 'addition-number';
        num2Btn.textContent = num2;
        numbersContainer.appendChild(num2Btn);
        
        const equalSign = document.createElement('div');
        equalSign.className = 'addition-operator';
        equalSign.textContent = '=';
        numbersContainer.appendChild(equalSign);
        
        // 清空输入框
        document.getElementById('additionAnswer').value = '';
    }

    selectNumber(num, button) {
        // 只允许选择4个数字
        if (this.userAnswer.length >= 4) return;
        
        // 添加到用户答案
        this.userAnswer.push(num);
        button.disabled = true;
        button.classList.add('selected');
        
        // 更新答案显示
        const userAnswerContainer = document.getElementById('userAnswer');
        const answerItem = document.createElement('div');
        answerItem.className = 'answer-item';
        answerItem.textContent = num;
        userAnswerContainer.appendChild(answerItem);
    }

    checkAnswer() {
        let isCorrect = false;
        const resultMessage = document.getElementById('resultMessage');
        
        if (this.currentLevel === 1) {
            // 检查排序是否正确
            const sortedNumbers = [...this.numbers].sort((a, b) => a - b);
            isCorrect = JSON.stringify(this.userAnswer) === JSON.stringify(sortedNumbers);
        } else if (this.currentLevel === 2) {
            // 检查加法答案
            const userAnswer = parseInt(document.getElementById('additionAnswer').value);
            const correctAnswer = this.numbers[0] + this.numbers[1];
            isCorrect = userAnswer === correctAnswer;
        }
        
        if (isCorrect) {
            resultMessage.textContent = '🎉 恭喜你！答对了！获得2颗星星！';
            resultMessage.className = 'result-message correct';
            this.stars += 2;
            this.updateStarsDisplay();
            localStorage.setItem('stars', this.stars);
            
            // 显示下一关按钮
            if (this.currentLevel < 2) {
                setTimeout(() => {
                    if (confirm('太棒了！是否进入下一关？')) {
                        this.startLevel(this.currentLevel + 1);
                    }
                }, 1000);
            }
        } else {
            resultMessage.textContent = '❌ 答案不对哦，再试一次吧！';
            resultMessage.className = 'result-message incorrect';
        }
    }

    resetGame() {
        this.startLevel(this.currentLevel);
    }

    updateStarsDisplay() {
        document.getElementById('stars').textContent = this.stars;
        document.getElementById('totalStars').textContent = this.stars;
    }

    setupEventListeners() {
        document.getElementById('submitBtn').addEventListener('click', () => this.checkAnswer());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }
}

// 确保DOM加载完成后再初始化
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
