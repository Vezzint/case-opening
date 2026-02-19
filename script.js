let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();
tg.setHeaderColor('#0a0a0f');
tg.setBackgroundColor('#0a0a0f');

const ADMIN_ID = 6584350034;

const NFT_DATABASE = [
    {id:0, name:"Подарок",    stars:0,   ton:0,    image:"nft/Gift.jpg",         isCurrency:true,  amount:1,  rarity:"special",   icon:"💝"},
    {id:1, name:"3 звезды",   stars:3,   ton:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:3,  rarity:"common",    icon:"⭐"},
    {id:2, name:"5 звёзд",    stars:5,   ton:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:5,  rarity:"common",    icon:"⭐"},
    {id:3, name:"15 звёзд",   stars:15,  ton:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:15, rarity:"rare",      icon:"⭐"},
    {id:4, name:"50 звёзд",   stars:50,  ton:0,    image:"nft/Stars.jpg",        isCurrency:true,  amount:50, rarity:"epic",      icon:"⭐"},
    {id:5, name:"1 may",         stars:20,  ton:0.10, image:"nft/1 may.jpg",        rarity:"legendary"},
    {id:6, name:"Artisan Brick", stars:9400,  ton:100, image:"nft/Artisan Brick.jpg",rarity:"legendary"},
    {id:7, name:"Astral Shard",  stars:21000,  ton:220, image:"nft/Astral Shard.jpg", rarity:"mythic"},
    {id:8, name:"Backpack",      stars:500,  ton:0.35, image:"nft/Backpack.jpg",      rarity:"legendary"},
    {id:9, name:"Crystal Eagle", stars:3881,  ton:41.25, image:"nft/Crystal Eagle.jpg",rarity:"mythic"},
    {id:10,name:"Durovs Cap",    stars:78550, ton:800, image:"nft/Durovs Cap.jpg",    rarity:"mythic"},
    {id:11,name:"Faith Amulet",  stars:650, ton:6, image:"nft/Faith Amulet.jpg",  rarity:"legendary"},
    {id:12,name:"Happy Brownie", stars:500, ton:5, image:"nft/Happy Brownie.jpg", rarity:"legendary"},
    {id:13,name:"Instant Ramen", stars:540, ton:3, image:"nft/Instant Ramen.jpg", rarity:"legendary"},
    {id:14,name:"Jolly Chimp",   stars:756, ton:8, image:"nft/Jolly Chimp.jpg",   rarity:"legendary"}
];

const CASES_DATA = {
  free: {
    name: "🎁 Бесплатный кейс",
    icon: "🎁",
    price: 0,
    type: "free",
    cooldown: true,
    items: [
      { nft: NFT_DATABASE[0],  chance: 40.0 }, // 💝 Подарок
      { nft: NFT_DATABASE[1],  chance: 30.0 }, // ⭐ 3 звезды
      { nft: NFT_DATABASE[2],  chance: 15.0 }, // ⭐ 5 звёзд
      { nft: NFT_DATABASE[3],  chance: 10.0 }, // ⭐ 15 звёзд
      { nft: NFT_DATABASE[4],  chance: 4.5  }, // ⭐ 50 звёзд
      { nft: NFT_DATABASE[12], chance: 0.4  }, // Happy Brownie (legendary)
      { nft: NFT_DATABASE[13], chance: 0.1  }  // Instant Ramen (legendary)
    ]
  },

  basic: {
    name: "📦 Basic Case",
    icon: "📦",
    price: 50,
    type: "basic",
    cooldown: false,
    items: [
      { nft: NFT_DATABASE[1],  chance: 55.0 }, // ⭐ 3 звезды
      { nft: NFT_DATABASE[2],  chance: 25.0 }, // ⭐ 5 звёзд
      { nft: NFT_DATABASE[3],  chance: 12.0 }, // ⭐ 15 звёзд
      { nft: NFT_DATABASE[4],  chance: 7.0  }, // ⭐ 50 звёзд

      { nft: NFT_DATABASE[8],  chance: 0.8  }, // Backpack (legendary)
      { nft: NFT_DATABASE[9],  chance: 0.15 }, // Crystal Eagle (mythic)
      { nft: NFT_DATABASE[7],  chance: 0.04 }, // Astral Shard (mythic)
      { nft: NFT_DATABASE[10], chance: 0.01 }  // Durovs Cap (mythic)
    ]
  },

  premium: {
    name: "💎 Premium Case",
    icon: "💎",
    price: 500,
    type: "premium",
    cooldown: false,
    items: [
      { nft: NFT_DATABASE[2],  chance: 30.0 }, // ⭐ 5 звёзд
      { nft: NFT_DATABASE[3],  chance: 25.0 }, // ⭐ 15 звёзд
      { nft: NFT_DATABASE[4],  chance: 20.0 }, // ⭐ 50 звёзд

      { nft: NFT_DATABASE[11], chance: 8.0  }, // Faith Amulet (legendary)
      { nft: NFT_DATABASE[12], chance: 5.0  }, // Happy Brownie (legendary)
      { nft: NFT_DATABASE[13], chance: 2.0  }, // Instant Ramen (legendary)
      { nft: NFT_DATABASE[14], chance: 8.0  }, // Jolly Chimp (legendary)

      { nft: NFT_DATABASE[9],  chance: 1.5  }, // Crystal Eagle (mythic)
      { nft: NFT_DATABASE[7],  chance: 0.4  }, // Astral Shard (mythic)
      { nft: NFT_DATABASE[10], chance: 0.1  }  // Durovs Cap (mythic)
    ]
  }
};
const ACHIEVEMENTS = [
    {id:'first_case', name:'Первый кейс',   desc:'Открой свой первый кейс',   icon:'🎁', reward:10},
    {id:'cases_5',    name:'Новичок',        desc:'Открой 5 кейсов',            icon:'📦', reward:25},
    {id:'cases_10',   name:'Коллекционер',   desc:'Открой 10 кейсов',           icon:'🎰', reward:50},
    {id:'legendary',  name:'Легендарная удача',desc:'Получи легендарное NFT',   icon:'⭐', reward:200}
];

