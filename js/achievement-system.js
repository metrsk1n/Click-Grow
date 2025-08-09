// Click&Grow Premium v0.0.5-alpha - Achievement System

class AchievementSystem {
    constructor() {
        this.achievements = this.initializeAchievements();
        this.unlockedAchievements = this.loadUnlockedAchievements();
        console.log('🏆 AchievementSystem initialized');
    }

    initializeAchievements() {
        return {
            // Growth Achievements (1-20)
            'first_sprout': {
                id: 'first_sprout',
                name: 'First Sprout',
                description: 'Reach level 5',
                icon: '🌱',
                requirement: { type: 'level', value: 5 },
                reward: { coins: 50, exp: 0 },
                rarity: 'common'
            },
            'young_tree': {
                id: 'young_tree',
                name: 'Young Tree',
                description: 'Reach level 15',
                icon: '🌳',
                requirement: { type: 'level', value: 15 },
                reward: { coins: 200, exp: 100 },
                rarity: 'uncommon'
            },
            'mighty_oak': {
                id: 'mighty_oak',
                name: 'Mighty Oak',
                description: 'Reach level 25',
                icon: '🌳',
                requirement: { type: 'level', value: 25 },
                reward: { coins: 500, exp: 300, gems: 1 },
                rarity: 'rare'
            },
            'magical_tree': {
                id: 'magical_tree',
                name: 'Magical Tree',
                description: 'Reach level 35',
                icon: '🌸',
                requirement: { type: 'level', value: 35 },
                reward: { coins: 1000, exp: 500, gems: 3 },
                rarity: 'epic'
            },
            'tree_of_life': {
                id: 'tree_of_life',
                name: 'Tree of Life',
                description: 'Reach level 50',
                icon: '🌳',
                requirement: { type: 'level', value: 50 },
                reward: { coins: 2000, exp: 1000, gems: 5 },
                rarity: 'legendary'
            },
            'ancient_tree': {
                id: 'ancient_tree',
                name: 'Ancient Tree',
                description: 'Reach level 75',
                icon: '🌲',
                requirement: { type: 'level', value: 75 },
                reward: { coins: 5000, exp: 2000, gems: 10 },
                rarity: 'mythic'
            },
            'divine_tree': {
                id: 'divine_tree',
                name: 'Divine Tree',
                description: 'Reach level 100',
                icon: '✨',
                requirement: { type: 'level', value: 100 },
                reward: { coins: 10000, exp: 5000, gems: 20 },
                rarity: 'divine'
            },
            'cosmic_tree': {
                id: 'cosmic_tree',
                name: 'Cosmic Tree',
                description: 'Reach level 150',
                icon: '🌟',
                requirement: { type: 'level', value: 150 },
                reward: { coins: 25000, exp: 10000, gems: 50 },
                rarity: 'cosmic'
            },
            'eternal_tree': {
                id: 'eternal_tree',
                name: 'Eternal Tree',
                description: 'Reach level 200',
                icon: '💫',
                requirement: { type: 'level', value: 200 },
                reward: { coins: 50000, exp: 20000, gems: 100 },
                rarity: 'eternal'
            },
            'supreme_tree': {
                id: 'supreme_tree',
                name: 'Supreme Tree',
                description: 'Reach the maximum level 240',
                icon: '👑',
                requirement: { type: 'level', value: 240 },
                reward: { coins: 100000, exp: 50000, gems: 200 },
                rarity: 'supreme'
            },

            // Action Achievements (21-40)
            'water_master': {
                id: 'water_master',
                name: 'Water Master',
                description: 'Water your plant 100 times',
                icon: '💧',
                requirement: { type: 'action_count', action: 'water', value: 100 },
                reward: { coins: 300, exp: 200 },
                rarity: 'uncommon'
            },
            'water_expert': {
                id: 'water_expert',
                name: 'Water Expert',
                description: 'Water your plant 500 times',
                icon: '💧',
                requirement: { type: 'action_count', action: 'water', value: 500 },
                reward: { coins: 1000, exp: 500, gems: 2 },
                rarity: 'rare'
            },
            'water_legend': {
                id: 'water_legend',
                name: 'Water Legend',
                description: 'Water your plant 1000 times',
                icon: '💧',
                requirement: { type: 'action_count', action: 'water', value: 1000 },
                reward: { coins: 3000, exp: 1000, gems: 5 },
                rarity: 'epic'
            },
            'fertilizer_expert': {
                id: 'fertilizer_expert',
                name: 'Fertilizer Expert',
                description: 'Use fertilizer 50 times',
                icon: '🌿',
                requirement: { type: 'action_count', action: 'fertilizer', value: 50 },
                reward: { coins: 400, exp: 250 },
                rarity: 'uncommon'
            },
            'fertilizer_master': {
                id: 'fertilizer_master',
                name: 'Fertilizer Master',
                description: 'Use fertilizer 200 times',
                icon: '🌿',
                requirement: { type: 'action_count', action: 'fertilizer', value: 200 },
                reward: { coins: 1200, exp: 600, gems: 3 },
                rarity: 'rare'
            },
            'fertilizer_legend': {
                id: 'fertilizer_legend',
                name: 'Fertilizer Legend',
                description: 'Use fertilizer 500 times',
                icon: '🌿',
                requirement: { type: 'action_count', action: 'fertilizer', value: 500 },
                reward: { coins: 4000, exp: 1500, gems: 8 },
                rarity: 'epic'
            },
            'sunlight_guru': {
                id: 'sunlight_guru',
                name: 'Sunlight Guru',
                description: 'Provide sunlight 75 times',
                icon: '☀️',
                requirement: { type: 'action_count', action: 'sunlight', value: 75 },
                reward: { coins: 350, exp: 225 },
                rarity: 'uncommon'
            },
            'sunlight_master': {
                id: 'sunlight_master',
                name: 'Sunlight Master',
                description: 'Provide sunlight 300 times',
                icon: '☀️',
                requirement: { type: 'action_count', action: 'sunlight', value: 300 },
                reward: { coins: 1000, exp: 500, gems: 2 },
                rarity: 'rare'
            },
            'sunlight_legend': {
                id: 'sunlight_legend',
                name: 'Sunlight Legend',
                description: 'Provide sunlight 750 times',
                icon: '☀️',
                requirement: { type: 'action_count', action: 'sunlight', value: 750 },
                reward: { coins: 3500, exp: 1200, gems: 6 },
                rarity: 'epic'
            },
            'action_master': {
                id: 'action_master',
                name: 'Action Master',
                description: 'Perform 1000 total actions',
                icon: '⚡',
                requirement: { type: 'total_actions', value: 1000 },
                reward: { coins: 2000, exp: 1000, gems: 5 },
                rarity: 'rare'
            },

            // Experience Achievements (41-60)
            'experience_collector': {
                id: 'experience_collector',
                name: 'Experience Collector',
                description: 'Earn 10,000 total experience',
                icon: '⭐',
                requirement: { type: 'total_exp', value: 10000 },
                reward: { coins: 1000, gems: 2 },
                rarity: 'rare'
            },
            'experience_hunter': {
                id: 'experience_hunter',
                name: 'Experience Hunter',
                description: 'Earn 50,000 total experience',
                icon: '⭐',
                requirement: { type: 'total_exp', value: 50000 },
                reward: { coins: 3000, exp: 1000, gems: 5 },
                rarity: 'epic'
            },
            'experience_legend': {
                id: 'experience_legend',
                name: 'Experience Legend',
                description: 'Earn 100,000 total experience',
                icon: '⭐',
                requirement: { type: 'total_exp', value: 100000 },
                reward: { coins: 8000, exp: 2000, gems: 10 },
                rarity: 'legendary'
            },
            'experience_master': {
                id: 'experience_master',
                name: 'Experience Master',
                description: 'Earn 500,000 total experience',
                icon: '⭐',
                requirement: { type: 'total_exp', value: 500000 },
                reward: { coins: 20000, exp: 5000, gems: 25 },
                rarity: 'mythic'
            },
            'experience_god': {
                id: 'experience_god',
                name: 'Experience God',
                description: 'Earn 1,000,000 total experience',
                icon: '⭐',
                requirement: { type: 'total_exp', value: 1000000 },
                reward: { coins: 50000, exp: 10000, gems: 50 },
                rarity: 'divine'
            },

            // Coin Achievements (61-75)
            'coin_collector': {
                id: 'coin_collector',
                name: 'Coin Collector',
                description: 'Earn 5,000 total coins',
                icon: '💰',
                requirement: { type: 'total_coins', value: 5000 },
                reward: { coins: 500, gems: 1 },
                rarity: 'uncommon'
            },
            'coin_hunter': {
                id: 'coin_hunter',
                name: 'Coin Hunter',
                description: 'Earn 25,000 total coins',
                icon: '💰',
                requirement: { type: 'total_coins', value: 25000 },
                reward: { coins: 1500, gems: 3 },
                rarity: 'rare'
            },
            'coin_master': {
                id: 'coin_master',
                name: 'Coin Master',
                description: 'Earn 100,000 total coins',
                icon: '💰',
                requirement: { type: 'total_coins', value: 100000 },
                reward: { coins: 5000, gems: 10 },
                rarity: 'epic'
            },
            'coin_legend': {
                id: 'coin_legend',
                name: 'Coin Legend',
                description: 'Earn 500,000 total coins',
                icon: '💰',
                requirement: { type: 'total_coins', value: 500000 },
                reward: { coins: 15000, gems: 25 },
                rarity: 'legendary'
            },
            'coin_tycoon': {
                id: 'coin_tycoon',
                name: 'Coin Tycoon',
                description: 'Earn 1,000,000 total coins',
                icon: '💰',
                requirement: { type: 'total_coins', value: 1000000 },
                reward: { coins: 30000, gems: 50 },
                rarity: 'mythic'
            },

            // Minigame Achievements (76-85)
            'minigame_beginner': {
                id: 'minigame_beginner',
                name: 'Minigame Beginner',
                description: 'Complete 10 minigames',
                icon: '🎮',
                requirement: { type: 'minigames_completed', value: 10 },
                reward: { coins: 200, exp: 100 },
                rarity: 'common'
            },
            'minigame_player': {
                id: 'minigame_player',
                name: 'Minigame Player',
                description: 'Complete 50 minigames',
                icon: '🎮',
                requirement: { type: 'minigames_completed', value: 50 },
                reward: { coins: 800, exp: 400, gems: 2 },
                rarity: 'uncommon'
            },
            'minigame_master': {
                id: 'minigame_master',
                name: 'Minigame Master',
                description: 'Complete 200 minigames',
                icon: '🎮',
                requirement: { type: 'minigames_completed', value: 200 },
                reward: { coins: 2000, exp: 1000, gems: 5 },
                rarity: 'rare'
            },
            'minigame_legend': {
                id: 'minigame_legend',
                name: 'Minigame Legend',
                description: 'Complete 500 minigames',
                icon: '🎮',
                requirement: { type: 'minigames_completed', value: 500 },
                reward: { coins: 5000, exp: 2000, gems: 10 },
                rarity: 'epic'
            },
            'minigame_god': {
                id: 'minigame_god',
                name: 'Minigame God',
                description: 'Complete 1000 minigames',
                icon: '🎮',
                requirement: { type: 'minigames_completed', value: 1000 },
                reward: { coins: 10000, exp: 5000, gems: 20 },
                rarity: 'legendary'
            },

            // Challenge Achievements (86-95)
            'challenge_beginner': {
                id: 'challenge_beginner',
                name: 'Challenge Beginner',
                description: 'Complete 5 challenges',
                icon: '🎯',
                requirement: { type: 'challenges_completed', value: 5 },
                reward: { coins: 300, exp: 150 },
                rarity: 'common'
            },
            'challenge_hunter': {
                id: 'challenge_hunter',
                name: 'Challenge Hunter',
                description: 'Complete 25 challenges',
                icon: '🎯',
                requirement: { type: 'challenges_completed', value: 25 },
                reward: { coins: 1000, exp: 500, gems: 3 },
                rarity: 'uncommon'
            },
            'challenge_master': {
                id: 'challenge_master',
                name: 'Challenge Master',
                description: 'Complete 100 challenges',
                icon: '🎯',
                requirement: { type: 'challenges_completed', value: 100 },
                reward: { coins: 3000, exp: 1500, gems: 8 },
                rarity: 'rare'
            },
            'challenge_legend': {
                id: 'challenge_legend',
                name: 'Challenge Legend',
                description: 'Complete 250 challenges',
                icon: '🎯',
                requirement: { type: 'challenges_completed', value: 250 },
                reward: { coins: 8000, exp: 3000, gems: 15 },
                rarity: 'epic'
            },
            'challenge_god': {
                id: 'challenge_god',
                name: 'Challenge God',
                description: 'Complete 500 challenges',
                icon: '🎯',
                requirement: { type: 'challenges_completed', value: 500 },
                reward: { coins: 15000, exp: 5000, gems: 30 },
                rarity: 'legendary'
            },

            // Special Achievements (96-105)
            'first_achievement': {
                id: 'first_achievement',
                name: 'First Steps',
                description: 'Unlock your first achievement',
                icon: '🏆',
                requirement: { type: 'achievements_unlocked', value: 1 },
                reward: { coins: 100, exp: 50 },
                rarity: 'common'
            },
            'achievement_hunter': {
                id: 'achievement_hunter',
                name: 'Achievement Hunter',
                description: 'Unlock 25 achievements',
                icon: '🏆',
                requirement: { type: 'achievements_unlocked', value: 25 },
                reward: { coins: 1000, exp: 500, gems: 2 },
                rarity: 'rare'
            },
            'achievement_master': {
                id: 'achievement_master',
                name: 'Achievement Master',
                description: 'Unlock 50 achievements',
                icon: '🏆',
                requirement: { type: 'achievements_unlocked', value: 50 },
                reward: { coins: 3000, exp: 1500, gems: 5 },
                rarity: 'epic'
            },
            'achievement_legend': {
                id: 'achievement_legend',
                name: 'Achievement Legend',
                description: 'Unlock 75 achievements',
                icon: '🏆',
                requirement: { type: 'achievements_unlocked', value: 75 },
                reward: { coins: 10000, exp: 5000, gems: 20 },
                rarity: 'legendary'
            },
            'achievement_god': {
                id: 'achievement_god',
                name: 'Achievement God',
                description: 'Unlock all achievements',
                icon: '👑',
                requirement: { type: 'achievements_unlocked', value: 105 },
                reward: { coins: 50000, exp: 20000, gems: 100 },
                rarity: 'supreme'
            }
        };
    }

