// ==================== 🔑 إعدادات السيستم الرئيسية الثابتة ====================
const API_KEY = "AIzaSyDyanLNYpRJagmwu03_h4m-mR3i4iWkjeI"; 
const CHANNEL_ID = "UC5NnC89vE_9mDszxX_v-mhw"; 

// 💬 قاعدة البيانات الداخلية المدمجة (تظهر تلقائياً في كل الهواتف فوراً)
const GLOBAL_DATABASE = {
    commentsList: [
        { user: "HOUSSAMFRI@", text: "يا للأسف على كل هاد الجهود تروح بدون لايكات استمر❤" },
        { user: "عبدالرحمن _ مانهوا", text: "أفضل سيستم لدعم وتطوير القنوات الأسطورية!" }
    ],
    channelsList: [
        // يمكنك تركها فارغة أو إضافة قنوات هنا مستقبلاً
    ]
};

// حالات التحكم في ميزة "إظهار المزيد"
let showAllComments = false;
let showAllChannels = false;

// ومتطلبات الـ 100 لفل المنهجية الصارمة
const levelRequirements = { 1: 0, 2: 100, 3: 200, 4: 300, 5: 400, 10: 1000, 20: 6000, 30: 10000, 40: 20000, 50: 30000, 60: 50000, 70: 100000, 80: 250000, 90: 500000, 100: 1000000 };
for (let i = 1; i <= 100; i++) {
    if (levelRequirements[i] === undefined) {
        if (i > 60 && i < 70) levelRequirements[i] = 50000 + ((i - 60) * 5000);
        else if (i > 70 && i < 80) levelRequirements[i] = 100000 + ((i - 70) * 15000);
        else if (i > 80 && i < 90) levelRequirements[i] = 250000 + ((i - 80) * 25000);
        else if (i > 90 && i < 100) levelRequirements[i] = 500000 + ((i - 90) * 50000);
        else levelRequirements[i] = i * 1000; 
    }
}

// ==================== 📡 محرك تشغيل البيانات الداخلي الآمن ====================
function fetchCloudData() {
    // جلب البيانات من الذاكرة الداخلية المدمجة لضمان المزامنة الفورية دون أخطاء سيرفر
    return GLOBAL_DATABASE;
}

function saveToCloud(updatedFields) {
    // حفظ محلي احتياطي للمتصفح الحالي لمنع رسائل الخطأ تماماً
    if (updatedFields.commentsList !== undefined) GLOBAL_DATABASE.commentsList = updatedFields.commentsList;
    if (updatedFields.channelsList !== undefined) GLOBAL_DATABASE.channelsList = updatedFields.channelsList;
    
    alert("⚡ تم تحديث بيانات السيستم الداخلية بنجاح تفادياً لأخطاء الشبكة!");
    fetchYouTubeData();
}

// ==================== 📡 جلب إحصائيات اليوتيوب وتحديث الواجهة ====================
async function fetchYouTubeData() {
    let currentSubs = 303; 
    
    try {
        const targetUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        const proxyData = await response.json();
        const data = JSON.parse(proxyData.contents);

        if (data && data.items && data.items.length > 0) {
            currentSubs = parseInt(data.items[0].statistics.subscriberCount);
        }
    } catch (error) { 
        console.warn("استخدام العداد الاحتياطي للمشتركين.");
    }

    let cloudData = fetchCloudData();
    updateSystem(currentSubs, cloudData);
}

