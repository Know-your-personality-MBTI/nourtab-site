// 🔑 إعدادات السيستم المستقل
const YOUTUBE_API_KEY = "AIzaSyDyanLNYpRJagmwu03_h4m-mR3i4iWkjeI"; 
const YOUTUBE_CHANNEL_ID = "UCZwO3TMEASfTcKCzYMBxy3w";
const CLOUD_STORAGE_BASE_URL = "https://api.jsonbin.io/v3/b/665b9df021ff5e5d2449bddc"; 

let showAllChannels = false;
let showAllComments = false; 

// 👁️ مهارة [استدعاء البيانات الحية من بوابة يوتيوب]
async function fetchLiveSubscribers() {
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return parseInt(data.items[0].statistics.subscriberCount);
            }
        }
    } catch (error) {
        console.error("⚠️ فشل استدعاء طاقة اليوتيوب الحية:", error);
    }
    return null; 
}

// 🌐 دالة جلب البيانات الذكية - مفككة للكاش ومؤمنة الطبقات
async function loadCloudData() {
    try {
        // إجبار السيرفر على تخطي الكاش تماماً عبر الـ Timestamp
        const liveUrl = `${CLOUD_STORAGE_BASE_URL}/latest?nocache=${new Date().getTime()}`;
        
        const response = await fetch(liveUrl, {
            method: 'GET',
            headers: {
                "X-Master-Key": "$2a$10$XkuYANla4J/lzWCbl408T.zrL9nQ5FXrmL/aax48KwjOGJxT0BeyS",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // 🔍 فحص وتفكيك طبقات JSONBin لضمان الوصول للمصفوفة الحقيقية
            let root = data.record || data;
            if (root.record) { root = root.record; } // تعمق إضافي في حال وجود طبقة مكررة
            
            return {
                commentsList: root.commentsList || [],
                channelsList: root.channelsList || []
            };
        }
    } catch (e) { 
        console.warn("⚠️ فشل الاتصال بالسيرفر السحابي، جاري الانتقال للذاكرة المحلية:", e); 
    }
    
    // ذاكرة احتياطية في حال انقطاع السيرفر
    return { 
        commentsList: JSON.parse(localStorage.getItem('localComments') || '[]'), 
        channelsList: JSON.parse(localStorage.getItem('localChannels') || '[]') 
    };
}

// الدالة الأساسية لتحديث النظام بالكامل بناءً على عدد المشتركين
async function updateSystem() {
    const liveSubs = await fetchLiveSubscribers();
    const currentSubs = liveSubs !== null ? liveSubs : 303; 
    
    let currentLvl = 1;
    let nextLevelSubs = 100;
    let prevLevelSubs = 0; 

    if (currentSubs < 100) { 
        currentLvl = 1; nextLevelSubs = 100; prevLevelSubs = 0; 
    } else if (currentSubs < 200) { 
        currentLvl = 2; nextLevelSubs = 200; prevLevelSubs = 100; 
    } else if (currentSubs < 300) { 
        currentLvl = 3; nextLevelSubs = 300; prevLevelSubs = 200; 
    } else if (currentSubs < 400) { 
        currentLvl = 4; nextLevelSubs = 400; prevLevelSubs = 300; 
    } else if (currentSubs < 1000) { 
        currentLvl = 5; nextLevelSubs = 1000; prevLevelSubs = 400; 
    } else {
        currentLvl = Math.floor(currentSubs / 1000) + 5;
        nextLevelSubs = (currentLvl - 4) * 1000;
        prevLevelSubs = (currentLvl - 5) * 1000;
    }

    document.getElementById('subs-display').textContent = currentSubs.toLocaleString();
    document.getElementById('next-level-subs').textContent = nextLevelSubs.toLocaleString();
    document.getElementById('current-level').textContent = `LV. ${currentLvl}`;

    const systemWindow = document.getElementById('system-window');
    const rankBadge = document.getElementById('rank-badge');
    
    if (currentSubs >= 1000) {
        systemWindow.classList.remove('evolution-stage-1');
        systemWindow.classList.add('evolution-stage-2');
        rankBadge.textContent = "الطور: الأخضر المستيقظ ⚡";
    } else {
        systemWindow.classList.remove('evolution-stage-2');
        systemWindow.classList.add('evolution-stage-1');
        rankBadge.textContent = "الطور: الأزرق القياسي 🎬";
    }

    let progressPercent = ((currentSubs - prevLevelSubs) / (nextLevelSubs - prevLevelSubs)) * 100;
    if (progressPercent > 100) progressPercent = 100;
    if (progressPercent < 0) progressPercent = 0;
    document.getElementById('progress-fill').style.width = `${progressPercent}%`;

    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = "";
    
    let skills = ["👁️ مهارة [رؤية إحصائيات السيستم الحية]"];
    if (currentLvl >= 2) skills.push("💬 مهارة [استدعاء صوت الأوفياء] - نشطة");
    if (currentLvl >= 4) skills.push("🤝 مهارة [فتح بوابات الدعم الحليفة] - نشطة");
    if (currentSubs >= 1000) skills.push("⚡ مهارة [الهالة الخضراء المستيقظة] - مفعّلة");
    
    skills.forEach(skill => {
        let li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
    });

    const cloudData = await loadCloudData();
    const comments = cloudData.commentsList;
    const channels = cloudData.channelsList;

    const maxComments = currentLvl;
    const maxChannels = currentLvl >= 4 ? Math.floor(currentLvl / 5) || 1 : 0;
    
    document.getElementById('comment-points-display').textContent = `${comments.length} / ${maxComments}`;
    document.getElementById('channel-points-display').textContent = `${channels.length} / ${maxChannels}`;

    document.getElementById('comment-summon-box').classList.toggle('hidden', currentLvl < 2);
    document.getElementById('alliance-section').classList.toggle('hidden', currentLvl < 4);

    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = "";
    const visibleComments = showAllComments ? comments : comments.slice(0, 3);
    
    visibleComments.forEach(item => {
        let div = document.createElement('div');
        div.className = "single-comment-item";
        div.innerHTML = `<p class="comment-user">${item.user}</p><p class="comment-text">"${item.text}"</p>`;
        commentsContainer.appendChild(div);
    });

    const showMoreCommentsBtn = document.getElementById('show-more-comments-btn');
    if (showMoreCommentsBtn) {
        showMoreCommentsBtn.classList.toggle('hidden', comments.length <= 3);
        showMoreCommentsBtn.textContent = showAllComments ? "🔼 إخفاء القائمة" : `🔽 إظهار المزيد من التعليقات (+${comments.length - 3})`;
    }

    const allianceContainer = document.getElementById('alliance-container');
    allianceContainer.innerHTML = "";
    const visibleChannels = showAllChannels ? channels : channels.slice(0, 3);
    
    visibleChannels.forEach(item => {
        let div = document.createElement('div');
        div.className = "single-alliance-item";
        div.innerHTML = `<p style="margin:0; font-size:13px;">دعم لـ: <strong>${item.name}</strong></p>
                         <a href="${item.url}" target="_blank" class="alliance-link">⚔️ دخول بوابة الدعم</a>`;
        allianceContainer.appendChild(div);
    });

    const showMoreChannelsBtn = document.getElementById('show-more-channels-btn');
    if (showMoreChannelsBtn) {
        showMoreChannelsBtn.classList.toggle('hidden', channels.length <= 3);
        showMoreChannelsBtn.textContent = showAllChannels ? "🔼 إخفاء البوابات" : `🔽 إظهار المزيد من البوابات (+${channels.length - 3})`;
    }

    renderAdminManageLists(comments, channels);
}

function renderAdminManageLists(comments, channels) {
    const commentManageBox = document.getElementById('admin-comments-manage-list');
    const channelManageBox = document.getElementById('admin-channels-manage-list');
    
    if(!commentManageBox || !channelManageBox) return;

    commentManageBox.innerHTML = comments.length === 0 ? "<p style='font-size:11px;color:#888;'>لا يوجد تعليقات حالياً</p>" : "";
    comments.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = "item-manage-row";
        div.innerHTML = `<span class="item-manage-text">${item.user}: ${item.text}</span>
                         <button class="inline-delete-btn" data-index="${index}" data-type="comment">🗑️ حذف</button>`;
        commentManageBox.appendChild(div);
    });

    channelManageBox.innerHTML = channels.length === 0 ? "<p style='font-size:11px;color:#888;'>لا يوجد بوابات دعم حالياً</p>" : "";
    channels.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = "item-manage-row";
        div.innerHTML = `<span class="item-manage-text">${item.name}</span>
                         <button class="inline-delete-btn" data-index="${index}" data-type="channel">🗑️ حذف</button>`;
        channelManageBox.appendChild(div);
    });

    document.querySelectorAll('.inline-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            const type = e.target.getAttribute('data-type');
            deleteSingleItem(type, idx);
        });
    });
}

