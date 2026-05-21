// ==================== 🔑 إعدادات السيرفر السحابي واليوتيوب الجاهزة ====================
const SUPABASE_URL = "https://bpwyzvdlnyskivqotkrp.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_kAcNMskOeWtXx4EHDTtZgA_a9onaOOM"; 

const API_KEY = "AIzaSyDyanLNYpRJagmwu03_h4m-mR3i4iWkjeI"; 
const CHANNEL_ID = "UC5NnC89vE_9mDszxX_v-mhw"; 

// ربط النواة بـ Supabase تلقائياً
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let showAllComments = false;
let showAllChannels = false;
let currentLevelGlobal = 1;
let secretClickCount = 0;
let secretClickTimeout;

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

// ==================== 📡 جلب البيانات الحية مباشرة من السحابة لجميع الهواتف ====================
async function fetchYouTubeData() {
    let currentSubs = 303; 
    try {
        const targetUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        const proxyData = await response.json();
        const data = JSON.parse(proxyData.contents);
        if (data && data.items && data.items.length > 0) currentSubs = parseInt(data.items[0].statistics.subscriberCount);
    } catch (e) { console.warn("العداد الاحتياطي نشط."); }

    // جلب التعليقات والقنوات من جدول السيرفر المشترك
    const { data: dbComments } = await supabase.from('channel_comments').select('*').order('created_at', { ascending: true });
    const { data: dbChannels } = await supabase.from('channel_alliances').select('*').order('created_at', { ascending: true });

    updateSystem(currentSubs, { commentsList: dbComments || [], channelsList: dbChannels || [] });
}

// ==================== 🌌 بناء وتحديث الواجهة لجميع الهواتف بشكل متزامن ====================
function updateSystem(subs, cloudData) {
    document.getElementById('subs-display').textContent = subs.toLocaleString();
    
    let currentLvl = 1;
    for (let i = 1; i <= 100; i++) { if (subs >= levelRequirements[i]) currentLvl = i; else break; }
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

    document.getElementById('comment-points-display').textContent = `${cloudData.commentsList.length} / ${currentLvl}`;
    document.getElementById('channel-points-display').textContent = `${cloudData.channelsList.length} / ${Math.floor(currentLvl / 5)}`;

    const isAdmin = sessionStorage.getItem('systemAdminActive') === "true";

    // عرض قسم التعليقات لجميع الناس
    if (currentLvl >= 2) {
        const container = document.getElementById('comments-container');
        container.innerHTML = "";
        if (cloudData.commentsList.length > 0) {
            document.getElementById('comment-summon-box').classList.remove('hidden');
            const visible = showAllComments ? cloudData.commentsList : cloudData.commentsList.slice(0, 3);
            visible.forEach(item => {
                let div = document.createElement('div'); div.className = "single-comment-item";
                div.innerHTML = `<p class="comment-user">${item.username}</p><p class="comment-text">"${item.comment_text}"</p>`;
                container.appendChild(div);
            });
            const btn = document.getElementById('show-more-comments-btn');
            if (cloudData.commentsList.length > 3) {
                btn.classList.remove('hidden');
                btn.textContent = showAllComments ? "🔼 إخفاء التعليقات الزائدة" : `🔽 إظهار المزيد (+${cloudData.commentsList.length - 3})`;
            } else btn.classList.add('hidden');
        } else {
            document.getElementById('comment-summon-box').classList.add('hidden');
        }
        if(isAdmin) document.getElementById('admin-comment-inputs').classList.remove('hidden');
    }

    // عرض قسم البوابات لجميع الناس
    if (currentLvl >= 5) {
        const container = document.getElementById('alliance-container');
        container.innerHTML = "";
        if (cloudData.channelsList.length > 0) {
            document.getElementById('alliance-section').classList.remove('hidden');
            const visible = showAllChannels ? cloudData.channelsList : cloudData.channelsList.slice(0, 3);
            visible.forEach(item => {
                let div = document.createElement('div'); div.className = "single-alliance-item";
                div.innerHTML = `<p style="margin:0; font-size:13px;">دعم لـ: <strong>${item.channel_name}</strong></p>
                                 <a href="${item.channel_url}" target="_blank" class="alliance-link">⚔️ دخول بوابة الدعم</a>`;
                container.appendChild(div);
            });
            const btn = document.getElementById('show-more-channels-btn');
            if (cloudData.channelsList.length > 3) {
                btn.classList.remove('hidden');
                btn.textContent = showAllChannels ? "🔼 إخفاء البوابات" : `🔽 إظهار المزيد (+${cloudData.channelsList.length - 3})`;
            } else btn.classList.add('hidden');
        } else document.getElementById('alliance-section').classList.add('hidden');
        if(isAdmin) document.getElementById('admin-channel-inputs').classList.remove('hidden');
    }

    // طباعة الميزات وقوائم الحذف المنفصلة للمسؤول
    const adminPanel = document.getElementById('admin-panel');
    if (isAdmin) {
        adminPanel.classList.remove('hidden');
        
        const commManage = document.getElementById('admin-comments-manage-list');
        commManage.innerHTML = "";
        cloudData.commentsList.forEach(c => {
            let row = document.createElement('div'); row.className = "item-manage-row";
            row.innerHTML = `<span class="item-manage-text">👤 ${c.username}</span>
                             <button class="inline-delete-btn" onclick="apiDeleteComment(${c.id})">حذف فوري ❌</button>`;
            commManage.appendChild(row);
        });

        const chanManage = document.getElementById('admin-channels-manage-list');
        chanManage.innerHTML = "";
        cloudData.channelsList.forEach(ch => {
            let row = document.createElement('div'); row.className = "item-manage-row";
            row.innerHTML = `<span class="item-manage-text">📢 ${ch.channel_name}</span>
                             <button class="inline-delete-btn" onclick="apiDeleteChannel(${ch.id})">حذف فوري ❌</button>`;
            chanManage.appendChild(row);
        });

        if (!document.getElementById('logout-admin-btn')) {
            const logout = document.createElement('button');
            logout.id = "logout-admin-btn"; logout.innerHTML = "🔒 الخروج من وضع المسؤول";
            logout.style = "background:#220505; color:#ff3333; border:1px dashed #ff3333; padding:7px; width:100%; border-radius:4px; font-weight:bold; cursor:pointer; font-size:11px; margin-bottom:15px;";
            logout.onclick = () => { sessionStorage.removeItem('systemAdminActive'); fetchYouTubeData(); };
            adminPanel.insertBefore(logout, adminPanel.children[1]);
        }
    } else { adminPanel.classList.add('hidden'); }

    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = "";
    let skills = ["🔓 ميزة رصد المشتركين تلقائياً الحية"];
    if (currentLvl >= 2) skills.push("💬 مهارة نشطة: [استدعاء تعليق حليف أوفى]");
    if (currentLvl >= 5) skills.push("🤝 مهارة فريدة: [فتح بوابة دعم القنوات الحليفة]");
    skills.forEach(s => { let li = document.createElement('li'); li.textContent = s; skillsList.appendChild(li); });
}