let currentFilter = 'all';
let currentCase    = null;
let userLevel      = 1;
let userXP         = 0;
let isAdmin        = false;
let inventory      = [];
let openedCases    = 0;
let achievements   = [];
let globalHistory  = [];
let freeTimerInterval = null;  // интервал живого счётчика

// ===========================================================
// ПОЛУЧЕНИЕ БАЛАНСА — всегда свежий из localStorage
// ===========================================================
function getStars() {
    return parseInt(localStorage.getItem('gameStars') || '0');
}
function setStars(val) {
    val = Math.max(0, val);
    localStorage.setItem('gameStars', val);
    document.getElementById('balance').textContent = val;
}

// ===========================================================
// ЕДИНСТВЕННАЯ ПРОВЕРКА — для ВСЕХ без исключений
// ===========================================================
function checkCanOpen(caseKey) {
    const data = CASES_DATA[caseKey];
    if (!data) return { ok:false, reason:'Кейс не найден' };

    if (data.cooldown) {
        const ms = getFreeMsLeft();
        if (ms > 0) {
            return { ok:false, reason:'⏰ Бесплатный кейс раз в 24 часа!\n\nОсталось: ' + msToHM(ms) };
        }
    }

    if (data.price > 0) {
        const stars = getStars();
        if (stars < data.price) {
            return { ok:false, reason:'❌ Недостаточно звёзд!\n\nУ вас: ' + stars + ' ⭐\nНужно: ' + data.price + ' ⭐' };
        }
    }

    return { ok:true };
}

function getFreeMsLeft() {
    const last = localStorage.getItem('lastFreeCase');
    if (!last) return 0;
    const left = 24 * 3600 * 1000 - (Date.now() - new Date(last).getTime());
    return left > 0 ? left : 0;
}

function msToHM(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return h > 0 ? `${h}ч ${m}м` : `${m}м ${s}с`;
}

// ===========================================================
// ЖИВОЙ СЧЁТЧИК ТАЙМЕРА НА КАРТОЧКЕ БЕСПЛАТНОГО КЕЙСА
// ===========================================================
function startFreeTimer() {
    if (freeTimerInterval) clearInterval(freeTimerInterval);
    freeTimerInterval = setInterval(() => {
        const ms = getFreeMsLeft();
        const timerEl  = document.getElementById('freeCountdown');
        const statusEl = document.getElementById('freeStatus');
        if (!timerEl) return;

        if (ms <= 0) {
            clearInterval(freeTimerInterval);
            freeTimerInterval = null;
            if (statusEl) { statusEl.textContent = '✅ ДОСТУПЕН'; statusEl.style.color = '#10b981'; }
            timerEl.textContent = '';
            // Снимаем затемнение с карточки
            const card = document.getElementById('freeCard');
            if (card) card.style.opacity = '1';
        } else {
            if (statusEl) { statusEl.textContent = '🔒 ЗАБЛОКИРОВАН'; statusEl.style.color = '#ef4444'; }
            timerEl.textContent = msToHM(ms);
        }
    }, 1000);
}

// ===========================================================
// ЧАСТИЦЫ
// ===========================================================
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const pts = Array.from({length:50}, () => ({
        x: Math.random()*canvas.width, y: Math.random()*canvas.height,
        r: Math.random()*2+1,
        vx: Math.random()*0.5-0.25, vy: Math.random()*0.5-0.25,
        o: Math.random()*0.5+0.2
    }));
    (function loop() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        pts.forEach(p => {
            p.x+=p.vx; p.y+=p.vy;
            if(p.x<0||p.x>canvas.width)  p.vx*=-1;
            if(p.y<0||p.y>canvas.height) p.vy*=-1;
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.fillStyle=`rgba(16,185,129,${p.o})`;
            ctx.fill();
        });
        requestAnimationFrame(loop);
    })();
}

function hideLoader() {
    setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 2000);
}

