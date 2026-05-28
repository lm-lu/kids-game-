// 程序入口
document.addEventListener('DOMContentLoaded', () => {
    initDOM();

    // 欢迎开始按钮
    DOM.startBtn.onclick = () => {
        user.isRegistered() ? pageManager.showLevelSelectPage() : pageManager.showRegisterPage();
    };

    // 返回按钮
    DOM.backBtn.onclick = () => pageManager.showWelcomePage();

    // 注册提交
    DOM.registerForm.onsubmit = (e) => {
        e.preventDefault();
        const name = DOM.studentName.value.trim();
        const school = DOM.schoolName.value.trim();
        const className = DOM.className.value.trim();

        if (!name || !school || !className) {
            pageManager.showError('请填写完整信息！');
            return;
        }

        user.register(name, school, className);
        pageManager.showLevelSelectPage();
    };

    // 返回首页
    DOM.backToWelcomeBtn.onclick = () => pageManager.showWelcomePage();

    // 返回关卡选择
    DOM.backToLevelSelectBtn.onclick = () => pageManager.showLevelSelectPage();

    // 退出登录
    DOM.logoutBtn.onclick = () => {
        user.logout();
        pageManager.showWelcomePage();
    };

    // 重新开始（回到第一关）
    DOM.resetBtn.onclick = () => game.resetLevel();

    // 提交答案
    DOM.submitBtn.onclick = () => game.checkAnswer();

    // 关卡选择
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.onclick = () => {
            const level = parseInt(btn.dataset.level);
            game.init(level);
            pageManager.showGamePage(level);
        };
    });

    // 兑换按钮
    document.querySelectorAll('.exchange-btn').forEach((btn, index) => {
        btn.onclick = () => {
            if (btn.disabled) return;
            const keys = Object.keys(CONFIG.EXCHANGE_ITEMS);
            const name = keys[index];
            const cost = CONFIG.EXCHANGE_ITEMS[name].cost;
            const result = user.exchangeItem(name, cost);

            pageManager.showExchangeMessage(result.message, result.success);
            if (result.success) {
                DOM.totalStars.textContent = user.getInfo().stars;
            }
        };
    });

    // 回车提交答案
    DOM.additionAnswer.onkeypress = (e) => {
        if (e.key === 'Enter') game.checkAnswer();
    };

    // 家长打赏弹窗
    const modal = document.getElementById('donateModal');
    const closeModal = document.querySelector('.close-modal');

    DOM.donateBtn.onclick = () => {
        modal.style.display = 'block';
    };

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
});
