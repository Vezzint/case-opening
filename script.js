// script.js - полный файл со всеми исправлениями
let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();
tg.setHeaderColor('#0a0a0f');
tg.setBackgroundColor('#0a0a0f');

const ADMIN_ID = 6584350034;
let currentTopUpMethod = 'stars';

const NFT_DATABASE = [
    {id:0, name:"Сердце",       stars:0,   gram:0,    image:"nft/Heart.jpg",         isCurrency:true,  amount:1,  rarity:"special"},
    {id:1, name:"3 звезды",   stars:3,   gram:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:3,  rarity:"common"},
    {id:2, name:"5 звёзд",    stars:5,   gram:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:5,  rarity:"common"},
    {id:3, name:"15 звёзд",   stars:15,  gram:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:15, rarity:"rare"},
    {id:4, name:"50 звёзд",   stars:50,  gram:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:50, rarity:"epic"},
    {id:5, name:"1 may",         stars:20,  gram:0.10, image:"nft/1 may.jpg",        rarity:"legendary"},
    {id:6, name:"Artisan Brick", stars:9400,  gram:100, image:"nft/Artisan Brick.jpg",rarity:"legendary"},
    {id:7, name:"Astral Shard",  stars:21000,  gram:220, image:"nft/Astral Shard.jpg", rarity:"mythic"},
    {id:8, name:"Backpack",      stars:500,  gram:0.35, image:"nft/Backpack.jpg",      rarity:"legendary"},
    {id:9, name:"Crystal Eagle", stars:3881,  gram:41.25, image:"nft/Crystal Eagle.jpg",rarity:"mythic"},
    {id:10,name:"Durovs Cap",    stars:78550, gram:800, image:"nft/Durovs Cap.jpg",    rarity:"mythic"},
    {id:11,name:"Faith Amulet",  stars:650, gram:6, image:"nft/Faith Amulet.jpg",  rarity:"legendary"},
    {id:12,name:"Happy Brownie", stars:500, gram:5, image:"nft/Happy Brownie.jpg", rarity:"legendary"},
    {id:13,name:"Instant Ramen", stars:540, gram:3, image:"nft/Instant Ramen.jpg", rarity:"legendary"},
    {id:14,name:"Jolly Chimp",   stars:756, gram:8, image:"nft/Jolly Chimp.jpg",   rarity:"legendary"},
    {id:15,name:"Mighty Arm",   stars:1500, gram:15, image:"nft/Mighty Arm.jpg",   rarity:"legendary"}
];

const CASES_DATA = {
    free: {
        name: "🎁 Бесплатный кейс",
        icon: "🎁",
        price: 0,
        priceGram: 0,
        type: "free",
        cooldown: true,
        items: [
            { nft: NFT_DATABASE[0],  chance: 40.0 },
            { nft: NFT_DATABASE[1],  chance: 30.0 },
            { nft: NFT_DATABASE[2],  chance: 15.0 },
            { nft: NFT_DATABASE[3],  chance: 10.0 },
            { nft: NFT_DATABASE[4],  chance: 4.5  },
            { nft: NFT_DATABASE[12], chance: 0.4  },
            { nft: NFT_DATABASE[13], chance: 0.1  }
        ]
    },
    basic: {
        name: "📦 Basic Case",
        icon: "📦",
        price: 50,
        priceGram: 0,
        type: "basic",
        cooldown: false,
        items: [
            { nft: NFT_DATABASE[1],  chance: 35.0 },
            { nft: NFT_DATABASE[2],  chance: 25.0 },
            { nft: NFT_DATABASE[3],  chance: 15.0 },
            { nft: NFT_DATABASE[4],  chance: 8.0  },
            { nft: NFT_DATABASE[0],  chance: 8.0  },
            { nft: NFT_DATABASE[8],  chance: 5.0  },
            { nft: NFT_DATABASE[9],  chance: 2.5 },
            { nft: NFT_DATABASE[7],  chance: 1.0 },
            { nft: NFT_DATABASE[10], chance: 0.5 }
        ]
    },
    premium: {
        name: "💎 Premium Case",
        icon: "💎",
        price: 500,
        priceGram: 0,
        type: "premium",
        cooldown: false,
        items: [
            { nft: NFT_DATABASE[2],  chance: 18.0 },
            { nft: NFT_DATABASE[3],  chance: 15.0 },
            { nft: NFT_DATABASE[4],  chance: 10.0 },
            { nft: NFT_DATABASE[0],  chance: 12.0 },
            { nft: NFT_DATABASE[11], chance: 12.0 },
            { nft: NFT_DATABASE[12], chance: 10.0 },
            { nft: NFT_DATABASE[13], chance: 8.0  },
            { nft: NFT_DATABASE[14], chance: 8.0  },
            { nft: NFT_DATABASE[9],  chance: 5.0  },
            { nft: NFT_DATABASE[7],  chance: 2.0  },
            { nft: NFT_DATABASE[10], chance: 0.5  }
        ]
    },
    legendary: {
        name: "👑 Legendary Case",
        icon: "👑",
        price: 0,
        priceGram: 100,
        type: "legendary",
        cooldown: false,
        items: [
            { nft: NFT_DATABASE[0], chance: 50.0 },
            { nft: NFT_DATABASE[15], chance: 50.0 }
        ]
    }
};

const ACHIEVEMENTS = [
    {id:'first_case', name:'Первый кейс',   desc:'Открой свой первый кейс',   icon:'🎁', reward:10},
    {id:'cases_5',    name:'Новичок',        desc:'Открой 5 кейсов',            icon:'📦', reward:25},
    {id:'cases_10',   name:'Коллекционер',   desc:'Открой 10 кейсов',           icon:'🎰', reward:50},
    {id:'mythic',     name:'Мифическая удача',desc:'Получи Mythic NFT',         icon:'💎', reward:500}
];

let currentFilter = 'all';
let userLevel = 1;
let userXP = 0;
let isAdmin = false;
let inventory = [];
let openedCases = 0;
let achievements = [];
let globalHistory = [];
let freeTimerInterval = null;

// ===== CASE SCREEN VARIABLES =====
let currentMultiplier = 1;
let isSlotSpinning = false;
let slotTimer = null;
let currentSlotCaseData = null;
let slotWinResults = [];
let idleAnimationInterval = null;

// ===== BALANCE FUNCTIONS =====
function getStars() {
    return parseInt(localStorage.getItem('gameStars') || '0', 10);
}

function setStars(val) {
    val = Math.max(0, val);
    localStorage.setItem('gameStars', val);
    let balanceEl = document.getElementById('balance');
    if (balanceEl) balanceEl.textContent = val;
}

function getGram() {
    return parseFloat(localStorage.getItem('gameGram') || '0');
}

function setGram(val) {
    val = Math.max(0, val);
    localStorage.setItem('gameGram', val.toFixed(4));
    let gramEl = document.getElementById('gramBalance');
    if (gramEl) gramEl.textContent = parseFloat(val).toFixed(2);
}

