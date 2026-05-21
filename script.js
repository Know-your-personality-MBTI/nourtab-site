// ==================== لوحة تحكم البيانات الثابتة ====================

// اكتب تعليقاتك هنا يدوياً (الخانات الفارغة ستحسب تلقائياً بناءً على مستواك الحالي)
const MY_COMMENTS = [
    { 
        username: "@HOUSSAMFRI", 
        comment_text: "يا للأسف على كل هاد الجهود تروح بدون لايكات استمر❤" 
    },
    { 
        username: "@M.zg08", 
        comment_text: "كل شي ممتاز مع الاستمراريه بتوصل بس حاول تزبط جوده صوتك او غير المايك و اختار قصص ما في احد ملخصها عشان تعطي الناس سبب تتابعك انت بس + حاول تختار مانهوا طويله جدا و تخليها اساسيه ف القناه و تبني جمهورك عليها مثل قناه مقهى الانمي و زوفان + و لا تلتزم ب النص حاول تطلع و تعطي تعليقك في لقطه معينه ف المقطع وترجع تكمل النص مثل الدقيقه 11:6" 
    },
    { 
        username: "@Manhwa_factory", 
        comment_text: "يا للأسف على كل هاد الجهود تروح بدون لايكات استمرعاش ي اسطوره ربنا يوفقق يارب حاول متسرعش الفديو و خليه بصوتك الطبيعي زي باقي الاجزاء كمل الفديو لحد ميبقا مثلا ساعه و اعمل تجميعه حط فيها جميع الاجزاء + جزء جديد علشان تنتشر اسرع و اکثر و بسرعه الحكايه دي في شخص سواها و جاب ف تجميعتها حوالي ۱۹ الف مشاهده ولاكنك لا تساس و کمل اهم حاجه الاستمراريه ." 
    },
    { 
        username: "@MahmudMahmad-z6j", 
        comment_text: "استمر يا بطل وان شاء الله تكون من المشهورين في الدنيا" 
    }
];

const MY_CHANNELS = [
    { channel_name: "قناة لوفي للمحترفين 🏴‍☠️", channel_url: "https://youtube.com" },
    { channel_name: "بوابة المانهوا العالمية 📖", channel_url: "https://youtube.com" }
];

// 🆔 معرف قناتك الفريد الخاص بيوتيوب
const YOUTUBE_CHANNEL_ID = "UCG87U2_XvGf4c9_OOn707bA"; 

// ===================================================================

let liveSubsCount = null; // يبدأ فارغاً تماماً ولا يحمل أي قيمة احتياطية
let systemErrorMessage = "جاري الاتصال بالنظام... 📡"; 

let showAllComments = false;
let showAllChannels = false;

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

// دالة جلب حية ومباشرة تستخدم خادم عدادات متوافق مع الحماية وبدون CORS
async function fetchYouTubeSubs() {
    try {
        systemErrorMessage = "جاري التحديث... 🔄";
        updateSystemUI();

        // استخدام واجهة برمجة خفيفة ومباشرة للعدادات الحية لا تسبب حظراً للمتصفح
        const response = await fetch(`https://api.shadiao.pro/subcount/youtube/${YOUTUBE_CHANNEL_ID}`);
        
        if (!response.ok) throw new Error("فشل استجابة خادم الجلب المباشر");

        const data = await response.json();
        
        // التحقق من بنية البيانات الراجعة للتأكد من وجود الرقم الحي
        if (data && data.subscribers) {
            let actualSubs = parseInt(data.subscribers);
            
            if (!isNaN(actualSubs) && actualSubs >= 0) {
                liveSubsCount = actualSubs;
                systemErrorMessage = ""; // مسح الخطأ بنجاح العملية
            } else {
                throw new Error("البيانات الراجعة ليست رقماً صالحاً");
            }
        } else {
            // محاولة جلب بديلة من ميكانيزم المظهر العام في حال تبديل السيرفر تلقائياً
            const fallbackRes = await fetch(`https://api.jienan.xyz/subcount/youtube/${YOUTUBE_CHANNEL_ID}`);
            if (fallbackRes.ok) {
                const fallbackData = await fallbackRes.json();
                if (fallbackData && fallbackData.count) {
                    liveSubsCount = parseInt(fallbackData.count);
                    systemErrorMessage = "";
                    updateSystemUI();
                    return;
                }
            }
            throw new Error("فشل قراءة حقل المشتركين من الخادم");
        }
    } catch (error) {
        liveSubsCount = null; // ضمان عدم عرض أي رقم خاطئ بناءً على رغبتك
        systemErrorMessage = "خطأ في استدعاء البيانات ⚠️";
        console.error("System Fetch Error: ", error);
    }
    updateSystemUI();
}

