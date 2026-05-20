// ==================== 🔑 إعدادات السيستم الرئيسية الحقيقية ====================
const API_KEY = "AIzaSyDyanLNYpRJagmwu03_h4m-mR3i4iWkjeI"; 
const CHANNEL_ID = "UC5NnC89vE_9mDszxX_v-mhw"; 

// مستودع النواة السحابية للسيطرة وحفظ البيانات المتسلسلة
const CLOUD_STORAGE_URL = "https://kvbin.glitch.me/bins/sensei_tammy_system";

// حالات التحكم في ميزة "إظهار المزيد" (محلية للعرض الحالي)
let showAllComments = false;
let showAllChannels = false;

// متغيرات حفظ السعة الحالية عالمياً لتتبعها عند الضغط على الأزرار
let maxCommentPoints = 0;
let currentCommentCount = 0;
let maxChannelPoints = 0;
let currentChannelCount = 0;

// متطلبات الـ 100 لفل
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

// ==================== 📡 المزامنة وجلب القوائم السحابية الحية ====================
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
        console.warn("استخدام العداد المحلي الاحتياطي");
    }

    let cloudData = { commentsList: [], channelsList: [] };

    try {
        const cloudResponse = await fetch(CLOUD_STORAGE_URL);
        if (cloudResponse.ok) {
            const resData = await cloudResponse.json();
            if (resData && resData.commentsList !== undefined) {
                cloudData = resData;
            }
        }
    } catch (e) {
        console.warn("تعذر سحب البيانات السحابية الحية.");
    }

    updateSystem(currentSubs, cloudData);
}

// ==================== 🌌 معالجة القوائم وحساب نقاط الميزات الحية للمسؤول ====================
function updateSystem(subs, cloudData) {
    document.getElementById('subs-display').textContent = subs.toLocaleString();
    
    let currentLvl = 1;
    for (let i = 1; i <= 100; i++) {
        if (subs >= levelRequirements[i]) currentLvl = i; else break;
    }
    document.getElementById('current-level').textContent = `LV. ${currentLvl}`;

    // شريط التقدم الشامل
    let currentMin = levelRequirements[currentLvl];
    let nextMax = levelRequirements[currentLvl + 1] || currentMin;
    let percentage = nextMax !== currentMin ? ((subs - currentMin) / (nextMax - currentMin)) * 100 : 100;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('next-level-subs').textContent = currentLvl === 100 ? "المستوى الأقصى" : nextMax.toLocaleString();

    // 📊 حساب سعة النقاط المتاحة بناءً على اللفل الحالي لـ عاهل السيستم
    maxCommentPoints = currentLvl; // عدد التعليقات المتاحة = رقم اللفل الحالي ليفل 3 يعطيك 3 نقاط
    currentCommentCount = (cloudData.commentsList || []).length;
    
    // حساب قنوات الدعم: بوابة واحدة لكل 5 ليفلات، واستثناء ليفل 4 ليفتح لك بوابة مبكرة
    maxChannelPoints = Math.floor(currentLvl / 5);
    if (currentLvl === 4 && maxChannelPoints === 0) maxChannelPoints = 1; 
    currentChannelCount = (cloudData.channelsList || []).length;

    // تحديث العدادات المرئية في لوحة التحكم فوراً
    document.getElementById('comment-points-display').textContent = `${currentCommentCount} / ${maxCommentPoints}`;
    document.getElementById('channel-points-display').textContent = `${currentChannelCount} / ${maxChannelPoints}`;

    // تشكيل قائمة المهارات الفردية لكل لفل
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = "";
    let skills = ["🔓 ميزة رصد المشتركين تلقائياً الحية"];

    // 🔒 التحقق الحصري الصارم من توقيع عاهل السيستم الحقيقي
    const isAdmin = localStorage.getItem('systemAdminSignature') === "bWFuYWdlcl9zZW5zZWlfMjAyNl9sb2NrZWQ=";
    
    // 1. مهارة استدعاء تعليقات الأوفياء المتعددة (تفتح لفل 2 فما فوق)
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
                container.innerHTML = `<p style="color:rgba(255,255,255,0.4); font-size:12px;">قائمة التعليقات مطهرة حالياً، بانتظار استدعائك الأول...</p>`;
            } else { document.getElementById('comment-summon-box').classList.add('hidden'); }
            document.getElementById('show-more-comments-btn').classList.add('hidden');
        }

        if(isAdmin) document.getElementById('admin-comment-inputs').classList.remove('hidden');
    }

    // 2. مهارة وعرض بوابات دعم القنوات المتعددة
    if (currentLvl >= 4 || currentLvl % 5 === 0) { 
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
                container.innerHTML = `<p style="color:#ff3333; font-size:12px;">جميع بوابات الدعم مغلقة حالياً.</p>`;
            } else { document.getElementById('alliance-section').classList.add('hidden'); }
            document.getElementById('show-more-channels-btn').classList.add('hidden');
        }

        if(isAdmin) document.getElementById('admin-channel-inputs').classList.remove('hidden');
    }

    skills.forEach(s => {
        let li = document.createElement('li'); li.textContent = s; skillsList.appendChild(li);
    });

    if (isAdmin) { document.getElementById('admin-panel').classList.remove('hidden'); } 
    else { document.getElementById('admin-panel').classList.add('hidden'); }
}