// ===========================================================
// ИНИЦИАЛИЗАЦИЯ
// ===========================================================
function init() {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        document.getElementById('userName').textContent = user.first_name || 'Player';
        if (user.id === ADMIN_ID) {
            isAdmin = true;
            document.getElementById('adminBadge').classList.remove('hidden');
        }
        const av = document.getElementById('avatarContainer');
        if (user.photo_url) av.innerHTML = `<img src="${user.photo_url}" alt="Avatar">`;
        else if (user.username) av.textContent = user.username.charAt(0).toUpperCase();
    }

    document.getElementById('balance').textContent = getStars();
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
    userLevel   = parseInt(localStorage.getItem('userLevel')   || '1');
    userXP      = parseInt(localStorage.getItem('userXP')      || '0');
    openedCases = parseInt(localStorage.getItem('openedCases') || '0');
    updateLevelDisplay();
}

function updateLevelDisplay() {
    const xpNeeded = userLevel * 100;
    document.getElementById('userLevel').textContent = `Level ${userLevel}`;
    document.getElementById('userXP').textContent    = `${userXP}/${xpNeeded} XP`;
}

function addXP(amount) {
    userXP += amount;
    const need = userLevel * 100;
    if (userXP >= need) {
        userXP -= need;
        userLevel++;
        const bonus = userLevel * 10;
        setStars(getStars() + bonus);
        tg.showPopup({title:'🎉 LEVEL UP!', message:`Уровень ${userLevel}!\n+${bonus} ⭐`, buttons:[{type:'ok'}]});
    }
    localStorage.setItem('userLevel', userLevel);
    localStorage.setItem('userXP',    userXP);
    updateLevelDisplay();
}

function getRarityColor(r) {
    return {common:'#9e9e9e',rare:'#3b82f6',epic:'#a855f7',legendary:'#fbbf24',mythic:'#ef4444',special:'#10b981'}[r] || '#fff';
}

// ===========================================================
// ГЕНЕРАЦИЯ КАРТОЧЕК КЕЙСОВ
// ===========================================================
function generateCases() {
    const container = document.getElementById('casesContainer');
    if (!container) return;

    const entries = Object.entries(CASES_DATA).filter(([k,d]) => {
        if (currentFilter === 'all')     return true;
        if (currentFilter === 'free')    return d.price === 0;
        if (currentFilter === 'basic')   return d.type  === 'basic';
        if (currentFilter === 'premium') return d.type  === 'premium';
        return true;
    });

    container.innerHTML = entries.map(([key, data]) => {
        const locked = data.cooldown ? getFreeMsLeft() > 0 : false;
        const ms     = locked ? getFreeMsLeft() : 0;
        const stars  = getStars();
        const canAfford = data.price === 0 || stars >= data.price;

        let footerHtml = '';
        if (data.price === 0) {
            footerHtml = `
                <div>
                    <div id="freeStatus" style="font-weight:700;font-size:14px;color:${locked?'#ef4444':'#10b981'};">
                        ${locked ? '🔒 ЗАБЛОКИРОВАН' : '✅ ДОСТУПЕН'}
                    </div>
                    <div id="freeCountdown" style="color:#6b7280;font-size:12px;margin-top:4px;">
                        ${locked ? msToHM(ms) : ''}
                    </div>
                </div>`;
        } else {
            footerHtml = `
                <div>
                    <div style="color:${canAfford?'#ffd700':'#ef4444'};font-size:24px;font-weight:900;">⭐ ${data.price}</div>
                    ${!canAfford ? `<div style="color:#ef4444;font-size:11px;margin-top:2px;">Не хватает ${data.price - stars} ⭐</div>` : ''}
                </div>`;
        }

        return `
            <div class="case-big" id="${key=== 'free'?'freeCard':''}" onclick="showCaseInfo('${key}')"
                 style="opacity:${locked?'0.6':'1'}">
                ${data.price === 0 ? '<div class="case-badge">FREE</div>' : ''}
                <div class="case-image-section">
                    <div class="case-main-image">${data.icon}</div>
                </div>
                <div class="case-info-section">
                    <div class="case-title">${data.name}</div>
                    <div class="case-footer">${footerHtml}</div>
                </div>
            </div>`;
    }).join('');

    startFreeTimer();
}

