// 用户数据管理类
class User {
    constructor() {
        this.userData = null;
        this.loadFromStorage();
    }

    // 从本地存储加载用户数据
    loadFromStorage() {
        const data = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (data) {
            this.userData = JSON.parse(data);
            if (!this.userData.exchangedItems) {
                this.userData.exchangedItems = [];
            }
        }
    }

    // 保存用户数据到本地存储
    saveToStorage() {
        if (this.userData) {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.userData));
        }
    }

    // 检查用户是否已注册
    isRegistered() {
        return this.userData !== null;
    }

    // 注册新用户
    register(name, school, className) {
        this.userData = {
            name: name,
            school: school,
            class: className,
            stars: 0,
            level: 1,
            exchangedItems: [],
            registerDate: new Date().toISOString()
        };
        this.saveToStorage();
    }

    // 更新用户游戏进度
    updateProgress(stars, level) {
        if (this.userData) {
            this.userData.stars = stars;
            this.userData.level = level;
            this.saveToStorage();
        }
    }

    // 获取用户信息
    getInfo() {
        return this.userData;
    }

    // 退出登录
    logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        this.userData = null;
    }

    // 兑换物品
    exchangeItem(itemName, cost) {
        if (!this.userData) return { success: false };

        if (this.userData.exchangedItems.length >= CONFIG.MAX_EXCHANGED_ITEMS) {
            return { success: false, message: '最多只能兑换2个徽章！' };
        }

        if (this.userData.stars < cost) {
            return { success: false, message: '星星不足，无法兑换！' };
        }

        if (this.userData.exchangedItems.includes(itemName)) {
            return { success: false, message: '你已经兑换过这个物品了！' };
        }

        this.userData.stars -= cost;
        this.userData.exchangedItems.push(itemName);
        this.saveToStorage();

        return { success: true, message: '兑换成功！' };
    }

    // 获取已兑换物品数量
    getExchangedCount() {
        return this.userData ? this.userData.exchangedItems.length : 0;
    }
}

const user = new User();