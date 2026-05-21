// ==================== 🔑 إعدادات السيستم الرئيسية الحقيقية ====================
const API_KEY = "AIzaSyDyanLNYpRJagmwu03_h4m-mR3i4iWkjeI"; 
const CHANNEL_ID = "UC5NnC89vE_9mDszxX_v-mhw"; 

// 🌐 رابط النواة السحابية الكونية الجديدة المفتوحة والمستقرة (لكل الهواتف)
const CLOUD_STORAGE_URL = "https://kvdb.io/MN7S6vX9fXvY6ZqP5vBc8d/sensei_system_data";

// حالات التحكم في ميزة "إظهار المزيد"
let showAllComments = false;
let showAllChannels = false;

// متغيرات تتبع النقاط عالمياً
let currentLevelGlobal = 1;
let currentCommentCountGlobal = 0;
let currentChannelCountGlobal = 0;

// عداد حماية البوابة السرية (5 ضغطات / 3 ثوانٍ)
let secretClickCount = 0;
let secretClickTimeout;

// متطلبات الـ 100 لفل المنهجية الصارمة
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

// ==================== 📡 محرك جلب البيانات السحابية العالمية ====================
async function fetchCloudData() {
    try {
        const response = await fetch(CLOUD_STORAGE_URL);
        if (response.ok) {
            const result = await response.json();
            if (result && (result.commentsList !== undefined || result.channelsList !== undefined)) {
                return result; 
            }
        }
    } catch (error) {
        console.warn("جاري إنشاء قاعدة بيانات سحابية جديدة أولى للسيستم...");
    }
    return { commentsList: [], channelsList: [] };
}

async function saveToCloud(updatedFields) {
    try {
        let currentCloudData = await fetchCloudData();
        
        const finalData = {
            commentsList: updatedFields.commentsList !== undefined ? updatedFields.commentsList : (currentCloudData.commentsList || []),
            channelsList: updatedFields.channelsList !== undefined ? updatedFields.channelsList : (currentCloudData.channelsList || [])
        };

        // استخدام الـ POST المباشر والمقبول عالمياً في السيرفر الجديد
        const response = await fetch(CLOUD_STORAGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
        });

        if (response.ok) {
            alert("⚡ تم التحديث والمزامنة السحابية العالمية لجميع الهواتف بنجاح!");
            fetchYouTubeData();
        } else {
            alert("❌ فشلت المزامنة، يرجى المحاولة مرة أخرى.");
        }
    } catch (error) {
        alert("❌ خطأ غير متوقع في الاتصال بالنواة السحابية.");
    }
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

    let cloudData = await fetchCloudData();
    updateSystem(currentSubs, cloudData);
}

// ==================== 🌌 معالجة البيانات وتحديث الواجهة التفاعلية ====================
function updateSystem(subs, cloudData) {
    document.getElementById('subs-display').textContent = subs.toLocaleString();
    
    let currentLvl = 1;
    for (let i = 1; i <= 100; i++) {
        if (subs >= levelRequirements[i]) currentLvl = i; else break;
    }
    currentLevelGlobal = currentLvl; 
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
    currentCommentCountGlobal = (cloudData.commentsList || []).length;
    document.getElementById('comment-points-display').textContent = `${currentCommentCountGlobal} / ${maxCommentPoints}`;

    // 📌 تعديل دعم القنوات الصارم: صفر في ليفل 4 ولا تفتح إلا في ليفل 5
    let maxChannelPoints = Math.floor(currentLvl / 5);
    currentChannelCountGlobal = (cloudData.channelsList || []).length;
    document.getElementById('channel-points-display').textContent = `${currentChannelCountGlobal} / ${maxChannelPoints}`;

    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = "";
    let skills = ["🔓 ميزة رصد المشتركين تلقائياً الحية"];

    const isAdmin = sessionStorage.getItem('systemAdminActive') === "true";
    
    // 🔮 1. مهارة استدعاء تعليقات الأوفياء (ليفل 2 فما فوق)
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

    // 🤝 2. مهارة بوابات دعم القنوات الحليفة (تفتح حركياً فقط من ليفل 5)
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

        if(isAdmin) document.getElementById('admin-channel-inputs').classList.remove('hidden');
    } else {
        document.getElementById('alliance-section').classList.add('hidden');
        if(isAdmin) document.getElementById('admin-channel-inputs').classList.add('hidden');
    }

    skills.forEach(s => {
        let li = document.createElement('li'); li.textContent = s; skillsList.appendChild(li);
    });

    // 👑 لوحة التحكم وزر الخروج السريع التلقائي
    const adminPanel = document.getElementById('admin-panel');
    if (isAdmin) { 
        adminPanel.classList.remove('hidden');
        
        if (!document.getElementById('logout-admin-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = "logout-admin-btn";
            logoutBtn.innerHTML = "🔒 قفل وبث حماية السيستم (الخروج من وضع المسؤول)";
            logoutBtn.style = "background: #220505; color: #ff3333; border: 1px dashed #ff3333; padding: 7px; width: 100%; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11px; margin-bottom: 15px;";
            
            logoutBtn.addEventListener('click', () => {
                if (confirm("هل أنت متأكد من تفعيل بروتوكول القفل الفوري وحجب لوحة عاهل السيستم؟")) {
                    sessionStorage.removeItem('systemAdminActive'); 
                    alert("🔒 تم قفل بوابات السيطرة وتطهير صلاحية الجلسة!");
                    fetchYouTubeData(); 
                }
            });
            adminPanel.insertBefore(logoutBtn, adminPanel.children[1]);
        }
    } else { 
        adminPanel.classList.add('hidden'); 
        const oldBtn = document.getElementById('logout-admin-btn');
        if(oldBtn) oldBtn.remove();
    }
}

