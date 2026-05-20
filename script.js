const CLOUD_STORAGE_URL = "https://kvbin.glitch.me/bins/sensei_tammy_system";
let showAllComments = false;
let showAllChannels = false;

// متطلبات الليفل
const levelRequirements = { 1: 0, 2: 100, 3: 200, 4: 300, 5: 400, 10: 1000, 20: 6000, 30: 10000, 40: 20000, 50: 30000, 100: 1000000 };

async function fetchYouTubeData() {
    let cloudData = { commentsList: [], channelsList: [] };
    try {
        const response = await fetch(CLOUD_STORAGE_URL);
        if (response.ok) cloudData = await response.json();
    } catch (e) { console.warn("تعذر جلب البيانات"); }
    
    updateSystem(303, cloudData); // 303 هو عدد المشتركين
}

function updateSystem(subs, cloudData) {
    document.getElementById('subs-display').textContent = subs.toLocaleString();
    
    let currentLvl = 1;
    for (let i = 1; i <= 100; i++) {
        if (subs >= (levelRequirements[i] || 0)) currentLvl = i; else break;
    }
    document.getElementById('current-level').textContent = `LV. ${currentLvl}`;

    // حساب النقاط الصارم
    const maxCommentPoints = currentLvl;
    const maxChannelPoints = Math.floor(currentLvl / 5);
    const comments = cloudData.commentsList || [];
    const channels = cloudData.channelsList || [];

    // تحديث العدادات (الحالي / المتاح)
    document.getElementById('comment-points-display').textContent = `${comments.length} / ${maxCommentPoints}`;
    document.getElementById('channel-points-display').textContent = `${channels.length} / ${maxChannelPoints}`;

    // عرض التعليقات (النسخة الأصلية التي طلبتها)
    const container = document.getElementById('comments-container');
    container.innerHTML = "";
    const visibleComments = showAllComments ? comments : comments.slice(0, 3);
    visibleComments.forEach(item => {
        let div = document.createElement('div'); div.className = "single-comment-item";
        div.innerHTML = `<p class="comment-user">${item.user}</p><p class="comment-text">"${item.text}"</p>`;
        container.appendChild(div);
    });
    
    const btnC = document.getElementById('show-more-comments-btn');
    btnC.classList.toggle('hidden', comments.length <= 3);
    btnC.textContent = showAllComments ? "🔼 إخفاء" : `🔽 إظهار المزيد (+${comments.length - 3})`;

    // عرض القنوات (النسخة الأصلية)
    const chContainer = document.getElementById('alliance-container');
    chContainer.innerHTML = "";
    const visibleChannels = showAllChannels ? channels : channels.slice(0, 3);
    visibleChannels.forEach(item => {
        let div = document.createElement('div'); div.className = "single-alliance-item";
        div.innerHTML = `<p style="margin:0; font-size:13px;">دعم لـ: <strong>${item.name}</strong></p>
                         <a href="${item.url}" target="_blank" class="alliance-link">⚔️ دخول بوابة الدعم</a>`;
        chContainer.appendChild(div);
    });
    
    const btnCh = document.getElementById('show-more-channels-btn');
    btnCh.classList.toggle('hidden', channels.length <= 3);
    btnCh.textContent = showAllChannels ? "🔼 إخفاء" : `🔽 إظهار المزيد (+${channels.length - 3})`;
}

async function saveToCloud(data) {
    await fetch(CLOUD_STORAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    fetchYouTubeData();
}

// 🔮 زر إضافة تعليق
document.getElementById('save-comment-btn').addEventListener('click', async () => {
    const data = await (await fetch(CLOUD_STORAGE_URL)).json();
    const lvl = parseInt(document.getElementById('current-level').textContent.replace('LV. ',''));
    if ((data.commentsList||[]).length >= lvl) return alert("❌ طاقة لفل القناة لا تسمح بإضافة تعليق جديد!");
    
    data.commentsList = [...(data.commentsList||[]), {user: document.getElementById('input-fan-name').value, text: document.getElementById('input-fan-text').value}];
    saveToCloud(data);
});

// 🔥 زر إضافة قناة
document.getElementById('save-channel-btn').addEventListener('click', async () => {
    const data = await (await fetch(CLOUD_STORAGE_URL)).json();
    const lvl = parseInt(document.getElementById('current-level').textContent.replace('LV. ',''));
    if ((data.channelsList||[]).length >= Math.floor(lvl / 5)) return alert("❌ طاقة النظام لا تسمح بفتح بوابة دعم جديدة!");
    
    data.channelsList = [...(data.channelsList||[]), {name: document.getElementById('input-channel-name').value, url: document.getElementById('input-channel-url').value}];
    saveToCloud(data);
});

// أزرار التطهير
document.getElementById('delete-comment-btn').addEventListener('click', () => saveToCloud({commentsList: [], channelsList: []}));
document.getElementById('delete-channel-btn').addEventListener('click', () => saveToCloud({channelsList: [], commentsList: []}));

// الأمن (كلمة السر: sensei2026)
document.getElementById('update-btn').addEventListener('mousedown', () => {
    setTimeout(() => { if(prompt("أدخل تعويذة السيطرة:") === "sensei2026") {
        document.getElementById('admin-panel').classList.remove('hidden');
        document.getElementById('admin-comment-inputs').classList.remove('hidden');
        document.getElementById('admin-channel-inputs').classList.remove('hidden');
        document.getElementById('comment-summon-box').classList.remove('hidden');
        document.getElementById('alliance-section').classList.remove('hidden');
    }}, 3000);
});

document.getElementById('show-more-comments-btn').addEventListener('click', () => { showAllComments = !showAllComments; fetchYouTubeData(); });
document.getElementById('show-more-channels-btn').addEventListener('click', () => { showAllChannels = !showAllChannels; fetchYouTubeData(); });

fetchYouTubeData();
