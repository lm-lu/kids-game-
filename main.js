// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化DOM元素
    initDOM();
    
    // 初始化页面管理器
    const pageManager = new PageManager();
    
    // 初始化游戏
    const game = new Game();
    
    // 欢迎页开始按钮
    DOM.startBtn.addEventListener('click', () => {
        if (user.isRegistered()) {
            pageManager.showLevelSelectPage();
        } else {
            pageManager.showRegisterPage();
        }
    });
    
    // 注册页返回按钮
    DOM.backBtn.addEventListener('click', () => {
        pageManager.showWelcomePage();
    });
    
    // 注册表单提交
    DOM.registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = DOM.studentName.value.trim();
        const school = DOM.schoolName.value.trim();
        const className = DOM.className.value.trim();
        
        if (!name || !school || !className) {
            pageManager.showError('请填写所有信息！');
            return;
        }
        
        user.register(name, school, className);
        pageManager.showLevelSelectPage();
    });
    
    // 关卡选择按钮
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = parseInt(btn.getAttribute('data-level'));
            game.init(level);
            pageManager.showGamePage(level);
        });
    });
    
    // 返回首页按钮
    DOM.backToWelcomeBtn.addEventListener('click', () => {
        pageManager.showWelcomePage();
    });
    
    // 返回关卡选择按钮
    DOM.backToLevelSelectBtn.addEventListener('click', () => {
        pageManager.showLevelSelectPage();
    });
    
    // 退出登录按钮
    DOM.logoutBtn.addEventListener('click', () => {
        user.logout();
        pageManager.showWelcomePage();
    });
    
    // 重新开始按钮
    DOM.resetBtn.addEventListener('click', () => {
        game.reset();
    });
    
    // 提交答案按钮
    DOM.submitBtn.addEventListener('click', () => {
        game.checkAnswer();
    });
    
    // 兑换按钮
    document.querySelectorAll('.exchange-btn').forEach((btn, index) => {
        const itemNames = Object.keys(CONFIG.EXCHANGE_ITEMS);
        const itemName = itemNames[index];
        const cost = CONFIG.EXCHANGE_ITEMS[itemName].cost;
        
        btn.addEventListener('click', () => {
            const result = user.exchangeItem(itemName, cost);
            pageManager.showExchangeMessage(result.message, result.success);
            DOM.totalStars.textContent = user.getInfo().stars;
        });
    });
    
    // 打赏按钮
    DOM.donateBtn.addEventListener('click', () => {
        DOM.donateModal.style.display = 'block';
    });
    
    // 关闭打赏模态框
    document.querySelector('.close-modal').addEventListener('click', () => {
        DOM.donateModal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === DOM.donateModal) {
            DOM.donateModal.style.display = 'none';
        }
    });
    
    // 页面加载时检查用户状态
    if (user.isRegistered()) {
        // 自动跳转到关卡选择页
        pageManager.showLevelSelectPage();
    }
});