    loadUnlockedAchievements() {
        const saved = localStorage.getItem('clickgrow_achievements');
        return saved ? JSON.parse(saved) : [];
    }

    saveUnlockedAchievements() {
        localStorage.setItem('clickgrow_achievements', JSON.stringify(this.unlockedAchievements));
    }

    checkAchievements(gameState) {
        const newAchievements = [];
        
        Object.values(this.achievements).forEach(achievement => {
            if (!this.unlockedAchievements.includes(achievement.id) && this.isAchievementMet(achievement, gameState)) {
                this.unlockAchievement(achievement.id);
                newAchievements.push(achievement);
            }
        });
        
        return newAchievements;
    }

    isAchievementMet(achievement, gameState) {
        const req = achievement.requirement;
        
        switch (req.type) {
            case 'level':
                return gameState.level >= req.value;
            case 'action_count':
                return gameState.actionCounts[req.action] >= req.value;
            case 'total_exp':
                return gameState.totalExp >= req.value;
            case 'total_coins':
                return gameState.totalCoinsEarned >= req.value;
            case 'minigames_completed':
                return gameState.minigamesCompleted >= req.value;
            case 'challenges_completed':
                return gameState.challenges?.completed?.length >= req.value;
            case 'achievements_unlocked':
                return this.unlockedAchievements.length >= req.value;
            case 'total_actions':
                const totalActions = gameState.actionCounts.water + gameState.actionCounts.fertilizer + gameState.actionCounts.sunlight;
                return totalActions >= req.value;
            default:
                return false;
        }
    }

