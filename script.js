// script.js - полный файл с анимацией загрузки
let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();
tg.setHeaderColor('#0a0a0f');
tg.setBackgroundColor('#0a0a0f');

const ADMIN_ID = 6584350034;

const NFT_DATABASE = [
    {id:0, name:"Подарок",    stars:0,   ton:0,    image:"nft/Gift.jpg",         isCurrency:true,  amount:1,  rarity:"special"},
    {id:1, name:"звезды",     stars:3,   ton:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:3,  rarity:"common"},
    {id:2, name:"звёзд",      stars:5,   ton:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:5,  rarity:"common"},
    {id:3, name:"звёзд",      stars:15,  ton:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:15, rarity:"rare"},
    {id:4, name:"звёзд",      stars:50,  ton:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:50, rarity:"epic"},
    {id:5, name:"1 may",         stars:20,  ton:0.10, image:"nft/1 may.jpg",        rarity:"legendary"},
    {id:6, name:"Artisan Brick", stars:9400,  ton:100, image:"nft/Artisan Brick.jpg",rarity:"legendary"},
    {id:7, name:"Astral Shard",  stars:21000,  ton:220, image:"nft/Astral Shard.jpg", rarity:"mythic"},
    {id:8, name:"Backpack",      stars:500,  ton:0.35, image:"nft/Backpack.jpg",      rarity:"legendary"},
    {id:9, name:"Crystal Eagle", stars:3881,  ton:41.25, image:"nft/Crystal Eagle.jpg",rarity:"mythic"},
    {id:10,name:"Durovs Cap",    stars:78550, ton:800, image:"nft/Durovs Cap.jpg",    rarity:"mythic"},
    {id:11,name:"Faith Amulet",  stars:650, ton:6, image:"nft/Faith Amulet.jpg",  rarity:"legendary"},
    {id:12,name:"Happy Brownie", stars:500, ton:5, image:"nft/Happy Brownie.jpg", rarity:"legendary"},
    {id:13,name:"Instant Ramen", stars:540, ton:3, image:"nft/Instant Ramen.jpg", rarity:"legendary"},
    {id:14,name:"Jolly Chimp",   stars:756, ton:8, image:"nft/Jolly Chimp.jpg",   rarity:"legendary"},
    {id:15,name:"Сердце",        stars:0,   ton:0,    image:"nft/Gift.jpg",         isCurrency:true,  amount:1,  rarity:"special"},
    {id:16,name:"Mighty Arm",    stars:1500, ton:15, image:"nft/Mighty Arm.jpg",   rarity:"legendary"}
];

