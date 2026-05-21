// ==================== 🔑 إعدادات السيستم الرئيسية الحقيقية ====================
const API_KEY = "AIzaSyDyanLNYpRJagmwu03_h4m-mR3i4iWkjeI"; 
const CHANNEL_ID = "UC5NnC89vE_9mDszxX_v-mhw"; 

// مستودع النواة السحابية للسيطرة وحفظ البيانات المتسلسلة
const CLOUD_STORAGE_URL = "https://kvbin.glitch.me/bins/sensei_tammy_system";

// حالات التحكم في ميزة "إظهار المزيد" (محلية للعرض الحالي)
let showAllComments = false;
let showAllChannels = false;

// متغيرات تتبع النقاط محلياً لمنع التكرار اللحظي
let currentLevelGlobal = 1;
let currentCommentCountGlobal = 0;
let currentChannelCountGlobal = 0;

// عداد حماية البوابة السرية (5 ضغطات / 3 ثوانٍ)
let secretClickCount = 0;
let secretClickTimeout;

// متطلبات الـ 100 لفل المنهجية
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

// ==================== 📡 المزامنة وجلب البيانات الشاملة ====================
async function fetchYouTubeData() {
    let currentSubs = 303; // العداد الافتراضي الحالي لقناتك (LV 4)
    
    try {
        const targetUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        const proxyData = await response.json();
        const data = JSON.parse(proxyData.contents);

        if (data && data.items && data.items.length > 0) {
            currentSubs = parseInt(data.items[0].statistics.subscriberCount);
        }
    } catch (error) { 
        console.warn("استخدام العداد المحلي الاحتياطي للمشتركين.");
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
        console.warn("تعذر سحب البيانات السحابية الحية، جاري بدء مستودع فارغ.");
    }

    updateSystem(currentSubs, cloudData);
}

// ==================== 🌌 معالجة البيانات وتحديث الواجهة التفاعلية ====================
function updateSystem(subs, cloudData) {
    document.getElementById('subs-display').textContent = subs.toLocaleString();
    
    // حساب المستوى الحالي بناءً على المشتركين
    let currentLvl = 1;
    for (let i = 1; i <= 100; i++) {
        if (subs >= levelRequirements[i]) currentLvl = i; else break;
    }
    currentLevelGlobal = currentLvl; // حفظ ليفل النظام عالمياً
    document.getElementById('current-level').textContent = `LV. ${currentLvl}`;

    // حساب النسبة المئوية للمسافة برمجياً لملء شريط التقدم بمرونة
    let currentMin = levelRequirements[currentLvl];
    let nextMax = levelRequirements[currentLvl + 1] || currentMin;
    let percentage = nextMax !== currentMin ? ((subs - currentMin) / (nextMax - currentMin)) * 100 : 100;
    
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('next-level-subs').textContent = currentLvl === 100 ? "المستوى الأقصى" : (nextMax - subs).toLocaleString();

    // ⚡ أمر الطور المتطور الحركي (عند الـ 1,000 مشترك تماماً أي ليفل 10 فما فوق)
    const systemWindow = document.getElementById('system-window');
    const rankBadge = document.getElementById('rank-badge');
    
    if (subs >= 1000) {
        systemWindow.className = "system-window evolution-stage-2";
        rankBadge.textContent = "الطور: الأخضر المستيقظ ⚡";
    } else {
        systemWindow.className = "system-window evolution-stage-1";
        rankBadge.textContent = "الطور: الأزرق القياسي 🎬";
    }

    // 📊 حساب سعة قيود جدار الطاقة الصارم والعدادات المرئية
    const maxCommentPoints = currentLvl; 
    currentCommentCountGlobal = (cloudData.commentsList || []).length;
    document.getElementById('comment-points-display').textContent = `${currentCommentCountGlobal} / ${maxCommentPoints}`;

    let maxChannelPoints = Math.floor(currentLvl / 5);
    if (currentLvl >= 4 && maxChannelPoints === 0) maxChannelPoints = 1; // استثناء ليفل 4 لفتح بوابة مبكرة
    currentChannelCountGlobal = (cloudData.channelsList || []).length;
    document.getElementById('channel-points-display').textContent = `${currentChannelCountGlobal} / ${maxChannelPoints}`;

    // تشكيل مهارات السيستم النشطة في الواجهة
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = "";
    let skills = ["🔓 ميزة رصد المشتركين تلقائياً الحية"];

    // 🛑 قراءة حالة الآدمن المؤقتة في الجلسة الحالية فقط لمنع فتحها الدائم
    const isAdmin = sessionStorage.getItem('systemAdminActive') === "true";
    
    // 1. عرض مهارة استدعاء تعليقات الأوفياء
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
                container.innerHTML = `<p style="color:rgba(255,255,255,0.4); font-size:12px; text-align:center;">قائمة التعليقات مطهرة حالياً، بانتظار استدعائك الأول...</p>`;
            } else { document.getElementById('comment-summon-box').classList.add('hidden'); }
            document.getElementById('show-more-comments-btn').classList.add('hidden');
        }

        if(isAdmin) document.getElementById('admin-comment-inputs').classList.remove('hidden');
    }

    // 2. عرض مهارة بوابات دعم القنوات الحليفة
    if (currentLvl >= 4) { 
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

        if(isAdmin) document.getElementById('admin-channel-inputs').classList.remove('hidden');
    }

    // حقن المهارات في القائمة
    skills.forEach(s => {
        let li = document.createElement('li'); li.textContent = s; skillsList.appendChild(li);
    });

    // إظهار لوحة التحكم بالكامل إذا كان التوقيع الإداري صحيحاً
    if (isAdmin) { document.getElementById('admin-panel').classList.remove('hidden'); } 
    else { document.getElementById('admin-panel').classList.add('hidden'); }
}

