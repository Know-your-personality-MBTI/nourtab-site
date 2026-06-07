const YOUTUBE_API_KEY = "AIzaSyDyanLNYpRJagmwu03_h4m-mR3i4iWkjeI";
const YOUTUBE_CHANNEL_ID = "UCZwO3TMEASfTcKCzYMBxy3w";
const CLOUD_STORAGE_BASE_URL = "https://api.jsonbin.io/v3/b/665b9df021ff5e5d2449bddc";
const CLOUD_MASTER_KEY = "$2a$10$7Ew69gG7S3r.YQ9iW6p0feWwT0Yszv/vW9rWkWp9xSBlGkL2N.c2i";

const ADMIN_PASSWORD = "SYSTEM_OWNER_2026"; 

let targetSubscribers = 0; 
let currentSubscribers = 0; 
let currentLevel = 1;
let animationInterval = null;

function calculateAvailablePoints(level) {
    let totalCommentPoints = level; 
    let totalPromoPoints = 0;
    if (level >= 10) {
        totalPromoPoints = Math.floor(level / 10);
    }
    return { comments: totalCommentPoints, promos: totalPromoPoints };
}

function calculateLevelAndExp(subs) {
    let lvl = 1; let nextLevelExp = 100; let currentLevelBaseExp = 0;
    if (subs <= 1000) {
        lvl = Math.floor(subs / 100) + 1;
        if(lvl > 10) lvl = 10;
        currentLevelBaseExp = (lvl - 1) * 100; nextLevelExp = lvl * 100;
    } else {
        lvl = 10 + Math.floor(90 * Math.pow((subs - 1000) / (1000000 - 1000), 0.5));
        if (lvl > 100) lvl = 100;
        currentLevelBaseExp = 1000 + Math.floor((1000000 - 1000) * Math.pow((lvl - 10) / 90, 2));
        nextLevelExp = 1000 + Math.floor((1000000 - 1000) * Math.pow((lvl - 9) / 90, 2));
    }
    if (subs >= 1000000) { lvl = 100; nextLevelExp = 1000000; }
    return { level: lvl, baseExp: currentLevelBaseExp, nextLevelExp: nextLevelExp };
}

function updateSystemTheme(level) {
    const body = document.body; body.className = "";
    if (level >= 10 && level < 20) body.classList.add("evo-10");
    else if (level >= 20 && level < 30) body.classList.add("evo-20");
    else if (level >= 30 && level < 50) body.classList.add("evo-30");
    else if (level >= 50) body.classList.add("evo-max");
}

function startAnimateCounters(realSubs) {
    clearInterval(animationInterval);
    
    const finalSys = calculateLevelAndExp(realSubs);
    let startSubs = 0;

    if (finalSys.level >= 50) startSubs = 181000; 
    else if (finalSys.level >= 30) startSubs = 44100; 
    else if (finalSys.level >= 20) startSubs = 10890; 
    else if (finalSys.level >= 10) startSubs = 1000;  
    else startSubs = 0; 

    currentSubscribers = startSubs;
    let step = Math.ceil((realSubs - startSubs) / 80) || 1;

    animationInterval = setInterval(() => {
        currentSubscribers += step;
        
        if (currentSubscribers >= realSubs) {
            currentSubscribers = realSubs;
            clearInterval(animationInterval);
        }

        const sys = calculateLevelAndExp(currentSubscribers);
        currentLevel = sys.level;

        document.getElementById("level-txt").innerText = `LEVEL ${currentLevel}`;
        updateSystemTheme(currentLevel);

        let progressPercent = 0;
        if(currentLevel === 100) {
            progressPercent = 100;
            document.getElementById("exp-txt").innerText = `${currentSubscribers.toLocaleString()} / 1,000,000 مشترك (الحد الأقصى)`;
        } else {
            const earnedInThisLevel = currentSubscribers - sys.baseExp;
            const totalNeededInThisLevel = sys.nextLevelExp - sys.baseExp;
            progressPercent = (earnedInThisLevel / totalNeededInThisLevel) * 100;
            document.getElementById("exp-txt").innerText = `${currentSubscribers.toLocaleString()} / ${sys.nextLevelExp.toLocaleString()} مشترك (EXP)`;
        }
        document.getElementById("exp-bar").style.width = `${progressPercent}%`;

        const points = calculateAvailablePoints(currentLevel);
        document.getElementById("counter-comment-view").innerText = `النقاط الكلية: ${points.comments}`;
        document.getElementById("counter-promo-view").innerText = `النقاط الكلية: ${points.promos}`;
        document.getElementById("counter-comment-admin").innerText = points.comments;
        document.getElementById("counter-promo-admin").innerText = points.promos;

        const panelPromo = document.getElementById("panel-promo");
        if (currentLevel >= 10) {
            panelPromo.classList.remove("system-locked-fade");
            document.getElementById("promo-locked-msg").style.display = "none";
            document.getElementById("promo-active").style.display = "block";
            document.getElementById("admin-promo-section").style.display = "block";
        } else {
            panelPromo.classList.add("system-locked-fade");
            document.getElementById("promo-locked-msg").style.display = "block";
            document.getElementById("promo-active").style.display = "none";
            document.getElementById("admin-promo-section").style.display = "none";
        }

    }, 25); 
}