// ===== TOP-UP MODAL =====
function openTopUpModal() {
    document.getElementById('topUpModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    selectTopUpMethod('stars');
    document.getElementById('topUpAmount').value = '';
    updateTopUpInfo();
}

function closeTopUpModal() {
    document.getElementById('topUpModal').style.display = 'none';
    document.body.style.overflow = '';
}

function selectTopUpMethod(method) {
    currentTopUpMethod = method;
    document.querySelectorAll('.topUpMethod').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.topUpMethod[data-method="${method}"]`);
    if (btn) btn.classList.add('active');
    
    const minInfo = document.getElementById('topUpMinInfo');
    if (method === 'stars') minInfo.textContent = 'Мин. сумма: 1 ⭐';
    else if (method === 'crypto') minInfo.textContent = 'Мин. сумма: 0.01 USDT';
    else if (method === 'gram') minInfo.textContent = 'Мин. сумма: 0.1 GRAM';
    
    updateTopUpInfo();
}

function updateTopUpInfo() {
    const amount = parseFloat(document.getElementById('topUpAmount').value) || 0;
    const gramResult = document.getElementById('topUpGramResult');
    if (currentTopUpMethod === 'stars') {
        const gram = (amount * 0.0096).toFixed(4);
        gramResult.textContent = gram + ' GRAM';
    } else {
        gramResult.textContent = '—';
    }
}

function confirmTopUp() {
    if (currentTopUpMethod !== 'stars') {
        tg.showAlert('Выберите способ оплаты Stars');
        return;
    }
    const amount = parseInt(document.getElementById('topUpAmount').value, 10);
    if (!amount || amount < 1) {
        tg.showAlert('Введите сумму звёзд (мин. 1)');
        return;
    }
    const stars = getStars();
    if (stars < amount) {
        tg.showAlert('Недостаточно звёзд');
        return;
    }
    const gram = amount * 0.0096;
    setStars(stars - amount);
    setGram(getGram() + gram);
    closeTopUpModal();
    tg.showPopup({
        title: '✅ Пополнено!',
        message: `+${gram.toFixed(4)} GRAM\nПотрачено: ${amount} ⭐\nБаланс GRAM: ${getGram().toFixed(2)}`,
        buttons: [{type: 'ok'}]
    });
}

// ===== CASE MANAGEMENT =====
function checkCanOpen(caseKey) {
    let data = CASES_DATA[caseKey];
    if (!data) return { ok: false, reason: 'Кейс не найден' };
    
    if (data.cooldown) {
        let ms = getFreeMsLeft();
        if (ms > 0) return { ok: false, reason: '⏰ Бесплатный кейс раз в 24 часа!\n\nОсталось: ' + msToHM(ms) };
    }
    
    if (data.price > 0) {
        let stars = getStars();
        if (stars < data.price) return { ok: false, reason: '❌ Недостаточно звёзд!\n\nУ вас: ' + stars + ' ⭐\nНужно: ' + data.price + ' ⭐' };
    }
    
    if (data.priceGram > 0) {
        let gram = getGram();
        if (gram < data.priceGram) return { ok: false, reason: '❌ Недостаточно GRAM!\n\nУ вас: ' + gram.toFixed(2) + ' GRAM\nНужно: ' + data.priceGram + ' GRAM' };
    }
    
    return { ok: true };
}

function getFreeMsLeft() {
    let last = localStorage.getItem('lastFreeCase');
    if (!last) return 0;
    let left = 86400000 - (Date.now() - new Date(last).getTime());
    return left > 0 ? left : 0;
}

function msToHM(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    return h > 0 ? h + 'ч ' + m + 'м' : m + 'м ' + s + 'с';
}

function startFreeTimer() {
    if (freeTimerInterval) clearInterval(freeTimerInterval);
    freeTimerInterval = setInterval(function() {
        let ms = getFreeMsLeft();
        let timerEl = document.getElementById('freeCountdown');
        let statusEl = document.getElementById('freeStatus');
        if (!timerEl) return;
        
        if (ms <= 0) {
            clearInterval(freeTimerInterval);
            freeTimerInterval = null;
            if (statusEl) { statusEl.textContent = '✅ ДОСТУПЕН'; statusEl.style.color = '#10b981'; }
            timerEl.textContent = '';
            let card = document.getElementById('freeCard');
            if (card) card.style.opacity = '1';
        } else {
            if (statusEl) { statusEl.textContent = '🔒 ЗАБЛОКИРОВАН'; statusEl.style.color = '#ef4444'; }
            timerEl.textContent = msToHM(ms);
        }
    }, 1000);
}

function generateCases() {
    let container = document.getElementById('casesContainer');
    if (!container) return;
    
    let entries = Object.keys(CASES_DATA).filter(function(key) {
        let data = CASES_DATA[key];
        if (currentFilter === 'all') return true;
        if (currentFilter === 'free') return data.price === 0 && data.priceGram === 0;
        if (currentFilter === 'basic') return data.type === 'basic';
        if (currentFilter === 'premium') return data.type === 'premium';
        if (currentFilter === 'legendary') return data.type === 'legendary';
        return true;
    });
    
    let html = '';
    for (let i = 0; i < entries.length; i++) {
        let key = entries[i];
        let data = CASES_DATA[key];
        let locked = data.cooldown ? getFreeMsLeft() > 0 : false;
        let ms = locked ? getFreeMsLeft() : 0;
        let stars = getStars();
        let gram = getGram();
        let canAfford = true;
        
        if (data.price > 0 && stars < data.price) canAfford = false;
        if (data.priceGram > 0 && gram < data.priceGram) canAfford = false;
        
        let footerHtml = '';
        if (data.price === 0 && data.priceGram === 0) {
            let statusText = locked ? '🔒 ЗАБЛОКИРОВАН' : '✅ ДОСТУПЕН';
            let statusColor = locked ? '#ef4444' : '#10b981';
            let timerText = locked ? msToHM(ms) : '';
            footerHtml = '<div><div id="freeStatus" style="font-weight:700;font-size:12px;color:' + statusColor + ';">' + statusText + '</div><div id="freeCountdown" style="color:#6b7280;font-size:10px;margin-top:2px;">' + timerText + '</div></div>';
        } else if (data.priceGram > 0) {
            footerHtml = '<div><div style="color:#10b981;font-size:20px;font-weight:900;">💎 ' + data.priceGram + '</div>' + (!canAfford ? '<div style="color:#ef4444;font-size:10px;margin-top:1px;">Не хватает GRAM</div>' : '') + '</div>';
        } else {
            footerHtml = '<div><div style="color:#ffd700;font-size:20px;font-weight:900;">⭐ ' + data.price + '</div>' + (!canAfford ? '<div style="color:#ef4444;font-size:10px;margin-top:1px;">Не хватает ' + (data.price - stars) + ' ⭐</div>' : '') + '</div>';
        }
        
        let cardId = key === 'free' ? 'freeCard' : '';
        let opacity = locked ? '0.6' : '1';
        let badge = (data.price === 0 && data.priceGram === 0) ? '<div class="case-badge">FREE</div>' : '';
        
        html += '<div class="case-big" id="' + cardId + '" onclick="openCaseScreen(\'' + key + '\')" style="opacity:' + opacity + ';">' + badge + '<div class="case-image-section"><div class="case-main-image" style="font-size:60px;">' + data.icon + '</div></div><div class="case-info-section"><div class="case-title" style="font-size:16px;">' + data.name + '</div><div class="case-footer">' + footerHtml + '</div></div></div>';
    }
    
    container.innerHTML = html;
    startFreeTimer();
}

function openCasesModal() {
    let modal = document.getElementById('modalCases');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        generateCases();
    }
}

function closeCasesModal() {
    let modal = document.getElementById('modalCases');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== CASE SCREEN =====
function openCaseScreen(caseKey) {
    let check = checkCanOpen(caseKey);
    if (!check.ok) {
        tg.showAlert(check.reason);
        return;
    }
    
    closeCasesModal();
    
    currentSlotCaseData = CASES_DATA[caseKey];
    if (!currentSlotCaseData) return;
    
    currentMultiplier = 1;
    document.querySelectorAll('.case-screen .multipliers button').forEach(b => b.classList.remove('active'));
    const multBtn = document.querySelector('.case-screen .multipliers button[data-mult="1"]');
    if (multBtn) multBtn.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) bottomNav.style.display = 'none';
    
    const screen = document.getElementById('caseScreen');
    if (screen) {
        screen.classList.add('active');
        document.getElementById('caseScreenTitle').textContent = currentSlotCaseData.name;
        updateCasePriceDisplay();
        renderSlotItemsList();
        resetSlotRows();
        updateSlotRows(1);
        document.getElementById('slotSpinBtn').disabled = false;
        isSlotSpinning = false;
    }
}

function closeCaseScreen() {
    const screen = document.getElementById('caseScreen');
    if (screen) screen.classList.remove('active');
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = '');
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) bottomNav.style.display = '';
    document.getElementById('tabGames').style.display = 'block';
    document.getElementById('tabGames').classList.add('active');
    if (slotTimer) { clearTimeout(slotTimer); slotTimer = null; }
    stopIdleAnimation();
    isSlotSpinning = false;
    document.getElementById('slotSpinBtn').disabled = false;
    currentMultiplier = 1;
    document.querySelectorAll('.case-screen .multipliers button').forEach(b => b.classList.remove('active'));
    const multBtn = document.querySelector('.case-screen .multipliers button[data-mult="1"]');
    if (multBtn) multBtn.classList.add('active');
}

function updateCasePriceDisplay() {
    const display = document.getElementById('casePriceDisplay');
    if (!display || !currentSlotCaseData) return;
    const totalPrice = (currentSlotCaseData.price || currentSlotCaseData.priceGram || 0) * currentMultiplier;
    if (currentSlotCaseData.priceGram > 0) {
        display.textContent = '💎 ' + totalPrice + ' GRAM';
        display.style.color = '#10b981';
    } else if (currentSlotCaseData.price > 0) {
        display.textContent = '⭐ ' + totalPrice;
        display.style.color = '#fbbf24';
    } else {
        display.textContent = 'БЕСПЛАТНО';
        display.style.color = '#10b981';
    }
}

function renderSlotItemsList() {
    const container = document.getElementById('slotItemsScroll');
    if (!container || !currentSlotCaseData) return;
    let html = '';
    const uniqueItems = [];
    const seen = new Set();
    for (let item of currentSlotCaseData.items) {
        if (!seen.has(item.nft.id)) {
            seen.add(item.nft.id);
            uniqueItems.push(item);
        }
    }
    
    for (let item of uniqueItems) {
        const nft = item.nft;
        const color = getRarityColor(nft.rarity);
        html += `
            <div class="item-row">
                <div class="item-icon">
                    <img src="${nft.image}" alt="${nft.name}" onerror="this.parentElement.innerHTML='<div style=font-size:30px>💎</div>'">
                </div>
                <div class="item-info">
                    <div class="name">${nft.name}</div>
                    <div class="rarity" style="color:${color}">${nft.rarity ? nft.rarity.toUpperCase() : 'ОБЫЧНЫЙ'}</div>
                </div>
                ${nft.gram > 0 ? `<div class="item-gram">💎 ${nft.gram}</div>` : ''}
            </div>
        `;
    }
    container.innerHTML = html;
}

function resetSlotRows() {
    const container = document.getElementById('slotRowsContainer');
    if (!container) return;
    const rows = container.querySelectorAll('.slot-row');
    rows.forEach(row => {
        const cells = row.querySelectorAll('.slot-cell');
        cells.forEach(cell => {
            cell.className = 'slot-cell';
            cell.innerHTML = `<div class="cell-emoji">🎰</div><div class="cell-name">Кейс</div><div class="rarity-bar common"></div>`;
        });
    });
    startIdleAnimation();
}

function startIdleAnimation() {
    stopIdleAnimation();
    idleAnimationInterval = setInterval(() => {
        if (isSlotSpinning) return;
        const container = document.getElementById('slotRowsContainer');
        if (!container || !currentSlotCaseData) return;
        const rows = container.querySelectorAll('.slot-row');
        rows.forEach(row => {
            const cells = row.querySelectorAll('.slot-cell');
            cells.forEach(cell => {
                if (!cell.classList.contains('pulse')) {
                    const randomItem = currentSlotCaseData.items[Math.floor(Math.random() * currentSlotCaseData.items.length)];
                    const nft = randomItem.nft;
                    const rarityClass = nft.rarity || 'common';
                    if (nft.isCurrency) {
                        cell.innerHTML = `<div class="cell-emoji">💎</div><div class="cell-name">${nft.name}</div><div class="rarity-bar ${rarityClass}"></div>`;
                    } else {
                        cell.innerHTML = `<img src="${nft.image}" alt="${nft.name}" onerror="this.parentElement.innerHTML='<div class=cell-emoji>💎</div>'"><div class="cell-name">${nft.name}</div><div class="rarity-bar ${rarityClass}"></div>`;
                    }
                }
            });
        });
    }, 800);
}

function stopIdleAnimation() {
    if (idleAnimationInterval) {
        clearInterval(idleAnimationInterval);
        idleAnimationInterval = null;
    }
}

function updateSlotRows(count) {
    const container = document.getElementById('slotRowsContainer');
    if (!container) return;
    const currentRows = container.querySelectorAll('.slot-row').length;
    
    if (count > currentRows) {
        for (let i = currentRows; i < count; i++) {
            const row = document.createElement('div');
            row.className = 'slot-row';
            row.dataset.row = i;
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.className = 'slot-cell';
                cell.dataset.index = j;
                cell.innerHTML = `<div class="cell-emoji">🎰</div><div class="cell-name">Кейс</div><div class="rarity-bar common"></div>`;
                row.appendChild(cell);
            }
            container.appendChild(row);
        }
    } else if (count < currentRows) {
        for (let i = currentRows - 1; i >= count; i--) {
            const row = container.querySelectorAll('.slot-row')[i];
            if (row) row.remove();
        }
    }
}

function setSlotMultiplier(mult) {
    currentMultiplier = mult;
    document.querySelectorAll('.case-screen .multipliers button').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.case-screen .multipliers button[data-mult="${mult}"]`);
    if (btn) btn.classList.add('active');
    updateCasePriceDisplay();
    updateSlotRows(mult);
    resetSlotRows();
}