const CASES_DATA = {
    free: {
        name: "🎁 Бесплатный кейс",
        icon: "🎁",
        price: 0,
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
        type: "basic",
        cooldown: false,
        items: [
            { nft: NFT_DATABASE[1],  chance: 35.0 },
            { nft: NFT_DATABASE[2],  chance: 25.0 },
            { nft: NFT_DATABASE[3],  chance: 15.0 },
            { nft: NFT_DATABASE[4],  chance: 8.0  },
            { nft: NFT_DATABASE[15], chance: 8.0  },
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
        type: "premium",
        cooldown: false,
        items: [
            { nft: NFT_DATABASE[2],  chance: 18.0 },
            { nft: NFT_DATABASE[3],  chance: 15.0 },
            { nft: NFT_DATABASE[4],  chance: 10.0 },
            { nft: NFT_DATABASE[15], chance: 12.0 },
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
        price: 1000,
        type: "legendary",
        cooldown: false,
        items: [
            { nft: NFT_DATABASE[15], chance: 50.0 },
            { nft: NFT_DATABASE[16], chance: 50.0 }
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
let currentCase = null;
let userLevel = 1;
let userXP = 0;
let isAdmin = false;
let inventory = [];
let openedCases = 0;
let achievements = [];
let globalHistory = [];
let freeTimerInterval = null;
let currentWinItem = null;
let isRouletteSpinning = false;
let rouletteTimeout = null;

function getStars() {
    return parseInt(localStorage.getItem('gameStars') || '0', 10);
}

function setStars(val) {
    val = Math.max(0, val);
    localStorage.setItem('gameStars', val);
    let balanceEl = document.getElementById('balance');
    if (balanceEl) {
        balanceEl.textContent = val;
    }
}

function checkCanOpen(caseKey) {
    let data = CASES_DATA[caseKey];
    if (!data) {
        return { ok: false, reason: 'Кейс не найден' };
    }

    if (data.cooldown) {
        let ms = getFreeMsLeft();
        if (ms > 0) {
            return { ok: false, reason: '⏰ Бесплатный кейс раз в 24 часа!\n\nОсталось: ' + msToHM(ms) };
        }
    }

    if (data.price > 0) {
        let stars = getStars();
        if (stars < data.price) {
            return { ok: false, reason: '❌ Недостаточно звёзд!\n\nУ вас: ' + stars + ' ⭐\nНужно: ' + data.price + ' ⭐' };
        }
    }

    return { ok: true };
}

function getFreeMsLeft() {
    let last = localStorage.getItem('lastFreeCase');
    if (!last) {
        return 0;
    }
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
    if (freeTimerInterval) {
        clearInterval(freeTimerInterval);
    }
    freeTimerInterval = setInterval(function() {
        let ms = getFreeMsLeft();
        let timerEl = document.getElementById('freeCountdown');
        let statusEl = document.getElementById('freeStatus');
        if (!timerEl) {
            return;
        }

        if (ms <= 0) {
            clearInterval(freeTimerInterval);
            freeTimerInterval = null;
            if (statusEl) {
                statusEl.textContent = '✅ ДОСТУПЕН';
                statusEl.style.color = '#10b981';
            }
            timerEl.textContent = '';
            let card = document.getElementById('freeCard');
            if (card) {
                card.style.opacity = '1';
            }
        } else {
            if (statusEl) {
                statusEl.textContent = '🔒 ЗАБЛОКИРОВАН';
                statusEl.style.color = '#ef4444';
            }
            timerEl.textContent = msToHM(ms);
        }
    }, 1000);
}

function initParticles() {
    let canvas = document.getElementById('particles');
    if (!canvas) {
        return;
    }
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
            if (p.x < 0 || p.x > canvas.width) {
                p.vx *= -1;
            }
            if (p.y < 0 || p.y > canvas.height) {
                p.vy *= -1;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139,92,246,' + p.o + ')';
            ctx.fill();
        }
        requestAnimationFrame(loop);
    }
    loop();
}

function hideLoader() {
    let loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

function init() {
    let user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    if (user) {
        let nameEl = document.getElementById('userName');
        if (nameEl) {
            nameEl.textContent = user.first_name || 'Player';
        }
        if (user.id === ADMIN_ID) {
            isAdmin = true;
            let badge = document.getElementById('adminBadge');
            if (badge) {
                badge.classList.remove('hidden');
            }
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

    let balanceEl = document.getElementById('balance');
    if (balanceEl) {
        balanceEl.textContent = getStars();
    }

    loadUserProgress();
    loadInventory();
    loadAchievements();
    generateFakeHistory();
    generateCases();
    loadRefLink();
    fetchOnlineCount();
    loadHistory();
    initParticles();
    hideLoader();
    startFreeTimer();

    setInterval(fetchOnlineCount, 15000);

    let filterBtns = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < filterBtns.length; i++) {
        filterBtns[i].addEventListener('click', function() {
            let btns = document.querySelectorAll('.filter-btn');
            for (let j = 0; j < btns.length; j++) {
                btns[j].classList.remove('active');
            }
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            generateCases();
        });
    }

    checkMythicAchievement();
}

function loadUserProgress() {
    userLevel = parseInt(localStorage.getItem('userLevel') || '1', 10);
    userXP = parseInt(localStorage.getItem('userXP') || '0', 10);
    openedCases = parseInt(localStorage.getItem('openedCases') || '0', 10);
    updateLevelDisplay();
}

function updateLevelDisplay() {
    let xpNeeded = userLevel * 100;
    let levelEl = document.getElementById('userLevel');
    let xpEl = document.getElementById('userXP');
    if (levelEl) {
        levelEl.textContent = 'Level ' + userLevel;
    }
    if (xpEl) {
        xpEl.textContent = userXP + '/' + xpNeeded + ' XP';
    }
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

function getRarityColor(r) {
    let colors = {common:'#9e9e9e', rare:'#3b82f6', epic:'#a855f7', legendary:'#fbbf24', mythic:'#ef4444', special:'#10b981'};
    return colors[r] || '#fff';
}

function generateCases() {
    let container = document.getElementById('casesContainer');
    if (!container) {
        return;
    }

    let entries = Object.keys(CASES_DATA).filter(function(key) {
        let data = CASES_DATA[key];
        if (currentFilter === 'all') {
            return true;
        }
        if (currentFilter === 'free') {
            return data.price === 0;
        }
        if (currentFilter === 'basic') {
            return data.type === 'basic';
        }
        if (currentFilter === 'premium') {
            return data.type === 'premium';
        }
        if (currentFilter === 'legendary') {
            return data.type === 'legendary';
        }
        return true;
    });

    let html = '';
    for (let i = 0; i < entries.length; i++) {
        let key = entries[i];
        let data = CASES_DATA[key];
        let locked = data.cooldown ? getFreeMsLeft() > 0 : false;
        let ms = locked ? getFreeMsLeft() : 0;
        let stars = getStars();
        let canAfford = data.price === 0 || stars >= data.price;

        let footerHtml = '';
        if (data.price === 0) {
            let statusText = locked ? '🔒 ЗАБЛОКИРОВАН' : '✅ ДОСТУПЕН';
            let statusColor = locked ? '#ef4444' : '#10b981';
            let timerText = locked ? msToHM(ms) : '';
            footerHtml = '<div><div id="freeStatus" style="font-weight:700;font-size:12px;color:' + statusColor + ';">' + statusText + '</div><div id="freeCountdown" style="color:#6b7280;font-size:10px;margin-top:2px;">' + timerText + '</div></div>';
        } else {
            let priceColor = canAfford ? '#ffd700' : '#ef4444';
            let shortText = canAfford ? '' : '<div style="color:#ef4444;font-size:10px;margin-top:1px;">Не хватает ' + (data.price - stars) + ' ⭐</div>';
            footerHtml = '<div><div style="color:' + priceColor + ';font-size:20px;font-weight:900;">⭐ ' + data.price + '</div>' + shortText + '</div>';
        }

        let cardId = key === 'free' ? 'freeCard' : '';
        let opacity = locked ? '0.6' : '1';
        let badge = data.price === 0 ? '<div class="case-badge">FREE</div>' : '';

        html += '<div class="case-big" id="' + cardId + '" onclick="showPreview(\'' + key + '\')" style="opacity:' + opacity + ';">' + badge + '<div class="case-image-section"><div class="case-main-image" style="font-size:60px;">' + data.icon + '</div></div><div class="case-info-section"><div class="case-title" style="font-size:16px;">' + data.name + '</div><div class="case-footer">' + footerHtml + '</div></div></div>';
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

function showPreview(caseKey) {
    let data = CASES_DATA[caseKey];
    if (!data) {
        return;
    }

    let check = checkCanOpen(caseKey);
    if (!check.ok) {
        tg.showAlert(check.reason);
        return;
    }

    currentCase = caseKey;

    let titleEl = document.getElementById('previewCaseTitle');
    let iconEl = document.getElementById('previewCaseIcon');
    let nameEl = document.getElementById('previewCaseName');
    let priceEl = document.getElementById('previewCasePrice');
    let btn = document.getElementById('previewOpenBtn');

    if (titleEl) titleEl.textContent = data.name;
    if (iconEl) iconEl.textContent = data.icon;
    if (nameEl) nameEl.textContent = data.name.toUpperCase();
    if (priceEl) priceEl.textContent = data.price === 0 ? 'БЕСПЛАТНО' : '⭐ ' + data.price;

    if (btn) {
        btn.textContent = data.price === 0 ? 'Открыть бесплатно' : 'Открыть за ⭐ ' + data.price;
        btn.disabled = false;
        btn.style.opacity = '1';
    }

    let track = document.getElementById('previewRollingTrack');
    if (track) {
        track.innerHTML = '';
        let itemsToShow = data.items.concat(data.items).concat(data.items);
        for (let i = 0; i < itemsToShow.length; i++) {
            let item = itemsToShow[i];
            let nft = item.nft;
            let div = document.createElement('div');
            div.className = 'preview-rolling-item';
            let color = nft.isCurrency ? '#fbbf24' : getRarityColor(nft.rarity);
            div.style.borderColor = color;

            if (nft.isCurrency) {
                div.innerHTML = '<img src="' + nft.image + '" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"><div class="item-name">' + nft.name + '</div><div class="item-rarity-label" style="color:' + color + ';">' + nft.rarity + '</div>';
            } else {
                div.innerHTML = '<img src="' + nft.image + '" alt="' + nft.name + '" onerror="this.parentElement.innerHTML=\'<div class=item-icon>💎</div>\'"><div class="item-name">' + nft.name + '</div><div class="item-rarity-label" style="color:' + color + ';">' + nft.rarity + '</div>';
            }
            track.appendChild(div);
        }
    }

    let itemsList = document.getElementById('previewItemsList');
    if (itemsList) {
        let listHtml = '<div class="preview-items-title">💎 Возможные награды</div>';
        for (let j = 0; j < data.items.length; j++) {
            let it = data.items[j];
            let nft = it.nft;
            if (!nft) continue;
            if (nft.isCurrency) {
                listHtml += '<div class="preview-item-row"><div class="preview-item-icon" style="border-color:#fbbf24;overflow:hidden;"><img src="' + nft.image + '" style="width:100%;height:100%;object-fit:cover;"></div><div class="preview-item-info"><div class="preview-item-name">' + nft.name + '</div><div class="preview-item-rarity" style="color:#fbbf24;">Валюта</div></div><div class="preview-item-chance">' + it.chance + '%</div></div>';
            } else {
                let color = getRarityColor(nft.rarity);
                listHtml += '<div class="preview-item-row"><div class="preview-item-icon" style="border-color:' + color + ';"><img src="' + nft.image + '" alt="' + nft.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.style.display=\'none\'"></div><div class="preview-item-info"><div class="preview-item-name">' + nft.name + '</div><div class="preview-item-rarity" style="color:' + color + ';">' + nft.rarity.toUpperCase() + '</div><div class="preview-item-price">⭐ ' + nft.stars + ' • 💎 ' + nft.ton + ' TON</div></div><div class="preview-item-chance">' + it.chance + '%</div></div>';
            }
        }
        itemsList.innerHTML = listHtml;
    }

    let modal = document.getElementById('modalPreview');
    if (modal) {
        modal.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
    let modal = document.getElementById('modalPreview');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
    currentCase = null;
}

function openCaseFromPreview() {
    if (!currentCase) {
        return;
    }

    let data = CASES_DATA[currentCase];
    let check = checkCanOpen(currentCase);

    if (!check.ok) {
        tg.showAlert(check.reason);
        closePreviewModal();
        generateCases();
        return;
    }

    if (data.price > 0) {
        setStars(getStars() - data.price);
        generateCases();
    }

    if (data.cooldown) {
        localStorage.setItem('lastFreeCase', new Date().toISOString());
        generateCases();
        startFreeTimer();
    }

    let key = currentCase;
    closePreviewModal();
    setTimeout(function() {
        startRoulette(key);
    }, 300);
}

function startRoulette(caseKey) {
    if (isRouletteSpinning) {
        return;
    }
    isRouletteSpinning = true;

    let data = CASES_DATA[caseKey];
    if (!data) {
        isRouletteSpinning = false;
        return;
    }

    let modal = document.getElementById('modalRoulette');
    let track = document.getElementById('rouletteTrack');
    let resultBox = document.getElementById('resultBox');
    let title = document.getElementById('rouletteTitle');
    let skipBtn = document.getElementById('skipBtn');

    if (!modal || !track) {
        isRouletteSpinning = false;
        return;
    }

    modal.classList.add('active');
    if (resultBox) {
        resultBox.classList.remove('active');
    }
    if (title) {
        title.textContent = '🎲 ОТКРЫВАЕМ...';
    }
    if (skipBtn) {
        skipBtn.style.display = 'block';
    }
    document.body.style.overflow = 'hidden';

    track.style.transition = 'none';
    track.style.transform = 'translateX(0px)';
    track.innerHTML = '';

    let WIN_IDX = 35;
    let TOTAL = 60;
    let winItem = getRandomItemByChance(data.items);
    currentWinItem = winItem;

    for (let i = 0; i < TOTAL; i++) {
        let item = (i === WIN_IDX) ? winItem : data.items[Math.floor(Math.random() * data.items.length)];
        let div = document.createElement('div');
        div.className = 'roulette-item';
        let borderColor = item.nft.isCurrency ? '#fbbf24' : getRarityColor(item.nft.rarity);
        div.style.borderColor = borderColor;
        if (item.nft.isCurrency) {
            div.innerHTML = '<img src="' + item.nft.image + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
        } else {
            div.innerHTML = '<img src="' + item.nft.image + '" alt="' + item.nft.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.parentElement.innerHTML=\'<div style=font-size:60px>💎</div>\'">';
        }
        track.appendChild(div);
    }

    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            let firstItem = track.children[0];
            if (!firstItem) {
                isRouletteSpinning = false;
                return;
            }

            let itemW = firstItem.getBoundingClientRect().width;
            let gap = 10;
            let stepW = itemW + gap;

            let wrapper = track.parentElement;
            let wrapW = wrapper ? wrapper.getBoundingClientRect().width : 370;
            let center = wrapW / 2;

            let winCenterX = WIN_IDX * stepW + itemW / 2;
            let offset = center - winCenterX;

            track.style.transition = 'transform 5s cubic-bezier(0.05, 0.85, 0.15, 1)';
            track.style.transform = 'translateX(' + offset + 'px)';
            if (title) {
                title.textContent = '🎰 КРУТИМ...';
            }

            if (rouletteTimeout) {
                clearTimeout(rouletteTimeout);
            }
            rouletteTimeout = setTimeout(function() {
                if (title) {
                    title.textContent = '🎉 РЕЗУЛЬТАТ!';
                }
                showResult(winItem.nft, caseKey);
                openedCases++;
                localStorage.setItem('openedCases', openedCases);
                checkAchievements();
                checkMythicAchievement();
                generateCases();
                if (skipBtn) {
                    skipBtn.style.display = 'none';
                }
                isRouletteSpinning = false;
                rouletteTimeout = null;
            }, 5500);
        });
    });
}

function skipRoulette() {
    if (!currentWinItem || !isRouletteSpinning) {
        return;
    }

    let track = document.getElementById('rouletteTrack');
    let title = document.getElementById('rouletteTitle');
    let skipBtn = document.getElementById('skipBtn');

    if (rouletteTimeout) {
        clearTimeout(rouletteTimeout);
        rouletteTimeout = null;
    }

    if (track) {
        track.style.transition = 'transform 0.3s cubic-bezier(0.05, 0.85, 0.15, 1)';
    }
    if (title) {
        title.textContent = '🎉 РЕЗУЛЬТАТ!';
    }

    let WIN_IDX = 35;
    if (track) {
        let firstItem = track.children[0];
        if (firstItem) {
            let itemW = firstItem.getBoundingClientRect().width;
            let gap = 10;
            let stepW = itemW + gap;
            let wrapper = track.parentElement;
            let wrapW = wrapper ? wrapper.getBoundingClientRect().width : 370;
            let center = wrapW / 2;
            let winCenterX = WIN_IDX * stepW + itemW / 2;
            let offset = center - winCenterX;
            track.style.transform = 'translateX(' + offset + 'px)';
        }
    }

    setTimeout(function() {
        if (skipBtn) {
            skipBtn.style.display = 'none';
        }
        showResult(currentWinItem.nft, currentCase);
        openedCases++;
        localStorage.setItem('openedCases', openedCases);
        checkAchievements();
        checkMythicAchievement();
        generateCases();
        isRouletteSpinning = false;
    }, 400);
}

function closeRouletteModal() {
    let modal = document.getElementById('modalRoulette');
    let track = document.getElementById('rouletteTrack');
    let skipBtn = document.getElementById('skipBtn');

    if (rouletteTimeout) {
        clearTimeout(rouletteTimeout);
        rouletteTimeout = null;
    }

    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
    isRouletteSpinning = false;

    if (track) {
        track.style.display = 'flex';
        track.style.transition = 'none';
        track.style.transform = 'translateX(0px)';
        track.innerHTML = '';
    }
    if (skipBtn) {
        skipBtn.style.display = 'block';
    }
}

function getRandomItemByChance(items) {
    let rand = Math.random() * 100;
    let cum = 0;
    for (let i = 0; i < items.length; i++) {
        cum += items[i].chance;
        if (rand <= cum) {
            return items[i];
        }
    }
    return items[items.length - 1];
}

function showResult(nft, caseKey) {
    let resultBox = document.getElementById('resultBox');
    if (resultBox) {
        resultBox.classList.add('active');
    }

    if (nft.isCurrency) {
        let isStars = nft.name.indexOf('звезд') !== -1 || nft.name.indexOf('звёзд') !== -1 || nft.name.indexOf('Сердце') !== -1;
        if (isStars) {
            let newBal = getStars() + nft.amount;
            setStars(newBal);
            let iconEl = document.getElementById('resultIcon');
            let nameEl = document.getElementById('resultName');
            let rarityEl = document.getElementById('resultRarity');
            let starsEl = document.getElementById('resultStars');
            let tonEl = document.getElementById('resultTon');
            if (iconEl) iconEl.innerHTML = '<img src="' + nft.image + '" style="width:140px;height:140px;object-fit:cover;border-radius:12px;">';
            if (nameEl) {
                // Убираем цифру из названия, чтобы не было дублирования
                let cleanName = nft.name.replace(/^\d+\s*/, '');
                nameEl.textContent = '+' + nft.amount + ' ' + cleanName;
            }
            if (rarityEl) rarityEl.textContent = 'ВАЛЮТА';
            if (starsEl) starsEl.innerHTML = 'Баланс: ⭐ ' + newBal;
            if (tonEl) tonEl.innerHTML = '';
            addXP(nft.amount);
        } else {
            let iconEl2 = document.getElementById('resultIcon');
            let nameEl2 = document.getElementById('resultName');
            let rarityEl2 = document.getElementById('resultRarity');
            let starsEl2 = document.getElementById('resultStars');
            let tonEl2 = document.getElementById('resultTon');
            if (iconEl2) iconEl2.innerHTML = '<img src="' + nft.image + '" style="width:140px;height:140px;object-fit:cover;border-radius:12px;">';
            if (nameEl2) nameEl2.textContent = 'Подарок';
            if (rarityEl2) rarityEl2.textContent = 'ОСОБОЕ';
            if (starsEl2) starsEl2.innerHTML = '🎁 Сюрприз!';
            if (tonEl2) tonEl2.innerHTML = '';
            addXP(10);
        }
        if (resultBox) resultBox.style.borderColor = '#fbbf24';
        let rarityEl3 = document.getElementById('resultRarity');
        if (rarityEl3) rarityEl3.style.background = '#fbbf24';
    } else {
        let iconEl3 = document.getElementById('resultIcon');
        let nameEl3 = document.getElementById('resultName');
        let rarityEl4 = document.getElementById('resultRarity');
        let starsEl3 = document.getElementById('resultStars');
        let tonEl3 = document.getElementById('resultTon');
        if (iconEl3) iconEl3.innerHTML = '<img src="' + nft.image + '" alt="' + nft.name + '" style="width:140px;height:140px;object-fit:cover;border-radius:12px;" onerror="this.style.display=\'none\'">';
        if (nameEl3) nameEl3.textContent = nft.name;
        if (rarityEl4) rarityEl4.textContent = nft.rarity.toUpperCase();
        let color = getRarityColor(nft.rarity);
        if (resultBox) resultBox.style.borderColor = color;
        if (rarityEl4) rarityEl4.style.background = color;
        if (starsEl3) starsEl3.innerHTML = '⭐ ' + nft.stars;
        if (tonEl3) tonEl3.innerHTML = '💎 ' + nft.ton + ' TON';
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
    let colors = ['#10b981','#fbbf24','#ef4444','#3b82f6','#a855f7'];
    for (let i = 0; i < 120; i++) {
        let el = document.createElement('div');
        el.style.cssText = 'position:fixed;top:50%;left:50%;width:10px;height:10px;background:' + colors[i % colors.length] + ';border-radius:50%;z-index:9999;pointer-events:none;animation:confettiFall ' + (Math.random() * 2 + 1) + 's linear forwards;--x:' + Math.random() + ';';
        document.body.appendChild(el);
        (function(e) {
            setTimeout(function() {
                e.remove();
            }, 3000);
        })(el);
    }
}

function addToInventory(nft) {
    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    let newItem = {
        id: nft.id,
        name: nft.name,
        stars: nft.stars,
        ton: nft.ton,
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
}

function loadInventory() {
    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    renderInventory();
    checkMythicAchievement();
}

function renderInventory() {
    let c = document.getElementById('inventoryContainer');
    if (!c) {
        return;
    }

    inventory = JSON.parse(localStorage.getItem('inventory') || '[]');

    if (!inventory.length) {
        c.innerHTML = '<div style="padding:60px 20px;text-align:center;"><div style="font-size:80px;opacity:0.3;">📦</div><h3>Инвентарь пуст</h3><p style="color:#6b7280;">Открой кейсы, чтобы получить NFT</p></div>';
        return;
    }

    let order = { mythic:5, legendary:4, epic:3, rare:2, common:1 };
    let sorted = inventory.slice().sort(function(a, b) {
        return (order[b.rarity] || 0) - (order[a.rarity] || 0);
    });

    let totalTon = 0;
    for (let i = 0; i < inventory.length; i++) {
        totalTon += (inventory[i].ton || 0);
    }

    let html = '<div style="padding:20px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;"><h3>📦 Мои NFT (' + inventory.length + ')</h3><div style="font-size:14px;color:#6b7280;">💎 <span style="color:#8b5cf6;font-weight:700;">' + totalTon.toFixed(2) + ' TON</span></div></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:15px;">';

    for (let j = 0; j < sorted.length; j++) {
        let nft = sorted[j];
        let uid = nft.uid || JSON.stringify(nft);
        let safeUid = encodeURIComponent(uid);
        html += '<div style="background:rgba(30,20,50,0.5);border-radius:12px;padding:12px;border:2px solid ' + getRarityColor(nft.rarity) + ';"><div style="width:100%;height:120px;border-radius:8px;overflow:hidden;margin-bottom:8px;position:relative;"><img src="' + nft.image + '" alt="' + nft.name + '" style="width:100%;height:100%;object-fit:cover;"><div style="position:absolute;top:5px;right:5px;background:' + getRarityColor(nft.rarity) + ';padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700;">' + nft.rarity.toUpperCase() + '</div></div><div style="font-size:13px;font-weight:700;margin-bottom:4px;">' + nft.name + '</div><div style="font-size:11px;color:#6b7280;margin-bottom:8px;">💎 ' + nft.ton + ' TON • ⭐ ' + nft.stars + '</div><button onclick="sellNFT(\'' + safeUid + '\')" style="width:100%;padding:8px;background:linear-gradient(135deg,#8b5cf6,#6366f1);border:none;border-radius:8px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Продать ' + Math.floor((nft.stars || 0) * 0.7) + ' ⭐</button></div>';
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
        if (itemUid === uid) {
            idx = i;
            break;
        }
    }

    if (idx === -1) {
        tg.showAlert('Предмет не найден!');
        return;
    }

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
                if (itemUid === uid) {
                    freshIdx = j;
                    break;
                }
            }

            if (freshIdx === -1) {
                tg.showAlert('Предмет уже продан!');
                return;
            }

            inventory.splice(freshIdx, 1);
            localStorage.setItem('inventory', JSON.stringify(inventory));
            setStars(getStars() + sp);
            loadInventory();
            tg.showAlert('Продано за ' + sp + ' ⭐!');
        }
    });
}

function saveToHistory(nft) {
    let h = JSON.parse(localStorage.getItem('caseHistory') || '[]');
    let item = {
        id: nft.id,
        name: nft.name,
        stars: nft.stars,
        ton: nft.ton,
        image: nft.image,
        rarity: nft.rarity,
        time: new Date().toLocaleString('ru-RU')
    };
    h.unshift(item);
    if (h.length > 50) {
        h = h.slice(0, 50);
    }
    localStorage.setItem('caseHistory', JSON.stringify(h));
}

function loadHistory() {
    renderHistory(JSON.parse(localStorage.getItem('caseHistory') || '[]'));
}

function renderHistory(history) {
    let c = document.getElementById('historyContainer');
    if (!c) {
        return;
    }
    if (!history.length) {
        c.innerHTML = '<div style="padding:60px 20px;text-align:center;"><div style="font-size:80px;opacity:0.3;">📜</div><h3>История пуста</h3></div>';
        return;
    }
    let html = '<div style="padding:20px;"><h3 style="margin-bottom:15px;">📜 История (' + history.length + ')</h3>';
    for (let i = 0; i < history.length; i++) {
        let item = history[i];
        html += '<div style="background:rgba(30,20,50,0.5);border-radius:12px;padding:15px;margin-bottom:12px;display:flex;align-items:center;gap:15px;"><div style="width:60px;height:60px;border-radius:10px;overflow:hidden;border:2px solid ' + getRarityColor(item.rarity) + ';flex-shrink:0;"><img src="' + item.image + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'"></div><div style="flex:1;"><div style="font-size:16px;font-weight:700;">' + item.name + '</div><div style="font-size:12px;color:' + getRarityColor(item.rarity) + ';margin-top:4px;">' + (item.rarity ? item.rarity.toUpperCase() : '') + '</div><div style="font-size:11px;color:#6b7280;margin-top:4px;">' + item.time + '</div></div><div style="text-align:right;"><div style="font-size:14px;color:#ffd700;">⭐ ' + item.stars + '</div><div style="font-size:12px;color:#0088cc;">💎 ' + item.ton + ' TON</div></div></div>';
    }
    html += '</div>';
    c.innerHTML = html;
}

function loadAchievements() {
    achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    renderAchievements();
}

function renderAchievements() {
    let c = document.getElementById('achievementsContainer');
    if (!c) {
        return;
    }
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
        if (inventory[j].rarity === 'mythic') {
            hasMythic = true;
            break;
        }
    }
    if (hasMythic && achievements.indexOf('mythic') === -1) {
        unlockAchievement('mythic');
    }
}

function unlockAchievement(id) {
    let a = null;
    for (let i = 0; i < ACHIEVEMENTS.length; i++) {
        if (ACHIEVEMENTS[i].id === id) {
            a = ACHIEVEMENTS[i];
            break;
        }
    }
    if (!a) {
        return;
    }
    achievements.push(id);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    setStars(getStars() + a.reward);
    tg.showPopup({title:'🏆 Достижение!', message:a.icon + ' ' + a.name + '\n' + a.desc + '\n+' + a.reward + ' ⭐', buttons:[{type:'ok'}]});
    renderAchievements();
}

function fetchOnlineCount() {
    let el = document.getElementById('onlineCount');
    if (el) {
        el.textContent = (150 + Math.floor(Math.random() * 50) - 25) + ' Online';
    }
}

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
    if (!slider) {
        return;
    }
    let all = globalHistory.concat(globalHistory).concat(globalHistory);
    let html = '';
    for (let i = 0; i < all.length; i++) {
        let item = all[i];
        let nft = item.nft;
        let color = nft.isCurrency ? '#fbbf24' : getRarityColor(nft.rarity);
        html += '<div class="nft-card" style="border:2px solid ' + color + ';min-width:160px;height:200px;"><div class="nft-image" style="border:2px solid ' + color + ';width:90px;height:90px;margin:0 auto;">' + (nft.isCurrency ? '<img src="' + nft.image + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">' : '<img src="' + nft.image + '" onerror="this.parentElement.innerHTML=\'<div style=font-size:45px>💎</div>\'" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">') + '</div><div class="nft-value" style="color:' + color + ';font-size:13px;margin-top:10px;">' + (nft.isCurrency ? nft.name : nft.ton + ' TON') + '</div><div style="font-size:11px;color:#fff;margin-top:8px;text-align:center;">👤 ' + item.username + '</div><div style="font-size:10px;color:#6b7280;text-align:center;margin-top:4px;">' + item.time + '</div></div>';
    }
    slider.innerHTML = html;
}

function addToGlobalHistory(nft) {
    let user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    let username = user ? (user.first_name || 'Игрок') : 'Игрок';
    globalHistory.unshift({nft:nft, username:username, time:'только что'});
    if (globalHistory.length > 25) {
        globalHistory = globalHistory.slice(0, 25);
    }
    renderGlobalHistory();
}

function switchTab(tab) {
    let navItems = document.querySelectorAll('.nav-item');
    for (let i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove('active');
    }
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
    let tabContents = document.querySelectorAll('.tab-content');
    for (let j = 0; j < tabContents.length; j++) {
        tabContents[j].classList.remove('active');
    }
    let map = {games:'tabGames', inventory:'tabInventory', history:'tabHistory', achievements:'tabAchievements', profile:'tabProfile'};
    let target = document.getElementById(map[tab]);
    if (target) {
        target.classList.add('active');
    }
    if (tab === 'inventory') {
        renderInventory();
    }
    if (tab === 'history') {
        loadHistory();
    }
    if (tab === 'achievements') {
        renderAchievements();
    }
    if (tab === 'profile') {
        renderProfile();
    }
}

function renderGames() {
    let container = document.getElementById('gamesContent');
    if (!container) return;
    container.innerHTML = '';
}

function showMinesweeper() {
    tg.showAlert('💣 Сапёр скоро появится!');
}

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

function showComingSoon() {
    tg.showAlert('🔄 Скоро появится!');
}

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
    if (refEl) {
        refEl.textContent = 'https://t.me/gsdfsdfdsfbot?start=ref_' + uid;
    }
    if (countEl) {
        countEl.textContent = localStorage.getItem('refCount') || '0';
    }
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
    if (!input) {
        return;
    }
    let code = input.value.trim().toUpperCase();
    if (!code) {
        tg.showAlert('Введите промокод');
        return;
    }
    let codes = {'WELCOME':100, 'NEWYEAR2026':200, 'LUCKY':150};
    let used = JSON.parse(localStorage.getItem('usedPromos') || '[]');
    if (used.indexOf(code) !== -1) {
        tg.showAlert('Промокод уже использован!');
        return;
    }
    if (!codes[code]) {
        tg.showAlert('Неверный промокод!');
        return;
    }
    setStars(getStars() + codes[code]);
    used.push(code);
    localStorage.setItem('usedPromos', JSON.stringify(used));
    tg.showPopup({title:'🎉 Активировано!', message:'+' + codes[code] + ' ⭐ звёзд!', buttons:[{type:'ok'}]});
    input.value = '';
    generateCases();
}

