// ==================== 🔑 إعدادات الربط بالسيستم ====================
const API_KEY = "AIzaSyDyanLNYpRJagmwu03_h4m-mR3i4iWkjeI"; 
const CHANNEL_ID = "UC5NnC89vE_9mDszxX_v-mhw"; 

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

// ==================== 📡 جلب البيانات التلقائية الحية ====================
async function fetchYouTubeData() {
    try {
        const targetUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        const proxyData = await response.json();
        const data = JSON.parse(proxyData.contents);

        if (data && data.items && data.items.length > 0) {
            updateSystem(parseInt(data.items[0].statistics.subscriberCount));
        } else { updateSystem(303); }
    } catch (error) { updateSystem(303); }
}

// ==================== 🌌 تحديث الأطوار والميزات البرمجية ====================
function updateSystem(subs) {
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

    // تشكيل الأطوار والمهارات
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = "";
    let skills = ["🔓 رصد المشتركين تلقائياً الحية"];

    // فحص شروط فتح الميزات الإدارية بناء على اللفل الحالي لتظهر في لوحة المسؤول
    const isAdmin = localStorage.getItem('systemAdmin') === 'true';
    
    // 1. ميزة التعليقات تفتح عند أي ارتقاء (لفل 2 فما فوق)
    if (currentLvl >= 2) {
        document.getElementById('comment-summon-box').classList.remove('hidden');
        if(isAdmin) document.getElementById('admin-comment-inputs').classList.remove('hidden');
        skills.push("💬 مهارة نشطة: [استدعاء تعليق حليف أوفى]");
        
        // جلب التعليق المحفوظ وعرضه للجميع
        const savedName = localStorage.getItem('summoned_user') || "عبدالرحمن _ مانهوا";
        const savedText = localStorage.getItem('summoned_text') || "والله التلخيص أسطوري والمونتاج فخم! 🔥";
        document.getElementById('comment-username').textContent = savedName;
        document.getElementById('comment-text').textContent = `"${savedText}"`;
    }

    // 2. ميزة دعم القنوات تفتح كل 5 مستويات (5، 10، 15، 20...)
    if (currentLvl >= 5 || currentLvl % 5 === 0 || currentLvl === 4) { // وضعت لفل 4 كحالة فحص مؤقتة لك ريثما ترتقي
        document.getElementById('alliance-section').classList.remove('hidden');
        if(isAdmin) document.getElementById('admin-channel-inputs').classList.remove('hidden');
        skills.push("🤝 مهارة فريدة: [فتح بوابة دعم القنوات الحليفة]");

        // جلب القناة المدعومة وعرضها للجميع كـ رابط
        const chName = localStorage.getItem('alliance_name') || "قناة المتابع الأسطوري";
        const chUrl = localStorage.getItem('alliance_url') || "#";
        const container = document.getElementById('alliance-container');
        container.innerHTML = `<p>دعم هذا الأسبوع مخصص لـ: <strong>${chName}</strong></p>
                               <a href="${chUrl}" target="_blank" class="alliance-link">⚔️ دخول بوابة دعم القناة</a>`;
    }

    skills.forEach(s => {
        let li = document.createElement('li'); li.textContent = s; skillsList.appendChild(li);
    });

    // إظهار اللوحة كاملة إذا كنت أنت المسؤول
    if (isAdmin) document.getElementById('admin-panel').classList.remove('hidden');
}

// ==================== 👑 نظام حفظ بيانات السيطرة والمسؤول 👑 ====================
// حفظ التعليق الجديد
document.getElementById('save-comment-btn').addEventListener('click', () => {
    const name = document.getElementById('input-fan-name').value;
    const text = document.getElementById('input-fan-text').value;
    if(name && text) {
        localStorage.setItem('summoned_user', name);
        localStorage.setItem('summoned_text', text);
        alert("🔮 تم حفر التعليق في قاعدة بيانات السيستم بنجاح!");
        fetchYouTubeData();
    }
});

// حفظ قناة الدعم الجديدة
document.getElementById('save-channel-btn').addEventListener('click', () => {
    const name = document.getElementById('input-channel-name').value;
    const url = document.getElementById('input-channel-url').value;
    if(name && url) {
        localStorage.setItem('alliance_name', name);
        localStorage.setItem('alliance_url', url);
        alert("🔥 تم فتح بوابة الدعم وتثبيت القناة الحليفة للزوار!");
        fetchYouTubeData();
    }
});

// ⏳ طريقة سرية لكي تتعرف الواجهة عليك كمسؤول (اضغط مطولاً 5 ثوانٍ على زر التحديث)
let pressTimer;
const updateBtn = document.getElementById('update-btn');
updateBtn.addEventListener('mousedown', () => {
    pressTimer = window.setTimeout(() => {
        localStorage.setItem('systemAdmin', 'true');
        alert("👑 أهلاً بك يا عاهل السيستم! تم تفعيل لوحة السيطرة والإدارة بنجاح.");
        fetchYouTubeData();
    }, 5000);
});
updateBtn.addEventListener('mouseup', () => clearTimeout(pressTimer));
updateBtn.addEventListener('touchstart', () => {
    pressTimer = window.setTimeout(() => {
        localStorage.setItem('systemAdmin', 'true');
        alert("👑 أهلاً بك يا عاهل السيستم! تم تفعيل لوحة السيطرة.");
        fetchYouTubeData();
    }, 5000);
});
updateBtn.addEventListener('touchend', () => clearTimeout(pressTimer));

window.addEventListener('DOMContentLoaded', fetchYouTubeData);
