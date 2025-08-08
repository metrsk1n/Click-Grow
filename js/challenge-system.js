// Click&Grow Premium v0.0.5-alpha - Challenge System

class ChallengeSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.challenges = new Map();
        this.activeChallenges = new Map();
        this.completedChallenges = new Set();
        this.challengeHistory = [];
        this.lastResetTime = {
            daily: 0,
            weekly: 0,
            monthly: 0
        };
        
        this.initializeChallenges();
        this.loadChallengeData();
    }
    
    // Initialize the challenge system (called by GameEngine)
    async init() {
        try {
            console.log('🏆 ChallengeSystem initializing...');
            
            // Check for daily/weekly/monthly resets
            this.checkResets();
            
            // Update UI if available
            this.updateUI();
            
            console.log('✅ ChallengeSystem initialized successfully');
        } catch (error) {
            console.error('❌ ChallengeSystem initialization failed:', error);
            throw error;
        }
    }
    
    initializeChallenges() {
        // Daily Challenges
        this.addChallenge({
            id: 'daily_water_10',
            name: 'Water Master',
            description: 'Water your plant 10 times today',
            type: 'daily',
            category: 'actions',
            icon: '💧',
            target: 10,
            current: 0,
            rewards: [
                { type: 'coins', amount: 50, icon: '🪙' },
                { type: 'exp', amount: 100, icon: '⭐' }
            ],
            duration: 24 * 60 * 60 * 1000, // 24 hours
            difficulty: 1
        });
        
        this.addChallenge({
            id: 'daily_fertilize_5',
            name: 'Fertilizer Fanatic',
            description: 'Use fertilizer 5 times today',
            type: 'daily',
            category: 'actions',
            icon: '🌰',
            target: 5,
            current: 0,
            rewards: [
                { type: 'coins', amount: 75, icon: '🪙' },
                { type: 'gems', amount: 2, icon: '💎' }
            ],
            duration: 24 * 60 * 60 * 1000,
            difficulty: 2
        });
        
        this.addChallenge({
            id: 'daily_sunlight_8',
            name: 'Sun Seeker',
            description: 'Give sunlight 8 times today',
            type: 'daily',
            category: 'actions',
            icon: '☀️',
            target: 8,
            current: 0,
            rewards: [
                { type: 'coins', amount: 60, icon: '🪙' },
                { type: 'exp', amount: 120, icon: '⭐' }
            ],
            duration: 24 * 60 * 60 * 1000,
            difficulty: 2
        });
        
        this.addChallenge({
            id: 'daily_music_3',
            name: 'Music Lover',
            description: 'Play music for your plant 3 times today',
            type: 'daily',
            category: 'actions',
            icon: '🎵',
            target: 3,
            current: 0,
            rewards: [
                { type: 'coins', amount: 40, icon: '🪙' },
                { type: 'exp', amount: 80, icon: '⭐' }
            ],
            duration: 24 * 60 * 60 * 1000,
            difficulty: 1
        });
        
        // Weekly Challenges
        this.addChallenge({
            id: 'weekly_level_up',
            name: 'Level Up!',
            description: 'Gain 5 levels this week',
            type: 'weekly',
            category: 'progress',
            icon: '📈',
            target: 5,
            current: 0,
            rewards: [
                { type: 'coins', amount: 200, icon: '🪙' },
                { type: 'gems', amount: 5, icon: '💎' },
                { type: 'exp', amount: 500, icon: '⭐' }
            ],
            duration: 7 * 24 * 60 * 60 * 1000, // 7 days
            difficulty: 3
        });
        
        this.addChallenge({
            id: 'weekly_games_10',
            name: 'Game Master',
            description: 'Play 10 mini-games this week',
            type: 'weekly',
            category: 'games',
            icon: '🎮',
            target: 10,
            current: 0,
            rewards: [
                { type: 'coins', amount: 150, icon: '🪙' },
                { type: 'gems', amount: 3, icon: '💎' }
            ],
            duration: 7 * 24 * 60 * 60 * 1000,
            difficulty: 2
        });
        
        this.addChallenge({
            id: 'weekly_achievements_5',
            name: 'Achievement Hunter',
            description: 'Unlock 5 achievements this week',
            type: 'weekly',
            category: 'achievements',
            icon: '🏆',
            target: 5,
            current: 0,
            rewards: [
                { type: 'coins', amount: 300, icon: '🪙' },
                { type: 'gems', amount: 8, icon: '💎' },
                { type: 'exp', amount: 800, icon: '⭐' }
            ],
            duration: 7 * 24 * 60 * 60 * 1000,
            difficulty: 4
        });
        
        // Monthly Challenges
        this.addChallenge({
            id: 'monthly_streak_30',
            name: 'Streak Master',
            description: 'Maintain a 30-day streak',
            type: 'monthly',
            category: 'streak',
            icon: '🔥',
            target: 30,
            current: 0,
            rewards: [
                { type: 'coins', amount: 1000, icon: '🪙' },
                { type: 'gems', amount: 20, icon: '💎' },
                { type: 'exp', amount: 2000, icon: '⭐' }
            ],
            duration: 30 * 24 * 60 * 60 * 1000, // 30 days
            difficulty: 5
        });
        
        this.addChallenge({
            id: 'monthly_total_actions',
            name: 'Action Hero',
            description: 'Perform 1000 total actions this month',
            type: 'monthly',
            category: 'actions',
            icon: '⚡',
            target: 1000,
            current: 0,
            rewards: [
                { type: 'coins', amount: 800, icon: '🪙' },
                { type: 'gems', amount: 15, icon: '💎' },
                { type: 'exp', amount: 1500, icon: '⭐' }
            ],
            duration: 30 * 24 * 60 * 60 * 1000,
            difficulty: 4
        });
        
        // Special Challenges
        this.addChallenge({
            id: 'special_first_plant',
            name: 'First Plant',
            description: 'Grow your first plant to level 10',
            type: 'special',
            category: 'progress',
            icon: '🌱',
            target: 10,
            current: 0,
            rewards: [
                { type: 'coins', amount: 500, icon: '🪙' },
                { type: 'gems', amount: 10, icon: '💎' },
                { type: 'exp', amount: 1000, icon: '⭐' }
            ],
            duration: null, // No time limit
            difficulty: 2,
            oneTime: true
        });
        
        this.addChallenge({
            id: 'special_rich_gardener',
            name: 'Rich Gardener',
            description: 'Accumulate 10,000 coins',
            type: 'special',
            category: 'economy',
            icon: '💰',
            target: 10000,
            current: 0,
            rewards: [
                { type: 'coins', amount: 1000, icon: '🪙' },
                { type: 'gems', amount: 25, icon: '💎' },
                { type: 'exp', amount: 2000, icon: '⭐' }
            ],
            duration: null,
            difficulty: 4,
            oneTime: true
        });
        
        this.addChallenge({
            id: 'special_gem_collector',
            name: 'Gem Collector',
            description: 'Collect 100 gems',
            type: 'special',
            category: 'economy',
            icon: '💎',
            target: 100,
            current: 0,
            rewards: [
                { type: 'coins', amount: 2000, icon: '🪙' },
                { type: 'gems', amount: 50, icon: '💎' },
                { type: 'exp', amount: 3000, icon: '⭐' }
            ],
            duration: null,
            difficulty: 5,
            oneTime: true
        });
        
        // Achievement-based Challenges
        this.addChallenge({
            id: 'achievement_water_master',
            name: 'Water Master',
            description: 'Water your plant 1000 times total',
            type: 'achievement',
            category: 'milestones',
            icon: '💧',
            target: 1000,
            current: 0,
            rewards: [
                { type: 'coins', amount: 500, icon: '🪙' },
                { type: 'gems', amount: 10, icon: '💎' },
                { type: 'exp', amount: 1000, icon: '⭐' }
            ],
            duration: null,
            difficulty: 3,
            oneTime: true
        });
        
        this.addChallenge({
            id: 'achievement_level_50',
            name: 'Halfway There',
            description: 'Reach level 50',
            type: 'achievement',
            category: 'milestones',
            icon: '🎯',
            target: 50,
            current: 0,
            rewards: [
                { type: 'coins', amount: 1000, icon: '🪙' },
                { type: 'gems', amount: 20, icon: '💎' },
                { type: 'exp', amount: 2000, icon: '⭐' }
            ],
            duration: null,
            difficulty: 4,
            oneTime: true
        });
        
        this.addChallenge({
            id: 'achievement_level_100',
            name: 'Century Club',
            description: 'Reach level 100',
            type: 'achievement',
            category: 'milestones',
            icon: '🏆',
            target: 100,
            current: 0,
            rewards: [
                { type: 'coins', amount: 2000, icon: '🪙' },
                { type: 'gems', amount: 50, icon: '💎' },
                { type: 'exp', amount: 5000, icon: '⭐' }
            ],
            duration: null,
            difficulty: 5,
            oneTime: true
        });
        
        this.addChallenge({
            id: 'achievement_level_240',
            name: 'Ultimate Gardener',
            description: 'Reach the maximum level 240',
            type: 'achievement',
            category: 'milestones',
            icon: '👑',
            target: 240,
            current: 0,
            rewards: [
                { type: 'coins', amount: 10000, icon: '🪙' },
                { type: 'gems', amount: 100, icon: '💎' },
                { type: 'exp', amount: 10000, icon: '⭐' }
            ],
            duration: null,
            difficulty: 5,
            oneTime: true
        });
    }
    
    addChallenge(challenge) {
        challenge.createdAt = Date.now();
        challenge.status = 'active';
        challenge.progress = 0;
        
        this.challenges.set(challenge.id, challenge);
    }
    
    getActiveChallenges() {
        const now = Date.now();
        const active = [];
        
        for (const [id, challenge] of this.challenges) {
            if (this.completedChallenges.has(id)) continue;
            
            // Check if challenge is expired
            if (challenge.duration && challenge.createdAt + challenge.duration < now) {
                challenge.status = 'expired';
                continue;
            }
            
            // Check if challenge should be active
            if (this.shouldActivateChallenge(challenge)) {
                challenge.status = 'active';
                active.push(challenge);
            }
        }
        
        return active;
    }
    
    shouldActivateChallenge(challenge) {
        const now = Date.now();
        
        switch (challenge.type) {
            case 'daily':
                const today = new Date().toDateString();
                const lastActivated = this.getLastActivatedDate(challenge.id);
                return lastActivated !== today;
                
            case 'weekly':
                const weekStart = this.getWeekStart();
                const lastWeekActivated = this.getLastActivatedDate(challenge.id);
                return lastWeekActivated < weekStart;
                
            case 'monthly':
                const monthStart = this.getMonthStart();
                const lastMonthActivated = this.getLastActivatedDate(challenge.id);
                return lastMonthActivated < monthStart;
                
            case 'special':
            case 'achievement':
                return !this.completedChallenges.has(challenge.id);
                
            default:
                return false;
        }
    }
    
    getLastActivatedDate(challengeId) {
        const history = this.challengeHistory.find(h => h.challengeId === challengeId);
        return history ? history.activatedAt : 0;
    }
    
    getWeekStart() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(now.setDate(diff)).getTime();
    }
    
    getMonthStart() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    }
    
    updateChallengeProgress(challengeId, amount = 1) {
        const challenge = this.challenges.get(challengeId);
        if (!challenge || challenge.status !== 'active') return;
        
        challenge.current += amount;
        challenge.progress = Math.min(100, (challenge.current / challenge.target) * 100);
        
        // Check if challenge is completed
        if (challenge.current >= challenge.target) {
            this.completeChallenge(challengeId);
        }
        
        this.saveChallengeData();
    }
    
    completeChallenge(challengeId) {
        const challenge = this.challenges.get(challengeId);
        if (!challenge) return;
        
        challenge.status = 'completed';
        challenge.completedAt = Date.now();
        this.completedChallenges.add(challengeId);
        
        // Add to history
        this.challengeHistory.push({
            challengeId,
            completedAt: Date.now(),
            activatedAt: challenge.createdAt
        });
        
        // Give rewards
        this.giveChallengeRewards(challenge);
        
        // Show completion notification
        this.showChallengeCompletion(challenge);
        
        this.saveChallengeData();
        
        console.log(`🎯 Challenge completed: ${challenge.name}`);
    }
    
    giveChallengeRewards(challenge) {
        challenge.rewards.forEach(reward => {
            switch (reward.type) {
                case 'coins':
                    this.gameEngine.addCoins(reward.amount);
                    break;
                case 'gems':
                    this.gameEngine.addGems(reward.amount);
                    break;
                case 'exp':
                    this.gameEngine.addExperience(reward.amount);
                    break;
            }
        });
    }
    
    showChallengeCompletion(challenge) {
        // Create completion notification
        const notification = document.createElement('div');
        notification.className = 'challenge-completion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🎯</div>
                <div class="notification-text">
                    <div class="notification-title">Challenge Completed!</div>
                    <div class="notification-subtitle">${challenge.name}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    getChallengeProgress(challengeId) {
        const challenge = this.challenges.get(challengeId);
        if (!challenge) return 0;
        
        return Math.min(100, (challenge.current / challenge.target) * 100);
    }
    
    getChallenge(challengeId) {
        return this.challenges.get(challengeId);
    }
    
    startChallenge(challengeId) {
        const challenge = this.challenges.get(challengeId);
        if (!challenge || challenge.status !== 'active') return false;
        
        // Mark as activated
        challenge.activatedAt = Date.now();
        this.activeChallenges.set(challengeId, challenge);
        
        return true;
    }
    
    getChallengeStats() {
        const stats = {
            total: this.challenges.size,
            completed: this.completedChallenges.size,
            active: this.getActiveChallenges().length,
            byType: {
                daily: 0,
                weekly: 0,
                monthly: 0,
                special: 0,
                achievement: 0
            },
            byDifficulty: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            }
        };
        
        for (const challenge of this.challenges.values()) {
            stats.byType[challenge.type]++;
            stats.byDifficulty[challenge.difficulty]++;
        }
        
        return stats;
    }
    
    getTimeLeft(challengeId) {
        const challenge = this.challenges.get(challengeId);
        if (!challenge || !challenge.duration) return null;
        
        const now = Date.now();
        const endTime = challenge.createdAt + challenge.duration;
        const timeLeft = endTime - now;
        
        if (timeLeft <= 0) return 'Expired';
        
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }
    
    resetDailyChallenges() {
        const today = new Date().toDateString();
        
        for (const [id, challenge] of this.challenges) {
            if (challenge.type === 'daily') {
                const lastActivated = this.getLastActivatedDate(id);
                if (lastActivated !== today) {
                    challenge.current = 0;
                    challenge.progress = 0;
                    challenge.status = 'active';
                    challenge.createdAt = Date.now();
                }
            }
        }
        
        this.saveChallengeData();
    }
    
    resetWeeklyChallenges() {
        const weekStart = this.getWeekStart();
        
        for (const [id, challenge] of this.challenges) {
            if (challenge.type === 'weekly') {
                const lastActivated = this.getLastActivatedDate(id);
                if (lastActivated < weekStart) {
                    challenge.current = 0;
                    challenge.progress = 0;
                    challenge.status = 'active';
                    challenge.createdAt = Date.now();
                }
            }
        }
        
        this.saveChallengeData();
    }
    
    resetMonthlyChallenges() {
        const monthStart = this.getMonthStart();
        
        for (const [id, challenge] of this.challenges) {
            if (challenge.type === 'monthly') {
                const lastActivated = this.getLastActivatedDate(id);
                if (lastActivated < monthStart) {
                    challenge.current = 0;
                    challenge.progress = 0;
                    challenge.status = 'active';
                    challenge.createdAt = Date.now();
                }
            }
        }
        
        this.saveChallengeData();
    }
    
    saveChallengeData() {
        const data = {
            challenges: Array.from(this.challenges.entries()),
            completedChallenges: Array.from(this.completedChallenges),
            challengeHistory: this.challengeHistory,
            lastResetTime: this.lastResetTime
        };
        
        localStorage.setItem('clickgrow_challenges', JSON.stringify(data));
    }
    
    loadChallengeData() {
        try {
            const data = localStorage.getItem('clickgrow_challenges');
            if (!data) return;
            
            const parsed = JSON.parse(data);
            
            // Restore challenges
            if (parsed.challenges) {
                for (const [id, challenge] of parsed.challenges) {
                    this.challenges.set(id, challenge);
                }
            }
            
            // Restore completed challenges
            if (parsed.completedChallenges) {
                this.completedChallenges = new Set(parsed.completedChallenges);
            }
            
            // Restore history
            if (parsed.challengeHistory) {
                this.challengeHistory = parsed.challengeHistory;
            }
            
            // Restore last reset times
            if (parsed.lastResetTime) {
                this.lastResetTime = {
                    daily: parsed.lastResetTime.daily || 0,
                    weekly: parsed.lastResetTime.weekly || 0,
                    monthly: parsed.lastResetTime.monthly || 0
                };
            }
            
        } catch (error) {
            console.error('Failed to load challenge data:', error);
        }
    }
    
    resetAllChallenges() {
        this.challenges.clear();
        this.activeChallenges.clear();
        this.completedChallenges.clear();
        this.challengeHistory = [];
        
        this.initializeChallenges();
        this.saveChallengeData();
    }
    
    updateUI() {
        // Update challenges display if UI is available
        const challengesContainer = document.querySelector('.challenges-list');
        if (challengesContainer) {
            this.renderChallenges(challengesContainer);
        }
    }
    
    checkResets() {
        // Check if daily challenges need reset
        const now = Date.now();
        const lastDailyReset = this.lastResetTime.daily || 0;
        const dayStart = new Date().setHours(0, 0, 0, 0);
        
        if (lastDailyReset < dayStart) {
            this.resetDailyChallenges();
            this.lastResetTime.daily = now;
        }
        
        // Check if weekly challenges need reset
        const lastWeeklyReset = this.lastResetTime.weekly || 0;
        const weekStart = this.getWeekStart();
        
        if (lastWeeklyReset < weekStart) {
            this.resetWeeklyChallenges();
            this.lastResetTime.weekly = now;
        }
        
        // Check if monthly challenges need reset
        const lastMonthlyReset = this.lastResetTime.monthly || 0;
        const monthStart = this.getMonthStart();
        
        if (lastMonthlyReset < monthStart) {
            this.resetMonthlyChallenges();
            this.lastResetTime.monthly = now;
        }
    }
    
    renderChallenges(container) {
        const activeChallenges = this.getActiveChallenges();
        
        container.innerHTML = '';
        
        if (activeChallenges.length === 0) {
            container.innerHTML = `
                <div class="no-challenges">
                    <div class="no-challenges-icon">🎯</div>
                    <div class="no-challenges-text">No active challenges</div>
                    <div class="no-challenges-subtext">Check back later for new challenges!</div>
                </div>
            `;
            return;
        }
        
        activeChallenges.forEach(challenge => {
            const progress = this.getChallengeProgress(challenge.id);
            const timeLeft = this.getTimeLeft(challenge.id);
            
            const challengeElement = document.createElement('div');
            challengeElement.className = `challenge-card ${challenge.type}`;
            challengeElement.innerHTML = `
                <div class="challenge-header">
                    <div class="challenge-icon">${challenge.icon}</div>
                    <div class="challenge-info">
                        <div class="challenge-title">${challenge.name}</div>
                        <div class="challenge-description">${challenge.description}</div>
                    </div>
                </div>
                <div class="challenge-progress">
                    <div class="progress-header">
                        <span class="progress-text">Progress</span>
                        <span class="progress-percentage">${Math.round(progress)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${challenge.current}/${challenge.target}</div>
                </div>
                ${timeLeft ? `<div class="challenge-timer">⏰ Time left: ${timeLeft}</div>` : ''}
                <div class="challenge-rewards">
                    ${challenge.rewards.map(reward => 
                        `<div class="reward-badge">+${reward.amount} ${reward.icon}</div>`
                    ).join('')}
                </div>
                <div class="challenge-actions">
                    <button class="challenge-btn primary" data-challenge-id="${challenge.id}" data-action="start">Start</button>
                    <button class="challenge-btn secondary" data-challenge-id="${challenge.id}" data-action="details">Details</button>
                </div>
            `;
            
            container.appendChild(challengeElement);
        });
    }
}

// Add challenge completion notification styles
const challengeStyles = document.createElement('style');
challengeStyles.textContent = `
    .challenge-completion-notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border-radius: var(--radius-xl);
        padding: var(--space-4) var(--space-6);
        box-shadow: var(--shadow-xl);
        z-index: var(--z-toast);
        transition: transform var(--transition-smooth);
    }
    
    .challenge-completion-notification.show {
        transform: translateX(-50%) translateY(0);
    }
    
    .challenge-completion-notification .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-3);
    }
    
    .challenge-completion-notification .notification-icon {
        font-size: var(--text-2xl);
        animation: bounce 1s infinite;
    }
    
    .challenge-completion-notification .notification-text {
        text-align: left;
    }
    
    .challenge-completion-notification .notification-title {
        font-size: var(--text-base);
        font-weight: var(--font-bold);
        margin-bottom: var(--space-1);
    }
    
    .challenge-completion-notification .notification-subtitle {
        font-size: var(--text-sm);
        opacity: 0.9;
    }
`;
document.head.appendChild(challengeStyles);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengeSystem;
} 