async function addEntry(type) {
    const cloudData = await loadCloudData();
    const currentLvl = parseInt(document.getElementById('current-level').textContent.replace('LV. ', ''));
    
    if (type === 'comment') {
        const maxComments = currentLvl;
        if (cloudData.commentsList.length >= maxComments) {
            return alert("❌ طاقة لفل القناة ممتلئة! لا يمكنك استدعاء المزيد من التعليقات في هذا المستوى.");
        }
        
        const userName = document.getElementById('input-fan-name').value.trim();
        const userText = document.getElementById('input-fan-text').value.trim();
        if(!userName || !userText) return alert("رجاءً املأ حقول التعليق أولاً!");

        cloudData.commentsList.push({ user: userName, text: userText });
    } else {
        const maxChannels = currentLvl >= 4 ? Math.floor(currentLvl / 5) || 1 : 0;
        if (cloudData.channelsList.length >= maxChannels) {
            return alert("❌ طاقة النظام لا تسمح بفتح بوابة دعم جديدة في هذا المستوى!");
        }
        
        const chanName = document.getElementById('input-channel-name').value.trim();
        const chanUrl = document.getElementById('input-channel-url').value.trim();
        if(!chanName || !chanUrl) return alert("رجاءً املأ حقول القناة الحليفة أولاً!");

        cloudData.channelsList.push({ name: chanName, url: chanUrl });
    }
    
    await sendCloudUpdate(cloudData);
}

