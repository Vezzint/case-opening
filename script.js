let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();
tg.setHeaderColor('#0a0a0f');
tg.setBackgroundColor('#0a0a0f');

const ADMIN_ID = 6584350034;

// БАЗА NFT + ВАЛЮТА
const NFT_DATABASE = [
    // ВАЛЮТА (id: 0-4)
    {id: 0, name: "Подарок", stars: 0, ton: 0, image: "nft/Gift.jpg", isCurrency: true, amount: 1, rarity: "special", icon: "💝"},
    {id: 1, name: "3 звезды", stars: 3, ton: 0, image: "nft/Stars.jpg", isCurrency: true, amount: 3, rarity: "common", icon: "⭐"},
    {id: 2, name: "5 звёзд", stars: 5, ton: 0, image: "nft/Stars.jpg", isCurrency: true, amount: 5, rarity: "common", icon: "⭐"},
    {id: 3, name: "15 звёзд", stars: 15, ton: 0, image: "nft/Stars.jpg", isCurrency: true, amount: 15, rarity: "rare", icon: "⭐"},
    {id: 4, name: "50 звёзд", stars: 50, ton: 0, image: "nft/Stars.jpg", isCurrency: true, amount: 50, rarity: "epic", icon: "⭐"},

    // NFT (id: 5-14)
    {id: 5, name: "1 may", stars: 20, ton: 0.10, image: "nft/1 may.jpg", rarity: "common"},
    {id: 6, name: "Artisan Brick", stars: 35, ton: 0.18, image: "nft/Artisan Brick.jpg", rarity: "common"},
    {id: 7, name: "Astral Shard", stars: 45, ton: 0.25, image: "nft/Astral Shard.jpg", rarity: "rare"},
    {id: 8, name: "Backpack", stars: 60, ton: 0.35, image: "nft/Backpack.jpg", rarity: "rare"},
    {id: 9, name: "Crystal Eagle", stars: 90, ton: 0.55, image: "nft/Crystal Eagle.jpg", rarity: "rare"},
    {id: 10, name: "Durovs Cap", stars: 150, ton: 0.90, image: "nft/Durovs Cap.jpg", rarity: "epic"},
    {id: 11, name: "Faith Amulet", stars: 220, ton: 1.40, image: "nft/Faith Amulet.jpg", rarity: "epic"},
    {id: 12, name: "Happy Brownie", stars: 350, ton: 2.20, image: "nft/Happy Brownie.jpg", rarity: "legendary"},
    {id: 13, name: "Instant Ramen", stars: 500, ton: 3.20, image: "nft/Instant Ramen.jpg", rarity: "legendary"},
    {id: 14, name: "Jolly Chimp", stars: 800, ton: 5.00, image: "nft/Jolly Chimp.jpg", rarity: "mythic"}
];

// КЕЙСЫ
const CASES_DATA = {
    free: {
        name: "🎁 Бесплатный кейс",
        icon: "🎁",
        price: 0,
        type: "free",
        items: [
            {nft: NFT_DATABASE[0], chance: 35},
            {nft: NFT_DATABASE[1], chance: 30},
            {nft: NFT_DATABASE[2], chance: 20},
            {nft: NFT_DATABASE[3], chance: 10},
            {nft: NFT_DATABASE[4], chance: 4},
            {nft: NFT_DATABASE[12], chance: 0.8},
            {nft: NFT_DATABASE[13], chance: 0.2}
        ]
    },
    basic: {
        name: "📦 Basic Case",
        icon: "📦",
        price: 50,
        type: "basic",
        items: [
            {nft: NFT_DATABASE[1], chance: 30},
            {nft: NFT_DATABASE[2], chance: 25},
            {nft: NFT_DATABASE[3], chance: 20},
            {nft: NFT_DATABASE[7], chance: 12},
            {nft: NFT_DATABASE[8], chance: 8},
            {nft: NFT_DATABASE[9], chance: 4},
            {nft: NFT_DATABASE[10], chance: 1}
        ]
    },
    premium: {
        name: "💎 Premium Case",
        icon: "💎",
        price: 150,
        type: "premium",
        items: [
            {nft: NFT_DATABASE[2], chance: 28},
            {nft: NFT_DATABASE[3], chance: 24},
            {nft: NFT_DATABASE[4], chance: 18},
            {nft: NFT_DATABASE[10], chance: 15},
            {nft: NFT_DATABASE[11], chance: 8},
            {nft: NFT_DATABASE[12], chance: 5},
            {nft: NFT_DATABASE[13], chance: 1.5},
            {nft: NFT_DATABASE[14], chance: 0.5}
        ]
    }
};

// ДОСТИЖЕНИЯ
const ACHIEVEMENTS = [
    {id: 'first_case', name: 'Первый кейс', desc: 'Открой свой первый кейс', icon: '🎁', reward: 10},
    {id: 'cases_5', name: 'Новичок', desc: 'Открой 5 кейсов', icon: '📦', reward: 25},
    {id: 'cases_10', name: 'Коллекционер', desc: 'Открой 10 кейсов', icon: '🎰', reward: 50},
    {id: 'legendary_drop', name: 'Легендарная удача', desc: 'Получи легендарное NFT', icon: '⭐', reward: 200},
    {id: 'ref_5', name: 'Социальный', desc: 'Пригласи 5 друзей', icon: '👥', reward: 150}
];