// ===========================================================
// ИНФО О КЕЙСЕ
// ===========================================================
function showCaseInfo(caseKey) {
    const data = CASES_DATA[caseKey];
    if (!data) return;

    const check = checkCanOpen(caseKey);
    if (!check.ok) { tg.showAlert(check.reason); return; }

    currentCase = caseKey;

    document.getElementById('modalCaseTitle').textContent = data.name;
    document.getElementById('modalCaseIcon').textContent  = data.icon;
    document.getElementById('modalCaseName').textContent  = data.name.toUpperCase();
    document.getElementById('modalCasePrice').textContent = data.price === 0 ? 'БЕСПЛАТНО' : `⭐ ${data.price}`;

    const btn = document.getElementById('modalOpenBtn');
    btn.textContent = data.price === 0 ? 'Открыть бесплатно' : `Открыть за ⭐ ${data.price}`;
    btn.disabled = false;
    btn.style.opacity = '1';

    document.getElementById('modalItemsList').innerHTML = data.items.map(item => {
        const nft = item.nft;
        if (!nft) return '';
        if (nft.isCurrency) return `
            <div class="item-row">
                <div class="item-icon" style="border-color:#fbbf24;"><div style="font-size:40px;">${nft.icon}</div></div>
                <div class="item-info">
                    <div class="item-name">${nft.name}</div>
                    <div class="item-price-row"><span class="item-price-stars">Валюта</span></div>
                </div>
                <div class="item-chance">${item.chance}%</div>
            </div>`;
        return `
            <div class="item-row">
                <div class="item-icon" style="border-color:${getRarityColor(nft.rarity)};">
                    <img src="${nft.image}" alt="${nft.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.style.display='none'">
                </div>
                <div class="item-info">
                    <div class="item-name">${nft.name}</div>
                    <div class="item-rarity" style="color:${getRarityColor(nft.rarity)};">${nft.rarity.toUpperCase()}</div>
                    <div class="item-price-row">
                        <span class="item-price-stars">⭐ ${nft.stars}</span>
                        <span class="item-price-ton">💎 ${nft.ton} TON</span>
                    </div>
                </div>
                <div class="item-chance">${item.chance}%</div>
            </div>`;
    }).join('');

    document.getElementById('modalInfo').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeInfoModal() {
    document.getElementById('modalInfo').classList.remove('active');
    document.body.style.overflow = '';
    currentCase = null;
}

// ===========================================================
// КНОПКА ОТКРЫТЬ
// ===========================================================
function openCaseFromModal() {
    if (!currentCase) return;

    const data  = CASES_DATA[currentCase];
    const check = checkCanOpen(currentCase);

    if (!check.ok) {
        tg.showAlert(check.reason);
        closeInfoModal();
        generateCases();
        return;
    }

    // Списываем звёзды ДО закрытия окна — баланс сразу обновится
    if (data.price > 0) {
        setStars(getStars() - data.price);
        generateCases(); // обновляем "не хватает" на карточке
    }

    if (data.cooldown) {
        localStorage.setItem('lastFreeCase', new Date().toISOString());
        generateCases();
        startFreeTimer();
    }

    const key = currentCase;
    closeInfoModal();
    setTimeout(() => startRoulette(key), 300);
}

// ===========================================================
// РУЛЕТКА — ПОЛНАЯ АНИМАЦИЯ
// ===========================================================
function startRoulette(caseKey) {
    const data = CASES_DATA[caseKey];
    if (!data) return;

    const modal     = document.getElementById('modalRoulette');
    const track     = document.getElementById('rouletteTrack');
    const resultBox = document.getElementById('resultBox');
    const title     = document.getElementById('rouletteTitle');

    if (!modal || !track) return;

    modal.classList.add('active');
    resultBox.classList.remove('active');
    title.textContent = '🎲 ОТКРЫВАЕМ...';
    document.body.style.overflow = 'hidden';

    // Сбрасываем без анимации
    track.style.transition = 'none';
    track.style.transform  = 'translateX(0px)';
    track.innerHTML        = '';

    const WIN_IDX = 35;
    const TOTAL   = 60;
    const winItem = getRandomItemByChance(data.items);

    for (let i = 0; i < TOTAL; i++) {
        const item = (i === WIN_IDX)
            ? winItem
            : data.items[Math.floor(Math.random() * data.items.length)];

        const div = document.createElement('div');
        div.className = 'roulette-item';
        div.style.borderColor = item.nft.isCurrency ? '#fbbf24' : getRarityColor(item.nft.rarity);
        div.innerHTML = item.nft.isCurrency
            ? `<div style="font-size:60px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${item.nft.icon}</div>`
            : `<img src="${item.nft.image}" alt="${item.nft.name}"
                style="width:100%;height:100%;object-fit:cover;border-radius:8px;"
                onerror="this.parentElement.innerHTML='<div style=font-size:60px>💎</div>'">`;
        track.appendChild(div);
    }

    // Ждём 2 кадра — браузер РЕАЛЬНО отрисовывает элементы
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Измеряем РЕАЛЬНУЮ ширину элемента из DOM
            const firstItem = track.children[0];
            if (!firstItem) return;

            const itemW  = firstItem.getBoundingClientRect().width;
            const gap    = 10; // ← укажи gap из своего style.css (.roulette-track gap: 10px)
            const stepW  = itemW + gap;

            const wrapper = track.parentElement;
            const wrapW   = wrapper ? wrapper.getBoundingClientRect().width : 370;
            const center  = wrapW / 2;

            // Считаем смещение: центр победного элемента → центр экрана
            const winCenterX = WIN_IDX * stepW + itemW / 2;
            const offset     = center - winCenterX;

            track.style.transition = 'transform 5s cubic-bezier(0.05, 0.85, 0.15, 1)';
            track.style.transform  = `translateX(${offset}px)`;
            title.textContent = '🎰 КРУТИМ...';
        });
    });

    setTimeout(() => {
        title.textContent = '🎉 РЕЗУЛЬТАТ!';
        showResult(winItem.nft, caseKey);
        openedCases++;
        localStorage.setItem('openedCases', openedCases);
        checkAchievements();
        generateCases();
    }, 5400);
}


function getRandomItemByChance(items) {
    const rand = Math.random() * 100;
    let cum = 0;
    for (const item of items) {
        cum += item.chance;
        if (rand <= cum) return item;
    }
    return items[items.length - 1];
}