function openAdminPanel() {
    if (!isAdmin) {
        return;
    }
    let panel = document.getElementById('adminPanel');
    if (panel) {
        panel.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
    loadAdminStats();
    loadAllUsers();
}

function closeAdminPanel() {
    let panel = document.getElementById('adminPanel');
    if (panel) {
        panel.classList.remove('active');
    }
    document.body.style.overflow = '';
}

function loadAdminStats() {
    let statsEl = document.getElementById('adminStats');
    if (!statsEl) {
        return;
    }
    statsEl.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:15px;"><div class="admin-stat-card"><div class="admin-stat-icon">⭐</div><div class="admin-stat-value">' + getStars() + '</div><div class="admin-stat-label">Звёзд</div></div><div class="admin-stat-card"><div class="admin-stat-icon">📦</div><div class="admin-stat-value">' + openedCases + '</div><div class="admin-stat-label">Кейсов</div></div><div class="admin-stat-card"><div class="admin-stat-icon">💎</div><div class="admin-stat-value">' + inventory.length + '</div><div class="admin-stat-label">NFT</div></div><div class="admin-stat-card"><div class="admin-stat-icon">🏆</div><div class="admin-stat-value">' + achievements.length + '</div><div class="admin-stat-label">Ачивок</div></div></div>';
}

function loadAllUsers() {
    let user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    let listEl = document.getElementById('adminUsersList');
    if (!listEl) {
        return;
    }
    let name = user ? (user.first_name || 'Admin') : 'Admin';
    let username = user ? (user.username || 'admin') : 'admin';
    let id = user ? user.id : 0;
    let avatar = name.charAt(0);
    listEl.innerHTML = '<div class="admin-user-row"><div style="display:flex;align-items:center;gap:15px;flex:1;"><div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;">' + avatar + '</div><div><div style="font-size:16px;font-weight:700;">' + name + ' <span style="background:linear-gradient(135deg,#fbbf24,#f59e0b);padding:3px 8px;border-radius:8px;font-size:11px;color:#000;">ADMIN</span></div><div style="font-size:13px;color:#6b7280;">@' + username + ' • ID: ' + id + '</div><div style="display:flex;gap:12px;margin-top:8px;font-size:12px;color:#6b7280;"><span>⭐ ' + getStars() + '</span><span>📊 Lvl ' + userLevel + '</span><span>📦 ' + openedCases + '</span><span>💎 ' + inventory.length + '</span></div></div></div><div style="display:flex;gap:8px;"><button class="admin-btn-small admin-btn-success" onclick="manageUserBalance(' + id + ',\'' + username + '\',' + getStars() + ')">💰</button><button class="admin-btn-small admin-btn-danger" onclick="resetUserProgress()">🗑️</button></div></div><div style="padding:20px;text-align:center;color:#6b7280;font-size:14px;border-top:1px solid rgba(255,255,255,0.05);margin-top:10px;"><div style="font-size:32px;margin-bottom:8px;">👥</div>Для просмотра всех пользователей нужен backend</div>';
}

function manageUserBalance(userId, username, curStars) {
    let modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = '<div class="admin-modal-content"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;"><h3 style="font-size:20px;font-weight:800;">💰 Управление балансом</h3><div style="font-size:28px;cursor:pointer;color:#6b7280;" onclick="this.closest(\'.admin-modal\').remove()">✕</div></div><div style="background:rgba(30,20,50,0.5);padding:15px;border-radius:12px;margin-bottom:20px;"><div style="font-size:18px;font-weight:700;">@' + username + '</div><div style="font-size:14px;color:#6b7280;margin-top:6px;">Баланс: <span id="modalCurStars" style="color:#8b5cf6;font-weight:700;">' + curStars + ' ⭐</span></div></div><input type="number" id="starsAmount" placeholder="Количество звёзд" min="1" style="width:100%;padding:15px;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:16px;margin-bottom:15px;"><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><button class="admin-btn admin-btn-success" onclick="giveStars(\'' + username + '\')">➕ Выдать</button><button class="admin-btn admin-btn-danger" onclick="takeStars(\'' + username + '\')">➖ Забрать</button></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;"><button class="admin-btn-quick" onclick="document.getElementById(\'starsAmount\').value=100">100</button><button class="admin-btn-quick" onclick="document.getElementById(\'starsAmount\').value=500">500</button><button class="admin-btn-quick" onclick="document.getElementById(\'starsAmount\').value=1000">1000</button></div></div>';
    document.body.appendChild(modal);
}

function giveStars(username) {
    let input = document.getElementById('starsAmount');
    if (!input) {
        return;
    }
    let amount = parseInt(input.value, 10);
    if (!amount || amount <= 0) {
        tg.showAlert('Введите количество!');
        return;
    }
    setStars(getStars() + amount);
    let modal = document.querySelector('.admin-modal');
    if (modal) {
        modal.remove();
    }
    generateCases();
    loadAllUsers();
    loadAdminStats();
    tg.showPopup({title:'✅ Выдано!', message:'+' + amount + ' ⭐\nНовый баланс: ' + getStars() + ' ⭐', buttons:[{type:'ok'}]});
}

function takeStars(username) {
    let input = document.getElementById('starsAmount');
    if (!input) {
        return;
    }
    let amount = parseInt(input.value, 10);
    if (!amount || amount <= 0) {
        tg.showAlert('Введите количество!');
        return;
    }
    setStars(getStars() - amount);
    let modal = document.querySelector('.admin-modal');
    if (modal) {
        modal.remove();
    }
    generateCases();
    loadAllUsers();
    loadAdminStats();
    tg.showPopup({title:'✅ Забрано!', message:'-' + amount + ' ⭐\nНовый баланс: ' + getStars() + ' ⭐', buttons:[{type:'ok'}]});
}

function resetUserProgress() {
    tg.showPopup({
        title:'⚠️ Сброс!',
        message:'Сбросить ВСЕ данные?\n(необратимо)',
        buttons:[{id:'yes', type:'destructive', text:'Сбросить'}, {type:'cancel'}]
    }, function(btn) {
        if (btn === 'yes') {
            let keys = ['gameStars','userLevel','userXP','openedCases','inventory','achievements','caseHistory','lastFreeCase'];
            for (let i = 0; i < keys.length; i++) {
                localStorage.removeItem(keys[i]);
            }
            userLevel = 1;
            userXP = 0;
            openedCases = 0;
            inventory = [];
            achievements = [];
            let balanceEl = document.getElementById('balance');
            if (balanceEl) {
                balanceEl.textContent = '0';
            }
            updateLevelDisplay();
            generateCases();
            closeAdminPanel();
            tg.showAlert('Прогресс сброшен!');
        }
    });
}

function sendGlobalNotification() {
    tg.showPopup({title:'📢', message:'Требует backend', buttons:[{type:'ok'}]});
}

function createPromoCode() {
    tg.showPopup({title:'🎟️ Промокоды', message:'WELCOME → 100 ⭐\nNEWYEAR2026 → 200 ⭐\nLUCKY → 150 ⭐', buttons:[{type:'ok'}]});
}

function exportUserData() {
    let data = {stars:getStars(), level:userLevel, cases:openedCases, inventory:inventory, achievements:achievements};
    let blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'export.json';
    a.click();
    tg.showAlert('Данные экспортированы!');
}

function switchAdminTab(tab) {
    let tabs = document.querySelectorAll('.admin-tab-vertical');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    let selector = '[data-tab="' + tab + '"]';
    let target = document.querySelector(selector);
    if (target) {
        target.classList.add('active');
    }
    let contents = document.querySelectorAll('.admin-tab-content');
    for (let j = 0; j < contents.length; j++) {
        contents[j].classList.remove('active');
    }
    let id = 'adminTab' + tab.charAt(0).toUpperCase() + tab.slice(1);
    let content = document.getElementById(id);
    if (content) {
        content.classList.add('active');
    }
    if (tab === 'stats') {
        loadAdminStats();
    }
    if (tab === 'users') {
        loadAllUsers();
    }
}


// ===== АНИМАЦИЯ ЗАГРУЗКИ =====
function startLoaderAnimation() {
    let progress = 0;
    const progressBar = document.getElementById('loaderProgressBar');
    const progressText = document.getElementById('loaderProgressText');
    const loader = document.getElementById('loader');
    
    // Создаем частицы
    const particlesContainer = document.getElementById('loaderParticles');
    if (particlesContainer) {
        for (let i = 0; i < 10; i++) {
            const span = document.createElement('span');
            particlesContainer.appendChild(span);
        }
    }
    
    // Анимируем прогресс
    const interval = setInterval(() => {
        progress += Math.random() * 3 + 1;
        if (progress > 100) progress = 100;
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressText) {
            progressText.textContent = Math.floor(progress) + '%';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (loader) {
                    loader.classList.add('hidden');
                }
                // Запускаем основное приложение
                init();
            }, 500);
        }
    }, 150);
}

// Запускаем анимацию загрузки при загрузке страницы
// Убираем вызов init() здесь, так как он вызывается внутри startLoaderAnimation()
document.addEventListener('DOMContentLoaded', function() {
    startLoaderAnimation();
});
