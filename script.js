```
    // Bible Verses
    const verses = [
        { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
        { text: "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear.", ref: "1 Corinthians 10:13" },
        { text: "For God gave us a spirit not of fear but of power and love and self-control.", ref: "2 Timothy 1:7" },
        { text: "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.", ref: "2 Corinthians 5:17" },
        { text: "Submit yourselves therefore to God. Resist the devil, and he will flee from you.", ref: "James 4:7" },
        { text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.", ref: "Psalm 28:7" },
        { text: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.'", ref: "2 Corinthians 12:9" },
        { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9" },
        { text: "Create in me a pure heart, O God, and renew a steadfast spirit within me.", ref: "Psalm 51:10" },
        { text: "He who began a good work in you will carry it on to completion.", ref: "Philippians 1:6" }
    ];

    // Panic Messages - YOU, YOUR AMBITIONS, GOD
    const panicMessages = [
        "Porn is a drug. Don't feed it.",
        "Think about the man you want to become",
        "Your brain is lying to you right now",
        "This kills your ambition and drive",
        "God created you for greatness",
        "Your future depends on this choice",
        "Would your future self be proud?",
        "This steals your energy and focus",
        "You're stronger than this lie",
        "Your goals require self-control",
        "God is with you in this moment",
        "Champions are made right here",
        "Think about your dreams and purpose",
        "Your body is a temple. Protect it.",
        "The life you want starts NOW",
        "God believes in you",
        "Every NO builds your character",
        "Your destiny is bigger than this",
        "This is spiritual warfare. Fight.",
        "You were made for more"
    ];

    // App Data
    let appData = {
        userName: '',
        startDate: null,
        checklist: {},
        reasons: [],
        bestStreak: 0,
        urgesResisted: 0,
        urgesResitedToday: 0,
        resetHistory: [],
        triggers: [],
        preventionPlan: [],
        gratitudeEntries: [],
        scriptureMemory: {},
        darkMode: false,
        dailyAffirmation: ''
    };

    // Initialize
    function init() {
        loadData();
        checkFirstTime();
        updateUI();
        loadReasons();
        loadNewVerse();
        updateMilestones();
        loadDailyQuoteAndAffirmation();
        applyDarkMode();
        updateTriggerStats();
        loadPreventionPlan();
        loadGratitudeToday();
        
        // Update time every minute
        setInterval(updateUI, 60000);
    }

    // Check if first time user
    function checkFirstTime() {
        if (!appData.userName) {
            document.getElementById('welcomeModal').style.display = 'flex';
        }
    }

    // Save user name
    function saveName() {
        const name = document.getElementById('userNameInput').value.trim();
        if (name) {
            appData.userName = name;
            appData.startDate = new Date().toISOString();
            saveData();
            document.getElementById('welcomeModal').style.display = 'none';
            updateUI();
            
            // Welcome notification
            setTimeout(() => {
                const welcomeMessages = [
                    `Welcome, ${name}! Your journey to freedom starts now. 🔥`,
                    `${name}, God is with you on this journey. Let's do this! 💪`,
                    `Ready to be transformed, ${name}? Your new life begins today! ✨`
                ];
                alert(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
            }, 300);
        } else {
            alert('Please enter your name to continue.');
        }
    }

    // Prevent accidental refresh/close
    window.addEventListener('beforeunload', function(e) {
        if (appData.startDate) {
            saveData();
        }
    });

    // Save data periodically
    setInterval(saveData, 30000); // Save every 30 seconds

    // Load Data
    function loadData() {
        const saved = localStorage.getItem('overcomeAppData');
        if (saved) {
            appData = JSON.parse(saved);
        }
        if (!appData.startDate) {
            appData.startDate = new Date().toISOString();
            saveData();
        }
    }

    // Save Data
    function saveData() {
        localStorage.setItem('overcomeAppData', JSON.stringify(appData));
    }

    // Update UI
    function updateUI() {
        try {
            const now = new Date();
            const start = new Date(appData.startDate);
            const diffMs = now - start;
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            // Update streak (with safety checks)
            const streakEl = document.getElementById('streakNumber');
            const totalEl = document.getElementById('totalDays');
            const bestEl = document.getElementById('bestStreak');
            const timeEl = document.getElementById('timeSince');
            const greetingEl = document.getElementById('userGreeting');
            
            if (streakEl) streakEl.textContent = days;
            if (totalEl) totalEl.textContent = days;

            // Update best streak
            if (days > appData.bestStreak) {
                appData.bestStreak = days;
                saveData();
            }
            if (bestEl) bestEl.textContent = appData.bestStreak;

            // Update time since
            let timeText = '';
            if (days > 0) {
                timeText = `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''} clean`;
            } else if (hours > 0) {
                timeText = `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''} clean`;
            } else {
                timeText = `${minutes} minute${minutes !== 1 ? 's' : ''} clean`;
            }
            if (timeEl) timeEl.textContent = timeText;

            // Update checklist
            const today = new Date().toDateString();
            const savedDate = localStorage.getItem('checklistDate');
            
            if (savedDate !== today) {
                appData.checklist = {};
                localStorage.setItem('checklistDate', today);
            }

            let completed = 0;
            document.querySelectorAll('.checklist-item').forEach(item => {
                const match = item.getAttribute('onclick').match(/'([^']+)'/);
                if (match) {
                    const id = match[1];
                    if (appData.checklist[id]) {
                        item.classList.add('completed');
                        completed++;
                    } else {
                        item.classList.remove('completed');
                    }
                }
            });
            
            
            // Update urge count if on progress page
            updateUrgeCount();
            
            // Update greeting
            if (appData.userName && greetingEl) {
                const greetings = ['Keep fighting', 'Stay strong', 'You got this', 'Keep going', 'Stay focused'];
                const greeting = greetings[Math.floor(Math.random() * greetings.length)];
                greetingEl.textContent = `${greeting}, ${appData.userName}`;
            }
            
            // Check for donation reminder on milestones
            checkDonationReminder(days);
        } catch (error) {
            console.error('UpdateUI error:', error);
        }
    }

    // Toggle Checkbox
    function toggleCheckbox(element, id) {
        element.classList.toggle('completed');
        appData.checklist[id] = element.classList.contains('completed');
        saveData();
        updateUI();
    }

    // Load New Verse
    function loadNewVerse() {
        const verse = verses[Math.floor(Math.random() * verses.length)];
        document.getElementById('verseText').textContent = verse.text;
        document.getElementById('verseRef').textContent = verse.ref;
    }

    // Panic Modal
    function openPanicModal() {
        const name = appData.userName ? `, ${appData.userName}` : '';
        const messages = [
            `${appData.userName || 'Listen'}, porn is a drug. Don't feed it.`,
            `${appData.userName || 'Think'}, who do you want to become?`,
            `Your brain is lying to you right now${name}`,
            `This kills your ambition${name}`,
            `${appData.userName || 'Remember'}, God created you for greatness`,
            `Your future depends on this choice${name}`,
            `Would your future self be proud${name}?`,
            `This steals your energy and focus${name}`,
            `You're stronger than this lie${name}`,
            `Your goals require self-control${name}`,
            `God is with you right now${name}`,
            `Champions are made right here${name}`,
            `Think about your dreams${name}`,
            `Your body is a temple${name}. Protect it.`,
            `The life you want starts NOW${name}`,
            `${appData.userName || 'Know this'}, God believes in you`,
            `Every NO builds your character${name}`,
            `Your destiny is bigger than this${name}`,
            `This is spiritual warfare${name}. Fight.`,
            `You were made for more${name}`
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('panicMessage').textContent = message;
        document.getElementById('panicModal').classList.add('active');
    }

    function closePanicModal() {
        document.getElementById('panicModal').classList.remove('active');
    }

    // Breathing Exercise
    let breathInterval = null;
    let breathCount = 0;

    // Anti-lust reflection messages - YOU, YOUR AMBITIONS, GOD
    const reflectionMessages = [
        "Porn is a drug that rewires your brain",
        "Think about the man you want to become",
        "Your brain is lying to you right now",
        "God created you for greatness, not pixels",
        "This steals your ambition and drive",
        "Real success requires self-control",
        "Would your future self be proud?",
        "Your destiny is bigger than this",
        "God sees you. He still believes in you.",
        "This kills your motivation and dreams",
        "You're building the person you'll be",
        "God has a purpose for your life",
        "This won't help you reach your goals",
        "Your body is a temple of the Holy Spirit",
        "Champions are made in moments like this",
        "The life you want requires discipline",
        "You were made for more than this",
        "Every victory builds your character",
        "God is fighting for you right now",
        "Your ambitions die when lust wins"
    ];

    function startBreathing() {
        closePanicModal();
        document.getElementById('breathingModal').classList.add('active');
        breathCount = 0;
        runBreathCycle();
    }

    function runBreathCycle() {
        const circle = document.getElementById('breathCircle');
        const text = document.getElementById('breathText');
        const counter = document.getElementById('breathCounter');
        const reflection = document.getElementById('reflectionText');
        
        let phase = 0; // 0 = breathe in, 1 = hold, 2 = breathe out, 3 = hold
        let cycleNum = 0;
        
        breathInterval = setInterval(() => {
            breathCount++;
            
            if (phase === 0) {
                text.textContent = 'Breathe In';
                circle.className = 'breathing-circle breathe-in';
                reflection.textContent = reflectionMessages[cycleNum % reflectionMessages.length];
            } else if (phase === 1) {
                text.textContent = 'Hold';
                reflection.textContent = reflectionMessages[cycleNum % reflectionMessages.length];
            } else if (phase === 2) {
                text.textContent = 'Breathe Out';
                circle.className = 'breathing-circle breathe-out';
                reflection.textContent = reflectionMessages[(cycleNum + 10) % reflectionMessages.length];
            } else if (phase === 3) {
                text.textContent = 'Hold';
                reflection.textContent = reflectionMessages[(cycleNum + 10) % reflectionMessages.length];
                cycleNum++;
            }
            
            counter.textContent = `Breath ${Math.ceil(breathCount / 4)} of 10`;
            
            phase = (phase + 1) % 4;
            
            if (breathCount >= 40) { // 10 full breath cycles
                clearInterval(breathInterval);
                text.textContent = 'Complete';
                const name = appData.userName ? ` ${appData.userName}` : '';
                reflection.textContent = `You chose freedom${name}. The urge is passing.`;
                counter.textContent = 'Well done! You did the right thing.';
            }
        }, 4000);
    }

    function closeBreathing() {
        clearInterval(breathInterval);
        document.getElementById('breathingModal').classList.remove('active');
        breathCount = 0;
    }

    // Reasons
    function loadReasons() {
        const container = document.getElementById('reasonsList');
        container.innerHTML = '';
        
        if (appData.reasons.length === 0) {
            container.innerHTML = '<div class="reason-item">Add your personal reasons for freedom. They\'ll be here when you need them most.</div>';
        } else {
            appData.reasons.forEach(reason => {
                const div = document.createElement('div');
                div.className = 'reason-item';
                div.textContent = reason;
                container.appendChild(div);
            });
        }
    }

    function addReason() {
        const input = document.getElementById('reasonInput');
        const reason = input.value.trim();
        if (reason) {
            appData.reasons.push(reason);
            saveData();
            loadReasons();
            input.value = '';
        }
    }

    // Navigation
    function switchPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        
        document.getElementById(page + 'Page').classList.add('active');
        event.currentTarget.classList.add('active');
    }

    // Urge Logging
    function logUrge() {
        appData.urgesResisted++;
        
        // Check if today
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('urgeDate');
        if (savedDate !== today) {
            appData.urgesResitedToday = 0;
            localStorage.setItem('urgeDate', today);
        }
        
        appData.urgesResitedToday++;
        saveData();
        
        document.getElementById('urgeCount').textContent = appData.urgesResitedToday;
        
        // Celebration effects
        playSound('success');
        if (appData.urgesResitedToday % 5 === 0) {
            showConfetti();
            playSound('celebration');
        }
        
        // Show encouragement with name
        const name = appData.userName ? ` ${appData.userName}` : '';
        const encouragements = [
            `💪 Victory${name}! That's another step toward freedom!`,
            `🔥 Well done${name}! You resisted the urge!`,
            `✨ Yes${name}! You're building strength!`,
            `🎯 That's it${name}! Keep fighting!`,
            `💯 Proud of you${name}! Another win!`
        ];
        alert(encouragements[Math.floor(Math.random() * encouragements.length)]);
    }

    // Update urge count
    function updateUrgeCount() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('urgeDate');
        if (savedDate !== today) {
            appData.urgesResitedToday = 0;
            localStorage.setItem('urgeDate', today);
        }
        const urgeCountEl = document.getElementById('urgeCount');
        if (urgeCountEl) {
            urgeCountEl.textContent = appData.urgesResitedToday;
        }
    }

    // Update milestones with celebrations
    function updateMilestones() {
        const container = document.getElementById('milestonesList');
        if (!container) return;
        
        const now = new Date();
        const start = new Date(appData.startDate);
        const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        
        const milestones = [
            { days: 1, text: '1 Day - The First Step', icon: '🌱' },
            { days: 3, text: '3 Days - Breaking the Cycle', icon: '💪' },
            { days: 7, text: '1 Week - One Week Strong!', icon: '⭐' },
            { days: 14, text: '2 Weeks - Momentum Building', icon: '🚀' },
            { days: 30, text: '1 Month - Major Milestone!', icon: '🏆' },
            { days: 60, text: '2 Months - Brain Rewiring', icon: '🧠' },
            { days: 90, text: '90 Days - Transformed Mind', icon: '👑' },
            { days: 180, text: '6 Months - New Identity', icon: '✨' },
            { days: 365, text: '1 Year - Complete Victory!', icon: '🎯' }
        ];
        
        // Check for milestone just achieved
        const lastChecked = parseInt(localStorage.getItem('lastMilestoneCheck') || '0');
        milestones.forEach(milestone => {
            if (days >= milestone.days && lastChecked < milestone.days) {
                showConfetti();
                playSound('celebration');
                setTimeout(() => {
                    alert(`🎉 MILESTONE REACHED!\n\n${milestone.text}\n\nKeep going ${appData.userName}!`);
                }, 500);
            }
        });
        localStorage.setItem('lastMilestoneCheck', days.toString());
        
        container.innerHTML = '';
        milestones.forEach(milestone => {
            const achieved = days >= milestone.days;
            const div = document.createElement('div');
            div.style.cssText = `
                background: ${achieved ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
                border: 1px solid ${achieved ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
                border-radius: 14px;
                padding: 16px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 12px;
                opacity: ${achieved ? '1' : '0.5'};
            `;
            div.innerHTML = `
                <div style="font-size: 28px;">${milestone.icon}</div>
                <div style="flex: 1;">
                    <div style="font-size: 15px; font-weight: 600;">${milestone.text}</div>
                    <div style="font-size: 13px; color: rgba(255, 255, 255, 0.6);">${milestone.days} days</div>
                </div>
                ${achieved ? '<div style="font-size: 24px;">✓</div>' : ''}
            `;
            container.appendChild(div);
        });
    }

    // Scripture Blast
    const scriptureBlastVerses = [
        { text: "Flee from sexual immorality.", ref: "1 Corinthians 6:18" },
        { text: "But I say, walk by the Spirit, and you will not gratify the desires of the flesh.", ref: "Galatians 5:16" },
        { text: "Put to death therefore what is earthly in you: sexual immorality, impurity, passion, evil desire.", ref: "Colossians 3:5" },
        { text: "For this is the will of God, your sanctification: that you abstain from sexual immorality.", ref: "1 Thessalonians 4:3" },
        { text: "Blessed are the pure in heart, for they shall see God.", ref: "Matthew 5:8" },
        { text: "Do you not know that your body is a temple of the Holy Spirit within you?", ref: "1 Corinthians 6:19" },
        { text: "So flee youthful passions and pursue righteousness, faith, love, and peace.", ref: "2 Timothy 2:22" },
        { text: "For the grace of God has appeared, bringing salvation for all people, training us to renounce ungodliness.", ref: "Titus 2:11-12" },
        { text: "I have made a covenant with my eyes; how then could I gaze at a virgin?", ref: "Job 31:1" },
        { text: "Let us walk properly as in the daytime, not in orgies and drunkenness, not in sexual immorality and sensuality.", ref: "Romans 13:13" }
    ];

    let currentScriptureIndex = 0;

    function scriptureBlast() {
        currentScriptureIndex = 0;
        showScriptureBlast();
        document.getElementById('scriptureBlastModal').classList.add('active');
    }

    function showScriptureBlast() {
        const verse = scriptureBlastVerses[currentScriptureIndex];
        document.getElementById('scriptureBlastText').textContent = verse.text;
        document.getElementById('scriptureBlastRef').textContent = verse.ref;
    }

    function nextScripture() {
        currentScriptureIndex = (currentScriptureIndex + 1) % scriptureBlastVerses.length;
        showScriptureBlast();
    }

    function closeScriptureBlast() {
        document.getElementById('scriptureBlastModal').classList.remove('active');
    }

    // Reset Streak
    function confirmReset() {
        document.getElementById('resetModal').classList.add('active');
    }

    function closeResetModal() {
        document.getElementById('resetModal').classList.remove('active');
        document.getElementById('resetReflection').value = '';
    }

    function executeReset() {
        const reflection = document.getElementById('resetReflection').value.trim();
        
        // Save to history
        const now = new Date();
        const start = new Date(appData.startDate);
        const daysSurvived = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        
        appData.resetHistory.push({
            date: now.toISOString(),
            daysSurvived: daysSurvived,
            reflection: reflection
        });
        
        // Reset
        appData.startDate = new Date().toISOString();
        appData.checklist = {};
        
        saveData();
        closeResetModal();
        updateUI();
        updateMilestones();
        
        const name = appData.userName ? ` ${appData.userName}` : '';
        alert(`Your streak has been reset${name}. Remember: God's grace is sufficient. Get back up and keep fighting! 💪`);
    }

    // Initialize app
    init();

    // Daily Affirmations
    const affirmations = [
        "I am free. I am strong. I am redeemed.",
        "God's power is greater than my temptation.",
        "I choose freedom over temporary pleasure.",
        "I am becoming the man God created me to be.",
        "Today I walk in victory and self-control.",
        "My identity is in Christ, not my past.",
        "I am loved, forgiven, and empowered by God.",
        "Every moment of discipline builds my future.",
        "I have the strength to resist. I am not alone.",
        "God is transforming me day by day."
    ];

    function loadDailyAffirmation() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('affirmationDate');
        
        if (savedDate !== today) {
            const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
            appData.dailyAffirmation = newAffirmation;
            localStorage.setItem('affirmationDate', today);
            saveData();
        }
        
        if (appData.dailyAffirmation) {
            document.getElementById('dailyAffirmation').textContent = appData.dailyAffirmation;
        }
    }

    // Dark Mode
    function toggleDarkMode() {
        appData.darkMode = !appData.darkMode;
        saveData();
        applyDarkMode();
    }

    function applyDarkMode() {
        const body = document.body;
        const btn = document.getElementById('darkModeBtn');
        
        if (appData.darkMode) {
            body.style.background = '#FFFFFF';
            body.style.color = '#000000';
            btn.textContent = '☀️';
            // Would need to update all styles - simplified for now
        } else {
            body.style.background = '#000000';
            body.style.color = '#FFFFFF';
            btn.textContent = '🌙';
        }
    }

    // Trigger Tracker
    function logTrigger() {
        const select = document.getElementById('triggerSelect');
        const trigger = select.value;
        
        if (trigger) {
            appData.triggers.push({
                type: trigger,
                date: new Date().toISOString()
            });
            saveData();
            select.value = '';
            updateTriggerStats();
            playSound('success');
            alert(`✅ Trigger logged: ${trigger}. Understanding your triggers helps you prepare!`);
        }
    }

    function updateTriggerStats() {
        const stats = {};
        appData.triggers.forEach(t => {
            stats[t.type] = (stats[t.type] || 0) + 1;
        });
        
        const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
        const container = document.getElementById('triggerStats');
        
        if (sorted.length > 0) {
            const top = sorted[0];
            container.textContent = `Most common trigger: ${top[0]} (${top[1]} times)`;
        } else {
            container.textContent = 'No triggers logged yet';
        }
    }

    // Prevention Plan
    function addPreventionStep() {
        const input = document.getElementById('preventionInput');
        const step = input.value.trim();
        
        if (step) {
            appData.preventionPlan.push(step);
            saveData();
            loadPreventionPlan();
            input.value = '';
            playSound('success');
        }
    }

    function loadPreventionPlan() {
        const container = document.getElementById('preventionList');
        container.innerHTML = '';
        
        if (appData.preventionPlan.length === 0) {
            container.innerHTML = '<div class="reason-item">Add action steps for when you\'re tempted</div>';
        } else {
            appData.preventionPlan.forEach((step, index) => {
                const div = document.createElement('div');
                div.className = 'reason-item';
                div.innerHTML = `<strong>${index + 1}.</strong> ${step}`;
                container.appendChild(div);
            });
        }
    }

    // Gratitude Journal
    function addGratitude() {
        const input = document.getElementById('gratitudeInput');
        const gratitude = input.value.trim();
        
        if (gratitude) {
            const today = new Date().toDateString();
            appData.gratitudeEntries.push({
                text: gratitude,
                date: today
            });
            saveData();
            loadGratitudeToday();
            input.value = '';
            playSound('success');
        }
    }

    function loadGratitudeToday() {
        const container = document.getElementById('gratitudeToday');
        const today = new Date().toDateString();
        const todayEntries = appData.gratitudeEntries.filter(e => e.date === today);
        
        container.innerHTML = '';
        todayEntries.forEach((entry, index) => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 12px; background: rgba(139, 92, 246, 0.05); border-radius: 10px; margin-bottom: 8px; font-size: 14px;';
            div.textContent = `${index + 1}. ${entry.text}`;
            container.appendChild(div);
        });
        
        if (todayEntries.length === 0) {
            container.innerHTML = '<div style="font-size: 13px; color: rgba(255, 255, 255, 0.5); padding: 12px;">No gratitudes added today</div>';
        }
    }

    // Scripture Memory Quiz
    const memoryVerses = [
        { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13", fill: "Christ" },
        { text: "For God gave us a spirit not of fear but of power and love and self-control.", ref: "2 Timothy 1:7", fill: "self-control" },
        { text: "Therefore, if anyone is in Christ, he is a new creation.", ref: "2 Corinthians 5:17", fill: "new creation" }
    ];

    function startScriptureQuiz() {
        const verse = memoryVerses[Math.floor(Math.random() * memoryVerses.length)];
        const answer = prompt(`Fill in the blank:\n\n"${verse.text.replace(verse.fill, '______')}"\n\n${verse.ref}`);
        
        if (answer && answer.toLowerCase() === verse.fill.toLowerCase()) {
            showConfetti();
            playSound('celebration');
            alert('🎉 Correct! You\'re memorizing Scripture!');
        } else if (answer) {
            alert(`The answer was: "${verse.fill}". Keep practicing!`);
        }
    }

    // Weekly Report
    function generateWeeklyReport() {
        const now = new Date();
        const start = new Date(appData.startDate);
        const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        
        const report = `
```

📊 WEEKLY REPORT
━━━━━━━━━━━━━━━━━━━━━

👤 Warrior: ${appData.userName || ‘Anonymous’}
🗓️ Report Date: ${now.toLocaleDateString()}

🔥 STREAK STATS
━━━━━━━━━━━━━━━━━━━━━
• Current Streak: ${days} days
• Best Streak: ${appData.bestStreak} days
• Urges Resisted: ${appData.urgesResisted} total

💪 VICTORIES
━━━━━━━━━━━━━━━━━━━━━
• Days Clean: ${days}
• Triggers Logged: ${appData.triggers.length}
• Gratitudes: ${appData.gratitudeEntries.length}

📈 PROGRESS
━━━━━━━━━━━━━━━━━━━━━
${days >= 30 ? ‘✅ 30+ days milestone reached!’ : `⏳ ${30 - days} days until 30-day milestone`}

🙏 Keep fighting! God is with you.

━━━━━━━━━━━━━━━━━━━━━
Generated by Redeemed App
SansVarg Corporation
`.trim();

```
        alert(report);
        
        if (confirm('Would you like to copy this report?')) {
            navigator.clipboard.writeText(report).then(() => {
                alert('✅ Report copied to clipboard!');
            });
        }
    }

    // Confetti Effect
    function showConfetti() {
        const duration = 3000;
        const colors = ['#8B5CF6', '#A78BFA', '#FCD34D', '#FBBF24'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    opacity: 1;
                    z-index: 10000;
                    border-radius: 50%;
                    pointer-events: none;
                `;
                document.body.appendChild(confetti);
                
                const fall = confetti.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
                
                fall.onfinish = () => confetti.remove();
            }, i * 30);
        }
    }

    // Motivational Quotes
    const motivationalQuotes = [
        { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
        { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { quote: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
        { quote: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
        { quote: "Character is forged in the smallest of battles.", author: "Anonymous" },
        { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
        { quote: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
        { quote: "The struggle you're in today is developing the strength you need tomorrow.", author: "Robert Tew" },
        { quote: "Champions keep playing until they get it right.", author: "Billie Jean King" }
    ];

    // Daily Affirmations
    const dailyAffirmations = [
        "I am free. I am strong. I am victorious.",
        "I choose freedom over fleeting pleasure.",
        "God's strength flows through me today.",
        "I am becoming the man I was created to be.",
        "Every day, I am growing stronger.",
        "I control my thoughts. They don't control me.",
        "Today, I walk in victory.",
        "I am worthy of a pure and free life.",
        "My past does not define my future.",
        "I have the power to overcome any temptation.",
        "God is fighting for me, and I am winning.",
        "I am redeemed and made new.",
        "Discipline is my superpower.",
        "I choose character over comfort.",
        "My future is brighter than my past."
    ];

    // Load daily quote and affirmation
    function loadDailyQuoteAndAffirmation() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('quoteDate');
        
        if (savedDate !== today) {
            const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
            const affirmation = dailyAffirmations[Math.floor(Math.random() * dailyAffirmations.length)];
            
            localStorage.setItem('dailyQuote', JSON.stringify(quote));
            localStorage.setItem('dailyAffirmation', affirmation);
            localStorage.setItem('quoteDate', today);
        }
        
        const savedQuote = JSON.parse(localStorage.getItem('dailyQuote') || '{}');
        const savedAffirmation = localStorage.getItem('dailyAffirmation');
        
        const quoteEl = document.getElementById('dailyQuote');
        const authorEl = document.getElementById('quoteAuthor');
        const affirmationEl = document.getElementById('dailyAffirmation');
        
        if (savedQuote.quote && quoteEl && authorEl) {
            quoteEl.textContent = `"${savedQuote.quote}"`;
            authorEl.textContent = `- ${savedQuote.author}`;
        }
        
        if (savedAffirmation && affirmationEl) {
            affirmationEl.textContent = savedAffirmation;
        }
    }

    // Share Progress
    function shareProgress() {
        const now = new Date();
        const start = new Date(appData.startDate);
        const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        
        const shareText = `🔥 ${days} DAYS STRONG 🔥
```

I’m on a journey to freedom with Redeemed.

${days >= 7 ? ‘✅ One week milestone!’ : ‘’}
${days >= 30 ? ‘✅ One month milestone!’ : ‘’}
${days >= 90 ? ‘✅ 90 days transformed!’ : ‘’}

💪 Total urges resisted: ${appData.urgesResisted}
🙏 God is with me every step.

#Redeemed #Freedom #Victory`;

```
        if (navigator.share) {
            navigator.share({
                title: 'My Progress - Redeemed',
                text: shareText
            }).catch(() => {
                copyToClipboard(shareText);
            });
        } else {
            copyToClipboard(shareText);
        }
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        playSound('success');
        alert('✅ Progress copied to clipboard! Share it wherever you want!');
    }

    // Sound Effects
    function playSound(type) {
        // Check if sound is enabled
        if (appData.soundEnabled === false) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'success') {
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            } else if (type === 'celebration') {
                [523, 659, 784].forEach((freq, i) => {
                    setTimeout(() => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.value = freq;
                        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                        osc.start(audioContext.currentTime);
                        osc.stop(audioContext.currentTime + 0.3);
                    }, i * 100);
                });
            }
        } catch (error) {
            // Audio API not supported or blocked
            console.log('Sound playback not available');
        }
    }

    // Show floating donation badge after 30 seconds
    setTimeout(() => {
        const badge = document.getElementById('floatingDonation');
        if (badge) {
            badge.style.display = 'flex';
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                badge.style.display = 'none';
            }, 10000);
        }
    }, 30000);

    // Show donation reminder on milestones
    function checkDonationReminder(days) {
        if ([3, 7, 14, 30, 60, 90].includes(days)) {
            setTimeout(() => {
                if (confirm(`🎉 Congratulations on ${days} days! Would you like to support our mission to keep Redeemed free for everyone?`)) {
                    showConfetti();
                    playSound('celebration');
                    window.open('https://paypal.me/sansvargscorp', '_blank');
                }
            }, 1000);
        }
    }

    // Settings Functions
    function openSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('active');
            
            // Set current values
            const darkModeToggle = document.getElementById('darkModeToggle');
            const soundToggle = document.getElementById('soundToggle');
            const nameInput = document.getElementById('changeNameInput');
            
            if (darkModeToggle) darkModeToggle.checked = appData.darkMode || false;
            if (soundToggle) soundToggle.checked = appData.soundEnabled !== false;
            if (nameInput && appData.userName) nameInput.value = appData.userName;
        }
    }

    function closeSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    function toggleDarkModeFromSettings() {
        toggleDarkMode();
    }

    function toggleSound() {
        const soundToggle = document.getElementById('soundToggle');
        appData.soundEnabled = soundToggle ? soundToggle.checked : true;
        saveData();
        
        if (appData.soundEnabled) {
            playSound('success');
        }
    }

    function changeName() {
        const input = document.getElementById('changeNameInput');
        const newName = input ? input.value.trim() : '';
        
        if (newName && newName !== appData.userName) {
            appData.userName = newName;
            saveData();
            updateUI();
            if (appData.soundEnabled) playSound('success');
            alert(`✅ Name updated to ${newName}!`);
        } else if (!newName) {
            alert('Please enter a name.');
        }
    }

    function confirmResetAllData() {
        if (confirm('⚠️ WARNING: This will permanently delete ALL your data including your streak, progress, and settings. This cannot be undone!\n\nAre you absolutely sure?')) {
            if (confirm('Last chance! This will delete EVERYTHING. Continue?')) {
                localStorage.clear();
                alert('All data has been reset. The app will now reload.');
                window.location.reload();
            }
        }
    }


    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('App Error:', e.message, e.filename, e.lineno);
    });

    // Initialize app safely
    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                try {
                    init();
                } catch (error) {
                    console.error('Init error:', error);
                }
            });
        } else {
            init();
        }
    } catch (error) {
        console.error('Critical error:', error);
    }
```