// ===========================================================
// ПОКАЗ РЕЗУЛЬТАТА
// ===========================================================
function showResult(nft, caseKey) {
    const resultBox = document.getElementById('resultBox');
    resultBox.classList.add('active');

    if (nft.isCurrency) {
        const isStars = nft.name.includes('звезд') || nft.name.includes('звёзд');
        if (isStars) {
            const newBal = getStars() + nft.amount;
            setStars(newBal);
            document.getElementById('resultIcon').innerHTML   = `<div style="font-size:100px;">${nft.icon}</div>`;
            document.getElementById('resultName').textContent  = `+${nft.amount} звёзд`;
            document.getElementById('resultRarity').textContent= 'ВАЛЮТА';
            document.getElementById('resultStars').innerHTML   = `Баланс: ⭐ ${newBal}`;
            document.getElementById('resultTon').innerHTML     = '';
            addXP(nft.amount);
        } else {
            document.getElementById('resultIcon').innerHTML   = `<div style="font-size:100px;">${nft.icon}</div>`;
            document.getElementById('resultName').textContent  = 'Подарок';
            document.getElementById('resultRarity').textContent= 'ОСОБОЕ';
            document.getElementById('resultStars').innerHTML   = '🎁 Сюрприз!';
            document.getElementById('resultTon').innerHTML     = '';
            addXP(10);
        }
        resultBox.style.borderColor = '#fbbf24';
        document.getElementById('resultRarity').style.background = '#fbbf24';
    } else {
        document.getElementById('resultIcon').innerHTML   = `<img src="${nft.image}" alt="${nft.name}" style="width:140px;height:140px;object-fit:cover;border-radius:12px;" onerror="this.style.display='none'">`;
        document.getElementById('resultName').textContent  = nft.name;
        document.getElementById('resultRarity').textContent= nft.rarity.toUpperCase();
        const color = getRarityColor(nft.rarity);
        resultBox.style.borderColor = color;
        document.getElementById('resultRarity').style.background = color;
        document.getElementById('resultStars').innerHTML   = `⭐ ${nft.stars}`;
        document.getElementById('resultTon').innerHTML     = `💎 ${nft.ton} TON`;
        addXP(Math.floor(nft.stars / 5));
        addToInventory(nft);
        saveToHistory(nft);
        if (nft.rarity === 'legendary' || nft.rarity === 'mythic') createConfetti();
    }

    addToGlobalHistory(nft);
}

function createConfetti() {
    const colors = ['#10b981','#fbbf24','#ef4444','#3b82f6','#a855f7'];
    for (let i = 0; i < 120; i++) {
        const el = document.createElement('div');
        el.style.cssText = `position:fixed;top:50%;left:50%;width:10px;height:10px;
            background:${colors[i%colors.length]};border-radius:50%;z-index:9999;
            pointer-events:none;
            animation:confettiFall ${Math.random()*2+1}s linear forwards;
            --x:${Math.random()};`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }
}

function closeRouletteModal() {
    document.getElementById('modalRoulette').classList.remove('active');
    document.body.style.overflow = '';
}

// ===========================================================
// ИНВЕНТАРЬ
// ===========================================================
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
    const c = document.getElementById('inventoryContainer');
    if (!c) return;
    if (!inventory.length) {
        c.innerHTML = `<div style="padding:60px 20px;text-align:center;"><div style="font-size:80px;opacity:0.3;">📦</div><h3>Инвентарь пуст</h3><p style="color:#6b7280;">Открой кейсы, чтобы получить NFT</p></div>`;
        return;
    }
    const order = {mythic:5,legendary:4,epic:3,rare:2,common:1};
    const sorted = [...inventory].sort((a,b)=>(order[b.rarity]||0)-(order[a.rarity]||0));
    c.innerHTML = `
        <div style="padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3>📦 Мои NFT (${inventory.length})</h3>
                <div style="font-size:14px;color:#6b7280;">💎 <span style="color:#10b981;font-weight:700;">${inventory.reduce((s,n)=>s+n.ton,0).toFixed(2)} TON</span></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:15px;">
                ${sorted.map((nft,i) => `
                    <div style="background:rgba(30,30,40,0.5);border-radius:12px;padding:12px;border:2px solid ${getRarityColor(nft.rarity)};">
                        <div style="width:100%;height:120px;border-radius:8px;overflow:hidden;margin-bottom:8px;position:relative;">
                            <img src="${nft.image}" alt="${nft.name}" style="width:100%;height:100%;object-fit:cover;">
                            <div style="position:absolute;top:5px;right:5px;background:${getRarityColor(nft.rarity)};padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700;">${nft.rarity.toUpperCase()}</div>
                        </div>
                        <div style="font-size:13px;font-weight:700;margin-bottom:4px;">${nft.name}</div>
                        <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">💎 ${nft.ton} TON • ⭐ ${nft.stars}</div>
                        <button onclick="sellNFT(${inventory.indexOf(nft)})" style="width:100%;padding:8px;background:linear-gradient(135deg,#10b981,#059669);border:none;border-radius:8px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">
                            Продать ${Math.floor(nft.stars*0.7)} ⭐
                        </button>
                    </div>`).join('')}
            </div>
        </div>`;
}

