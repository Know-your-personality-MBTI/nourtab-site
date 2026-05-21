// ==================== لوحة تحكم البيانات الثابتة ====================

const MY_COMMENTS = [
    { username:"@HOUSSAMFRI" , comment_text:"يا للأسف على كل هاد الجهود تروح بدون لايكات استمر❤"  },
 { username:"@M.zg08" , comment_text:"كل شي ممتاز مع الاستمراريه بتوصل بس حاول تزبط جوده صوتك او غير المايك و اختار قصص ما في احد ملخصها عشان تعطي الناس سبب تتابعك انت بس + حاول تختار مانهوا طويله جدا و تخليها اساسيه ف القناه و تبني جمهورك عليها مثل قناه مقهى الانمي و زوفان + و لا تلتزم ب النص حاول تطلع و تعطي تعليقك في لقطه معينه ف المقطع وترجع تكمل النص مثل الدقيقه 11:6"  },
 { username:"@Manhwa_factory" , comment_text:"يا للأسف على كل هاد الجهود تروح بدون لايكات استمرعاش ي اسطوره ربنا يوفقق يارب حاول متسرعش الفديو و خليه بصوتك الطبيعي زي باقي الاجزاء كمل الفديو لحد ميبقا مثلا ساعه و اعمل تجميعه حط فيها جميع الاجزاء + جزء جديد علشان تنتشر اسرع و اکثر و بسرعه الحكايه دي في شخص سواها و جاب ف تجميعتها حوالي ۱۹ الف مشاهده ولاكنك لا تساس و کمل اهم حاجه الاستمراريه ."  },
 { username:"@MahmudMahmad-z6j" , comment_text:"استمر يا بطل وان شاء الله تكون من المشهورين في الدنيا"  },

];

const MY_CHANNELS = [
    { channel_name: "قناة لوفي للمحترفين 🏴‍☠️", channel_url: "https://youtube.com" },
    { channel_name: "بوابة المانهوا العالمية 📖", channel_url: "https://youtube.com" }
];

const FIXED_SUBS = 303; 

// ===================================================================

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

function initSystem() {
    document.getElementById('subs-display').textContent = FIXED_SUBS.toLocaleString();
    
    let currentLvl = 1;
    for (let i = 1; i <= 100; i++) { if (FIXED_SUBS >= levelRequirements[i]) currentLvl = i; else break; }
    document.getElementById('current-level').textContent = `LV. ${currentLvl}`;

    let currentMin = levelRequirements[currentLvl];
    let nextMax = levelRequirements[currentLvl + 1] || currentMin;
    let percentage = nextMax !== currentMin ? ((FIXED_SUBS - currentMin) / (nextMax - currentMin)) * 100 : 100;
    
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('next-level-subs').textContent = currentLvl === 100 ? "المستوى الأقصى" : (nextMax - FIXED_SUBS).toLocaleString();

    const systemWindow = document.getElementById('system-window');
    const rankBadge = document.getElementById('rank-badge');
    
    if (FIXED_SUBS >= 1000) {
        systemWindow.className = "system-window evolution-stage-2";
        rankBadge.textContent = "الطور: الأخضر المستيقظ ⚡";
    } else {
        systemWindow.className = "system-window evolution-stage-1";
        rankBadge.textContent = "الطور: الأزرق القياسي 🎬";
    }

    // حساب وعرض عدد الخانات الفارغة المتبقية فوق القوائم مباشرة
    const maxComments = currentLvl; 
    const emptyComments = maxComments - MY_COMMENTS.length;
    const commentPointsElem = document.getElementById('comment-points-display');
    if (commentPointsElem) {
        commentPointsElem.textContent = emptyComments >= 0 ? emptyComments : 0;
    }

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
                document.getElementById('comment-summon-box').classList.remove('hidden');
                const visible = showAllComments ? MY_COMMENTS : MY_COMMENTS.slice(0, 3);
                visible.forEach(item => {
                    let div = document.createElement('div'); div.className = "single-comment-item";
                    div.innerHTML = `<p class="comment-user">${item.username}</p><p class="comment-text">"${item.comment_text}"</p>`;
                    container.appendChild(div);
                });
                const btn = document.getElementById('show-more-comments-btn');
                if (MY_COMMENTS.length > 3) {
                    btn.classList.remove('hidden');
                    btn.textContent = showAllComments ? "🔼 إخفاء التعليقات الزائدة" : `🔽 إظهار المزيد (+${MY_COMMENTS.length - 3})`;
                } else btn.classList.add('hidden');
            } else {
                document.getElementById('comment-summon-box').classList.add('hidden');
            }
        }
    }

    // مهارة بوابات الدعم للقنوات الحليفة
    if (currentLvl >= 5) {
        const container = document.getElementById('alliance-container');
        if (container) {
            container.innerHTML = "";
            if (MY_CHANNELS.length > 0) {
                document.getElementById('alliance-section').classList.remove('hidden');
                const visible = showAllChannels ? MY_CHANNELS : MY_CHANNELS.slice(0, 3);
                visible.forEach(item => {
                    let div = document.createElement('div'); div.className = "single-alliance-item";
                    div.innerHTML = `<p style="margin:0; font-size:13px;">دعم لـ: <strong>${item.channel_name}</strong></p>
                                     <a href="${item.channel_url}" target="_blank" class="alliance-link">⚔️ دخول بوابة الدعم</a>`;
                    container.appendChild(div);
                });
                const btn = document.getElementById('show-more-channels-btn');
                if (MY_CHANNELS.length > 3) {
                    btn.classList.remove('hidden');
                    btn.textContent = showAllChannels ? "🔼 إخفاء البوابات" : `🔽 إظهار المزيد (+${MY_CHANNELS.length - 3})`;
                } else btn.classList.add('hidden');
            } else document.getElementById('alliance-section').classList.add('hidden');
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

document.getElementById('update-btn').addEventListener('click', initSystem);
document.getElementById('show-more-comments-btn').addEventListener('click', () => { showAllComments = !showAllComments; initSystem(); });
document.getElementById('show-more-channels-btn').addEventListener('click', () => { showAllChannels = !showAllChannels; initSystem(); });
window.addEventListener('DOMContentLoaded', initSystem);