// 🛡️ دالة الاستدعاء الذكية لاكتشاف نوع الخطأ وحجبه من خوادم جوجل
async function fetchYouTubeSubs() {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`);
        const data = await response.json();
        
        // فحص قيود أو رفض الـ API Key من جوجل
        if (data.error) {
            document.getElementById("level-txt").innerText = "❌ خطأ في النظام";
            document.getElementById("exp-txt").innerText = `السبب: ${data.error.message}`;
            console.error("تفاصيل استجابة خادم جوجل المرفوضة:", data.error);
            return;
        }

        if (!data.items || data.items.length === 0) {
            document.getElementById("level-txt").innerText = "⚠️ لم يتم العثور على القناة";
            document.getElementById("exp-txt").innerText = "تأكد من معرف الـ ID الخاص بقناتك";
            return;
        }

        targetSubscribers = parseInt(data.items[0].statistics.subscriberCount);
        startAnimateCounters(targetSubscribers);

    } catch (error) {
        document.getElementById("level-txt").innerText = "🔌 خطأ في الاتصال";
        document.getElementById("exp-txt").innerText = "فشلت المحاولة بسبب قيود المتصفح المحلية CORS";
        console.error("خطأ في الشبكة المباشرة:", error);
    }
}

async function fetchCloudData() {
    try {
        const response = await fetch(`${CLOUD_STORAGE_BASE_URL}/latest`, {
            headers: { "X-Master-Key": CLOUD_MASTER_KEY }
        });
        const data = await response.json(); const record = data.record;
        if(record.comment) {
            document.getElementById("display-comment").innerText = `"${record.comment}"`;
            document.getElementById("display-author").innerText = `- ${record.author}`;
        }
        if(record.channelName) {
            document.getElementById("display-channel-name").innerText = record.channelName;
            document.getElementById("display-channel-link").href = record.channelLink;
        }
    } catch (error) { console.error("خطأ في جلب البيانات السحابية:", error); }
}

async function refreshSystemData() {
    const btn = document.querySelector('.refresh-system-btn');
    btn.innerText = "⏳ جاري الفحص..."; btn.style.pointerEvents = "none";
    await fetchYouTubeSubs(); await fetchCloudData();
    setTimeout(() => { btn.innerText = "🔄 تحديث حالة النظام"; btn.style.pointerEvents = "auto"; }, 1000);
}

function openAdminPanel() { document.getElementById("admin-panel").style.display = "block"; }
function closeAdminPanel() { document.getElementById("admin-panel").style.display = "none"; }

async function saveSystemData() {
    const pass = document.getElementById("admin-pass").value;
    if(pass !== ADMIN_PASSWORD) { alert("⚠️ رمز الوصول مرفوض!"); return; }

    const updatedData = {
        author: document.getElementById("input-author").value || "متابع نظامي",
        comment: document.getElementById("input-comment").value || "لا يوجد تعليق حالي",
        channelName: document.getElementById("input-channel-name").value || "قناة تحت التقييم",
        channelLink: document.getElementById("input-channel-link").value || "#"
    };

    try {
        const response = await fetch(CLOUD_STORAGE_BASE_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "X-Master-Key": CLOUD_MASTER_KEY },
            body: JSON.stringify(updatedData)
        });
        if(response.ok) { alert("⚡ تم استهلاك النقاط وتحديث النظام!"); closeAdminPanel(); fetchCloudData(); }
        else { alert("حدث خطأ أثناء الاتصال بالسيرفر."); }
    } catch (error) { alert("فشل التحديث: " + error.message); }
}

window.addEventListener('DOMContentLoaded', () => {
    fetchYouTubeSubs();
    fetchCloudData();
    setInterval(fetchYouTubeSubs, 3600000);
});