// ==================== 👑 محرك الرفع السحابي المتزامن الصارم ====================
async function saveToCloud(updatedFields) {
    try {
        // نأتي بكامل الكائن السحابي أولاً لضمان عدم مسح الحقول الأخرى
        let currentCloudData = { commentsList: [], channelsList: [] };
        try {
            const res = await fetch(CLOUD_STORAGE_URL);
            if (res.ok) {
                const data = await res.json();
                if (data && data.commentsList !== undefined) currentCloudData = data;
            }
        } catch(e){}

        const finalData = {
            commentsList: updatedFields.commentsList !== undefined ? updatedFields.commentsList : (currentCloudData.commentsList || []),
            channelsList: updatedFields.channelsList !== undefined ? updatedFields.channelsList : (currentCloudData.channelsList || [])
        };

        const postResponse = await fetch(CLOUD_STORAGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
        });
        
        if(postResponse.ok) {
            alert("⚡ تم تحديث ومزامنة النواة السحابية للسيستم المطلق بنجاح!");
            fetchYouTubeData();
        } else {
            alert("❌ فشل السيرفر في قبول البيانات الجديدة.");
        }
    } catch (error) { 
        alert("❌ فشلت المزامنة السحابية العامة، تحقق من اتصال السيرفر."); 
    }
}

// 🔮 أمر استدعاء تعليق الأوفياء الصارم
document.getElementById('save-comment-btn').addEventListener('click', async () => {
    const name = document.getElementById('input-fan-name').value.trim();
    const text = document.getElementById('input-fan-text').value.trim();
    
    if(!name || !text) { 
        alert("الرجاء إدخال اسم المشترك المستدعى ونص التعليق الأسطوري أولاً!"); 
        return; 
    }

    // 1️⃣ FETCH فوري ومباشر من السيرفر لمعرفة العدد الفعلي الآن لمنع الـ Race Condition
    let currentCloudData = { commentsList: [], channelsList: [] };
    try {
        const res = await fetch(CLOUD_STORAGE_URL);
        if (res.ok) currentCloudData = await res.json();
    } catch(e){}

    const currentComments = currentCloudData.commentsList || [];

    // 2️⃣ التحقق من قيود جدار الطاقة الصارم بناءً على ليفل القناة الحالي
    if (currentComments.length >= currentLevelGlobal) {
        alert(`❌ طاقة لفل القناة ممتلئة! الحد الأقصى لمستواك هو ${currentLevelGlobal} تعليقات فقط.`);
        return;
    }

    // 3️⃣ إضافة البيانات الجديدة وإرسالها
    currentComments.push({ user: name, text: text });
    document.getElementById('input-fan-name').value = "";
    document.getElementById('input-fan-text').value = "";
    
    await saveToCloud({ commentsList: currentComments });
});