function sellNFT(idx) {
    const nft = inventory[idx];
    if (!nft) return;
    const sp = Math.floor(nft.stars * 0.7);
    tg.showPopup({
        title:'Продать NFT?', message:`${nft.name}\nВы получите: ${sp} ⭐`,
        buttons:[{id:'sell',type:'default',text:`Продать за ${sp} ⭐`},{type:'cancel'}]
    }, btn => {
        if (btn === 'sell') {
            setStars(getStars() + sp);
            inventory.splice(idx, 1);
            localStorage.setItem('inventory', JSON.stringify(inventory));
            renderInventory();
            tg.showAlert(`Продано за ${sp} ⭐!`);
        }
    });
}

// ===========================================================
// ИСТОРИЯ
// ===========================================================
function saveToHistory(nft) {
    let h = JSON.parse(localStorage.getItem('caseHistory') || '[]');
    h.unshift({...nft, time: new Date().toLocaleString('ru-RU')});
    if (h.length > 50) h = h.slice(0,50);
    localStorage.setItem('caseHistory', JSON.stringify(h));
}

function loadHistory() {
    renderHistory(JSON.parse(localStorage.getItem('caseHistory') || '[]'));
}

function renderHistory(history) {
    const c = document.getElementById('historyContainer');
    if (!c) return;
    if (!history.length) {
        c.innerHTML = `<div style="padding:60px 20px;text-align:center;"><div style="font-size:80px;opacity:0.3;">📜</div><h3>История пуста</h3></div>`;
        return;
    }
    c.innerHTML = `<div style="padding:20px;"><h3 style="margin-bottom:15px;">📜 История (${history.length})</h3>
        ${history.map(item => `
            <div style="background:rgba(30,30,40,0.5);border-radius:12px;padding:15px;margin-bottom:12px;display:flex;align-items:center;gap:15px;">
                <div style="width:60px;height:60px;border-radius:10px;overflow:hidden;border:2px solid ${getRarityColor(item.rarity)};flex-shrink:0;">
                    <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">
                </div>
                <div style="flex:1;">
                    <div style="font-size:16px;font-weight:700;">${item.name}</div>
                    <div style="font-size:12px;color:${getRarityColor(item.rarity)};margin-top:4px;">${item.rarity?.toUpperCase()}</div>
                    <div style="font-size:11px;color:#6b7280;margin-top:4px;">${item.time}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:14px;color:#ffd700;">⭐ ${item.stars}</div>
                    <div style="font-size:12px;color:#0088cc;">💎 ${item.ton} TON</div>
                </div>
            </div>`).join('')}
    </div>`;
}

// ===========================================================
// ДОСТИЖЕНИЯ
// ===========================================================
function loadAchievements() {
    achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    renderAchievements();
}

function renderAchievements() {
    const c = document.getElementById('achievementsContainer');
    if (!c) return;
    const prog = Math.round((achievements.length / ACHIEVEMENTS.length) * 100);
    c.innerHTML = `
        <div style="padding:20px;">
            <div style="margin-bottom:20px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                    <h3>🏆 Достижения</h3>
                    <div style="color:#10b981;font-weight:700;">${achievements.length}/${ACHIEVEMENTS.length}</div>
                </div>
                <div style="width:100%;height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;">
                    <div style="width:${prog}%;height:100%;background:linear-gradient(90deg,#10b981,#059669);"></div>
                </div>
            </div>
            ${ACHIEVEMENTS.map(a => {
                const done = achievements.includes(a.id);
                return `<div style="background:rgba(30,30,40,0.5);border-radius:12px;padding:15px;margin-bottom:12px;opacity:${done?1:0.5};border:2px solid ${done?'#10b981':'rgba(255,255,255,0.1)'};display:flex;align-items:center;gap:15px;">
                    <div style="font-size:40px;filter:grayscale(${done?0:1});">${a.icon}</div>
                    <div style="flex:1;">
                        <div style="font-size:16px;font-weight:700;">${a.name} ${done?'✅':''}</div>
                        <div style="font-size:13px;color:#6b7280;">${a.desc}</div>
                    </div>
                    <div style="color:${done?'#10b981':'#ffd700'};font-weight:700;">+${a.reward} ⭐</div>
                </div>`;
            }).join('')}
        </div>`;
}

function checkAchievements() {
    const map = {first_case:1, cases_5:5, cases_10:10};
    Object.entries(map).forEach(([id, n]) => {
        if (openedCases >= n && !achievements.includes(id)) unlockAchievement(id);
    });
}

function unlockAchievement(id) {
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (!a) return;
    achievements.push(id);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    setStars(getStars() + a.reward);
    tg.showPopup({title:'🏆 Достижение!', message:`${a.icon} ${a.name}\n${a.desc}\n+${a.reward} ⭐`, buttons:[{type:'ok'}]});
    renderAchievements();
}

// ===========================================================
// ОНЛАЙН / ИСТОРИЯ СЛАЙДЕР
// ===========================================================
function fetchOnlineCount() {
    document.getElementById('onlineCount').textContent = `${150+Math.floor(Math.random()*50)-25} Online`;
}

function generateFakeHistory() {
    const names = ['Алексей','Мария','Дмитрий','Анна','Иван','Елена'];
    for (let i = 0; i < 15; i++) {
        const rCase = Object.values(CASES_DATA)[Math.floor(Math.random()*3)];
        const item  = getRandomItemByChance(rCase.items);
        globalHistory.push({nft:item.nft, username:names[Math.floor(Math.random()*names.length)], time:`${Math.floor(Math.random()*45)+1} мин назад`});
    }
    renderGlobalHistory();
}

