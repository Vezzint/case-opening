let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();
tg.setHeaderColor('#0a0a0f');
tg.setBackgroundColor('#0a0a0f');

const ADMIN_ID = 6584350034;

// БАЗА NFT + ВАЛЮТА
const NFT_DATABASE = [
    // ВАЛЮТА (id: 0-4)
    {id: 0, name: "Подарок", stars: 0, ton: 0, image: "nft/Gift.jpg", isCurrency: true, amount: 1, rarity: "special"},
    {id: 1, name: "3 звезды", stars: 3, ton: 0, image: "nft/Stars.jpg", isCurrency: true, amount: 3, rarity: "common"},
    {id: 2, name: "5 звёзд", stars: 5, ton: 0, image: "nft/Stars.jpg", isCurrency: true, amount: 5, rarity: "common"},
    {id: 3, name: "15 звёзд", stars: 15, ton: 0, image: "nft/Stars.jpg", isCurrency: true, amount: 15, rarity: "rare"},
    {id: 4, name: "50 звёзд", stars: 50, ton: 0, image: "nft/Stars.jpg", isCurrency: true, amount: 50, rarity: "epic"},
    
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

// КЕЙСЫ С РЕАЛИСТИЧНЫМИ ШАНСАМИ
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
    },
    elite: {
        name: "👑 Elite Case",
        icon: "👑",
        price: 300,
        type: "elite",
        items: [
            {nft: NFT_DATABASE[3], chance: 30},
            {nft: NFT_DATABASE[4], chance: 25},
            {nft: NFT_DATABASE[10], chance: 20},
            {nft: NFT_DATABASE[11], chance: 12},
            {nft: NFT_DATABASE[12], chance: 8},
            {nft: NFT_DATABASE[13], chance: 4},
            {nft: NFT_DATABASE[14], chance: 1}
        ]
    },
    mega: {
        name: "🌟 Mega Case",
        icon: "🌟",
        price: 500,
        type: "elite",
        items: [
            {nft: NFT_DATABASE[4], chance: 35},
            {nft: NFT_DATABASE[10], chance: 25},
            {nft: NFT_DATABASE[11], chance: 18},
            {nft: NFT_DATABASE[12], chance: 12},
            {nft: NFT_DATABASE[13], chance: 8},
            {nft: NFT_DATABASE[14], chance: 2}
        ]
    }
};

// ДОСТИЖЕНИЯ
const ACHIEVEMENTS = [
    {id: 'first_case', name: 'Первый кейс', desc: 'Открой свой первый кейс', icon: '🎁', reward: 10},
    {id: 'cases_5', name: 'Новичок', desc: 'Открой 5 кейсов', icon: '📦', reward: 25},
    {id: 'cases_10', name: 'Коллекционер', desc: 'Открой 10 кейсов', icon: '🎰', reward: 50},
    {id: 'cases_25', name: 'Азартный', desc: 'Открой 25 кейсов', icon: '🎲', reward: 100},
    {id: 'cases_50', name: 'Фанат кейсов', desc: 'Открой 50 кейсов', icon: '🏆', reward: 200},
    {id: 'cases_100', name: 'Легенда', desc: 'Открой 100 кейсов', icon: '👑', reward: 500},
    {id: 'rare_drop', name: 'Везунчик', desc: 'Получи редкое NFT', icon: '💎', reward: 50},
    {id: 'epic_drop', name: 'Эпический дроп', desc: 'Получи эпическое NFT', icon: '⚡', reward: 100},
    {id: 'legendary_drop', name: 'Легендарная удача', desc: 'Получи легендарное NFT', icon: '⭐', reward: 200},
    {id: 'mythic_drop', name: 'Божественный', desc: 'Получи мифическое NFT', icon: '🔥', reward: 500},
    {id: 'stars_100', name: 'Богач', desc: 'Накопи 100 звёзд', icon: '💰', reward: 50},
    {id: 'stars_500', name: 'Миллионер', desc: 'Накопи 500 звёзд', icon: '💸', reward: 100},
    {id: 'stars_1000', name: 'Олигарх', desc: 'Накопи 1000 звёзд', icon: '🤑', reward: 300},
    {id: 'level_5', name: 'Опытный', desc: 'Достигни 5 уровня', icon: '📈', reward: 50},
    {id: 'level_10', name: 'Профи', desc: 'Достигни 10 уровня', icon: '🎖️', reward: 150},
    {id: 'level_25', name: 'Мастер', desc: 'Достигни 25 уровня', icon: '🏅', reward: 400},
    {id: 'inventory_10', name: 'Коллекция', desc: 'Собери 10 NFT', icon: '🗃️', reward: 75},
    {id: 'inventory_25', name: 'Музей', desc: 'Собери 25 NFT', icon: '🏛️', reward: 200},
    {id: 'sell_nft', name: 'Торговец', desc: 'Продай первое NFT', icon: '💵', reward: 30},
    {id: 'ref_1', name: 'Пригласитель', desc: 'Пригласи 1 друга', icon: '👤', reward: 50},
    {id: 'ref_5', name: 'Социальный', desc: 'Пригласи 5 друзей', icon: '👥', reward: 150},
    {id: 'ref_10', name: 'Амбассадор', desc: 'Пригласи 10 друзей', icon: '👨‍👩‍👧‍👦', reward: 350}
];