function startSlotSpin() {
    if (isSlotSpinning || !currentSlotCaseData) return;
    
    const totalCost = (currentSlotCaseData.price || currentSlotCaseData.priceGram || 0) * currentMultiplier;
    
    if (currentSlotCaseData.priceGram > 0) {
        const gram = getGram();
        if (gram < totalCost) {
            tg.showAlert(`❌ Недостаточно GRAM!\n\nУ вас: ${gram.toFixed(2)} GRAM\nНужно: ${totalCost} GRAM`);
            return;
        }
        setGram(gram - totalCost);
    } else if (currentSlotCaseData.price > 0) {
        const stars = getStars();
        if (stars < totalCost) {
            tg.showAlert(`❌ Недостаточно звёзд!\n\nУ вас: ${stars} ⭐\nНужно: ${totalCost} ⭐`);
            return;
        }
        setStars(stars - totalCost);
    }
    
    if (currentSlotCaseData.cooldown) {
        localStorage.setItem('lastFreeCase', new Date().toISOString());
        generateCases();
        startFreeTimer();
    }
    
    stopIdleAnimation();
    isSlotSpinning = true;
    document.getElementById('slotSpinBtn').disabled = true;
    
    const container = document.getElementById('slotRowsContainer');
    const rows = container.querySelectorAll('.slot-row');
    const totalRows = rows.length;
    
    slotWinResults = [];
    for (let i = 0; i < totalRows; i++) {
        const winItem = getRandomItemByChance(currentSlotCaseData.items);
        slotWinResults.push(winItem);
    }
    
    rows.forEach((row, idx) => {
        animateSlotRow(row, slotWinResults[idx], idx);
    });
}

