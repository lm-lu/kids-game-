// 页面切换管理器
class PageManager {
    constructor() {
        this.pages = document.querySelectorAll('.page');
    }

    // 显示指定页面
    showPage(element) {
        this.pages.forEach(page => page.classList.remove('active'));
        element.classList.add('active');
    }

    // 显示欢迎页
    showWelcomePage() {
        this.showPage(DOM.welcomePage);
    }

    // 显示注册页
    showRegisterPage() {
        this.showPage(DOM.registerPage);
        DOM.errorMessage.textContent = '';
    }

    // 显示关卡选择页
    showLevelSelectPage() {
        this.showPage(DOM.levelSelectPage);
        const userInfo = user.getInfo();
        DOM.totalStars.textContent = userInfo.stars;
        DOM.exchangeMessage.style.display = 'none';
        this.updateExchangeButtons();
    }

    // 显示游戏页
    showGamePage(gameLevel) {
        this.showPage(DOM.gamePage);
        const userInfo = user.getInfo();
        DOM.userName.textContent = userInfo.name;

        let badgesHtml = '';
        for (const [itemName, itemData] of Object.entries(CONFIG.EXCHANGE_ITEMS)) {
            if (userInfo.exchangedItems.includes(itemName)) {
                badgesHtml += itemData.icon + ' ';
            }
        }
        DOM.userBadges.innerHTML = badgesHtml;

        DOM.starsDisplay.textContent = userInfo.stars;
        DOM.levelDisplay.textContent = userInfo.level;
    }

    // 显示错误信息
    showError(message) {
        DOM.errorMessage.textContent = message;
    }

    // 显示兑换信息
    showExchangeMessage(message, isSuccess) {
        DOM.exchangeMessage.className = 'exchange-message ' + (isSuccess ? 'success' : 'error');
        DOM.exchangeMessage.textContent = message;
        DOM.exchangeMessage.style.display = 'block';

        if (isSuccess) {
            this.updateExchangeButtons();
        }
    }

    // 更新兑换按钮状态
    updateExchangeButtons() {
        const userInfo = user.getInfo();
        const exchangedCount = user.getExchangedCount();
        const isMaxReached = exchangedCount >= CONFIG.MAX_EXCHANGED_ITEMS;
        const itemElements = document.querySelectorAll('.exchange-item');
        const itemNames = Object.keys(CONFIG.EXCHANGE_ITEMS);

        itemElements.forEach((item, index) => {
            const btn = item.querySelector('.exchange-btn');
            const name = itemNames[index];
            const isExchanged = userInfo.exchangedItems.includes(name);

            if (isExchanged || isMaxReached) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.textContent = isExchanged ? '已兑换' : '已达上限';
            } else {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.textContent = CONFIG.EXCHANGE_ITEMS[name].cost + '颗星星';
            }
        });
    }
}

const pageManager = new PageManager();