function updateSystemUI() {
    const subsDisplay = document.getElementById('subs-display');
    const currentLevelBox = document.getElementById('current-level');
    const progressFill = document.getElementById('progress-fill');
    const nextLevelSubs = document.getElementById('next-level-subs');
    const systemWindow = document.getElementById('system-window');
    const rankBadge = document.getElementById('rank-badge');

    // حالة وجود خطأ في جلب البيانات
    if (liveSubsCount === null) {
        if (subsDisplay) subsDisplay.textContent = systemErrorMessage;
        if (currentLevelBox) currentLevelBox.textContent = "LV. ??";
        if (progressFill) progressFill.style.width = "0%";
        if (nextLevelSubs) nextLevelSubs.textContent = "غير متاح بسبب الخطأ";
        if (rankBadge) rankBadge.textContent = "الطور: مجهول 🌀";
        if (systemWindow) systemWindow.className = "system-window evolution-stage-error";
        return; 
    }

    // حالة النجاح الفعلي: عرض الرقم الحي وحساب المستويات
    if (subsDisplay) subsDisplay.textContent = liveSubsCount.toLocaleString();
    
    let currentLvl = 1;
    for (let i = 1; i <= 100; i++) { if (liveSubsCount >= levelRequirements[i]) currentLvl = i; else break; }
    if (currentLevelBox) currentLevelBox.textContent = `LV. ${currentLvl}`;

    let currentMin = levelRequirements[currentLvl];
    let nextMax = levelRequirements[currentLvl + 1] || currentMin;
    let percentage = nextMax !== currentMin ? ((liveSubsCount - currentMin) / (nextMax - currentMin)) * 100 : 100;
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (nextLevelSubs) nextLevelSubs.textContent = currentLvl === 100 ? "المستوى الأقصى" : (nextMax - liveSubsCount).toLocaleString();
    
    if (systemWindow && rankBadge) {
        if (liveSubsCount >= 1000) {
            systemWindow.className = "system-window evolution-stage-2";
            rankBadge.textContent = "الطور: الأخضر المستيقظ ⚡";
        } else {
            systemWindow.className = "system-window evolution-stage-1";
            rankBadge.textContent = "الطور: الأزرق القياسي 🎬";
        }
    }

    // حساب الخانات الفارغة المتبقية للتعليقات
    const maxComments = currentLvl; 
    const emptyComments = maxComments - MY_COMMENTS.length;
    const commentPointsElem = document.getElementById('comment-points-display');
    if (commentPointsElem) {
        commentPointsElem.textContent = emptyComments >= 0 ? emptyComments : 0;
    }

    // حساب الخانات الفارغة المتبقية للقنوات الحليفة
    const maxChannels = Math.floor(currentLvl / 5);
    const emptyChannels = maxChannels - MY_CHANNELS.length;
    const channelPointsElem = document.getElementById('channel-points-display');
    if (channelPointsElem) {
        channelPointsElem.textContent = emptyChannels >= 0 ? emptyChannels : 0;
    }

    // مهارة استدعاء تعليقات الأوفياء
    if (currentLvl >= 2) {
        const container = document.getElementById('comments-container');
        if (container) {
            container.innerHTML = "";
            if (MY_COMMENTS.length > 0) {
                const summonBox = document.getElementById('comment-summon-box');
                if (summonBox) summonBox.classList.remove('hidden');
                const visible = showAllComments ? MY_COMMENTS : MY_COMMENTS.slice(0, 3);
                visible.forEach(item => {
                    let div = document.createElement('div'); div.className = "single-comment-item";
                    div.innerHTML = `<p class="comment-user">${item.username}</p><p class="comment-text">"${item.comment_text}"</p>`;
                    container.appendChild(div);
                });
                const btn = document.getElementById('show-more-comments-btn');
                if (btn) {
                    if (MY_COMMENTS.length > 3) {
                        btn.classList.remove('hidden');
                        btn.textContent = showAllComments ? "🔼 إخفاء التعليقات الزائدة" : `🔽 إظهار المزيد (+${MY_COMMENTS.length - 3})`;
                    } else btn.classList.add('hidden');
                }
            } else {
                const summonBox = document.getElementById('comment-summon-box');
                if (summonBox) summonBox.classList.add('hidden');
            }
        }
    }

    // مهارة بوابات الدعم للقنوات الحليفة
    if (currentLvl >= 5) {
        const container = document.getElementById('alliance-container');
        if (container) {
            container.innerHTML = "";
            if (MY_CHANNELS.length > 0) {
                const allianceSection = document.getElementById('alliance-section');
                if (allianceSection) allianceSection.classList.remove('hidden');
                const visible = showAllChannels ? MY_CHANNELS : MY_CHANNELS.slice(0, 3);
                visible.forEach(item => {
                    let div = document.createElement('div'); div.className = "single-alliance-item";
                    div.innerHTML = `<p style="margin:0; font-size:13px;">دعم لـ: <strong>${item.channel_name}</strong></p>
                                     <a href="${item.channel_url}" target="_blank" class="alliance-link">⚔️ دخول بوابة الدعم</a>`;
                    container.appendChild(div);
                });
                const btn = document.getElementById('show-more-channels-btn');
                if (btn) {
                    if (MY_CHANNELS.length > 3) {
                        btn.classList.remove('hidden');
                        btn.textContent = showAllChannels ? "🔼 إخفاء البوابات" : `🔽 إظهار المزيد (+${MY_CHANNELS.length - 3})`;
                    } else btn.classList.add('hidden');
                }
            } else {
                const allianceSection = document.getElementById('alliance-section');
                if (allianceSection) allianceSection.classList.add('hidden');
            }
        }
    }

    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
        skillsList.innerHTML = "";
        let skills = ["🔓 ميزة رصد المشتركين تلقائياً"];
        if (currentLvl >= 2) skills.push("💬 مهارة نشطة: [استدعاء تعليق حليف أوفى]");
        if (currentLvl >= 5) skills.push("🤝 مهارة فريدة: [فتح بوابة دعم القنوات الحليفة]");
        skills.forEach(s => { let li = document.createElement('li'); li.textContent = s; skillsList.appendChild(li); });
    }
}

// ربط الأحداث بأزرار الواجهة للتأكد من استدعاء الدوال بشكل صحيح
const updateBtn = document.getElementById('update-btn');
if (updateBtn) updateBtn.addEventListener('click', fetchYouTubeSubs);

const showCommentsBtn = document.getElementById('show-more-comments-btn');
if (showCommentsBtn) showCommentsBtn.addEventListener('click', () => { showAllComments = !showAllComments; updateSystemUI(); });

const showChannelsBtn = document.getElementById('show-more-channels-btn');
if (showChannelsBtn) showChannelsBtn.addEventListener('click', () => { showAllChannels = !showAllChannels; updateSystemUI(); });

// التشغيل المباشر عند بدء تحميل الواجهة
window.addEventListener('DOMContentLoaded', fetchYouTubeSubs);