function animateSlotRow(row, winItem, rowIndex) {
    const cells = row.querySelectorAll('.slot-cell');
    const items = currentSlotCaseData.items;
    let cycles = 0;
    const maxCycles = 18 + Math.floor(Math.random() * 10);
    let interval = 50;
    
    function step() {
        cells.forEach((cell, idx) => {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            const nft = randomItem.nft;
            const rarityClass = nft.rarity || 'common';
            cell.className = 'slot-cell';
            if (nft.isCurrency) {
                cell.innerHTML = `<div class="cell-emoji">💎</div><div class="cell-name">${nft.name}</div><div class="rarity-bar ${rarityClass}"></div>`;
            } else {
                cell.innerHTML = `<img src="${nft.image}" alt="${nft.name}" onerror="this.parentElement.innerHTML='<div class=cell-emoji>💎</div>'"><div class="cell-name">${nft.name}</div><div class="rarity-bar ${rarityClass}"></div>`;
            }
        });
        
        cycles++;
        interval += 2;
        
        if (cycles < maxCycles) {
            slotTimer = setTimeout(step, interval);
        } else {
            finishSlotRow(row, winItem, rowIndex);
        }
    }
    step();
}

function finishSlotRow(row, winItem, rowIndex) {
    const cells = row.querySelectorAll('.slot-cell');
    if (!winItem || !winItem.nft) return;
    
    const nft = winItem.nft;
    const rarityClass = nft.rarity || 'common';
    
    const centerCell = cells[2];
    if (!centerCell) return;
    
    centerCell.className = 'slot-cell pulse';
    if (nft.isCurrency) {
        centerCell.innerHTML = `<div class="cell-emoji">💎</div><div class="cell-name">${nft.name}</div><div class="rarity-bar ${rarityClass}"></div>`;
    } else {
        centerCell.innerHTML = `<img src="${nft.image}" alt="${nft.name}" onerror="this.parentElement.innerHTML='<div class=cell-emoji>💎</div>'"><div class="cell-name">${nft.name}</div><div class="rarity-bar ${rarityClass}"></div>`;
    }
    
    cells.forEach((cell, idx) => {
        if (idx === 2) return;
        const randomItem = currentSlotCaseData.items[Math.floor(Math.random() * currentSlotCaseData.items.length)];
        if (!randomItem || !randomItem.nft) return;
        const rnft = randomItem.nft;
        const rclass = rnft.rarity || 'common';
        cell.className = 'slot-cell';
        if (rnft.isCurrency) {
            cell.innerHTML = `<div class="cell-emoji">💎</div><div class="cell-name">${rnft.name}</div><div class="rarity-bar ${rclass}"></div>`;
        } else {
            cell.innerHTML = `<img src="${rnft.image}" alt="${rnft.name}" onerror="this.parentElement.innerHTML='<div class=cell-emoji>💎</div>'"><div class="cell-name">${rnft.name}</div><div class="rarity-bar ${rclass}"></div>`;
        }
    });
    
    if (nft.isCurrency) {
        const isStars = nft.name.indexOf('звезд') !== -1 || nft.name.indexOf('звёзд') !== -1 || nft.name.indexOf('Сердце') !== -1;
        if (isStars) {
            setStars(getStars() + nft.amount);
            addXP(nft.amount);
        } else {
            addXP(10);
        }
    } else {
        addToInventory(nft);
        saveToHistory(nft);
        addXP(Math.floor(nft.stars / 5));
    }
    
    addToGlobalHistory(nft);
    
    if (nft.rarity === 'mythic' || nft.rarity === 'legendary') {
        createConfetti();
    }
    
    const allRows = document.querySelectorAll('#slotRowsContainer .slot-row');
    let finished = 0;
    allRows.forEach(r => {
        const center = r.querySelector('.slot-cell:nth-child(3)');
        if (center && center.classList.contains('pulse')) finished++;
    });
    
    if (finished === allRows.length) {
        setTimeout(() => {
            isSlotSpinning = false;
            document.getElementById('slotSpinBtn').disabled = false;
            openedCases++;
            localStorage.setItem('openedCases', openedCases);
            checkAchievements();
            checkMythicAchievement();
            generateCases();
            
            setTimeout(() => {
                resetSlotRows();
                slotWinResults = [];
            }, 3000);
        }, 1500);
    }
}

function getRandomItemByChance(items) {
    let rand = Math.random() * 100;
    let cum = 0;
    for (let i = 0; i < items.length; i++) {
        cum += items[i].chance;
        if (rand <= cum) return items[i];
    }
    return items[items.length - 1];
}