let currentFilter = 'all';
let currentCase = null;
let userLevel = 1;
let userXP = 0;
let isAdmin = false;
let inventory = [];
let openedCases = 0;
let achievements = [];
let globalHistory = [];

function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            vx: Math.random() * 0.5 - 0.25,
            vy: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function hideLoader() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 2000);
}

function generateFakeHistory() {
    const fakeNames = ['Алексей', 'Мария', 'Дмитрий', 'Анна', 'Иван', 'Елена', 'Сергей', 'Ольга'];

    for (let i = 0; i < 15; i++) {
        const randomCase = Object.values(CASES_DATA)[Math.floor(Math.random() * Object.keys(CASES_DATA).length)];
        const randomItem = getRandomItemByChance(randomCase.items);
        const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
        const minutesAgo = Math.floor(Math.random() * 45) + 1;

        globalHistory.push({
            nft: randomItem.nft,
            username: randomName,
            time: `${minutesAgo} мин назад`
        });
    }

    renderGlobalHistory();
}

function renderGlobalHistory() {
    const slider = document.getElementById('nftScroll');
    if (!slider) return;

    if (globalHistory.length === 0) {
        slider.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 40px 20px; opacity: 0.5;">
                <div style="font-size: 48px; margin-bottom: 15px;">😴</div>
                <div style="font-size: 16px; font-weight: 600;">В данный момент никто не крутил кейсы</div>
                <div style="font-size: 14px; color: #6b7280; margin-top: 8px;">Будь первым!</div>
            </div>
        `;
        return;
    }

    const doubled = [...globalHistory, ...globalHistory, ...globalHistory];

    slider.innerHTML = doubled.map(item => {
        const nft = item.nft;
        const color = nft.isCurrency ? '#fbbf24' : getRarityColor(nft.rarity);
        const displayIcon = nft.isCurrency ? nft.icon : '';

        return `
            <div class="nft-card" style="border: 2px solid ${color}; min-width: 160px; height: 200px;">
                <div class="nft-image" style="border: 2px solid ${color}; width: 90px; height: 90px; margin: 0 auto;">
                    ${nft.isCurrency 
                        ? `<div style="font-size: 45px;">${displayIcon}</div>`
                        : `<img src="${nft.image}" alt="${nft.name}" onerror="this.parentElement.innerHTML='<div style=font-size:45px>💎</div>'">`
                    }
                </div>
                <div class="nft-value" style="color: ${color}; font-size: 13px; margin-top: 10px;">
                    ${nft.isCurrency 
                        ? nft.name 
                        : `${nft.ton} TON`
                    }
                </div>
                <div style="font-size: 11px; color: #fff; margin-top: 8px; text-align: center; font-weight: 600;">
                    👤 ${item.username}
                </div>
                <div style="font-size: 10px; color: #6b7280; text-align: center; margin-top: 4px;">
                    ${item.time}
                </div>
            </div>
        `;
    }).join('');
}

function addToGlobalHistory(nft) {
    const user = tg.initDataUnsafe?.user;
    const username = user?.first_name || 'Игрок';

    globalHistory.unshift({
        nft: nft,
        username: username,
        time: 'только что'
    });

    if (globalHistory.length > 25) {
        globalHistory = globalHistory.slice(0, 25);
    }

    renderGlobalHistory();
}

function init() {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        document.getElementById('userName').textContent = user.first_name || 'Player';

        if (user.id === ADMIN_ID) {
            isAdmin = true;
            document.getElementById('adminBadge').classList.remove('hidden');
        }

        const avatarContainer = document.getElementById('avatarContainer');
        if (user.photo_url) {
            avatarContainer.innerHTML = `<img src="${user.photo_url}" alt="Avatar">`;
        } else if (user.username) {
            avatarContainer.textContent = user.username.charAt(0).toUpperCase();
        }
    }

    let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
    document.getElementById('balance').textContent = gameStars;

    loadUserProgress();
    loadInventory();
    loadAchievements();
    generateFakeHistory();
    generateCases();
    updateFreeTimer();
    loadRefLink();
    fetchOnlineCount();
    loadHistory();
    initParticles();
    hideLoader();

    setInterval(() => fetchOnlineCount(), 15000);
    setInterval(updateFreeTimer, 60000);

    setInterval(() => {
        const randomCase = Object.values(CASES_DATA)[Math.floor(Math.random() * Object.keys(CASES_DATA).length)];
        const randomItem = getRandomItemByChance(randomCase.items);
        const fakeNames = ['Алексей', 'Мария', 'Дмитрий', 'Анна', 'Иван'];
        const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];

        globalHistory.unshift({
            nft: randomItem.nft,
            username: randomName,
            time: 'только что'
        });

        if (globalHistory.length > 25) {
            globalHistory = globalHistory.slice(0, 25);
        }

        renderGlobalHistory();
    }, Math.random() * 20000 + 20000);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            generateCases();
        });
    });
}

function loadUserProgress() {
    userLevel = parseInt(localStorage.getItem('userLevel') || '1');
    userXP = parseInt(localStorage.getItem('userXP') || '0');
    openedCases = parseInt(localStorage.getItem('openedCases') || '0');
    updateLevelDisplay();
}

function updateLevelDisplay() {
    const xpNeeded = userLevel * 100;
    document.getElementById('userLevel').textContent = `Level ${userLevel}`;
    document.getElementById('userXP').textContent = `${userXP}/${xpNeeded} XP`;
}

function addXP(amount) {
    userXP += amount;
    const xpNeeded = userLevel * 100;

    if (userXP >= xpNeeded) {
        userXP -= xpNeeded;
        userLevel++;

        let reward = userLevel * 10;
        let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
        gameStars += reward;
        localStorage.setItem('gameStars', gameStars);
        document.getElementById('balance').textContent = gameStars;

        tg.showPopup({
            title: '🎉 LEVEL UP!',
            message: `Поздравляем! Вы достигли ${userLevel} уровня!\n\n+${reward} ⭐ звёзд в награду!`,
            buttons: [{type: 'ok'}]
        });
    }

    localStorage.setItem('userLevel', userLevel);
    localStorage.setItem('userXP', userXP);
    updateLevelDisplay();
}

function openAdminPanel() {
    if (!isAdmin) return;

    document.getElementById('adminPanel').classList.add('active');
    document.body.style.overflow = 'hidden';
    loadAdminStats();
    loadAllUsers();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.remove('active');
    document.body.style.overflow = '';
}

function loadAdminStats() {
    const stats = {
        totalUsers: 1,
        onlineUsers: 15 + Math.floor(Math.random() * 10),
        totalCases: parseInt(localStorage.getItem('openedCases') || '0'),
        totalStars: parseInt(localStorage.getItem('gameStars') || '0'),
        totalNFTs: JSON.parse(localStorage.getItem('inventory') || '[]').length,
        achievements: JSON.parse(localStorage.getItem('achievements') || '[]').length
    };

    document.getElementById('adminStats').innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <div class="admin-stat-card">
                <div class="admin-stat-icon">👥</div>
                <div class="admin-stat-value">${stats.totalUsers}</div>
                <div class="admin-stat-label">Пользователей</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon">🟢</div>
                <div class="admin-stat-value">${stats.onlineUsers}</div>
                <div class="admin-stat-label">Онлайн</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon">📦</div>
                <div class="admin-stat-value">${stats.totalCases}</div>
                <div class="admin-stat-label">Открыто кейсов</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon">⭐</div>
                <div class="admin-stat-value">${stats.totalStars}</div>
                <div class="admin-stat-label">Звёзд у вас</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon">💎</div>
                <div class="admin-stat-value">${stats.totalNFTs}</div>
                <div class="admin-stat-label">NFT собрано</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon">🏆</div>
                <div class="admin-stat-value">${stats.achievements}</div>
                <div class="admin-stat-label">Достижений</div>
            </div>
        </div>
    `;
}

function loadAllUsers() {
    const currentUser = tg.initDataUnsafe?.user;
    const users = [{
        id: currentUser?.id || 123456,
        username: currentUser?.username || 'admin',
        first_name: currentUser?.first_name || 'Admin',
        stars: parseInt(localStorage.getItem('gameStars') || '0'),
        level: parseInt(localStorage.getItem('userLevel') || '1'),
        cases: parseInt(localStorage.getItem('openedCases') || '0'),
        nfts: JSON.parse(localStorage.getItem('inventory') || '[]').length,
        isAdmin: true
    }];

    document.getElementById('adminUsersList').innerHTML = users.map(user => `
        <div class="admin-user-row">
            <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700;">
                    ${user.first_name.charAt(0).toUpperCase()}
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 16px; font-weight: 700;">
                        ${user.first_name}
                        ${user.isAdmin ? '<span style="background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 3px 8px; border-radius: 8px; font-size: 11px; margin-left: 8px; color: #000;">ADMIN</span>' : ''}
                    </div>
                    <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">
                        @${user.username} • ID: ${user.id}
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 8px; font-size: 12px; color: #6b7280;">
                        <span>⭐ ${user.stars}</span>
                        <span>📊 Lvl ${user.level}</span>
                        <span>📦 ${user.cases}</span>
                        <span>💎 ${user.nfts}</span>
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="admin-btn-small admin-btn-success" onclick="manageUserBalance(${user.id}, '${user.username}', ${user.stars})">
                    💰
                </button>
                <button class="admin-btn-small admin-btn-danger" onclick="resetUserProgress(${user.id}, '${user.username}')">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

function manageUserBalance(userId, username, currentStars) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="font-size: 20px; font-weight: 800;">💰 Управление балансом</h3>
                <div style="font-size: 28px; cursor: pointer; color: #6b7280;" onclick="this.closest('.admin-modal').remove()">✕</div>
            </div>

            <div style="background: rgba(30, 30, 40, 0.5); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Пользователь</div>
                <div style="font-size: 18px; font-weight: 700;">@${username}</div>
                <div style="font-size: 14px; color: #6b7280; margin-top: 8px;">Текущий баланс: <span style="color: #10b981; font-weight: 700;">${currentStars} ⭐</span></div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 10px;">Количество звёзд</label>
                <input type="number" id="starsAmount" placeholder="Введите количество" style="width: 100%; padding: 15px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 16px;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button class="admin-btn admin-btn-success" onclick="giveStars(${userId}, '${username}', ${currentStars})">
                    ➕ Выдать
                </button>
                <button class="admin-btn admin-btn-danger" onclick="takeStars(${userId}, '${username}', ${currentStars})">
                    ➖ Забрать
                </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 15px;">
                <button class="admin-btn-quick" onclick="document.getElementById('starsAmount').value=100">+100</button>
                <button class="admin-btn-quick" onclick="document.getElementById('starsAmount').value=500">+500</button>
                <button class="admin-btn-quick" onclick="document.getElementById('starsAmount').value=1000">+1000</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function giveStars(userId, username, currentStars) {
    const amount = parseInt(document.getElementById('starsAmount').value);

    if (!amount || amount <= 0) {
        tg.showAlert('Введите корректное количество!');
        return;
    }

    let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
    gameStars += amount;
    localStorage.setItem('gameStars', gameStars);
    document.getElementById('balance').textContent = gameStars;

    tg.showPopup({
        title: '✅ Успешно!',
        message: `Выдано ${amount} ⭐ звёзд пользователю @${username}\n\nНовый баланс: ${gameStars} ⭐`,
        buttons: [{type: 'ok'}]
    });

    document.querySelector('.admin-modal').remove();
    loadAllUsers();
}

function takeStars(userId, username, currentStars) {
    const amount = parseInt(document.getElementById('starsAmount').value);

    if (!amount || amount <= 0) {
        tg.showAlert('Введите корректное количество!');
        return;
    }

    let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
    gameStars = Math.max(0, gameStars - amount);
    localStorage.setItem('gameStars', gameStars);
    document.getElementById('balance').textContent = gameStars;

    tg.showPopup({
        title: '✅ Успешно!',
        message: `Забрано ${amount} ⭐ звёзд у пользователя @${username}\n\nНовый баланс: ${gameStars} ⭐`,
        buttons: [{type: 'ok'}]
    });

    document.querySelector('.admin-modal').remove();
    loadAllUsers();
}

function resetUserProgress(userId, username) {
    tg.showPopup({
        title: '⚠️ ВНИМАНИЕ!',
        message: `Вы уверены что хотите сбросить ВСЕ данные пользователя @${username}?\n\n• Баланс звёзд\n• Уровень и XP\n• Инвентарь\n• Достижения\n• Историю\n\nЭто действие НЕОБРАТИМО!`,
        buttons: [
            {id: 'confirm', type: 'destructive', text: 'Да, сбросить всё'},
            {type: 'cancel'}
        ]
    }, (btnId) => {
        if (btnId === 'confirm') {
            localStorage.setItem('gameStars', '0');
            localStorage.setItem('userLevel', '1');
            localStorage.setItem('userXP', '0');
            localStorage.setItem('openedCases', '0');
            localStorage.setItem('inventory', '[]');
            localStorage.setItem('achievements', '[]');
            localStorage.setItem('caseHistory', '[]');

            document.getElementById('balance').textContent = '0';
            userLevel = 1;
            userXP = 0;
            updateLevelDisplay();

            tg.showAlert('Прогресс полностью сброшен!');
            loadAllUsers();
        }
    });
}

function sendGlobalNotification() {
    tg.showPopup({
        title: '📢 Уведомление',
        message: 'Функция отправки уведомлений работает!\n\n(Для реальной отправки нужен backend)',
        buttons: [{type: 'ok'}]
    });
}

function createPromoCode() {
    tg.showPopup({
        title: '🎟️ Промокод',
        message: 'Доступные промокоды:\n\nWELCOME - 100⭐\nNEWYEAR2026 - 200⭐\nLUCKY - 150⭐',
        buttons: [{type: 'ok'}]
    });
}

function exportUserData() {
    const data = {
        stars: localStorage.getItem('gameStars'),
        level: localStorage.getItem('userLevel'),
        xp: localStorage.getItem('userXP'),
        cases: localStorage.getItem('openedCases'),
        inventory: localStorage.getItem('inventory'),
        achievements: localStorage.getItem('achievements')
    };

    console.log('Exported data:', data);
    tg.showAlert('Данные экспортированы в консоль!');
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`adminTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');

    if (tab === 'users') loadAllUsers();
    if (tab === 'stats') loadAdminStats();
}

function fetchOnlineCount() {
    const online = 150 + Math.floor(Math.random() * 50) - 25;
    document.getElementById('onlineCount').textContent = `${online} Online`;
}

function generateCases() {
    const container = document.getElementById('casesContainer');
    if (!container) return;

    const cases = Object.entries(CASES_DATA).filter(([key, data]) => {
        if (currentFilter === 'all') return true;
        return data.type === currentFilter;
    });

    container.innerHTML = cases.map(([key, data]) => {
        const isFree = data.price === 0;
        return `
            <div class="case-big" onclick="showCaseInfo('${key}')">
                ${isFree ? '<div class="case-badge">FREE</div>' : ''}
                <div class="case-image-section">
                    <div class="case-main-image">${data.icon}</div>
                </div>
                <div class="case-info-section">
                    <div class="case-title">${data.name}</div>
                    <div class="case-footer">
                        ${isFree ? `
                            <div>
                                <div class="case-status" id="freeStatus">ДОСТУПЕН</div>
                                <div class="case-timer" id="freeTimer"></div>
                            </div>
                        ` : `
                            <div class="case-price">⭐ ${data.price}</div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updateFreeTimer();
}

function showCaseInfo(caseKey) {
    currentCase = caseKey;
    const data = CASES_DATA[caseKey];

    if (!data) {
        tg.showAlert('Ошибка: кейс не найден');
        return;
    }

    document.getElementById('modalCaseTitle').textContent = data.name;
    document.getElementById('modalCaseIcon').textContent = data.icon;
    document.getElementById('modalCaseName').textContent = data.name.toUpperCase();
    document.getElementById('modalCasePrice').textContent = data.price === 0 ? 'БЕСПЛАТНО' : `⭐ ${data.price}`;
    document.getElementById('modalOpenBtn').textContent = data.price === 0 ? 'Открыть бесплатно' : `Открыть за ⭐ ${data.price}`;

    const itemsList = document.getElementById('modalItemsList');
    itemsList.innerHTML = data.items.map(item => {
        const nft = item.nft;

        if (!nft) return '';

        if (nft.isCurrency) {
            return `
                <div class="item-row">
                    <div class="item-icon" style="border-color: #fbbf24;">
                        <div style="font-size:40px;">${nft.icon}</div>
                    </div>
                    <div class="item-info">
                        <div class="item-name">${nft.name}</div>
                        <div class="item-price-row">
                            <span class="item-price-stars">Валюта</span>
                        </div>
                    </div>
                    <div class="item-chance">${item.chance}%</div>
                </div>
            `;
        } else {
            return `
                <div class="item-row">
                    <div class="item-icon" style="border-color: ${getRarityColor(nft.rarity)};">
                        <img src="${nft.image}" alt="${nft.name}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" onerror="this.style.display='none'">
                    </div>
                    <div class="item-info">
                        <div class="item-name">${nft.name}</div>
                        <div class="item-rarity" style="color: ${getRarityColor(nft.rarity)};">${nft.rarity.toUpperCase()}</div>
                        <div class="item-price-row">
                            <span class="item-price-stars">⭐ ${nft.stars}</span>
                            <span class="item-price-ton">💎 ${nft.ton} TON</span>
                        </div>
                    </div>
                    <div class="item-chance">${item.chance}%</div>
                </div>
            `;
        }
    }).join('');

    document.getElementById('modalInfo').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function getRarityColor(rarity) {
    const colors = {
        common: '#9e9e9e',
        rare: '#3b82f6',
        epic: '#a855f7',
        legendary: '#fbbf24',
        mythic: '#ef4444',
        special: '#10b981'
    };
    return colors[rarity] || '#fff';
}

function closeInfoModal() {
    document.getElementById('modalInfo').classList.remove('active');
    document.body.style.overflow = '';
}

function openCaseFromModal() {
    if (!currentCase) return;

    const data = CASES_DATA[currentCase];
    let gameStars = parseInt(localStorage.getItem('gameStars') || '0');

    if (data.price === 0) {
        // ПРОВЕРКА КД
        if (!isAdmin) {
            const lastOpen = localStorage.getItem('lastFreeCase');
            if (lastOpen) {
                const timePassed = new Date() - new Date(lastOpen);
                const timeLeft = 24 * 60 * 60 * 1000 - timePassed;

                if (timeLeft > 0) {
                    const h = Math.floor(timeLeft / 3600000);
                    const m = Math.floor((timeLeft % 3600000) / 60000);
                    tg.showAlert(`Бесплатный кейс можно открыть раз в 24 часа!\n\nОсталось: ${h}ч ${m}м`);
                    return;
                }
            }
        }
        localStorage.setItem('lastFreeCase', new Date().toISOString());
        closeInfoModal();
        setTimeout(() => startRoulette(currentCase), 300);
    } else {
        // ПРОВЕРКА БАЛАНСА
        if (gameStars < data.price && !isAdmin) {
            tg.showAlert(`Недостаточно звёзд!\n\nУ вас: ${gameStars} ⭐\nНужно: ${data.price} ⭐\n\nОткройте бесплатный кейс или пригласите друзей!`);
            return;
        }

        if (!isAdmin) {
            gameStars -= data.price;
            localStorage.setItem('gameStars', gameStars);
            document.getElementById('balance').textContent = gameStars;
        }

        closeInfoModal();
        setTimeout(() => startRoulette(currentCase), 300);
    }
}

function startRoulette(caseKey) {
    if (!CASES_DATA[caseKey]) {
        tg.showAlert('Ошибка кейса');
        return;
    }

    const data = CASES_DATA[caseKey];
    const modal = document.getElementById('modalRoulette');
    const track = document.getElementById('rouletteTrack');
    const resultBox = document.getElementById('resultBox');
    const title = document.getElementById('rouletteTitle');

    if (!modal || !track) return;

    modal.classList.add('active');
    resultBox.classList.remove('active');
    title.textContent = '🎲 OPENING...';
    document.body.style.overflow = 'hidden';

    track.innerHTML = '';
    track.style.transform = 'translateX(0)';
    track.style.transition = 'none';

    const items = [];
    for (let i = 0; i < 51; i++) {
        const randomItem = data.items[Math.floor(Math.random() * data.items.length)];
        items.push(randomItem);
    }

    const winItem = getRandomItemByChance(data.items);
    const winIndex = 25;
    items[winIndex] = winItem;

    items.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'roulette-item';

        if (item.nft.isCurrency) {
            div.innerHTML = `<div style="font-size:70px;">${item.nft.icon}</div>`;
        } else {
            div.innerHTML = `<img src="${item.nft.image}" alt="${item.nft.name}" onerror="this.style.display='none'">`;
        }

        track.appendChild(div);
    });

    setTimeout(() => {
        const wrapper = document.querySelector('.roulette-wrapper');
        if (!wrapper) return;

        const wrapperWidth = wrapper.offsetWidth;
        const itemWidth = 130;
        const gap = 20;
        const itemFullWidth = itemWidth + gap;

        const winItemLeftEdge = winIndex * itemFullWidth;
        const winItemCenter = winItemLeftEdge + (itemWidth / 2);
        const containerCenter = wrapperWidth / 2;
        const offset = containerCenter - winItemCenter;

        track.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        track.style.transform = `translateX(${offset}px)`;
        title.textContent = '🎰 SPINNING...';
    }, 100);

    setTimeout(() => {
        showResult(winItem.nft);

        openedCases++;
        localStorage.setItem('openedCases', openedCases);
        checkAchievements();
    }, 4500);
}

function getRandomItemByChance(items) {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (let item of items) {
        cumulative += item.chance;
        if (rand <= cumulative) return item;
    }
    return items[items.length - 1];
}

function showResult(nft) {
    const resultBox = document.getElementById('resultBox');
    resultBox.classList.add('active');

    if (nft.isCurrency) {
        if (nft.name.includes('звезд')) {
            let currentBalance = parseInt(localStorage.getItem('gameStars') || '0');
            currentBalance += nft.amount;
            localStorage.setItem('gameStars', currentBalance);
            document.getElementById('balance').textContent = currentBalance;

            document.getElementById('resultIcon').innerHTML = `<div style="font-size:100px;">${nft.icon}</div>`;
            document.getElementById('resultName').textContent = `+${nft.amount} звёзд`;
            document.getElementById('resultRarity').textContent = 'ВАЛЮТА';
            document.getElementById('resultStars').innerHTML = `Баланс: ⭐ ${currentBalance}`;
            document.getElementById('resultTon').innerHTML = '';

            addXP(nft.amount);
        } else {
            document.getElementById('resultIcon').innerHTML = `<div style="font-size:100px;">${nft.icon}</div>`;
            document.getElementById('resultName').textContent = 'Подарок';
            document.getElementById('resultRarity').textContent = 'ОСОБОЕ';
            document.getElementById('resultStars').innerHTML = `🎁 Сюрприз!`;
            document.getElementById('resultTon').innerHTML = '';

            addXP(10);
        }
        resultBox.style.borderColor = '#fbbf24';
        document.getElementById('resultRarity').style.background = '#fbbf24';
    } else {
        document.getElementById('resultIcon').innerHTML = `<img src="${nft.image}" alt="${nft.name}" style="width:140px; height:140px; object-fit:cover; border-radius:12px;" onerror="this.style.display='none'">`;
        document.getElementById('resultName').textContent = nft.name;
        document.getElementById('resultRarity').textContent = nft.rarity.toUpperCase();

        const color = getRarityColor(nft.rarity);
        resultBox.style.borderColor = color;
        document.getElementById('resultRarity').style.background = color;

        document.getElementById('resultStars').innerHTML = `⭐ ${nft.stars}`;
        document.getElementById('resultTon').innerHTML = `💎 ${nft.ton} TON`;

        addXP(Math.floor(nft.stars / 5));
        addToInventory(nft);
        saveToHistory(nft);

        if (nft.rarity === 'legendary' || nft.rarity === 'mythic') {
            createConfetti();
        }
    }

    addToGlobalHistory(nft);
}

function createConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        const colors = ['#10b981', '#fbbf24', '#ef4444', '#3b82f6', '#a855f7'];
        confetti.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            z-index: 9999;
            pointer-events: none;
            animation: confettiFall ${Math.random() * 2 + 1}s linear forwards;
            --x: ${Math.random()};
        `;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

function closeRouletteModal() {
    document.getElementById('modalRoulette').classList.remove('active');
    document.body.style.overflow = '';
}

function addToInventory(nft) {
    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    inventory.unshift({...nft, time: new Date().toISOString()});
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function loadInventory() {
    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    renderInventory();
}

function renderInventory() {
    const container = document.getElementById('inventoryContainer');
    if (!container) return;

    if (inventory.length === 0) {
        container.innerHTML = `
            <div style="padding: 60px 20px; text-align: center;">
                <div style="font-size: 80px; margin-bottom: 20px; opacity: 0.3;">📦</div>
                <h3 style="font-size: 22px; margin-bottom: 10px;">Инвентарь пуст</h3>
                <p style="color: #6b7280;">Откройте кейсы, чтобы получить NFT</p>
            </div>
        `;
        return;
    }

    const rarityOrder = {mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1};
    const sorted = [...inventory].sort((a, b) => (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0));

    container.innerHTML = `
        <div style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="font-size: 18px;">📦 Мои NFT (${inventory.length})</h3>
                <div style="font-size: 14px; color: #6b7280;">
                    Общая ценность: <span style="color: #10b981; font-weight: 700;">${inventory.reduce((sum, nft) => sum + nft.ton, 0).toFixed(2)} TON</span>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px;">
                ${sorted.map((nft, idx) => `
                    <div style="background: rgba(30,30,40,0.5); border-radius: 12px; padding: 12px; border: 2px solid ${getRarityColor(nft.rarity)};">
                        <div style="width: 100%; height: 120px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; position: relative;">
                            <img src="${nft.image}" alt="${nft.name}" style="width: 100%; height: 100%; object-fit: cover;">
                            <div style="position: absolute; top: 5px; right: 5px; background: ${getRarityColor(nft.rarity)}; padding: 3px 8px; border-radius: 6px; font-size: 9px; font-weight: 700; text-transform: uppercase;">
                                ${nft.rarity}
                            </div>
                        </div>
                        <div style="font-size: 13px; font-weight: 700; margin-bottom: 4px;">${nft.name}</div>
                        <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">💎 ${nft.ton} TON • ⭐ ${nft.stars}</div>
                        <button onclick="sellNFT(${inventory.indexOf(nft)})" style="width: 100%; padding: 8px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 8px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer;">
                            Продать за ${Math.floor(nft.stars * 0.7)} ⭐
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function sellNFT(idx) {
    const nft = inventory[idx];
    if (!nft) return;

    const sellPrice = Math.floor(nft.stars * 0.7);

    tg.showPopup({
        title: 'Продать NFT?',
        message: `${nft.name}\n\nВы получите: ${sellPrice} ⭐`,
        buttons: [
            {id: 'sell', type: 'default', text: `Продать за ${sellPrice} ⭐`},
            {type: 'cancel'}
        ]
    }, (btnId) => {
        if (btnId === 'sell') {
            let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
            gameStars += sellPrice;
            localStorage.setItem('gameStars', gameStars);
            document.getElementById('balance').textContent = gameStars;

            inventory.splice(idx, 1);
            localStorage.setItem('inventory', JSON.stringify(inventory));
            renderInventory();

            tg.showAlert(`Продано за ${sellPrice} ⭐!`);
        }
    });
}

function saveToHistory(nft) {
    let history = JSON.parse(localStorage.getItem('caseHistory') || '[]');
    history.unshift({...nft, time: new Date().toLocaleString('ru-RU')});
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem('caseHistory', JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('caseHistory') || '[]');
    renderHistory(history);
}

function renderHistory(history) {
    const container = document.getElementById('historyContainer');
    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = `
            <div style="padding: 60px 20px; text-align: center;">
                <div style="font-size: 80px; margin-bottom: 20px; opacity: 0.3;">📜</div>
                <h3 style="font-size: 22px; margin-bottom: 10px;">История пуста</h3>
                <p style="color: #6b7280;">Откройте кейс, чтобы увидеть историю</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div style="padding: 20px;">
            <h3 style="font-size: 18px; margin-bottom: 15px;">📜 История открытий (${history.length})</h3>
            ${history.map(item => `
                <div style="background: rgba(30,30,40,0.5); border-radius: 12px; padding: 15px; margin-bottom: 12px; display: flex; align-items: center; gap: 15px;">
                    <div style="width: 60px; height: 60px; border-radius: 10px; overflow: hidden; border: 2px solid ${getRarityColor(item.rarity)}; flex-shrink: 0;">
                        <img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 16px; font-weight: 700;">${item.name}</div>
                        <div style="font-size: 12px; color: ${getRarityColor(item.rarity)}; margin-top: 4px;">${item.rarity?.toUpperCase() || 'COMMON'}</div>
                        <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">${item.time}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 14px; color: #ffd700;">⭐ ${item.stars}</div>
                        <div style="font-size: 12px; color: #0088cc; margin-top: 4px;">💎 ${item.ton} TON</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function loadAchievements() {
    achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    renderAchievements();
}

function renderAchievements() {
    const container = document.getElementById('achievementsContainer');
    if (!container) return;

    const unlockedCount = achievements.length;
    const totalCount = ACHIEVEMENTS.length;
    const progress = Math.round((unlockedCount / totalCount) * 100);

    container.innerHTML = `
        <div style="padding: 20px;">
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="font-size: 18px;">🏆 Достижения</h3>
                    <div style="font-size: 14px; font-weight: 700; color: #10b981;">${unlockedCount}/${totalCount}</div>
                </div>
                <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, #10b981, #059669); transition: width 0.3s;"></div>
                </div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 8px; text-align: center;">${progress}% выполнено</div>
            </div>
            ${ACHIEVEMENTS.map(ach => {
                const unlocked = achievements.includes(ach.id);
                return `
                    <div style="background: rgba(30,30,40,0.5); border-radius: 12px; padding: 15px; margin-bottom: 12px; opacity: ${unlocked ? '1' : '0.5'}; border: 2px solid ${unlocked ? '#10b981' : 'rgba(255,255,255,0.1)'};">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="font-size: 40px; filter: grayscale(${unlocked ? 0 : 1});">${ach.icon}</div>
                            <div style="flex: 1;">
                                <div style="font-size: 16px; font-weight: 700;">${ach.name} ${unlocked ? '✅' : ''}</div>
                                <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${ach.desc}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 14px; color: ${unlocked ? '#10b981' : '#ffd700'};">+${ach.reward} ⭐</div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function checkAchievements() {
    if (openedCases >= 1 && !achievements.includes('first_case')) {
        unlockAchievement('first_case');
    }
    if (openedCases >= 5 && !achievements.includes('cases_5')) {
        unlockAchievement('cases_5');
    }
    if (openedCases >= 10 && !achievements.includes('cases_10')) {
        unlockAchievement('cases_10');
    }
}

function unlockAchievement(achId) {
    const ach = ACHIEVEMENTS.find(a => a.id === achId);
    if (!ach) return;

    achievements.push(achId);
    localStorage.setItem('achievements', JSON.stringify(achievements));

    let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
    gameStars += ach.reward;
    localStorage.setItem('gameStars', gameStars);
    document.getElementById('balance').textContent = gameStars;

    tg.showPopup({
        title: '🏆 Достижение получено!',
        message: `${ach.icon} ${ach.name}\n\n${ach.desc}\n\n+${ach.reward} ⭐ звёзд!`,
        buttons: [{type: 'ok'}]
    });

    renderAchievements();
}

function updateFreeTimer() {
    const statusEl = document.getElementById('freeStatus');
    const timerEl = document.getElementById('freeTimer');
    if (!statusEl || !timerEl) return;

    const lastOpen = localStorage.getItem('lastFreeCase');
    if (!lastOpen) {
        statusEl.textContent = 'ДОСТУПЕН';
        statusEl.style.color = '#10b981';
        timerEl.textContent = '';
        return;
    }

    const diff = 24 * 60 * 60 * 1000 - (new Date() - new Date(lastOpen));
    if (diff <= 0) {
        statusEl.textContent = 'ДОСТУПЕН';
        statusEl.style.color = '#10b981';
        timerEl.textContent = '';
    } else {
        statusEl.textContent = 'НЕДОСТУПЕН';
        statusEl.style.color = '#ef4444';
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        timerEl.textContent = `Через ${h}ч ${m}м`;
    }
}

function switchTab(tab) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const tabs = {
        cases: 'tabCases',
        inventory: 'tabInventory',
        profile: 'tabProfile',
        history: 'tabHistory',
        achievements: 'tabAchievements'
    };

    document.getElementById(tabs[tab]).classList.add('active');

    if (tab === 'inventory') renderInventory();
    if (tab === 'history') loadHistory();
    if (tab === 'achievements') renderAchievements();
}

function loadRefLink() {
    const userId = tg.initDataUnsafe?.user?.id || '123456789';
    const refCount = parseInt(localStorage.getItem('refCount') || '0');

    document.getElementById('refLink').textContent = `https://t.me/gsdfsdfdsfbot?start=ref_${userId}`;
    document.getElementById('refCount').textContent = refCount;
}

function copyRefLink() {
    const link = document.getElementById('refLink').textContent;
    navigator.clipboard.writeText(link);
    tg.showPopup({title: 'Успешно!', message: 'Ссылка скопирована', buttons: [{type: 'ok'}]});
}

function activatePromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    if (!code) {
        tg.showAlert('Введите промокод');
        return;
    }

    const promoCodes = {
        'WELCOME': 100,
        'NEWYEAR2026': 200,
        'LUCKY': 150
    };

    const usedPromos = JSON.parse(localStorage.getItem('usedPromos') || '[]');

    if (usedPromos.includes(code)) {
        tg.showAlert('Промокод уже использован!');
        return;
    }

    if (promoCodes[code]) {
        const reward = promoCodes[code];
        let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
        gameStars += reward;
        localStorage.setItem('gameStars', gameStars);
        document.getElementById('balance').textContent = gameStars;

        usedPromos.push(code);
        localStorage.setItem('usedPromos', JSON.stringify(usedPromos));

        tg.showPopup({
            title: '🎉 Промокод активирован!',
            message: `Вы получили ${reward} ⭐ звёзд!`,
            buttons: [{type: 'ok'}]
        });

        document.getElementById('promoInput').value = '';
    } else {
        tg.showAlert('Неверный промокод!');
    }
}

init();
