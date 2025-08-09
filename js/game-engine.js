// Click&Grow Premium v0.0.5a - Game Engine

class GameEngine {
    constructor() {
        this.gameState = this.initializeGameState();
        this.plantRenderer = new PlantRenderer();
        this.uiManager = null; // Will be initialized in app.js
        this.achievementSystem = new AchievementSystem();
        this.minigameSystem = new MinigameSystem(this);
        this.challengeSystem = new ChallengeSystem(this);
        this.particleSystem = new ParticleSystem();
        this.storage = new Storage('clickgrow');
        
        this.shopItems = this.initializeShopItems();
        console.log('🎮 GameEngine created');
    }
    
    async init() {
        try {
            this.loadGameData();
            // Apply offline decay and death checks
            this.applyOfflineDecayAndDeath();
            // Start a lightweight periodic tick (every 10 minutes) while app is open
            this.startOnlineTick();
            await this.challengeSystem.init();
            console.log('✅ GameEngine initialized with all systems');
        } catch (error) {
            console.error('❌ GameEngine initialization failed:', error);
            throw error;
        }
    }

    initializeGameState() {
        return {
            level: 1,
            experience: 0,
            coins: 100,
            gems: 0,
            happiness: 100, // 0-100
            health: 100,    // 0-100
            growth: 0,      // 0-100 (progress within current level or visual growth)
            plantName: 'Sprout', // Default plant name
            lastWatered: Date.now(),
            lastFertilized: Date.now(),
            lastSunlight: Date.now(),
            totalExp: 0,
            totalCoinsEarned: 0,
            totalGemsEarned: 0,
            totalActions: 0,
            totalGamesPlayed: 0,
            totalChallengesCompleted: 0,
            totalAchievementsUnlocked: 0,
            bestScore: 0,
            averageScore: 0,
            longestStreak: 0,
            currentStreak: 0,
            playTime: 0,
            lastPlayTime: Date.now(), // ms timestamp
            lastPlayDate: new Date().toDateString(),
            dead: false,
            actionCounts: {
                water: 0,
                fertilizer: 0,
                sunlight: 0
            },
            gameStats: {
                waterGames: { played: 0, bestScore: 0, totalScore: 0 },
                fertilizerGames: { played: 0, bestScore: 0, totalScore: 0 },
                sunlightGames: { played: 0, bestScore: 0, totalScore: 0 },
                puzzleGames: { played: 0, bestScore: 0, totalScore: 0 },
                speedGames: { played: 0, bestScore: 0, totalScore: 0 },
                memoryGames: { played: 0, bestScore: 0, totalScore: 0 },
                balanceGames: { played: 0, bestScore: 0, totalScore: 0 }
            },
            minigamesCompleted: 0,
            consecutiveDays: 1,
            boosters: {
                experienceMultiplier: 0,
                coinMultiplier: 0
            },
            inventory: {},
            settings: {
                darkMode: false,
                notifications: true,
                soundEnabled: true,
                particlesEnabled: true
            },
            challenges: {
                completed: [],
                progress: {},
                lastReset: {
                    daily: Date.now(),
                    weekly: Date.now(),
                    monthly: Date.now()
                }
            }
        };
    }

    initializeShopItems() {
        return {
            superFertilizer: {
                name: 'Super Fertilizer',
                description: 'Doubles fertilizer effectiveness for 1 hour',
                icon: '🧪',
                price: 1200,
                currency: 'coins',
                category: 'boosters'
            },
            growthBooster: {
                name: 'Growth Booster',
                description: 'Increases XP gain by 50% for 30 minutes',
                icon: '⚡',
                price: 1400,
                currency: 'coins',
                category: 'boosters'
            },
            happinessPotion: {
                name: 'Happiness Potion',
                description: 'Instantly restores happiness to 100%',
                icon: '😊',
                price: 600,
                currency: 'coins',
                category: 'consumables'
            },
            healthElixir: {
                name: 'Health Elixir',
                description: 'Instantly restores health to 100%',
                icon: '❤️',
                price: 500,
                currency: 'coins',
                category: 'consumables'
            },
            experienceMultiplier: {
                name: 'XP Multiplier',
                description: 'Double XP for 2 hours',
                icon: '⭐',
                price: 25,
                currency: 'gems',
                category: 'premium'
            },
            coinMultiplier: {
                name: 'Coin Multiplier',
                description: 'Double coin rewards for 2 hours',
                icon: '💰',
                price: 35,
                currency: 'gems',
                category: 'premium'
            },
            rainbowSeed: {
                name: 'Rainbow Seed',
                description: 'Special seed that grows faster',
                icon: '🌈',
                price: 75,
                currency: 'gems',
                category: 'premium'
            },
            timeAccelerator: {
                name: 'Time Accelerator',
                description: 'Reduces cooldowns by 50% for 1 hour',
                icon: '⏰',
                price: 15,
                currency: 'gems',
                category: 'premium'
            },
            goldenWater: {
                name: 'Golden Water',
                description: 'Premium water that gives 3x rewards',
                icon: '💧',
                price: 25,
                currency: 'gems',
                category: 'special'
            },
            cosmicFertilizer: {
                name: 'Cosmic Fertilizer',
                description: 'Legendary fertilizer with amazing effects',
                icon: '✨',
                price: 55,
                currency: 'gems',
                category: 'special'
            },
            plantSkin: {
                name: 'Golden Plant Skin',
                description: 'Beautiful golden plant appearance',
                icon: '🎨',
                price: 60,
                currency: 'gems',
                category: 'cosmetics'
            }
        };
    }

