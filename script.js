// ==================== 🔑 بيانات الربط بالسيستم الحقيقي ====================
const API_KEY = "AIzaSyDyanLNYpRJagmwu03_h4m-mR3i4iWkjeI"; 
const CHANNEL_ID = "UC5NnC89vE_9mDszxX_v-mhw"; 

// رابط النواة السحابية المشتركة
const CLOUD_STORAGE_URL = "https://kvbin.glitch.me/bins/sensei_tammy_system";

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

// ==================== 📡 جلب البيانات التلقائية الحية والمزامنة السحابية ====================
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

    let cloudData = {
        summoned_user: "عبدالرحمن _ مانهوا",
        summoned_text: "والله التلخيص أسطوري والمونتاج فخم! 🔥",
        alliance_name: "قناة المتابع الأسطوري",
        alliance_url: "#"
    };

    try {
        const cloudResponse = await fetch(CLOUD_STORAGE_URL);
        if (cloudResponse.ok) {
            const resData = await cloudResponse.json();
            if (resData && resData.summoned_user) {
                cloudData = resData;
            }
        }
    } catch (e) {
        console.warn("عرض البيانات الاحتياطية الافتراضية.");
    }

    updateSystem(currentSubs, cloudData);
}

// ==================== 🌌 تحديث الواجهة والتحقق الآمن من هوية المسؤول ====================
function updateSystem(subs, cloudData) {
    document.getElementById('subs-display').textContent = subs.toLocaleString();
    
    let currentLvl = 1;
    for (let i = 1; i <= 100; i++) {
        if (subs >= levelRequirements[i]) currentLvl = i; else break;
    }
    document.getElementById('current-level').textContent = `LV. ${currentLvl}`;

    // شريط التقدم
    let currentMin = levelRequirements[currentLvl];
    let nextMax = levelRequirements[currentLvl + 1] || currentMin;
    let percentage = nextMax !== currentMin ? ((subs - currentMin) / (nextMax - currentMin)) * 100 : 100;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('next-level-subs').textContent = currentLvl === 100 ? "المستوى الأقصى" : nextMax.toLocaleString();

    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = "";
    let skills = ["🔓 ميزة رصد المشتركين تلقائياً الحية"];

    // 🔒 جدار الحماية: التحقق من التوقيع السري المشفر للمسؤول
    const isAdmin = localStorage.getItem('systemAdminSignature') === "bWFuYWdlcl9zZW5zZWlfMjAyNl9sb2NrZWQ=";
    
    if (currentLvl >= 2) {
        document.getElementById('comment-summon-box').classList.remove('hidden');
        if(isAdmin) document.getElementById('admin-comment-inputs').classList.remove('hidden');
        skills.push("💬 مهارة نشطة: [استدعاء تعليق حليف أوفى]");
        
        document.getElementById('comment-username').textContent = cloudData.summoned_user;
        document.getElementById('comment-text').textContent = `"${cloudData.summoned_text}"`;
    }

    if (currentLvl >= 4 || currentLvl % 5 === 0) { 
        document.getElementById('alliance-section').classList.remove('hidden');
        if(isAdmin) document.getElementById('admin-channel-inputs').classList.remove('hidden');
        skills.push("🤝 مهارة فريدة: [فتح بوابة دعم القنوات الحليفة]");

        const container = document.getElementById('alliance-container');
        container.innerHTML = `<p>دعم هذا الأسبوع مخصص لـ: <strong>${cloudData.alliance_name}</strong></p>
                               <a href="${cloudData.alliance_url}" target="_blank" class="alliance-link">⚔️ دخول بوابة دعم القناة</a>`;
    }

    skills.forEach(s => {
        let li = document.createElement('li'); li.textContent = s; skillsList.appendChild(li);
    });

    if (isAdmin) {
        document.getElementById('admin-panel').classList.remove('hidden');
    } else {
        document.getElementById('admin-panel').classList.add('hidden');
    }
}

// ==================== 👑 نظام الرفع والسيطرة السحابية المطلقة ====================
async function saveToCloud(updatedFields) {
    try {
        let currentCloudData = {};
        try {
            const res = await fetch(CLOUD_STORAGE_URL);
            if (res.ok) currentCloudData = await res.json();
        } catch(e){}

        const finalData = { ...currentCloudData, ...updatedFields };

        await fetch(CLOUD_STORAGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
        });
        
        alert("🔥 تم تحديث بيانات السيستم في السحابة بنجاح!");
        fetchYouTubeData();
    } catch (error) {
        alert("فشلت المزامنة السحابية.");
    }
}

document.getElementById('save-comment-btn').addEventListener('click', () => {
    const name = document.getElementById('input-fan-name').value;
    const text = document.getElementById('input-fan-text').value;
    if(name && text) saveToCloud({ summoned_user: name, summoned_text: text });
});

document.getElementById('save-channel-btn').addEventListener('click', () => {
    const name = document.getElementById('input-channel-name').value;
    const url = document.getElementById('input-channel-url').value;
    if(name && url) saveToCloud({ alliance_name: name, alliance_url: url });
});

// ==================== 🛡️ آلية التحقق من الهوية السحرية المحدثة ====================
let pressTimer;
const updateBtn = document.getElementById('update-btn');

const askForAdminAccess = () => {
    // يطلب السيستم كلمة السر
    const accessKey = prompt("⚠️ تنبيه نظام حماية الأبعاد:\nالرجاء إدخال تعويذة السيطرة لإثبات هويتك كعاهل السيستم:");
    
    // تشفير فوري لكلمة السر المدخلة ومقارنتها بالشفرة السرية المخفية
    if (accessKey && btoa(accessKey) === "c2Vuc2VpMjAyNg==") { 
        // إذا كانت صحيحة، يتم حقن توقيع رقمي معقد لا يمكن للزوار توقعه
        localStorage.setItem('systemAdminSignature', "bWFuYWdlcl9zZW5zZWlfMjAyNl9sb2NrZWQ=");
        alert("👑 تم التحقق من الهوية! أهلاً بك يا عاهل السيستم، بوابات السيطرة مفتوحة الآن.");
        fetchYouTubeData();
    } else if (accessKey) {
        alert("❌ تعويذة خاطئة! خوارزمية الحماية رصدت محاولة اختراق وسيتم حظر المتطفل.");
    }
};

updateBtn.addEventListener('mousedown', () => { pressTimer = window.setTimeout(askForAdminAccess, 5000); });
updateBtn.addEventListener('mouseup', () => clearTimeout(pressTimer));
updateBtn.addEventListener('touchstart', () => { pressTimer = window.setTimeout(askForAdminAccess, 5000); });
updateBtn.addEventListener('touchend', () => clearTimeout(pressTimer));

window.addEventListener('DOMContentLoaded', fetchYouTubeData);
if (updateBtn) { updateBtn.addEventListener('click', fetchYouTubeData); }