// 🔮 أمر استدعاء تعليق الأوفياء الصارم
document.getElementById('save-comment-btn').addEventListener('click', async () => {
    const name = document.getElementById('input-fan-name').value.trim();
    const text = document.getElementById('input-fan-text').value.trim();
    
    if(!name || !text) { 
        alert("الرجاء إدخال اسم المشترك ونص التعليق أولاً!"); 
        return; 
    }

    let currentCloudData = await fetchCloudData();
    const currentComments = currentCloudData.commentsList || [];

    if (currentComments.length >= currentLevelGlobal) {
        alert(`❌ طاقة لفل القناة ممتلئة! الحد الأقصى لمستواك الحالي هو ${currentLevelGlobal} تعليقات فقط.`);
        return;
    }

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
        alert("الرجاء إدخال اسم القناة الحليفة ورابطها!"); 
        return; 
    }

    let currentCloudData = await fetchCloudData();
    const currentChannels = currentCloudData.channelsList || [];
    
    let maxChannelPoints = Math.floor(currentLevelGlobal / 5);

    if (currentChannels.length >= maxChannelPoints) {
        alert(`❌ طاقة النظام لا تسمح بفتح بوابة دعم جديدة! حدك الأقصى الحالي هو ${maxChannelPoints} بوابات.`);
        return;
    }

    currentChannels.push({ name: name, url: url });
    document.getElementById('input-channel-name').value = "";
    document.getElementById('input-channel-url').value = "";
    
    await saveToCloud({ channelsList: currentChannels });
});

// 🗑️ أزرار التطهير وتصفير المصفوفات
document.getElementById('delete-comment-btn').addEventListener('click', () => {
    if(confirm("هل أنت متأكد من مسح وتطهير قائمة التعليقات سحابياً؟")) {
        saveToCloud({ commentsList: [] });
    }
});

document.getElementById('delete-channel-btn').addEventListener('click', () => {
    if(confirm("هل أنت متأكد من إغلاق كافة بوابات الدعم الحالية؟")) {
        saveToCloud({ channelsList: [] });
    }
});

document.getElementById('show-more-comments-btn').addEventListener('click', () => { showAllComments = !showAllComments; fetchYouTubeData(); });
document.getElementById('show-more-channels-btn').addEventListener('click', () => { showAllChannels = !showAllChannels; fetchYouTubeData(); });

// ==================== 🛡️ بروتوكول حماية البوابة السرية ====================
const updateBtn = document.getElementById('update-btn');
updateBtn.addEventListener('click', () => {
    secretClickCount++;

    if (secretClickCount === 1) {
        clearTimeout(secretClickTimeout);
        secretClickTimeout = setTimeout(() => { secretClickCount = 0; }, 3000);
    }

    if (secretClickCount === 5) {
        clearTimeout(secretClickTimeout);
        secretClickCount = 0; 

        const accessKey = prompt("⚠️ تنبيه نظام حماية الأبعاد:\nالرجاء إدخال تعويذة السيطرة لإثبات هويتك كعاهل السيستم:");
        if (accessKey === "sensei2026") { 
            sessionStorage.setItem('systemAdminActive', "true"); 
            alert("👑 أهلاً بك يا عاهل السيستم! بوابات السيطرة السحابية المطلقة مفتوحة بين يديك الآن.");
            fetchYouTubeData();
        } else if (accessKey) {
            alert("❌ تعويذة خاطئة! تم تفعيل بروتوكول حماية اللوحة الإدارية.");
        }
        return; 
    }
    fetchYouTubeData();
});

window.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('systemAdminSignature');
    fetchYouTubeData();
});