    loadGameData() {
        try {
            const savedState = JSON.parse(localStorage.getItem('clickgrow_state'));
            if (savedState) {
                this.gameState = { ...this.initializeGameState(), ...savedState };
            }
        } catch (e) {
            console.warn('⚠️ Failed to load game data, using defaults', e);
        }
    }

    saveGameData() {
        // Update last active timestamps when saving
        this.gameState.lastPlayTime = Date.now();
        this.gameState.lastPlayDate = new Date().toDateString();
        localStorage.setItem('clickgrow_state', JSON.stringify(this.gameState));
    }

    performAction(actionType) {
        this.gameState.totalActions++;
        
        switch (actionType) {
            case 'water':
                this.gameState.actionCounts.water++;
                // Watering boosts health slightly and growth
                this.gameState.health = Math.min(100, this.gameState.health + 5);
                this.gameState.growth = Math.min(100, this.gameState.growth + 3);
                break;
            case 'fertilizer':
                this.gameState.actionCounts.fertilizer++;
                // Fertilizer boosts growth significantly
                this.gameState.growth = Math.min(100, this.gameState.growth + 8);
                break;
            case 'sunlight':
                this.gameState.actionCounts.sunlight++;
                // Sunlight boosts happiness and a bit of health
                this.gameState.happiness = Math.min(100, this.gameState.happiness + 6);
                this.gameState.health = Math.min(100, this.gameState.health + 2);
                break;
            case 'entertain':
                // Entertainment action: improves happiness, tiny growth via morale
                this.gameState.happiness = Math.min(100, this.gameState.happiness + 10);
                this.gameState.growth = Math.min(100, this.gameState.growth + 1);
                if (this.uiManager) this.uiManager.showActionFeedback('🎵 Your plant enjoyed the entertainment!', 'success');
                break;
        }

        this.saveGameData();
        this.updateUI();
    }

    updateUI() {
        // Update all UI elements
        this.uiManager.updateAllDisplays(this.gameState);
        
        // Update plant visual, including dead state rendering handled by UI
        this.uiManager.updatePlantVisual(this.gameState.level);
        
        // Update challenge system UI
        this.challengeSystem.updateUI();
    }

    addExperience(amount) {
        this.gameState.experience += amount;
        this.gameState.totalExp += amount;
    }

    setLevel(level) {
        if (level >= 1 && level <= 240) {
            this.gameState.level = level;
            // Let UI decide whether to render dead or alive
            this.uiManager.updatePlantVisual(level);
            this.updateUI();
        }
    }

    resetGame() {
        this.gameState = this.initializeGameState();
        this.achievementSystem.resetAchievements();
        this.challengeSystem.resetAllChallenges();
        this.saveGameData();
        this.updateUI();
        console.log('🔄 Game reset');
    }

    // Apply offline decay based on time elapsed and handle death after 7 days of inactivity
    applyOfflineDecayAndDeath() {
        const now = Date.now();
        const last = this.gameState.lastPlayTime || now;
        const elapsedMs = Math.max(0, now - last);
        const elapsedHours = Math.floor(elapsedMs / (60 * 60 * 1000));

        // If no login > 7 days => plant dies
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        if (elapsedMs >= sevenDaysMs) {
            this.gameState.dead = true;
        }

        // Apply decay only if not dead yet
        if (!this.gameState.dead && elapsedHours > 0) {
            // Happiness decays 2 per hour
            this.gameState.happiness = Math.max(0, this.gameState.happiness - 2 * elapsedHours);
            // Health decays 1 per hour if happiness is low
            if (this.gameState.happiness < 30) {
                this.gameState.health = Math.max(0, this.gameState.health - 1 * elapsedHours);
            }
            // Passive growth if both stats are high
            if (this.gameState.health > 70 && this.gameState.happiness > 70) {
                this.gameState.growth = Math.min(100, this.gameState.growth + 1 * Math.floor(elapsedHours / 3));
            }
        }

        // If either stat reaches 0 for extended time, consider plant fragile (optional future)

        // Persist applied decay baseline
        this.saveGameData();
    }

    // Online tick to decay while the app is open (every 10 minutes)
    startOnlineTick() {
        if (this._onlineTick) clearInterval(this._onlineTick);
        this._onlineTick = setInterval(() => {
            if (this.gameState.dead) return;
            // 10-minute step decay
            this.gameState.happiness = Math.max(0, this.gameState.happiness - 1); // ~6/hr
            if (this.gameState.happiness < 30) {
                this.gameState.health = Math.max(0, this.gameState.health - 0.5);
            }
            if (this.gameState.health > 70 && this.gameState.happiness > 70) {
                this.gameState.growth = Math.min(100, this.gameState.growth + 0.2);
            }
            // Death check: if no interaction for 7 days (handled offline), or health==0 for long (future)
            this.saveGameData();
            this.updateUI();
        }, 10 * 60 * 1000);
    }

    // Helper to mark plant dead and force restart from UI
    markPlantDead() {
        this.gameState.dead = true;
        this.saveGameData();
        this.updateUI();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
}