// ==================== 👑 محرك الرفع السحابي والتحقق من طاقة النقاط المتاحة ====================
async function saveToCloud(updatedFields) {
    try {
        let currentCloudData = { commentsList: [], channelsList: [] };
        try {
            const res = await fetch(CLOUD_STORAGE_URL);
            if (res.ok) {
                const data = await res.json();
                if (data && data.commentsList) currentCloudData = data;
            }
        } catch(e){}

        const finalData = { ...currentCloudData, ...updatedFields };

        await fetch(CLOUD_STORAGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
        });
        
        alert("⚡ تم تحديث ومزامنة النواة السحابية للسيستم المطلق!");
        fetchYouTubeData();
    } catch (error) { alert("فشلت المزامنة السحابية العامة."); }
}

// 🔮 استدعاء تعليق جديد (مع تفعيل فحص طاقة النقاط الحالية)
document.getElementById('save-comment-btn').addEventListener('click', async () => {
    // ⚠️ جدار التحقق الصارم من النقاط المتاحة
    if (currentCommentCount >= maxCommentPoints) {
        alert(`❌ فشل الاستدعاء! [خطأ في النظام: لا توجد نقاط طاقة كافية].\nسعة مستواك الحالي هي ${maxCommentPoints} تعليقات فقط، وقد استهلكتها بالكامل.\nقم بتطهير القائمة أو انتظر ارتقاء لفل القناة!`);
        return;
    }

    const name = document.getElementById('input-fan-name').value.trim();
    const text = document.getElementById('input-fan-text').value.trim();
    
    if(name && text) {
        let currentList = [];
        try {
            const res = await fetch(CLOUD_STORAGE_URL);
            if(res.ok) { const d = await res.json(); currentList = d.commentsList || []; }
        } catch(e){}

        currentList.push({ user: name, text: text });
        document.getElementById('input-fan-name').value = "";
        document.getElementById('input-fan-text').value = "";
        
        await saveToCloud({ commentsList: currentList });
    } else { alert("الرجاء إدخال اسم المتابع وتفضيل نص التعليق!"); }
});

// 🔥 فتح بوابة دعم جديدة (مع تفعيل فحص نقاط البوابات الحالية)
document.getElementById('save-channel-btn').addEventListener('click', async () => {
    // ⚠️ جدار التحقق الصارم من نقاط بوابات الدعم المتاحة
    if (currentChannelCount >= maxChannelPoints) {
        alert(`❌ فشل فتح البوابة! [خطأ في النظام: لا توجد نقاط بوابات كافية].\nمستواك الحالي يمنحك فتح ${maxChannelPoints} بوابة دعم فقط كحد أقصى.\nقم بإغلاق البوابات القديمة لتحرير النقاط المستهلكة!`);
        return;
    }

    const name = document.getElementById('input-channel-name').value.trim();
    const url = document.getElementById('input-channel-url').value.trim();
    
    if(name && url) {
        let currentList = [];
        try {
            const res = await fetch(CLOUD_STORAGE_URL);
            if(res.ok) { const d = await res.json(); currentList = d.channelsList || []; }
        } catch(e){}

        currentList.push({ name: name, url: url });
        document.getElementById('input-channel-name').value = "";
        document.getElementById('input-channel-url').value = "";
        
        await saveToCloud({ channelsList: currentList });
    } else { alert("الرجاء إدخال اسم القناة والرابط الأصلي الحليفة!"); }
});

// 🗑️ أزرار التطهير لاسترداد النقاط فوراً والبدء من جديد
document.getElementById('delete-comment-btn').addEventListener('click', () => {
    if(confirm("هل أنت متأكد من مسح قائمة التعليقات بالكامل واسترداد جميع نقاط الطاقة المندمجة؟")) {
        saveToCloud({ commentsList: [] });
    }
});

document.getElementById('delete-channel-btn').addEventListener('click', () => {
    if(confirm("هل أنت متأكد من إغلاق كافة بوابات الدعم الحالية لتحرير نقاط البوابات؟")) {
        saveToCloud({ channelsList: [] });
    }
});

// 🔽 تفعيل وظائف أزرار "إظهار المزيد"
document.getElementById('show-more-comments-btn').addEventListener('click', () => { showAllComments = !showAllComments; fetchYouTubeData(); });
document.getElementById('show-more-channels-btn').addEventListener('click', () => { showAllChannels = !showAllChannels; fetchYouTubeData(); });

// ==================== 🛡️ جدار حماية التفعيل السري للضغط المطول ====================
let pressTimer;
const updateBtn = document.getElementById('update-btn');

const askForAdminAccess = () => {
    const accessKey = prompt("⚠️ تنبيه نظام حماية الأبعاد:\nالرجاء إدخال تعويذة السيطرة لإثبات هويتك كعاهل السيستم:");
    if (accessKey && btoa(accessKey) === "c2Vuc2VpMjAyNg==") { 
        localStorage.setItem('systemAdminSignature', "bWFuYWdlcl9zZW5zZWlfMjAyNl9sb2NrZWQ=");
        alert("👑 أهلاً بك يا عاهل السيستم! بوابات السيطرة السحابية المطلقة مفتوحة بين يديك الآن.");
        fetchYouTubeData();
    } else if (accessKey) {
        alert("❌ تعويذة خاطئة! تم تفعيل بروتوكول حماية اللوحة الإدارية.");
    }
};

updateBtn.addEventListener('mousedown', () => { pressTimer = window.setTimeout(askForAdminAccess, 5000); });
updateBtn.addEventListener('mouseup', () => clearTimeout(pressTimer));
updateBtn.addEventListener('touchstart', () => { pressTimer = window.setTimeout(askForAdminAccess, 5000); });
updateBtn.addEventListener('touchend', () => clearTimeout(pressTimer));

window.addEventListener('DOMContentLoaded', fetchYouTubeData);
if (updateBtn) { updateBtn.addEventListener('click', fetchYouTubeData); }