// ==================== 🛠️ أوامر التحكم الحية بالسحابة وبث التحديث لكل الأجهزة ====================
document.getElementById('save-comment-btn').addEventListener('click', async () => {
    const name = document.getElementById('input-fan-name').value.trim();
    const text = document.getElementById('input-fan-text').value.trim();
    if(!name || !text) return alert("املاً الحقول أولاً!");

    await supabase.from('channel_comments').insert([{ username: name, comment_text: text }]);
    document.getElementById('input-fan-name').value = ""; document.getElementById('input-fan-text').value = "";
    alert("⚡ تم بث وتعليق الصوت الأسطوري لجميع الهواتف!");
    fetchYouTubeData();
});

document.getElementById('save-channel-btn').addEventListener('click', async () => {
    const name = document.getElementById('input-channel-name').value.trim();
    const url = document.getElementById('input-channel-url').value.trim();
    if(!name || !url) return alert("املاً الحقول أولاً!");

    await supabase.from('channel_alliances').insert([{ channel_name: name, channel_url: url }]);
    document.getElementById('input-channel-name').value = ""; document.getElementById('input-channel-url').value = "";
    alert("🔥 تم فتح البوابة وبثها لجميع الهواتف!");
    fetchYouTubeData();
});

window.apiDeleteComment = function(id) {
    if(confirm("حذف هذا التعليق نهائياً من كل الأبعاد؟")) {
        supabase.from('channel_comments').delete().eq('id', id).then(() => fetchYouTubeData());
    }
}

window.apiDeleteChannel = function(id) {
    if(confirm("إغلاق وحذف هذه البوابة نهائياً عند الجميع؟")) {
        supabase.from('channel_alliances').delete().eq('id', id).then(() => fetchYouTubeData());
    }
}

// بروتوكول فتح بوابات التحكم السرية للمؤسس (5 ضغطات على زر التحديث)
document.getElementById('update-btn').addEventListener('click', () => {
    secretClickCount++;
    if (secretClickCount === 1) { clearTimeout(secretClickTimeout); secretClickTimeout = setTimeout(() => { secretClickCount = 0; }, 3000); }
    if (secretClickCount === 5) {
        secretClickCount = 0;
        const key = prompt("الرجاء إدخل تعويذة السيطرة لعاهل السيستم:");
        if (key === "sensei2026") { sessionStorage.setItem('systemAdminActive', "true"); fetchYouTubeData(); }
        return;
    }
    fetchYouTubeData();
});

document.getElementById('show-more-comments-btn').addEventListener('click', () => { showAllComments = !showAllComments; fetchYouTubeData(); });
document.getElementById('show-more-channels-btn').addEventListener('click', () => { showAllChannels = !showAllChannels; fetchYouTubeData(); });
window.addEventListener('DOMContentLoaded', fetchYouTubeData);
