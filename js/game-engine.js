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
        // GameEngine created
    }
    
    async init() {
        try {
            this.loadGameData();
            // Apply offline decay and death checks
            this.applyOfflineDecayAndDeath();
            // Start a lightweight periodic tick (every 10 minutes) while app is open
            this.startOnlineTick();
            await this.challengeSystem.init();
            // GameEngine initialized with all systems
        } catch (error) {
            console.error('❌ GameEngine initialization failed:', error);
            throw error;
        }
    }

    initializeGameState() {
        return {
            level: 1,
            experience: 0,
            coins: 500,
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
            },
            statistics: {
                gamesPlayed: 0,
                challengesCompleted: 0,
                bestStreak: 0,
                currentStreak: 0,
                plantsOwned: 1,
                plantVarieties: 1,
                totalCoinsSpent: 0,
                totalActionsPerformed: 0,
                daysPlayed: 1,
                achievementsUnlocked: 0
            }
        };
    }

    initializeShopItems() {
        return {
            // Boosters
            superFertilizer: {
                name: 'Super Fertilizer',
                description: 'Doubles fertilizer effectiveness for 1 hour',
                icon: '🧪',
                price: { coins: 500 },
                category: 'boosters'
            },
            growthBooster: {
                name: 'Growth Booster',
                description: 'Increases XP gain by 50% for 30 minutes',
                icon: '⚡',
                price: { coins: 480 },
                category: 'boosters'
            },
            megaBooster: {
                name: 'Mega Booster',
                description: 'Triple XP gain for 1 hour',
                icon: '🚀',
                price: { coins: 630 },
                category: 'boosters'
            },
            ultraFertilizer: {
                name: 'Ultra Fertilizer',
                description: 'Triple fertilizer effectiveness for 2 hours',
                icon: '🔬',
                price: { coins: 575 },
                category: 'boosters'
            },
            
            // Consumables
            happinessPotion: {
                name: 'Happiness Potion',
                description: 'Instantly restores happiness to 100%',
                icon: '😊',
                price: { coins: 240 },
                category: 'consumables'
            },
            healthElixir: {
                name: 'Health Elixir',
                description: 'Instantly restores health to 100%',
                icon: '❤️',
                price: { coins: 100 },
                category: 'consumables'
            },
            energyDrink: {
                name: 'Energy Drink',
                description: 'Removes all cooldowns instantly',
                icon: '⚡',
                price: { coins: 180 },
                category: 'consumables'
            },
            revitalizer: {
                name: 'Plant Revitalizer',
                description: 'Restores all stats to 100%',
                icon: '💊',
                price: { coins: 220 },
                category: 'consumables'
            },
            
            // Premium items
            experienceMultiplier: {
                name: 'XP Multiplier',
                description: 'Double XP for 2 hours',
                icon: '⭐',
                price: { gems: 10 },
                category: 'premium'
            },
            coinMultiplier: {
                name: 'Coin Multiplier',
                description: 'Double coin rewards for 2 hours',
                icon: '💰',
                price: { gems: 10 },
                category: 'premium'
            },
            rainbowSeed: {
                name: 'Rainbow Seed',
                description: 'Special seed that grows faster',
                icon: '🌈',
                price: { gems: 20 },
                category: 'premium'
            },
            timeAccelerator: {
                name: 'Time Accelerator',
                description: 'Reduces cooldowns by 50% for 1 hour',
                icon: '⏰',
                price: { gems: 10 },
                category: 'premium'
            },
            luckyCharm: {
                name: 'Lucky Charm',
                description: 'Double rewards from mini-games for 3 hours',
                icon: '🍀',
                price: { gems: 20 },
                category: 'premium'
            },
            
            // Special items
            goldenWater: {
                name: 'Golden Water',
                description: 'Premium water that gives 3x rewards',
                icon: '💧',
                price: { gems: 8 },
                category: 'special'
            },
            cosmicFertilizer: {
                name: 'Cosmic Fertilizer',
                description: 'Legendary fertilizer with amazing effects',
                icon: '✨',
                price: { gems: 10 },
                category: 'special'
            },
            diamondSeed: {
                name: 'Diamond Seed',
                description: 'Ultra rare seed with incredible growth rate',
                icon: '💎',
                price: { gems: 15 },
                category: 'special'
            },
            phoenixFeather: {
                name: 'Phoenix Feather',
                description: 'Revives plant from any condition',
                icon: '🔥',
                price: { gems: 20 },
                category: 'special'
            },
            
            // Cosmetics
            plantSkin: {
                name: 'Golden Plant Skin',
                description: 'Beautiful golden plant appearance',
                icon: '🎨',
                price: { gems: 10 },
                category: 'cosmetics'
            },
            silverSkin: {
                name: 'Silver Plant Skin',
                description: 'Elegant silver plant appearance',
                icon: '🥈',
                price: { gems: 8 },
                category: 'cosmetics'
            },
            bronzeSkin: {
                name: 'Bronze Plant Skin',
                description: 'Classic bronze plant appearance',
                icon: '🥉',
                price: { gems: 5 },
                category: 'cosmetics'
            },
            rainbowSkin: {
                name: 'Rainbow Plant Skin',
                description: 'Magical rainbow plant appearance',
                icon: '🌈',
                price: { gems: 13 },
                category: 'cosmetics'
            },
            crystalSkin: {
                name: 'Crystal Plant Skin',
                description: 'Sparkling crystal plant appearance',
                icon: '💎',
                price: { gems: 18 },
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
        if (this.gameState.dead) {
            if (this.uiManager) this.uiManager.showActionFeedback('💀 Your plant is dead! Reset the game to start over.', 'error');
            return;
        }

        // Track total actions performed
        if (!this.gameState.statistics.totalActionsPerformed) {
            this.gameState.statistics.totalActionsPerformed = 0;
        }
        this.gameState.statistics.totalActionsPerformed++;

        switch (actionType) {
            case 'water':
                // Water action: improves health and growth
                this.gameState.happiness = Math.min(100, this.gameState.happiness + 5);
                this.gameState.health = Math.min(100, this.gameState.health + 15);
                this.gameState.growth = Math.min(100, this.gameState.growth + 10);
                this.gameState.experience += 10;
                this.gameState.coins += 5;
                this.gameState.lastWatered = Date.now();
                this.gameState.actionCounts.water++;
                if (this.uiManager) this.uiManager.showActionFeedback('💧 Your plant feels refreshed!', 'success');
                break;
            case 'fertilizer':
                // Fertilizer action: improves growth and happiness
                this.gameState.happiness = Math.min(100, this.gameState.happiness + 10);
                this.gameState.growth = Math.min(100, this.gameState.growth + 20);
                this.gameState.experience += 15;
                this.gameState.coins += 8;
                this.gameState.lastFertilized = Date.now();
                this.gameState.actionCounts.fertilizer++;
                if (this.uiManager) this.uiManager.showActionFeedback('🌰 Your plant is well-nourished!', 'success');
                break;
            case 'sunlight':
                // Sunlight action: improves happiness and health
                this.gameState.happiness = Math.min(100, this.gameState.happiness + 8);
                this.gameState.health = Math.min(100, this.gameState.health + 10);
                this.gameState.growth = Math.min(100, this.gameState.growth + 5);
                this.gameState.experience += 12;
                this.gameState.coins += 6;
                this.gameState.lastSunlight = Date.now();
                this.gameState.actionCounts.sunlight++;
                if (this.uiManager) this.uiManager.showActionFeedback('☀️ Your plant soaks up the sunshine!', 'success');
                break;
            default:
                if (this.uiManager) this.uiManager.showActionFeedback('❓ Unknown action', 'error');
                return;
        }

        // Check for level up
        this.checkLevelUp();
        
        // Save and update UI
        this.saveGameData();
        this.updateUI();
    }

    updateUI() {
        // Only update UI if UIManager is properly initialized
        if (this.uiManager && this.uiManager.isInitialized) {
            // Update all UI elements
            this.uiManager.updateAllDisplays(this.gameState);
            
            // Update plant visual, including dead state rendering handled by UI
            this.uiManager.updatePlantVisual(this.gameState.level);
        }
        
        // Update challenge system UI (independent of UIManager)
        if (this.challengeSystem && this.challengeSystem.updateUI) {
            this.challengeSystem.updateUI();
        }
    }

    addExperience(amount) {
        this.gameState.experience += amount;
        this.gameState.totalExp += amount;
        this.checkLevelUp();
    }

    checkLevelUp() {
        const requiredExp = this.getRequiredExpForLevel(this.gameState.level + 1);
        if (this.gameState.experience >= requiredExp) {
            this.gameState.level++;
            this.gameState.experience -= requiredExp;
            this.gameState.coins += this.gameState.level * 10; // Level up bonus
            this.gameState.gems += Math.floor(this.gameState.level / 5); // Gem bonus every 5 levels
            
            // Show level up feedback
            if (this.uiManager) {
                this.uiManager.showActionFeedback(`🎉 Level Up! You are now level ${this.gameState.level}!`, 'success');
            }
            
            // Check for additional level ups (in case of large exp gains)
            this.checkLevelUp();
        }
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
        // Game reset
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

    // PUBLIC API: return immutable snapshot of game state for external systems (UI, Achievements)
    getGameState() {
        // Prefer this.gameState as the canonical container
        const state = this.gameState || this.state || {};
        // Return a shallow clone to avoid accidental external mutation
        return { ...state };
    }

    // PUBLIC API: progression curve for EXP per level; UI uses this to render progress bar
    getRequiredExpForLevel(level) {
        // Simple exponential curve: level 1 -> 100, grows ~20% per level
        const lvl = Math.max(1, Number(level) || 1);
        const base = 100;
        return Math.floor(base * Math.pow(1.2, lvl - 1));
    }

    // PUBLIC API: provide shop items; UI falls back to a static list if empty
    getShopItems() {
        // If a ShopSystem exists, delegate (future-proof)
        if (this.shopSystem?.getItems) return this.shopSystem.getItems();

        // Return the initialized shop items object
        return this.shopItems || {};
    }

    // PUBLIC API: purchase shop item
    purchaseShopItem(itemId) {
        const item = this.shopItems[itemId];
        if (!item) {
            return { success: false, reason: 'item_not_found' };
        }

        // Get cost and currency from item price structure
        let cost, currency;
        if (item.price.coins) {
            cost = item.price.coins;
            currency = 'coins';
        } else if (item.price.gems) {
            cost = item.price.gems;
            currency = 'gems';
        } else {
            return { success: false, reason: 'invalid_price' };
        }

        // Check if player has enough currency
        if (currency === 'coins' && this.gameState.coins < cost) {
            return { success: false, reason: 'insufficient_funds' };
        }
        if (currency === 'gems' && this.gameState.gems < cost) {
            return { success: false, reason: 'insufficient_funds' };
        }

        // Deduct cost
        if (currency === 'coins') {
            this.gameState.coins -= cost;
            // Track coins spent
            if (!this.gameState.statistics.totalCoinsSpent) {
                this.gameState.statistics.totalCoinsSpent = 0;
            }
            this.gameState.statistics.totalCoinsSpent += cost;
        } else if (currency === 'gems') {
            this.gameState.gems -= cost;
        }

        // Add item to inventory
        if (!this.gameState.inventory[itemId]) {
            this.gameState.inventory[itemId] = 0;
        }
        this.gameState.inventory[itemId]++;

        // Apply item effects (if any)
        this.applyItemEffects(item);

        this.saveGameData();
        return { success: true };
    }

    applyItemEffects(item) {
        // Apply item effects based on item type
        // This can be expanded based on item properties
        if (item.category === 'consumables') {
            // Instant effects for consumables
            if (item.name.includes('Health')) {
                this.gameState.health = 100;
            }
            if (item.name.includes('Happiness')) {
                this.gameState.happiness = 100;
            }
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
}
