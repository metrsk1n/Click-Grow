// Click&Grow Premium v0.0.5-alpha - Game Engine

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
            await this.challengeSystem.init();
            console.log('✅ GameEngine initialized with all systems');
        } catch (error) {
            console.error('❌ GameEngine initialization failed:', error);
            throw error;
        }
    }

    initializeGameState() {
        return {
            plantName: '',
            level: 1,
            experience: 0,
            coins: 100,
            gems: 0,
            happiness: 100,
            health: 100,
            lastWatered: Date.now(),
            lastFertilized: Date.now(),
            lastSunlight: Date.now(),
            totalExp: 0,
            totalCoinsEarned: 0,
            actionCounts: {
                water: 0,
                fertilizer: 0,
                sunlight: 0
            },
            minigamesCompleted: 0,
            consecutiveDays: 1,
            happinessStreakHours: 0,
            lastPlayDate: new Date().toDateString(),
            inventory: {
                superFertilizer: 0,
                growthBooster: 0,
                happinessPotion: 0,
                experienceMultiplier: 0,
                coinMultiplier: 0
            },
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
                price: 150,
                currency: 'coins',
                category: 'boosters'
            },
            growthBooster: {
                name: 'Growth Booster',
                description: 'Increases XP gain by 50% for 30 minutes',
                icon: '⚡',
                price: 200,
                currency: 'coins',
                category: 'boosters'
            },
            happinessPotion: {
                name: 'Happiness Potion',
                description: 'Instantly restores happiness to 100%',
                icon: '😊',
                price: 100,
                currency: 'coins',
                category: 'consumables'
            },
            experienceMultiplier: {
                name: 'XP Multiplier',
                description: 'Double XP for 2 hours',
                icon: '⭐',
                price: 2,
                currency: 'gems',
                category: 'premium'
            },
            coinMultiplier: {
                name: 'Coin Multiplier',
                description: 'Double coin rewards for 2 hours',
                icon: '💰',
                price: 3,
                currency: 'gems',
                category: 'premium'
            },
            rainbowSeed: {
                name: 'Rainbow Seed',
                description: 'Special seed that grows faster',
                icon: '🌈',
                price: 5,
                currency: 'gems',
                category: 'premium'
            },
            timeAccelerator: {
                name: 'Time Accelerator',
                description: 'Reduces cooldowns by 50% for 1 hour',
                icon: '⏰',
                price: 1,
                currency: 'gems',
                category: 'premium'
            }
        };
    }

    loadGameData() {
        const savedData = this.storage.get('gameState');
        if (savedData) {
            // Merge saved data with default state
            this.gameState = { ...this.gameState, ...savedData };
            
            // Ensure new properties exist
            if (!this.gameState.challenges) {
                this.gameState.challenges = {
                    completed: [],
                    progress: {},
                    lastReset: {
                        daily: Date.now(),
                        weekly: Date.now(),
                        monthly: Date.now()
                    }
                };
            }
            
            if (!this.gameState.settings.particlesEnabled) {
                this.gameState.settings.particlesEnabled = true;
            }
        }
        
        // Load theme preference
        const savedTheme = this.storage.get('theme', 'light');
        this.gameState.settings.darkMode = savedTheme === 'dark';
        
        console.log('📊 Game data loaded');
    }

    saveGameData() {
        this.storage.set('gameState', this.gameState);
        this.storage.set('theme', this.gameState.settings.darkMode ? 'dark' : 'light');
        console.log('💾 Game data saved');
    }

    async performAction(actionType) {
        const now = Date.now();
        const cooldownTimes = {
            water: 30000,    // 30 seconds
            fertilizer: 60000, // 1 minute
            sunlight: 45000   // 45 seconds
        };

        const lastActionTime = this.gameState[`last${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`];
        const timeSinceLastAction = now - lastActionTime;

        if (timeSinceLastAction < cooldownTimes[actionType]) {
            const remainingTime = cooldownTimes[actionType] - timeSinceLastAction;
            this.uiManager.showActionFeedback(`⏰ ${actionType} is on cooldown! Wait ${Math.ceil(remainingTime / 1000)}s`);
            return { success: false, reason: 'cooldown' };
        }

        // Start minigame for the action
        const minigameResult = await this.minigameSystem.startGame(actionType);
        
        if (minigameResult.success) {
            this.processActionResult(actionType, minigameResult.score);
            
            // Update challenge progress
            this.challengeSystem.updateChallengeProgress(actionType, 1);
            
            // Update last action time
            this.gameState[`last${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`] = now;
            this.gameState.actionCounts[actionType]++;
            
            this.saveGameData();
            this.updateUI();
            
            return { success: true, score: minigameResult.score };
        } else {
            this.uiManager.showActionFeedback(`❌ ${actionType} action failed!`);
            return { success: false, reason: 'minigame_failed' };
        }
    }

    processActionResult(actionType, score) {
        const baseRewards = {
            water: { exp: 10, coins: 5, happiness: 5 },
            fertilizer: { exp: 15, coins: 8, happiness: 3 },
            sunlight: { exp: 12, coins: 6, happiness: 4 }
        };

        const baseReward = baseRewards[actionType];
        const multiplier = 1 + (score / 100); // Score affects reward multiplier

        const expGain = Math.floor(baseReward.exp * multiplier);
        const coinGain = Math.floor(baseReward.coins * multiplier);
        const happinessGain = Math.floor(baseReward.happiness * multiplier);

        // Apply boosters if active
        const activeBoosters = this.getActiveBoosters();
        const finalExpGain = Math.floor(expGain * activeBoosters.expMultiplier);
        const finalCoinGain = Math.floor(coinGain * activeBoosters.coinMultiplier);

        // Add rewards
        this.addExperience(finalExpGain);
        this.addCoins(finalCoinGain);
        this.gameState.happiness = Math.min(100, this.gameState.happiness + happinessGain);

        // Show feedback
        const feedback = `+${finalExpGain} XP +${finalCoinGain} 💰 +${happinessGain} 😊`;
        this.uiManager.showActionFeedback(feedback);

        // Check for level up
        this.checkLevelUp();

        // Check achievements
        this.achievementSystem.checkAchievements(this.gameState);

        // Create particles
        if (this.gameState.settings.particlesEnabled) {
            this.particleSystem.createParticles(actionType, 50, 50);
        }
    }

    getActiveBoosters() {
        const boosters = { expMultiplier: 1, coinMultiplier: 1 };
        
        // Check for active boosters in inventory
        if (this.gameState.inventory.experienceMultiplier > 0) {
            boosters.expMultiplier = 2;
        }
        if (this.gameState.inventory.coinMultiplier > 0) {
            boosters.coinMultiplier = 2;
        }
        
        return boosters;
    }

    checkLevelUp() {
        const currentLevel = this.gameState.level;
        const requiredExp = this.getRequiredExpForLevel(currentLevel + 1);
        
        if (this.gameState.experience >= requiredExp && currentLevel < 240) {
            this.gameState.level++;
            this.gameState.experience -= requiredExp;
            
            // Level up rewards
            const levelRewards = this.getLevelRewards(currentLevel + 1);
            this.addCoins(levelRewards.coins);
            this.addGems(levelRewards.gems);
            
            // Show level up notification
            this.uiManager.showLevelUpNotification(currentLevel + 1, levelRewards);
            
            // Update plant visual
            this.plantRenderer.updatePlantVisual(currentLevel + 1);
            
            // Check achievements
            this.achievementSystem.checkAchievements(this.gameState);
            
            console.log(`🎉 Level up! Now level ${currentLevel + 1}`);
        }
    }

    getRequiredExpForLevel(level) {
        // Progressive difficulty: each level requires more XP
        if (level <= 10) return level * 100;
        if (level <= 25) return level * 150;
        if (level <= 50) return level * 200;
        if (level <= 100) return level * 300;
        if (level <= 150) return level * 400;
        if (level <= 200) return level * 500;
        return level * 600; // Levels 201-240
    }

    getLevelRewards(level) {
        const baseCoins = Math.floor(level * 10);
        const baseGems = Math.floor(level / 10);
        
        return {
            coins: baseCoins,
            gems: baseGems
        };
    }

    purchaseShopItem(itemId) {
        const item = this.shopItems[itemId];
        if (!item) return { success: false, reason: 'item_not_found' };

        const currency = item.currency === 'gems' ? 'gems' : 'coins';
        const currentAmount = this.gameState[currency];

        if (currentAmount < item.price) {
            return { success: false, reason: 'insufficient_funds' };
        }

        // Purchase item
        this.gameState[currency] -= item.price;
        this.gameState.inventory[itemId]++;

        this.saveGameData();
        this.updateUI();

        this.uiManager.showActionFeedback(`✅ Purchased ${item.name}!`);
        return { success: true };
    }

    useItem(itemId) {
        if (this.gameState.inventory[itemId] <= 0) {
            return { success: false, reason: 'no_items' };
        }

        this.gameState.inventory[itemId]--;
        
        // Apply item effects
        switch (itemId) {
            case 'happinessPotion':
                this.gameState.happiness = 100;
                this.uiManager.showActionFeedback('😊 Happiness restored to 100%!');
                break;
            case 'superFertilizer':
                // Apply fertilizer boost for 1 hour
                this.uiManager.showActionFeedback('🧪 Super fertilizer active for 1 hour!');
                break;
            case 'growthBooster':
                // Apply XP boost for 30 minutes
                this.uiManager.showActionFeedback('⚡ Growth booster active for 30 minutes!');
                break;
        }

        this.saveGameData();
        this.updateUI();
        return { success: true };
    }

    toggleDarkMode(force = null) {
        const newMode = force !== null ? force : !this.gameState.settings.darkMode;
        this.gameState.settings.darkMode = newMode;
        
        document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
        this.saveGameData();
        
        console.log(`🌙 Dark mode ${newMode ? 'enabled' : 'disabled'}`);
    }

    openBuyMeCoffee() {
        // Placeholder for future implementation
        this.uiManager.showActionFeedback('☕ Buy Me a Coffee - Coming Soon!');
    }

    awardAchievementRewards(achievement) {
        if (achievement.reward.coins) {
            this.addCoins(achievement.reward.coins);
        }
        if (achievement.reward.exp) {
            this.addExperience(achievement.reward.exp);
        }
        if (achievement.reward.gems) {
            this.addGems(achievement.reward.gems);
        }
    }

    updateUI() {
        // Update all UI elements
        this.uiManager.updateAllDisplays(this.gameState);
        
        // Update challenge system UI
        this.challengeSystem.updateUI();
    }

    addExperience(amount) {
        this.gameState.experience += amount;
        this.gameState.totalExp += amount;
    }

    addCoins(amount) {
        this.gameState.coins += amount;
        this.gameState.totalCoinsEarned += amount;
    }

    addGems(amount) {
        this.gameState.gems += amount;
    }

    setLevel(level) {
        if (level >= 1 && level <= 240) {
            this.gameState.level = level;
            this.plantRenderer.updatePlantVisual(level);
            this.updateUI();
        }
    }

    getGameState() {
        return this.gameState;
    }

    getShopItems() {
        return this.shopItems;
    }

    resetGame() {
        this.gameState = this.initializeGameState();
        this.achievementSystem.resetAchievements();
        this.challengeSystem.resetAllChallenges();
        this.saveGameData();
        this.updateUI();
        console.log('🔄 Game reset');
    }
}

// Export
if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
}