    unlockAchievement(id) {
        if (!this.unlockedAchievements.includes(id)) {
            this.unlockedAchievements.push(id);
            this.saveUnlockedAchievements();
            
            const achievement = this.achievements[id];
            if (achievement) {
                this.showAchievementToast(achievement);
                console.log(`🏆 Achievement unlocked: ${achievement.name}`);
            }
        }
    }

    showAchievementToast(achievement) {
        const toast = document.getElementById('achievement-toast');
        if (!toast) return;
        
        const description = toast.querySelector('#achievement-description');
        if (description) {
            description.textContent = achievement.description;
        }
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
        
        console.log(`🏆 Achievement unlocked: ${achievement.name}`);
    }

    getAchievementProgress(id, gameState) {
        const achievement = this.achievements[id];
        if (!achievement) return { current: 0, target: 0, percentage: 0 };
        
        const req = achievement.requirement;
        let current = 0;
        let target = req.value;
        
        switch (req.type) {
            case 'level':
                current = gameState.level;
                break;
            case 'action_count':
                current = gameState.actionCounts[req.action] || 0;
                break;
            case 'total_exp':
                current = gameState.totalExp;
                break;
            case 'total_coins':
                current = gameState.totalCoinsEarned;
                break;
            case 'minigames_completed':
                current = gameState.minigamesCompleted;
                break;
            case 'challenges_completed':
                current = gameState.challenges?.completed?.length || 0;
                break;
            case 'achievements_unlocked':
                current = this.unlockedAchievements.length;
                break;
            case 'total_actions':
                current = (gameState.actionCounts.water || 0) + (gameState.actionCounts.fertilizer || 0) + (gameState.actionCounts.sunlight || 0);
                break;
        }
        
        const percentage = Math.min(100, (current / target) * 100);
        return { current, target, percentage };
    }