// 🔥 أمر فتح بوابة دعم القنوات الصارم
document.getElementById('save-channel-btn').addEventListener('click', async () => {
    const name = document.getElementById('input-channel-name').value.trim();
    const url = document.getElementById('input-channel-url').value.trim();
    
    if(!name || !url) { 
        alert("الرجاء إدخال اسم القناة الحليفة ورابطها الأصلي!"); 
        return; 
    }

    // 1️⃣ FETCH فوري ومباشر من السيرفر
    let currentCloudData = { commentsList: [], channelsList: [] };
    try {
        const res = await fetch(CLOUD_STORAGE_URL);
        if (res.ok) currentCloudData = await res.json();
    } catch(e){}

    const currentChannels = currentCloudData.channelsList || [];
    
    // حساب الحد الأقصى للبوابات
    let maxChannelPoints = Math.floor(currentLevelGlobal / 5);
    if (currentLevelGlobal >= 4 && maxChannelPoints === 0) maxChannelPoints = 1;

    // 2️⃣ التحقق من قيود جدار الطاقة الصارم
    if (currentChannels.length >= maxChannelPoints) {
        alert(`❌ طاقة النظام لا تسمح بفتح بوابة دعم جديدة! الحد الأقصى لك هو ${maxChannelPoints} بوابات.`);
        return;
    }

    // 3️⃣ إضافة البيانات وإرسالها للـ POST
    currentChannels.push({ name: name, url: url });
    document.getElementById('input-channel-name').value = "";
    document.getElementById('input-channel-url').value = "";
    
    await saveToCloud({ channelsList: currentChannels });
});

// 🗑️ أزرار التطهير وتصفير المصفوفات لاسترداد نقاط جدار الطاقة فوراً
document.getElementById('delete-comment-btn').addEventListener('click', () => {
    if(confirm("هل أنت متأكد من مسح وتطهير قائمة التعليقات سحابياً لاسترداد نقاط طاقة اللفل بالكامل؟")) {
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

// ==================== 🛡️ بروتوكول حماية البوابة السرية (The Secret 5-Click Trigger) ====================
const updateBtn = document.getElementById('update-btn');

updateBtn.addEventListener('click', () => {
    secretClickCount++;

    // الضغطة الأولى تفتح نافذة الموقت الصارم لمدة 3 ثوانٍ فقط لتصفير العداد
    if (secretClickCount === 1) {
        clearTimeout(secretClickTimeout);
        secretClickTimeout = setTimeout(() => {
            secretClickCount = 0; 
        }, 3000);
    }

    // 🛑 الشرط الصارم: عند الضغط 5 ضغطات متتالية وسريعة خلال 3 ثوانٍ
    if (secretClickCount === 5) {
        clearTimeout(secretClickTimeout);
        secretClickCount = 0; // تصفير عداد النقرات فوراً لمنع التداخل المستمر

        const accessKey = prompt("⚠️ تنبيه نظام حماية الأبعاد:\nالرجاء إدخال تعويذة السيطرة لإثبات هويتك كعاهل السيستم:");
        if (accessKey === "sensei2026") { 
            sessionStorage.setItem('systemAdminActive', "true"); // تفعيل مؤقت للجلسة الحالية فقط
            alert("👑 أهلاً بك يا عاهل السيستم! بوابات السيطرة السحابية المطلقة مفتوحة بين يديك الآن.");
            fetchYouTubeData();
        } else if (accessKey) {
            alert("❌ تعويذة خاطئة! تم تفعيل بروتوكول حماية اللوحة الإدارية.");
        }
        return; // إنهاء التابع فوراً لمنع تشغيل التحديث العادي المزدوج
    }

    // 🔄 إذا ضغط المستخدم ضغطة واحدة عادية أو ضغطات متباعدة
    fetchYouTubeData();
});

// 🛑 خطوة حاسمة: تنظيف أي توقيعات قديمة من الـ localStorage عند تشغيل الصفحة لأول مرة لضمان قفل الواجهة
window.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('systemAdminSignature');
    // إذا كنت تريد قفلها عند كل تحديث ريفريش، نفذ السطر التالي:
    // sessionStorage.removeItem('systemAdminActive'); 
    fetchYouTubeData();
});