// ЕЖЕДНЕВНЫЕ ЗАДАНИЯ
const DAILY_QUESTS = [
    {id: 'quest_case_1', name: 'Открой 1 кейс', target: 1, reward: 10, icon: '🎁', type: 'cases'},
    {id: 'quest_case_3', name: 'Открой 3 кейса', target: 3, reward: 30, icon: '📦', type: 'cases'},
    {id: 'quest_case_5', name: 'Открой 5 кейсов', target: 5, reward: 75, icon: '🎰', type: 'cases'},
    {id: 'quest_invite_1', name: 'Пригласи 1 друга', target: 1, reward: 50, icon: '👤', type: 'refs'},
    {id: 'quest_sell_1', name: 'Продай 1 NFT', target: 1, reward: 25, icon: '💵', type: 'sells'}
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
let dailyQuests = {};
let totalSells = 0;

// ЗВУКИ
function playSound(type) {
    try {
        const audio = new Audio(`sounds/${type}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(() => {});
    } catch(e) {}
}

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

// ГЕНЕРАЦИЯ ФЕЙКОВОЙ ИСТОРИИ
function generateFakeHistory() {
    const fakeNames = ['Алексей', 'Мария', 'Дмитрий', 'Анна', 'Иван', 'Елена', 'Сергей', 'Ольга', 'Павел', 'София'];
    
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

// ОТОБРАЖЕНИЕ ГЛОБАЛЬНОЙ ИСТОРИИ
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
        
        let displayIcon = '';
        if (nft.isCurrency) {
            displayIcon = nft.name === 'Подарок' ? '💝' : '⭐';
        }
        
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

// ДОБАВЛЕНИЕ В ГЛОБАЛЬНУЮ ИСТОРИЮ
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

// ОБНОВЛЕНИЕ ВРЕМЕНИ В ИСТОРИИ
function updateHistoryTimes() {
    globalHistory = globalHistory.map(item => {
        if (item.time === 'только что') {
            item.time = '1 мин назад';
        } else {
            const match = item.time.match(/(\d+) мин/);
            if (match) {
                const mins = parseInt(match[1]) + 1;
                item.time = `${mins} мин назад`;
            }
        }
        return item;
    });
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
    loadDailyQuests();
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
    setInterval(updateHistoryTimes, 60000);
    
    // Добавление фейковых открытий каждые 20-40 секунд
    setInterval(() => {
        const randomCase = Object.values(CASES_DATA)[Math.floor(Math.random() * Object.keys(CASES_DATA).length)];
        const randomItem = getRandomItemByChance(randomCase.items);
        const fakeNames = ['Алексей', 'Мария', 'Дмитрий', 'Анна', 'Иван', 'Елена', 'Сергей'];
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
    totalSells = parseInt(localStorage.getItem('totalSells') || '0');
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
        
        checkLevelAchievements();
    }
    
    localStorage.setItem('userLevel', userLevel);
    localStorage.setItem('userXP', userXP);
    updateLevelDisplay();
}

function checkLevelAchievements() {
    if (userLevel >= 5 && !achievements.includes('level_5')) {
        unlockAchievement('level_5');
    }
    if (userLevel >= 10 && !achievements.includes('level_10')) {
        unlockAchievement('level_10');
    }
    if (userLevel >= 25 && !achievements.includes('level_25')) {
        unlockAchievement('level_25');
    }
}

function openAdminPanel() {
    if (!isAdmin) return;
    
    const stats = {
        totalUsers: 150 + Math.floor(Math.random() * 50),
        onlineUsers: 20 + Math.floor(Math.random() * 10),
        totalCases: 1500 + Math.floor(Math.random() * 500),
        totalStars: 50000 + Math.floor(Math.random() * 10000)
    };
    
    tg.showPopup({
        title: '👑 ADMIN PANEL',
        message: `📊 Статистика:\n\n👥 Всего пользователей: ${stats.totalUsers}\n🟢 Онлайн: ${stats.onlineUsers}\n📦 Открыто кейсов: ${stats.totalCases}\n⭐ Всего звёзд: ${stats.totalStars}`,
        buttons: [{type: 'ok'}]
    });
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
            let icon = '⭐';
            if (nft.name === 'Подарок') icon = '💝';
            
            return `
                <div class="item-row">
                    <div class="item-icon" style="border-color: #fbbf24;">
                        <div style="font-size:40px;">${icon}</div>
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
    
    if (data.price === 0) {
        if (!isAdmin) {
            const lastOpen = localStorage.getItem('lastFreeCase');
            if (lastOpen && (new Date() - new Date(lastOpen)) < 24 * 60 * 60 * 1000) {
                tg.showAlert('Бесплатный кейс можно открыть раз в 24 часа');
                return;
            }
        }
        localStorage.setItem('lastFreeCase', new Date().toISOString());
        closeInfoModal();
        setTimeout(() => startRoulette(currentCase), 300);
    } else {
        let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
        
        if (isAdmin || gameStars >= data.price) {
            if (!isAdmin) {
                gameStars -= data.price;
                localStorage.setItem('gameStars', gameStars);
                document.getElementById('balance').textContent = gameStars;
            }
            
            closeInfoModal();
            setTimeout(() => startRoulette(currentCase), 300);
        } else {
            tg.showAlert(`Недостаточно звёзд!\n\nУ вас: ${gameStars} ⭐\nНужно: ${data.price} ⭐\n\nОткрывайте бесплатный кейс!`);
        }
    }
}

function startRoulette(caseKey) {
    playSound('spin');
    
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
            let icon = '⭐';
            if (item.nft.name === 'Подарок') icon = '💝';
            div.innerHTML = `<div style="font-size:70px;">${icon}</div>`;
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
        playSound('win');
        showResult(winItem.nft);
        
        openedCases++;
        localStorage.setItem('openedCases', openedCases);
        updateDailyQuest('cases');
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
            
            document.getElementById('resultIcon').innerHTML = `<div style="font-size:100px;">⭐</div>`;
            document.getElementById('resultName').textContent = `+${nft.amount} звёзд`;
            document.getElementById('resultRarity').textContent = 'ВАЛЮТА';
            document.getElementById('resultStars').innerHTML = `Баланс: ⭐ ${currentBalance}`;
            document.getElementById('resultTon').innerHTML = '';
            
            addXP(nft.amount);
            checkStarsAchievements(currentBalance);
        } else {
            document.getElementById('resultIcon').innerHTML = `<div style="font-size:100px;">💝</div>`;
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
        checkRarityAchievements(nft.rarity);
        
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
    checkInventoryAchievements();
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
    
    // Сортировка по редкости
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
                    <div class="inventory-item" onclick="showNFTDetails(${inventory.indexOf(nft)})">
                        <div style="width: 100%; height: 150px; background: rgba(0,0,0,0.5); border-radius: 12px; overflow: hidden; border: 3px solid ${getRarityColor(nft.rarity)}; position: relative;">
                            <img src="${nft.image}" alt="${nft.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
                            <div style="position: absolute; top: 8px; right: 8px; background: ${getRarityColor(nft.rarity)}; padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
                                ${nft.rarity}
                            </div>
                        </div>
                        <div style="margin-top: 8px; font-size: 14px; font-weight: 700;">${nft.name}</div>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">💎 ${nft.ton} TON • ⭐ ${nft.stars}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showNFTDetails(idx) {
    const nft = inventory[idx];
    if (!nft) return;
    
    const sellPrice = Math.floor(nft.stars * 0.7);
    
    tg.showPopup({
        title: nft.name,
        message: `Редкость: ${nft.rarity.toUpperCase()}\nЦена: ${nft.ton} TON\nЗвёзды: ${nft.stars} ⭐\n\nПродать за ${sellPrice} ⭐?`,
        buttons: [
            {id: 'sell', type: 'default', text: `Продать за ${sellPrice} ⭐`},
            {type: 'cancel'}
        ]
    }, (btnId) => {
        if (btnId === 'sell') {
            sellNFT(idx);
        }
    });
}

function sellNFT(idx) {
    const nft = inventory[idx];
    if (!nft) return;
    
    const sellPrice = Math.floor(nft.stars * 0.7);
    let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
    gameStars += sellPrice;
    localStorage.setItem('gameStars', gameStars);
    document.getElementById('balance').textContent = gameStars;
    
    inventory.splice(idx, 1);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventory();
    
    totalSells++;
    localStorage.setItem('totalSells', totalSells);
    updateDailyQuest('sells');
    
    if (totalSells === 1 && !achievements.includes('sell_nft')) {
        unlockAchievement('sell_nft');
    }
    
    tg.showAlert(`Продано за ${sellPrice} ⭐!`);
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
    let unlocked = false;
    
    if (openedCases >= 1 && !achievements.includes('first_case')) {
        unlockAchievement('first_case');
        unlocked = true;
    }
    if (openedCases >= 5 && !achievements.includes('cases_5')) {
        unlockAchievement('cases_5');
        unlocked = true;
    }
    if (openedCases >= 10 && !achievements.includes('cases_10')) {
        unlockAchievement('cases_10');
        unlocked = true;
    }
    if (openedCases >= 25 && !achievements.includes('cases_25')) {
        unlockAchievement('cases_25');
        unlocked = true;
    }
    if (openedCases >= 50 && !achievements.includes('cases_50')) {
        unlockAchievement('cases_50');
        unlocked = true;
    }
    if (openedCases >= 100 && !achievements.includes('cases_100')) {
        unlockAchievement('cases_100');
        unlocked = true;
    }
    
    if (unlocked) {
        renderAchievements();
    }
}

function checkRarityAchievements(rarity) {
    if (rarity === 'rare' && !achievements.includes('rare_drop')) {
        unlockAchievement('rare_drop');
    }
    if (rarity === 'epic' && !achievements.includes('epic_drop')) {
        unlockAchievement('epic_drop');
    }
    if (rarity === 'legendary' && !achievements.includes('legendary_drop')) {
        unlockAchievement('legendary_drop');
    }
    if (rarity === 'mythic' && !achievements.includes('mythic_drop')) {
        unlockAchievement('mythic_drop');
    }
}

function checkStarsAchievements(stars) {
    if (stars >= 100 && !achievements.includes('stars_100')) {
        unlockAchievement('stars_100');
    }
    if (stars >= 500 && !achievements.includes('stars_500')) {
        unlockAchievement('stars_500');
    }
    if (stars >= 1000 && !achievements.includes('stars_1000')) {
        unlockAchievement('stars_1000');
    }
}

function checkInventoryAchievements() {
    if (inventory.length >= 10 && !achievements.includes('inventory_10')) {
        unlockAchievement('inventory_10');
    }
    if (inventory.length >= 25 && !achievements.includes('inventory_25')) {
        unlockAchievement('inventory_25');
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

// ЕЖЕДНЕВНЫЕ КВЕСТЫ
function loadDailyQuests() {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('questsDate');
    
    if (savedDate !== today) {
        dailyQuests = {};
        DAILY_QUESTS.forEach(quest => {
            dailyQuests[quest.id] = {progress: 0, completed: false};
        });
        localStorage.setItem('questsDate', today);
        localStorage.setItem('dailyQuests', JSON.stringify(dailyQuests));
    } else {
        dailyQuests = JSON.parse(localStorage.getItem('dailyQuests') || '{}');
    }
    
    renderDailyQuests();
}

function renderDailyQuests() {
    const container = document.getElementById('questsContainer');
    if (!container) return;
    
    const completedCount = Object.values(dailyQuests).filter(q => q.completed).length;
    const totalCount = DAILY_QUESTS.length;
    
    container.innerHTML = `
        <div style="padding: 20px;">
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 18px; margin-bottom: 10px;">📋 Ежедневные задания</h3>
                <div style="font-size: 14px; color: #6b7280;">Выполнено: ${completedCount}/${totalCount}</div>
            </div>
            ${DAILY_QUESTS.map(quest => {
                const progress = dailyQuests[quest.id]?.progress || 0;
                const completed = dailyQuests[quest.id]?.completed || false;
                const percent = Math.min((progress / quest.target) * 100, 100);
                
                return `
                    <div style="background: rgba(30,30,40,0.5); border-radius: 12px; padding: 15px; margin-bottom: 12px; border: 2px solid ${completed ? '#10b981' : 'rgba(255,255,255,0.1)'};">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <div style="font-size: 32px;">${quest.icon}</div>
                            <div style="flex: 1;">
                                <div style="font-size: 16px; font-weight: 700;">${quest.name} ${completed ? '✅' : ''}</div>
                                <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${progress}/${quest.target}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 14px; color: #ffd700;">+${quest.reward} ⭐</div>
                            </div>
                        </div>
                        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #10b981, #059669); transition: width 0.3s;"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function updateDailyQuest(type) {
    DAILY_QUESTS.forEach(quest => {
        if (quest.type === type && !dailyQuests[quest.id]?.completed) {
            if (!dailyQuests[quest.id]) {
                dailyQuests[quest.id] = {progress: 0, completed: false};
            }
            
            dailyQuests[quest.id].progress++;
            
            if (dailyQuests[quest.id].progress >= quest.target) {
                dailyQuests[quest.id].completed = true;
                
                let gameStars = parseInt(localStorage.getItem('gameStars') || '0');
                gameStars += quest.reward;
                localStorage.setItem('gameStars', gameStars);
                document.getElementById('balance').textContent = gameStars;
                
                tg.showPopup({
                    title: '✅ Задание выполнено!',
                    message: `${quest.icon} ${quest.name}\n\n+${quest.reward} ⭐ звёзд!`,
                    buttons: [{type: 'ok'}]
                });
            }
            
            localStorage.setItem('dailyQuests', JSON.stringify(dailyQuests));
            renderDailyQuests();
        }
    });
}

function updateFreeTimer() {
    const statusEl = document.getElementById('freeStatus');
    const timerEl = document.getElementById('freeTimer');
    if (!statusEl || !timerEl) return;
    
    const lastOpen = localStorage.getItem('lastFreeCase');
    if (!lastOpen) {
        statusEl.textContent = 'ДОСТУПЕН';
        timerEl.textContent = '';
        return;
    }
    
    const diff = 24 * 60 * 60 * 1000 - (new Date() - new Date(lastOpen));
    if (diff <= 0) {
        statusEl.textContent = 'ДОСТУПЕН';
        timerEl.textContent = '';
    } else {
        statusEl.textContent = 'НЕДОСТУПЕН';
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
        achievements: 'tabAchievements',
        quests: 'tabQuests'
    };
    
    document.getElementById(tabs[tab]).classList.add('active');
    
    if (tab === 'inventory') renderInventory();
    if (tab === 'history') loadHistory();
    if (tab === 'achievements') renderAchievements();
    if (tab === 'quests') renderDailyQuests();
}

function loadRefLink() {
    const userId = tg.initDataUnsafe?.user?.id || '123456789';
    const refCount = parseInt(localStorage.getItem('refCount') || '0');
    
    document.getElementById('refLink').textContent = `https://t.me/gsdfsdfdsfbot?start=ref_${userId}`;
    document.getElementById('refCount').textContent = refCount;
    
    checkRefAchievements(refCount);
}

function checkRefAchievements(refCount) {
    if (refCount >= 1 && !achievements.includes('ref_1')) {
        unlockAchievement('ref_1');
    }
    if (refCount >= 5 && !achievements.includes('ref_5')) {
        unlockAchievement('ref_5');
    }
    if (refCount >= 10 && !achievements.includes('ref_10')) {
        unlockAchievement('ref_10');
    }
}

function copyRefLink() {
    navigator.clipboard.writeText(document.getElementById('refLink').textContent);
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
        'LUCKY': 150,
        'VIP': 500,
        'CRYPTO': 250,
        'NFT': 300,
        'TELEGRAM': 175
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