async function deleteSingleItem(type, index) {
    const cloudData = await loadCloudData();
    if (type === 'comment') {
        cloudData.commentsList.splice(index, 1);
    } else {
        cloudData.channelsList.splice(index, 1);
    }
    await sendCloudUpdate(cloudData);
}

async function clearAllData(type) {
    if(!confirm("هل أنت متأكد من رغبتك في تصفير وتطهير القائمة بالكامل؟")) return;
    const cloudData = await loadCloudData();
    if (type === 'comment') cloudData.commentsList = [];
    else cloudData.channelsList = [];

    await sendCloudUpdate(cloudData);
}

// 🚀 دالة الرفع السحابي النظيف والمباشر
async function sendCloudUpdate(data) {
    try {
        localStorage.setItem('localComments', JSON.stringify(data.commentsList));
        localStorage.setItem('localChannels', JSON.stringify(data.channelsList));
        
        // تجهيز كائن مسطح ونظيف تماماً بدون أي تعقيدات تفهمها المنصة غلط
        const cleanPayload = {
            commentsList: data.commentsList,
            channelsList: data.channelsList
        };

        const response = await fetch(CLOUD_STORAGE_BASE_URL, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'X-Master-Key': "$2a$10$XkuYANla4J/lzWCbl408T.zrL9nQ5FXrmL/aax48KwjOGJxT0BeyS",
                'X-Bin-Versioning': 'false' 
            },
            body: JSON.stringify(cleanPayload)
        });

        if(response.ok) {
            console.log("✅ تم مزامنة البيانات سحابياً بنجاح مطلق!");
        }
    } catch(e) { 
        console.error("❌ حدث خطأ أثناء الرفع للسيرفر:", e); 
    }

    document.getElementById('input-fan-name').value = "";
    document.getElementById('input-fan-text').value = "";
    document.getElementById('input-channel-name').value = "";
    document.getElementById('input-channel-url').value = "";
    updateSystem();
}

let clickCount = 0;
let clickTimer;

document.getElementById('update-btn').addEventListener('click', () => {
    clickCount++;
    
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 3000);

    if (clickCount >= 5) {
        clickCount = 0;
        const password = prompt("أدخل تعويذة السيطرة لعاهل السيستم:");
        if (password === "sensei2026") {
            document.getElementById('admin-panel').classList.remove('hidden');
            alert("🔮 تم تفعيل واجهة السيطرة المطلقة بنجاح يا سينسي!");
        } else {
            alert("❌ تعويذة خاطئة! تم حظر محاولة الاختراق وتأمين النظام.");
        }
    } else {
        updateSystem();
    }
});

document.getElementById('save-comment-btn').addEventListener('click', () => addEntry('comment'));
document.getElementById('save-channel-btn').addEventListener('click', () => addEntry('channel'));
document.getElementById('delete-comment-btn').addEventListener('click', () => clearAllData('comment'));
document.getElementById('delete-channel-btn').addEventListener('click', () => clearAllData('channel'));

document.getElementById('show-more-comments-btn').addEventListener('click', () => { showAllComments = !showAllComments; updateSystem(); });
document.getElementById('show-more-channels-btn').addEventListener('click', () => { showAllChannels = !showAllChannels; updateSystem(); });

// أول تشغيل للنظام
updateSystem();