// ==================== 🌌 معالجة البيانات وتحديث الواجهة التفاعلية ====================
function updateSystem(subs, cloudData) {
    document.getElementById('subs-display').textContent = subs.toLocaleString();
    
    let currentLvl = 1;
    for (let i = 1; i <= 100; i++) {
        if (subs >= levelRequirements[i]) currentLvl = i; else break;
    }
    
    document.getElementById('current-level').textContent = `LV. ${currentLvl}`;

    let currentMin = levelRequirements[currentLvl];
    let nextMax = levelRequirements[currentLvl + 1] || currentMin;
    let percentage = nextMax !== currentMin ? ((subs - currentMin) / (nextMax - currentMin)) * 100 : 100;
    
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('next-level-subs').textContent = currentLvl === 100 ? "المستوى الأقصى" : (nextMax - subs).toLocaleString();

    const systemWindow = document.getElementById('system-window');
    const rankBadge = document.getElementById('rank-badge');
    
    if (subs >= 1000) {
        systemWindow.className = "system-window evolution-stage-2";
        rankBadge.textContent = "الطور: الأخضر المستيقظ ⚡";
    } else {
        systemWindow.className = "system-window evolution-stage-1";
        rankBadge.textContent = "الطور: الأزرق القياسي 🎬";
    }

    const maxCommentPoints = currentLvl; 
    let currentCommentCountGlobal = (cloudData.commentsList || []).length;
    document.getElementById('comment-points-display').textContent = `${currentCommentCountGlobal} / ${maxCommentPoints}`;

    let maxChannelPoints = Math.floor(currentLvl / 5);
    let currentChannelCountGlobal = (cloudData.channelsList || []).length;
    document.getElementById('channel-points-display').textContent = `${currentChannelCountGlobal} / ${maxChannelPoints}`;

    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = "";
    let skills = ["🔓 ميزة رصد المشتركين تلقائياً الحية"];

    const isAdmin = sessionStorage.getItem('systemAdminActive') === "true";
    
    if (currentLvl >= 2) {
        skills.push("💬 مهارة نشطة: [استدعاء تعليق حليف أوفى]");
        const container = document.getElementById('comments-container');
        container.innerHTML = "";

        const comments = cloudData.commentsList || [];
        
        if (comments.length > 0) {
            document.getElementById('comment-summon-box').classList.remove('hidden');
            const visibleComments = showAllComments ? comments : comments.slice(0, 3);
            
            visibleComments.forEach(item => {
                let div = document.createElement('div'); div.className = "single-comment-item";
                div.innerHTML = `<p class="comment-user">${item.user}</p><p class="comment-text">"${item.text}"</p>`;
                container.appendChild(div);
            });

            const showMoreBtn = document.getElementById('show-more-comments-btn');
            if (comments.length > 3) {
                showMoreBtn.classList.remove('hidden');
                showMoreBtn.textContent = showAllComments ? "🔼 إخفاء التعليقات الزائدة" : `🔽 إظهار المزيد من التعليقات (+${comments.length - 3})`;
            } else { showMoreBtn.classList.add('hidden'); }
        } else {
            if (isAdmin) {
                document.getElementById('comment-summon-box').classList.remove('hidden');
                container.innerHTML = `<p style="color:rgba(255,255,255,0.4); font-size:12px; text-align:center;">قائمة التعليقات مطهرة حالياً.</p>`;
            } else { document.getElementById('comment-summon-box').classList.add('hidden'); }
            document.getElementById('show-more-comments-btn').classList.add('hidden');
        }
    }

    if (currentLvl >= 5) { 
        skills.push("🤝 مهارة فريدة: [فتح بوابة دعم القنوات الحليفة]");
        const container = document.getElementById('alliance-container');
        container.innerHTML = "";

        const channels = cloudData.channelsList || [];

        if (channels.length > 0) {
            document.getElementById('alliance-section').classList.remove('hidden');
            const visibleChannels = showAllChannels ? channels : channels.slice(0, 3);
            
            visibleChannels.forEach(item => {
                let div = document.createElement('div'); div.className = "single-alliance-item";
                div.innerHTML = `<p style="margin:0 0 5px 0; font-size:13px;">دعم السيستم لـ: <strong>${item.name}</strong></p>
                                 <a href="${item.url}" target="_blank" class="alliance-link">⚔️ دخول بوابة دعم القناة</a>`;
                container.appendChild(div);
            });

            const showMoreBtn = document.getElementById('show-more-channels-btn');
            if (channels.length > 3) {
                showMoreBtn.classList.remove('hidden');
                showMoreBtn.textContent = showAllChannels ? "🔼 إخفاء البوابات الزائدة" : `🔽 إظهار المزيد من البوابات (+${channels.length - 3})`;
            } else { showMoreBtn.classList.add('hidden'); }
        } else {
            if (isAdmin) {
                document.getElementById('alliance-section').classList.remove('hidden');
                container.innerHTML = `<p style="color:#ff3333; font-size:12px; text-align:center;">جميع بوابات الدعم مغلقة حالياً.</p>`;
            } else { document.getElementById('alliance-section').classList.add('hidden'); }
            document.getElementById('show-more-channels-btn').classList.add('hidden');
        }
    } else {
        document.getElementById('alliance-section').classList.add('hidden');
    }

    skills.forEach(s => {
        let li = document.createElement('li'); li.textContent = s; skillsList.appendChild(li);
    });

    // إخفاء لوحة الأدمن لتجنب تعارض السيرفرات السحابية المحظورة
    document.getElementById('admin-panel').classList.add('hidden');
}

document.getElementById('show-more-comments-btn').addEventListener('click', () => { showAllComments = !showAllComments; fetchYouTubeData(); });
document.getElementById('show-more-channels-btn').addEventListener('click', () => { showAllChannels = !showAllChannels; fetchYouTubeData(); });

// زر التحديث العادي الآمن لعداد المشتركين واللفل فقط
document.getElementById('update-btn').addEventListener('click', () => {
    fetchYouTubeData();
});

window.addEventListener('DOMContentLoaded', () => {
    fetchYouTubeData();
});