function renderGlobalHistory() {
    const slider = document.getElementById('nftScroll');
    if (!slider) return;
    const all = [...globalHistory, ...globalHistory, ...globalHistory];
    slider.innerHTML = all.map(item => {
        const nft   = item.nft;
        const color = nft.isCurrency ? '#fbbf24' : getRarityColor(nft.rarity);
        return `<div class="nft-card" style="border:2px solid ${color};min-width:160px;height:200px;">
            <div class="nft-image" style="border:2px solid ${color};width:90px;height:90px;margin:0 auto;">
                ${nft.isCurrency ? `<div style="font-size:45px;">${nft.icon}</div>`
                    : `<img src="${nft.image}" onerror="this.parentElement.innerHTML='<div style=font-size:45px>💎</div>'">`}
            </div>
            <div class="nft-value" style="color:${color};font-size:13px;margin-top:10px;">${nft.isCurrency?nft.name:`${nft.ton} TON`}</div>
            <div style="font-size:11px;color:#fff;margin-top:8px;text-align:center;">👤 ${item.username}</div>
            <div style="font-size:10px;color:#6b7280;text-align:center;margin-top:4px;">${item.time}</div>
        </div>`;
    }).join('');
}

function addToGlobalHistory(nft) {
    const user = tg.initDataUnsafe?.user;
    globalHistory.unshift({nft, username:user?.first_name||'Игрок', time:'только что'});
    if (globalHistory.length > 25) globalHistory = globalHistory.slice(0,25);
    renderGlobalHistory();
}

// ===========================================================
// НАВИГАЦИЯ
// ===========================================================
function switchTab(tab) {
    document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    const map = {cases:'tabCases',inventory:'tabInventory',profile:'tabProfile',history:'tabHistory',achievements:'tabAchievements'};
    document.getElementById(map[tab]).classList.add('active');
    if (tab==='inventory')    renderInventory();
    if (tab==='history')      loadHistory();
    if (tab==='achievements') renderAchievements();
}

// ===========================================================
// РЕФЕРАЛ / ПРОМО
// ===========================================================
function loadRefLink() {
    const uid = tg.initDataUnsafe?.user?.id || '000';
    document.getElementById('refLink').textContent  = `https://t.me/gsdfsdfdsfbot?start=ref_${uid}`;
    document.getElementById('refCount').textContent = localStorage.getItem('refCount') || '0';
}

function copyRefLink() {
    navigator.clipboard.writeText(document.getElementById('refLink').textContent);
    tg.showPopup({title:'Скопировано!',message:'Ссылка в буфере',buttons:[{type:'ok'}]});
}

function activatePromo() {
    const code  = document.getElementById('promoInput').value.trim().toUpperCase();
    if (!code) { tg.showAlert('Введите промокод'); return; }
    const codes = {'WELCOME':100,'NEWYEAR2026':200,'LUCKY':150};
    const used  = JSON.parse(localStorage.getItem('usedPromos')||'[]');
    if (used.includes(code)) { tg.showAlert('Промокод уже использован!'); return; }
    if (!codes[code])        { tg.showAlert('Неверный промокод!');        return; }
    setStars(getStars() + codes[code]);
    used.push(code);
    localStorage.setItem('usedPromos', JSON.stringify(used));
    tg.showPopup({title:'🎉 Активировано!',message:`+${codes[code]} ⭐ звёзд!`,buttons:[{type:'ok'}]});
    document.getElementById('promoInput').value = '';
    generateCases(); // обновляем кнопки кейсов
}