// ===== CONFETTI =====
function createConfetti() {
    const colors = ['#fbbf24','#ef4444','#a855f7','#10b981','#3b82f6','#8b5cf6','#f59e0b','#ec4899'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(container);
    
    for (let i = 0; i < 300; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 10 + 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 2 + 3;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size * (Math.random() > 0.5 ? 1 : 1.5)}px;
            background: ${color};
            left: ${left}%;
            top: -20px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: confettiFall ${duration}s linear ${delay}s forwards;
            box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        `;
        container.appendChild(particle);
    }
    
    setTimeout(() => container.remove(), 5000);
}

// ===== INVENTORY =====
function addToInventory(nft) {
    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    let newItem = {
        id: nft.id,
        name: nft.name,
        stars: nft.stars,
        gram: nft.gram || 0,
        image: nft.image,
        isCurrency: nft.isCurrency || false,
        amount: nft.amount || 0,
        rarity: nft.rarity,
        uid: Date.now() + '_' + Math.random().toString(36).slice(2),
        time: new Date().toISOString()
    };
    inventory.unshift(newItem);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    checkMythicAchievement();
    
    if (document.getElementById('tabInventory').classList.contains('active')) {
        renderInventory();
    }
}

function loadInventory() {
    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    renderInventory();
    checkMythicAchievement();
}

function renderInventory() {
    let c = document.getElementById('inventoryContainer');
    if (!c) return;
    
    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    if (!inventory.length) {
        c.innerHTML = '<div style="padding:60px 20px;text-align:center;"><div style="font-size:80px;opacity:0.3;">📦</div><h3>Инвентарь пуст</h3><p style="color:#6b7280;">Открой кейсы, чтобы получить NFT</p></div>';
        return;
    }
    
    let order = { mythic:5, legendary:4, epic:3, rare:2, common:1 };
    let sorted = inventory.slice().sort(function(a, b) {
        return (order[b.rarity] || 0) - (order[a.rarity] || 0);
    });
    
    let totalGram = 0;
    for (let i = 0; i < inventory.length; i++) {
        totalGram += (inventory[i].gram || 0);
    }
    
    let html = '<div style="padding:20px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;"><h3>📦 Мои NFT (' + inventory.length + ')</h3><div style="font-size:14px;color:#6b7280;">💎 <span style="color:#10b981;font-weight:700;">' + totalGram.toFixed(2) + ' GRAM</span></div></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:15px;">';
    
    for (let j = 0; j < sorted.length; j++) {
        let nft = sorted[j];
        let uid = nft.uid || JSON.stringify(nft);
        let safeUid = encodeURIComponent(uid);
        html += '<div style="background:rgba(30,20,50,0.5);border-radius:12px;padding:12px;border:2px solid ' + getRarityColor(nft.rarity) + ';"><div style="width:100%;height:120px;border-radius:8px;overflow:hidden;margin-bottom:8px;position:relative;"><img src="' + nft.image + '" alt="' + nft.name + '" style="width:100%;height:100%;object-fit:cover;"><div style="position:absolute;top:5px;right:5px;background:' + getRarityColor(nft.rarity) + ';padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700;">' + nft.rarity.toUpperCase() + '</div></div><div style="font-size:13px;font-weight:700;margin-bottom:4px;">' + nft.name + '</div><div style="font-size:11px;color:#6b7280;margin-bottom:8px;">💎 ' + (nft.gram || 0) + ' GRAM • ⭐ ' + nft.stars + '</div><button onclick="sellNFT(\'' + safeUid + '\')" style="width:100%;padding:8px;background:linear-gradient(135deg,#8b5cf6,#6366f1);border:none;border-radius:8px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Продать ' + Math.floor((nft.stars || 0) * 0.7) + ' ⭐</button></div>';
    }
    
    html += '</div></div>';
    c.innerHTML = html;
}

function sellNFT(safeUid) {
    let uid = decodeURIComponent(safeUid);
    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    let idx = -1;
    for (let i = 0; i < inventory.length; i++) {
        let itemUid = inventory[i].uid || JSON.stringify(inventory[i]);
        if (itemUid === uid) { idx = i; break; }
    }
    
    if (idx === -1) { tg.showAlert('Предмет не найден!'); return; }
    
    let nft = inventory[idx];
    let sp = Math.floor((nft.stars || 0) * 0.7);
    
    tg.showPopup({
        title: 'Продать NFT?',
        message: nft.name + '\nВы получите: ' + sp + ' ⭐',
        buttons: [
            { id: 'sell', type: 'default', text: 'Продать за ' + sp + ' ⭐' },
            { type: 'cancel' }
        ]
    }, function(btn) {
        if (btn === 'sell') {
            inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
            let freshIdx = -1;
            for (let j = 0; j < inventory.length; j++) {
                let itemUid = inventory[j].uid || JSON.stringify(inventory[j]);
                if (itemUid === uid) { freshIdx = j; break; }
            }
            
            if (freshIdx === -1) { tg.showAlert('Предмет уже продан!'); return; }
            
            inventory.splice(freshIdx, 1);
            localStorage.setItem('inventory', JSON.stringify(inventory));
            setStars(getStars() + sp);
            renderInventory();
            tg.showAlert('Продано за ' + sp + ' ⭐!');
        }
    });
}

// ===== HISTORY =====
function saveToHistory(nft) {
    let h = JSON.parse(localStorage.getItem('caseHistory') || '[]');
    let item = {
        id: nft.id,
        name: nft.name,
        stars: nft.stars,
        gram: nft.gram || 0,
        image: nft.image,
        rarity: nft.rarity,
        time: new Date().toLocaleString('ru-RU')
    };
    h.unshift(item);
    if (h.length > 50) h = h.slice(0, 50);
    localStorage.setItem('caseHistory', JSON.stringify(h));
}

function loadHistory() {
    renderHistory(JSON.parse(localStorage.getItem('caseHistory') || '[]'));
}

function renderHistory(history) {
    let c = document.getElementById('historyContainer');
    if (!c) return;
    if (!history.length) {
        c.innerHTML = '<div style="padding:60px 20px;text-align:center;"><div style="font-size:80px;opacity:0.3;">📜</div><h3>История пуста</h3></div>';
        return;
    }
    let html = '<div style="padding:20px;"><h3 style="margin-bottom:15px;">📜 История (' + history.length + ')</h3>';
    for (let i = 0; i < history.length; i++) {
        let item = history[i];
        html += '<div style="background:rgba(30,20,50,0.5);border-radius:12px;padding:15px;margin-bottom:12px;display:flex;align-items:center;gap:15px;"><div style="width:60px;height:60px;border-radius:10px;overflow:hidden;border:2px solid ' + getRarityColor(item.rarity) + ';flex-shrink:0;"><img src="' + item.image + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'"></div><div style="flex:1;"><div style="font-size:16px;font-weight:700;">' + item.name + '</div><div style="font-size:12px;color:' + getRarityColor(item.rarity) + ';margin-top:4px;">' + (item.rarity ? item.rarity.toUpperCase() : '') + '</div><div style="font-size:11px;color:#6b7280;margin-top:4px;">' + item.time + '</div></div><div style="text-align:right;"><div style="font-size:14px;color:#ffd700;">⭐ ' + item.stars + '</div><div style="font-size:12px;color:#10b981;">💎 ' + (item.gram || 0) + ' GRAM</div></div></div>';
    }
    html += '</div>';
    c.innerHTML = html;
}

// ===== ACHIEVEMENTS =====
function loadAchievements() {
    achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    renderAchievements();
}

function renderAchievements() {
    let c = document.getElementById('achievementsContainer');
    if (!c) return;
    let prog = Math.round((achievements.length / ACHIEVEMENTS.length) * 100);
    let html = '<div style="padding:20px;"><div style="margin-bottom:20px;"><div style="display:flex;justify-content:space-between;margin-bottom:10px;"><h3>🏆 Достижения</h3><div style="color:#8b5cf6;font-weight:700;">' + achievements.length + '/' + ACHIEVEMENTS.length + '</div></div><div style="width:100%;height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;"><div style="width:' + prog + '%;height:100%;background:linear-gradient(90deg,#8b5cf6,#6366f1);"></div></div></div>';
    for (let i = 0; i < ACHIEVEMENTS.length; i++) {
        let a = ACHIEVEMENTS[i];
        let done = achievements.indexOf(a.id) !== -1;
        html += '<div style="background:rgba(30,20,50,0.5);border-radius:12px;padding:15px;margin-bottom:12px;opacity:' + (done ? 1 : 0.5) + ';border:2px solid ' + (done ? '#8b5cf6' : 'rgba(255,255,255,0.1)') + ';display:flex;align-items:center;gap:15px;"><div style="font-size:40px;filter:grayscale(' + (done ? 0 : 1) + ');">' + a.icon + '</div><div style="flex:1;"><div style="font-size:16px;font-weight:700;">' + a.name + (done ? ' ✅' : '') + '</div><div style="font-size:13px;color:#6b7280;">' + a.desc + '</div></div><div style="color:' + (done ? '#8b5cf6' : '#ffd700') + ';font-weight:700;">+' + a.reward + ' ⭐</div></div>';
    }
    html += '</div>';
    c.innerHTML = html;
}

function checkAchievements() {
    let map = {first_case:1, cases_5:5, cases_10:10};
    let keys = Object.keys(map);
    for (let i = 0; i < keys.length; i++) {
        let id = keys[i];
        let n = map[id];
        if (openedCases >= n && achievements.indexOf(id) === -1) {
            unlockAchievement(id);
        }
    }
}

function checkMythicAchievement() {
    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    let hasMythic = false;
    for (let j = 0; j < inventory.length; j++) {
        if (inventory[j].rarity === 'mythic') { hasMythic = true; break; }
    }
    if (hasMythic && achievements.indexOf('mythic') === -1) {
        unlockAchievement('mythic');
    }
}

function unlockAchievement(id) {
    let a = null;
    for (let i = 0; i < ACHIEVEMENTS.length; i++) {
        if (ACHIEVEMENTS[i].id === id) { a = ACHIEVEMENTS[i]; break; }
    }
    if (!a) return;
    achievements.push(id);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    setStars(getStars() + a.reward);
    tg.showPopup({title:'🏆 Достижение!', message:a.icon + ' ' + a.name + '\n' + a.desc + '\n+' + a.reward + ' ⭐', buttons:[{type:'ok'}]});
    renderAchievements();
}

// ===== UTILITY =====
function getRarityColor(r) {
    let colors = {common:'#9e9e9e', rare:'#3b82f6', epic:'#a855f7', legendary:'#fbbf24', mythic:'#ef4444', special:'#10b981'};
    return colors[r] || '#fff';
}

function addXP(amount) {
    userXP += amount;
    let need = userLevel * 100;
    if (userXP >= need) {
        userXP -= need;
        userLevel++;
        let bonus = userLevel * 10;
        setStars(getStars() + bonus);
        tg.showPopup({title:'🎉 LEVEL UP!', message:'Уровень ' + userLevel + '!\n+' + bonus + ' ⭐', buttons:[{type:'ok'}]});
    }
    localStorage.setItem('userLevel', userLevel);
    localStorage.setItem('userXP', userXP);
    updateLevelDisplay();
}

function updateLevelDisplay() {
    let levelEl = document.getElementById('userLevel');
    let xpEl = document.getElementById('userXP');
    if (levelEl) levelEl.textContent = 'Level ' + userLevel;
    if (xpEl) xpEl.textContent = userXP + '/' + (userLevel * 100) + ' XP';
}

function fetchOnlineCount() {
    let el = document.getElementById('onlineCount');
    if (el) el.textContent = (150 + Math.floor(Math.random() * 50) - 25) + ' Online';
}

// ===== GLOBAL HISTORY =====
function generateFakeHistory() {
    let names = ['Алексей','Мария','Дмитрий','Анна','Иван','Елена'];
    let caseKeys = Object.keys(CASES_DATA);
    for (let i = 0; i < 15; i++) {
        let rCase = CASES_DATA[caseKeys[Math.floor(Math.random() * caseKeys.length)]];
        let item = getRandomItemByChance(rCase.items);
        globalHistory.push({nft:item.nft, username:names[Math.floor(Math.random() * names.length)], time:(Math.floor(Math.random() * 45) + 1) + ' мин назад'});
    }
    renderGlobalHistory();
}

function renderGlobalHistory() {
    let slider = document.getElementById('nftScroll');
    if (!slider) return;
    let all = globalHistory.concat(globalHistory).concat(globalHistory);
    let html = '';
    for (let i = 0; i < all.length; i++) {
        let item = all[i];
        let nft = item.nft;
        let color = nft.isCurrency ? '#fbbf24' : getRarityColor(nft.rarity);
        html += '<div class="nft-card" style="border:2px solid ' + color + ';min-width:160px;height:200px;"><div class="nft-image" style="border:2px solid ' + color + ';width:90px;height:90px;margin:0 auto;">' + (nft.isCurrency ? '<img src="' + nft.image + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">' : '<img src="' + nft.image + '" onerror="this.parentElement.innerHTML=\'<div style=font-size:45px>💎</div>\'" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">') + '</div><div class="nft-value" style="color:' + color + ';font-size:13px;margin-top:10px;">' + (nft.isCurrency ? nft.name : nft.gram + ' GRAM') + '</div><div style="font-size:11px;color:#fff;margin-top:8px;text-align:center;">👤 ' + item.username + '</div><div style="font-size:10px;color:#6b7280;text-align:center;margin-top:4px;">' + item.time + '</div></div>';
    }
    slider.innerHTML = html;
}

function addToGlobalHistory(nft) {
    let user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    let username = user ? (user.first_name || 'Игрок') : 'Игрок';
    globalHistory.unshift({nft:nft, username:username, time:'только что'});
    if (globalHistory.length > 25) globalHistory = globalHistory.slice(0, 25);
    renderGlobalHistory();
}

// ===== NAVIGATION =====
function switchTab(tab) {
    let tabContents = document.querySelectorAll('.tab-content');
    for (let j = 0; j < tabContents.length; j++) {
        tabContents[j].classList.remove('active');
        tabContents[j].style.display = 'none';
    }
    
    let map = {games:'tabGames', inventory:'tabInventory', history:'tabHistory', achievements:'tabAchievements', profile:'tabProfile'};
    let target = document.getElementById(map[tab]);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    let navItems = document.querySelectorAll('.nav-item');
    for (let i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove('active');
    }
    let activeNav = document.querySelector(`.nav-item[data-tab="${tab}"]`);
    if (activeNav) activeNav.classList.add('active');
    
    let slider = document.querySelector('.nft-slider');
    if (slider) {
        slider.style.display = tab === 'games' ? 'block' : 'none';
    }
    
    if (tab === 'inventory') renderInventory();
    if (tab === 'history') loadHistory();
    if (tab === 'achievements') renderAchievements();
    if (tab === 'profile') renderProfile();
}

// ===== PROFILE =====
function renderProfile() {
    let container = document.getElementById('profileContainer');
    if (!container) return;
    
    let user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    let name = user ? (user.first_name || 'Player') : 'Player';
    let username = user ? (user.username || 'player') : 'player';
    
    let html = '';
    html += '<div class="profile-card">';
    html += '<div class="profile-card-header">';
    html += '<div class="profile-card-avatar">';
    if (user && user.photo_url) {
        html += '<img src="' + user.photo_url + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    } else {
        html += '🎰';
    }
    html += '</div>';
    html += '<div><div class="profile-card-name">' + name + '</div>';
    html += '<div class="profile-card-level">📊 Уровень ' + userLevel + '</div></div></div>';
    html += '<div class="profile-stats">';
    html += '<div class="profile-stat-item"><div class="profile-stat-value">' + getStars() + '</div><div class="profile-stat-label">⭐ Звёзд</div></div>';
    html += '<div class="profile-stat-item"><div class="profile-stat-value">' + getGram().toFixed(2) + '</div><div class="profile-stat-label">💎 GRAM</div></div>';
    html += '<div class="profile-stat-item"><div class="profile-stat-value">' + openedCases + '</div><div class="profile-stat-label">📦 Кейсов</div></div>';
    html += '<div class="profile-stat-item"><div class="profile-stat-value">' + inventory.length + '</div><div class="profile-stat-label">💎 NFT</div></div>';
    html += '<div class="profile-stat-item"><div class="profile-stat-value">' + userXP + '/' + (userLevel * 100) + '</div><div class="profile-stat-label">📈 Опыт</div></div>';
    html += '</div></div>';
    
    html += '<div class="profile-ref-section">';
    html += '<div class="profile-ref-title">👥 Реферальная программа</div>';
    html += '<div class="profile-ref-link" id="refLink">Загрузка...</div>';
    html += '<div class="profile-ref-count">';
    html += '<div class="profile-ref-count-value" id="refCount">0</div>';
    html += '<div class="profile-ref-count-label">Приглашённых друзей</div>';
    html += '</div>';
    html += '<button class="profile-btn-copy" onclick="copyRefLink()">📋 Копировать ссылку</button>';
    html += '</div>';
    
    html += '<div class="profile-promo-section">';
    html += '<div class="profile-promo-title">🎟️ Промокод</div>';
    html += '<input type="text" id="promoInput" class="profile-promo-input" placeholder="Введите промокод">';
    html += '<button class="profile-btn" onclick="activatePromo()">Активировать</button>';
    html += '</div>';
    
    container.innerHTML = html;
    loadRefLink();
}

function loadRefLink() {
    let uid = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : '000';
    let refEl = document.getElementById('refLink');
    let countEl = document.getElementById('refCount');
    if (refEl) refEl.textContent = 'https://t.me/gsdfsdfdsfbot?start=ref_' + uid;
    if (countEl) countEl.textContent = localStorage.getItem('refCount') || '0';
}

function copyRefLink() {
    let refEl = document.getElementById('refLink');
    if (refEl) {
        navigator.clipboard.writeText(refEl.textContent);
        tg.showPopup({title:'Скопировано!', message:'Ссылка в буфере', buttons:[{type:'ok'}]});
    }
}

function activatePromo() {
    let input = document.getElementById('promoInput');
    if (!input) return;
    let code = input.value.trim().toUpperCase();
    if (!code) { tg.showAlert('Введите промокод'); return; }
    let codes = {'WELCOME':100, 'NEWYEAR2026':200, 'LUCKY':150};
    let used = JSON.parse(localStorage.getItem('usedPromos') || '[]');
    if (used.indexOf(code) !== -1) { tg.showAlert('Промокод уже использован!'); return; }
    if (!codes[code]) { tg.showAlert('Неверный промокод!'); return; }
    setStars(getStars() + codes[code]);
    used.push(code);
    localStorage.setItem('usedPromos', JSON.stringify(used));
    tg.showPopup({title:'🎉 Активировано!', message:'+' + codes[code] + ' ⭐ звёзд!', buttons:[{type:'ok'}]});
    input.value = '';
    generateCases();
}

// ===== GAMES STUBS =====
function showMinesweeper() { tg.showAlert('💣 Сапёр скоро появится!'); }
function showComingSoon() { tg.showAlert('🔄 Скоро появится!'); }

function showPromoGames() {
    let container = document.getElementById('gamesContent');
    if (!container) return;
    container.innerHTML = `
        <div style="padding:20px;max-width:400px;margin:0 auto;">
            <div style="background:rgba(30,20,50,0.6);border-radius:20px;padding:25px;border:1px solid rgba(139,92,246,0.15);">
                <h3 style="font-size:20px;font-weight:800;margin-bottom:15px;color:#a78bfa;">🎟️ Активация промокода</h3>
                <input type="text" id="promoInputGame" placeholder="Введите промокод" style="width:100%;padding:15px;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.06);border-radius:12px;color:#fff;font-size:15px;margin-bottom:12px;">
                <button onclick="activatePromoGame()" style="width:100%;padding:16px;background:linear-gradient(135deg,#8b5cf6,#6366f1);border:none;border-radius:12px;color:#fff;font-size:16px;font-weight:700;cursor:pointer;">Активировать</button>
            </div>
        </div>
    `;
}

function activatePromoGame() {
    let input = document.getElementById('promoInputGame');
    if (!input) return;
    let code = input.value.trim().toUpperCase();
    if (!code) { tg.showAlert('Введите промокод'); return; }
    let codes = {'WELCOME':100, 'NEWYEAR2026':200, 'LUCKY':150};
    let used = JSON.parse(localStorage.getItem('usedPromos') || '[]');
    if (used.indexOf(code) !== -1) { tg.showAlert('Промокод уже использован!'); return; }
    if (!codes[code]) { tg.showAlert('Неверный промокод!'); return; }
    setStars(getStars() + codes[code]);
    used.push(code);
    localStorage.setItem('usedPromos', JSON.stringify(used));
    tg.showPopup({title:'🎉 Активировано!', message:'+' + codes[code] + ' ⭐ звёзд!', buttons:[{type:'ok'}]});
    input.value = '';
}

// ===== ADMIN =====
function openAdminPanel() {
    if (!isAdmin) return;
    let panel = document.getElementById('adminPanel');
    if (panel) panel.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadAdminStats();
    loadAllUsers();
}

function closeAdminPanel() {
    let panel = document.getElementById('adminPanel');
    if (panel) panel.classList.remove('active');
    document.body.style.overflow = '';
}

function loadAdminStats() {
    let statsEl = document.getElementById('adminStats');
    if (!statsEl) return;
    statsEl.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:15px;"><div class="admin-stat-card"><div class="admin-stat-icon">⭐</div><div class="admin-stat-value">' + getStars() + '</div><div class="admin-stat-label">Звёзд</div></div><div class="admin-stat-card"><div class="admin-stat-icon">💎</div><div class="admin-stat-value">' + getGram().toFixed(2) + '</div><div class="admin-stat-label">GRAM</div></div><div class="admin-stat-card"><div class="admin-stat-icon">📦</div><div class="admin-stat-value">' + openedCases + '</div><div class="admin-stat-label">Кейсов</div></div><div class="admin-stat-card"><div class="admin-stat-icon">💎</div><div class="admin-stat-value">' + inventory.length + '</div><div class="admin-stat-label">NFT</div></div><div class="admin-stat-card"><div class="admin-stat-icon">🏆</div><div class="admin-stat-value">' + achievements.length + '</div><div class="admin-stat-label">Ачивок</div></div></div>';
}

function loadAllUsers() {
    let user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    let listEl = document.getElementById('adminUsersList');
    if (!listEl) return;
    let name = user ? (user.first_name || 'Admin') : 'Admin';
    let username = user ? (user.username || 'admin') : 'admin';
    let id = user ? user.id : 0;
    let avatar = name.charAt(0);
    listEl.innerHTML = '<div class="admin-user-row"><div style="display:flex;align-items:center;gap:15px;flex:1;"><div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;">' + avatar + '</div><div><div style="font-size:16px;font-weight:700;">' + name + ' <span style="background:linear-gradient(135deg,#fbbf24,#f59e0b);padding:3px 8px;border-radius:8px;font-size:11px;color:#000;">ADMIN</span></div><div style="font-size:13px;color:#6b7280;">@' + username + ' • ID: ' + id + '</div><div style="display:flex;gap:12px;margin-top:8px;font-size:12px;color:#6b7280;"><span>⭐ ' + getStars() + '</span><span>💎 ' + getGram().toFixed(2) + '</span><span>📊 Lvl ' + userLevel + '</span><span>📦 ' + openedCases + '</span></div></div></div></div><div style="padding:20px;text-align:center;color:#6b7280;font-size:14px;border-top:1px solid rgba(255,255,255,0.05);margin-top:10px;"><div style="font-size:32px;margin-bottom:8px;">👥</div>Для просмотра всех пользователей нужен backend</div>';
}

function switchAdminTab(tab) {
    let tabs = document.querySelectorAll('.admin-tab-vertical');
    for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    let target = document.querySelector('.admin-tab-vertical[data-tab="' + tab + '"]');
    if (target) target.classList.add('active');
    
    let contents = document.querySelectorAll('.admin-tab-content');
    for (let j = 0; j < contents.length; j++) contents[j].classList.remove('active');
    let content = document.getElementById('adminTab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (content) content.classList.add('active');
    
    if (tab === 'stats') loadAdminStats();
    if (tab === 'users') loadAllUsers();
}

function sendGlobalNotification() { tg.showPopup({title:'📢', message:'Требует backend', buttons:[{type:'ok'}]}); }
function createPromoCode() { tg.showPopup({title:'🎟️ Промокоды', message:'WELCOME → 100 ⭐\nNEWYEAR2026 → 200 ⭐\nLUCKY → 150 ⭐', buttons:[{type:'ok'}]}); }
function exportUserData() {
    let data = {stars:getStars(), gram:getGram(), level:userLevel, cases:openedCases, inventory:inventory, achievements:achievements};
    let blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'export.json';
    a.click();
    tg.showAlert('Данные экспортированы!');
}

// ===== INIT =====
function initParticles() {
    let canvas = document.getElementById('particles');
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let pts = [];
    for (let i = 0; i < 50; i++) {
        pts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            vx: Math.random() * 0.5 - 0.25,
            vy: Math.random() * 0.5 - 0.25,
            o: Math.random() * 0.5 + 0.2
        });
    }
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < pts.length; i++) {
            let p = pts[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139,92,246,' + p.o + ')';
            ctx.fill();
        }
        requestAnimationFrame(loop);
    }
    loop();
}

function startLoaderAnimation() {
    const progressBar = document.getElementById('loaderProgressBar');
    const progressText = document.getElementById('loaderProgressText');
    const loader = document.getElementById('loader');
    const particlesContainer = document.getElementById('loaderParticles');
    
    if (particlesContainer) {
        for (let i = 0; i < 10; i++) {
            const span = document.createElement('span');
            particlesContainer.appendChild(span);
        }
    }
    
    if (!progressBar || !loader) {
        if (typeof init === 'function') init();
        return;
    }
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 3 + 1;
        if (progress > 100) progress = 100;
        
        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) progressText.textContent = Math.floor(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
                if (typeof init === 'function') init();
            }, 300);
        }
    }, 150);
}

function loadUserProgress() {
    userLevel = parseInt(localStorage.getItem('userLevel') || '1', 10);
    userXP = parseInt(localStorage.getItem('userXP') || '0', 10);
    openedCases = parseInt(localStorage.getItem('openedCases') || '0', 10);
    updateLevelDisplay();
}

function init() {
    let user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    if (user) {
        let nameEl = document.getElementById('userName');
        if (nameEl) nameEl.textContent = user.first_name || 'Player';
        if (user.id === ADMIN_ID) {
            isAdmin = true;
            let badge = document.getElementById('adminBadge');
            if (badge) badge.classList.remove('hidden');
        }
        let av = document.getElementById('avatarContainer');
        if (av) {
            if (user.photo_url) {
                av.innerHTML = '<img src="' + user.photo_url + '" alt="Avatar">';
            } else if (user.username) {
                av.textContent = user.username.charAt(0).toUpperCase();
            }
        }
    }
    
    document.getElementById('balance').textContent = getStars();
    document.getElementById('gramBalance').textContent = getGram().toFixed(2);
    
    loadUserProgress();
    loadInventory();
    loadAchievements();
    generateFakeHistory();
    generateCases();
    loadRefLink();
    fetchOnlineCount();
    loadHistory();
    initParticles();
    startFreeTimer();
    
    setInterval(fetchOnlineCount, 15000);
    
    let filterBtns = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < filterBtns.length; i++) {
        filterBtns[i].addEventListener('click', function() {
            let btns = document.querySelectorAll('.filter-btn');
            for (let j = 0; j < btns.length; j++) btns[j].classList.remove('active');
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            generateCases();
        });
    }
    
    checkMythicAchievement();
}

document.addEventListener('DOMContentLoaded', function() {
    startLoaderAnimation();
});