    getAllAchievements() {
        return Object.values(this.achievements);
    }

    getUnlockedCount() {
        return this.unlockedAchievements.length;
    }

    getTotalCount() {
        return Object.keys(this.achievements).length;
    }

    isUnlocked(id) {
        return this.unlockedAchievements.includes(id);
    }

    resetAchievements() {
        this.unlockedAchievements = [];
        this.saveUnlockedAchievements();
    }

    filterAchievements(category) {
        const achievementsContainer = document.getElementById('achievements-list');
        if (!achievementsContainer) return;

        const allAchievements = this.getAllAchievements();
        let filteredAchievements = [];

        switch (category) {
            case 'all':
                filteredAchievements = allAchievements;
                break;
            case 'growth':
                filteredAchievements = allAchievements.filter(a => 
                    a.requirement.type === 'level' || 
                    a.requirement.type === 'experience'
                );
                break;
            case 'actions':
                filteredAchievements = allAchievements.filter(a => 
                    a.requirement.type === 'actions' || 
                    a.requirement.type === 'water' || 
                    a.requirement.type === 'fertilizer' || 
                    a.requirement.type === 'sunlight'
                );
                break;
            case 'games':
                filteredAchievements = allAchievements.filter(a => 
                    a.requirement.type === 'minigames' || 
                    a.requirement.type === 'games'
                );
                break;
            case 'challenges':
                filteredAchievements = allAchievements.filter(a => 
                    a.requirement.type === 'challenges'
                );
                break;
            case 'streaks':
                filteredAchievements = allAchievements.filter(a => 
                    a.requirement.type === 'streak' || 
                    a.requirement.type === 'consecutive'
                );
                break;
            case 'rare':
                filteredAchievements = allAchievements.filter(a => 
                    a.rarity === 'rare' || 
                    a.rarity === 'epic' || 
                    a.rarity === 'legendary' || 
                    a.rarity === 'mythic' || 
                    a.rarity === 'divine' || 
                    a.rarity === 'cosmic' || 
                    a.rarity === 'eternal'
                );
                break;
            default:
                filteredAchievements = allAchievements;
        }

        this.renderAchievements(achievementsContainer, filteredAchievements);
    }