// ===========================================================
// АДМИН ПАНЕЛЬ
// ===========================================================
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
    document.getElementById('adminStats').innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:15px;">
            <div class="admin-stat-card"><div class="admin-stat-icon">⭐</div><div class="admin-stat-value">${getStars()}</div><div class="admin-stat-label">Звёзд</div></div>
            <div class="admin-stat-card"><div class="admin-stat-icon">📦</div><div class="admin-stat-value">${openedCases}</div><div class="admin-stat-label">Кейсов</div></div>
            <div class="admin-stat-card"><div class="admin-stat-icon">💎</div><div class="admin-stat-value">${inventory.length}</div><div class="admin-stat-label">NFT</div></div>
            <div class="admin-stat-card"><div class="admin-stat-icon">🏆</div><div class="admin-stat-value">${achievements.length}</div><div class="admin-stat-label">Ачивок</div></div>
        </div>`;
}

function loadAllUsers() {
    const user = tg.initDataUnsafe?.user;
    document.getElementById('adminUsersList').innerHTML = `
        <div class="admin-user-row">
            <div style="display:flex;align-items:center;gap:15px;flex:1;">
                <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;">${(user?.first_name||'A').charAt(0)}</div>
                <div>
                    <div style="font-size:16px;font-weight:700;">${user?.first_name||'Admin'} <span style="background:linear-gradient(135deg,#fbbf24,#f59e0b);padding:3px 8px;border-radius:8px;font-size:11px;color:#000;">ADMIN</span></div>
                    <div style="font-size:13px;color:#6b7280;">@${user?.username||'admin'} • ID: ${user?.id||0}</div>
                    <div style="display:flex;gap:12px;margin-top:8px;font-size:12px;color:#6b7280;">
                        <span>⭐ ${getStars()}</span>
                        <span>📊 Lvl ${userLevel}</span>
                        <span>📦 ${openedCases}</span>
                        <span>💎 ${inventory.length}</span>
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:8px;">
                <button class="admin-btn-small admin-btn-success" onclick="manageUserBalance(${user?.id||0},'${user?.username||'admin'}',${getStars()})">💰</button>
                <button class="admin-btn-small admin-btn-danger"  onclick="resetUserProgress()">🗑️</button>
            </div>
        </div>
        <div style="padding:20px;text-align:center;color:#6b7280;font-size:14px;border-top:1px solid rgba(255,255,255,0.05);margin-top:10px;">
            <div style="font-size:32px;margin-bottom:8px;">👥</div>
            Для просмотра всех пользователей нужен backend
        </div>`;
}

function manageUserBalance(userId, username, curStars) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="font-size:20px;font-weight:800;">💰 Управление балансом</h3>
                <div style="font-size:28px;cursor:pointer;color:#6b7280;" onclick="this.closest('.admin-modal').remove()">✕</div>
            </div>
            <div style="background:rgba(30,30,40,0.5);padding:15px;border-radius:12px;margin-bottom:20px;">
                <div style="font-size:18px;font-weight:700;">@${username}</div>
                <div style="font-size:14px;color:#6b7280;margin-top:6px;">Баланс: <span id="modalCurStars" style="color:#10b981;font-weight:700;">${curStars} ⭐</span></div>
            </div>
            <input type="number" id="starsAmount" placeholder="Количество звёзд" min="1"
                style="width:100%;padding:15px;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:16px;margin-bottom:15px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <button class="admin-btn admin-btn-success" onclick="giveStars('${username}')">➕ Выдать</button>
                <button class="admin-btn admin-btn-danger"  onclick="takeStars('${username}')">➖ Забрать</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;">
                <button class="admin-btn-quick" onclick="document.getElementById('starsAmount').value=100">100</button>
                <button class="admin-btn-quick" onclick="document.getElementById('starsAmount').value=500">500</button>
                <button class="admin-btn-quick" onclick="document.getElementById('starsAmount').value=1000">1000</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

function giveStars(username) {
    const amount = parseInt(document.getElementById('starsAmount').value);
    if (!amount || amount <= 0) { tg.showAlert('Введите количество!'); return; }
    setStars(getStars() + amount);
    document.querySelector('.admin-modal').remove();
    generateCases(); // сразу обновляем кнопки кейсов
    loadAllUsers();
    loadAdminStats();
    tg.showPopup({title:'✅ Выдано!', message:`+${amount} ⭐\nНовый баланс: ${getStars()} ⭐`, buttons:[{type:'ok'}]});
}

function takeStars(username) {
    const amount = parseInt(document.getElementById('starsAmount').value);
    if (!amount || amount <= 0) { tg.showAlert('Введите количество!'); return; }
    setStars(getStars() - amount);
    document.querySelector('.admin-modal').remove();
    generateCases();
    loadAllUsers();
    loadAdminStats();
    tg.showPopup({title:'✅ Забрано!', message:`-${amount} ⭐\nНовый баланс: ${getStars()} ⭐`, buttons:[{type:'ok'}]});
}

function resetUserProgress() {
    tg.showPopup({
        title:'⚠️ Сброс!',
        message:'Сбросить ВСЕ данные?\n(необратимо)',
        buttons:[{id:'yes',type:'destructive',text:'Сбросить'},{type:'cancel'}]
    }, btn => {
        if (btn==='yes') {
            ['gameStars','userLevel','userXP','openedCases','inventory','achievements','caseHistory','lastFreeCase'].forEach(k=>localStorage.removeItem(k));
            userLevel=1; userXP=0; openedCases=0; inventory=[]; achievements=[];
            document.getElementById('balance').textContent='0';
            updateLevelDisplay();
            generateCases();
            closeAdminPanel();
            tg.showAlert('Прогресс сброшен!');
        }
    });
}

function sendGlobalNotification() {
    tg.showPopup({title:'📢',message:'Требует backend',buttons:[{type:'ok'}]});
}
function createPromoCode() {
    tg.showPopup({title:'🎟️ Промокоды',message:'WELCOME → 100 ⭐\nNEWYEAR2026 → 200 ⭐\nLUCKY → 150 ⭐',buttons:[{type:'ok'}]});
}
function exportUserData() {
    const blob = new Blob([JSON.stringify({stars:getStars(),level:userLevel,cases:openedCases,inventory,achievements},null,2)],{type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'export.json';
    a.click();
    tg.showAlert('Данные экспортированы!');
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.querySelectorAll('.admin-tab-content').forEach(c=>c.classList.remove('active'));
    document.getElementById(`adminTab${tab[0].toUpperCase()+tab.slice(1)}`).classList.add('active');
    if (tab==='stats') loadAdminStats();
    if (tab==='users') loadAllUsers();
}

init();




