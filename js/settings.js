// 全局配置与常量定义
const CONFIG = {
    // 本地存储键名
    STORAGE_KEY: 'algorithmKidUser',

    // 游戏配置
    MIN_NUMBER: 1,
    MAX_NUMBER: 20,
    MIN_NUMBERS_COUNT: 3,
    MAX_NUMBERS_COUNT: 8,

    // 兑换配置（限制最多兑换2个徽章）
    MAX_EXCHANGED_ITEMS: 2,

    // 兑换物品配置
    EXCHANGE_ITEMS: {
        '小勇士徽章': { cost: 10, icon: '🏅' },
        '彩色主题': { cost: 20, icon: '🎨' },
        '算法小天才称号': { cost: 50, icon: '👑' }
    },

    // DOM元素ID
    ELEMENTS: {
        welcomePage: 'welcomePage',
        registerPage: 'registerPage',
        levelSelectPage: 'levelSelectPage',
        gamePage: 'gamePage',

        startBtn: 'startBtn',
        backBtn: 'backBtn',
        registerForm: 'registerForm',
        errorMessage: 'errorMessage',

        welcomeMessage: 'welcomeMessage',
        userName: 'userName',
        userBadges: 'userBadges',
        logoutBtn: 'logoutBtn',

        numbersContainer: 'numbersContainer',
        answerContainer: 'answerContainer',
        userAnswer: 'userAnswer',

        resetBtn: 'resetBtn',
        submitBtn: 'submitBtn',
        resultMessage: 'resultMessage',

        starsDisplay: 'stars',
        levelDisplay: 'level',

        studentName: 'studentName',
        schoolName: 'schoolName',
        className: 'className',

        backToWelcomeBtn: 'backToWelcomeBtn',
        backToLevelSelectBtn: 'backToLevelSelectBtn',
        totalStars: 'totalStars',

        gameTitle: 'gameTitle',
        gameInstruction: 'gameInstruction',
        additionInputContainer: 'additionInputContainer',
        additionAnswer: 'additionAnswer',

        exchangeMessage: 'exchangeMessage',
        donateBtn: 'donateBtn',
        donateModal: 'donateModal',
        closeModal: 'close-modal'
    }
};

// 全局DOM元素缓存
const DOM = {};

// 初始化DOM元素
function initDOM() {
    for (const [key, id] of Object.entries(CONFIG.ELEMENTS)) {
        DOM[key] = document.getElementById(id);
    }
}