    renderAchievements(container, achievements = null) {
        if (!achievements) {
            achievements = this.getAllAchievements();
        }

        container.innerHTML = '';

        if (achievements.length === 0) {
            container.innerHTML = `
                <div class="no-achievements">
                    <div class="no-achievements-icon">🏆</div>
                    <div class="no-achievements-text">No achievements found</div>
                    <div class="no-achievements-subtext">Try a different category!</div>
                </div>
            `;
            return;
        }

        achievements.forEach(achievement => {
            const isUnlocked = this.isUnlocked(achievement.id);
            const gameState = window.app?.gameEngine?.getGameState() || { level: 1, actionCounts: {}, totalExp: 0, totalCoinsEarned: 0, minigamesCompleted: 0, challenges: { completed: [] } };
            const progress = this.getAchievementProgress(achievement.id, gameState);

            // Get localized rarity label
            const rarityLabel = window.i18n ? window.i18n.t(`achievements.rarity.${achievement.rarity}`) : achievement.rarity;
            
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                        </div>
                        <span class="progress-text">${progress.current}/${progress.target}</span>
                    </div>
                </div>
                <div class="achievement-rewards">
                    ${achievement.reward.coins ? `<div class="reward-badge">+${achievement.reward.coins} 🪙</div>` : ''}
                    ${achievement.reward.exp ? `<div class="reward-badge">+${achievement.reward.exp} ⭐</div>` : ''}
                    ${achievement.reward.gems ? `<div class="reward-badge">+${achievement.reward.gems} 💎</div>` : ''}
                </div>
                <div class="achievement-rarity ${achievement.rarity}">${rarityLabel}</div>
            `;
            
            container.appendChild(achievementElement);
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.AchievementSystem = AchievementSystem;
}
