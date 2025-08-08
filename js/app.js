// Click&Grow Premium v0.0.5-alpha - Main Application

class ClickAndGrowApp {
    constructor() {
        this.gameEngine = null;
        this.telegramIntegration = null;
        this.currentTheme = 'light';
        this.isInitialized = false;
        
        console.log('🌱 Click&Grow Premium v1.0.0 starting...');
    }
    
    async init() {
        try {
            // Initialize Telegram integration first
            this.telegramIntegration = new TelegramIntegration();
            this.telegramIntegration.init();
            
            // Initialize game engine
            this.gameEngine = new GameEngine();
            await this.gameEngine.init();
            
            // Initialize UI manager with game engine
            this.gameEngine.uiManager = new UIManager(this.gameEngine);
            await this.gameEngine.uiManager.init();
            
            // Initialize particle system
            this.gameEngine.particleSystem.init();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load theme preference
            this.loadThemePreference();
            
            // Show the app
            this.showApp();
            
            // Update UI
            this.gameEngine.updateUI();
            
            this.isInitialized = true;
            console.log('✅ Click&Grow Premium initialized successfully');
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showError('Failed to initialize app');
        }
    }
    
    setupEventListeners() {
        // Action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const actionType = btn.dataset.action;
                if (actionType) {
                    await this.performAction(actionType);
                }
            });
        });
        
        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-tab');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = btn.dataset.tab;
                if (tabName) {
                    this.gameEngine.uiManager.switchTab(tabName);
                }
            });
        });
        
        // Theme toggle button
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.gameEngine.uiManager.showSettings();
            });
        }
        
        // Theme toggle in settings
        const themeToggle = document.getElementById('dark-theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                this.toggleTheme();
            });
        }
        
        // Buy me coffee button
        const buyMeCoffeeBtn = document.getElementById('buy-coffee-btn');
        if (buyMeCoffeeBtn) {
            buyMeCoffeeBtn.addEventListener('click', () => {
                this.showBuyMeCoffeeModal();
            });
        }
        
        // Reset game button
        const resetGameBtn = document.getElementById('reset-game-btn');
        if (resetGameBtn) {
            resetGameBtn.addEventListener('click', () => {
                this.showResetConfirmation();
            });
        }
        
        // Export data button
        const exportDataBtn = document.getElementById('export-data-btn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportGameData();
            });
        }
        
        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', () => {
                this.gameEngine.gameState.settings.soundEnabled = soundToggle.checked;
                this.gameEngine.saveGameData();
            });
        }
        
        // Notifications toggle
        const notificationsToggle = document.getElementById('notifications-toggle');
        if (notificationsToggle) {
            notificationsToggle.addEventListener('change', () => {
                this.gameEngine.gameState.settings.notifications = notificationsToggle.checked;
                this.gameEngine.saveGameData();
            });
        }
        
        // Particles toggle
        const particlesToggle = document.getElementById('particles-toggle');
        if (particlesToggle) {
            particlesToggle.addEventListener('change', () => {
                this.gameEngine.gameState.settings.particlesEnabled = particlesToggle.checked;
                this.gameEngine.saveGameData();
            });
        }
        
        // Settings modal
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            const closeBtn = settingsModal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.gameEngine.uiManager.hideSettings();
                });
            }
        }
        
        // Coffee modal
        const coffeeModal = document.getElementById('coffee-modal');
        if (coffeeModal) {
            const closeBtn = coffeeModal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.hideBuyMeCoffeeModal();
                });
            }
        }
        
        // Game modal
        const gameModal = document.getElementById('game-modal');
        if (gameModal) {
            const closeBtn = gameModal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.gameEngine.minigameSystem.hideGameModal();
                });
            }
        }
        
        // Shop category buttons
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = btn.dataset.category;
                if (category) {
                    this.gameEngine.uiManager.filterShopItems(category);
                }
            });
        });
        
        // Game cards
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const gameId = card.dataset.game;
                if (gameId) {
                    this.gameEngine.minigameSystem.startGame(gameId);
                }
            });
        });
        
        // Achievement categories
        const achievementCategories = document.querySelectorAll('.achievement-category');
        achievementCategories.forEach(category => {
            category.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryType = category.dataset.category;
                
                // Update active category
                achievementCategories.forEach(c => c.classList.remove('active'));
                category.classList.add('active');
                
                // Filter achievements (to be implemented)
                if (this.gameEngine && this.gameEngine.achievementSystem) {
                    this.gameEngine.achievementSystem.filterAchievements(categoryType);
                }
            });
        });
        
        // Garden plot buttons
        const plotButtons = document.querySelectorAll('.plot-btn');
        plotButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!btn.classList.contains('disabled')) {
                    const plot = btn.closest('.garden-plot');
                    if (plot && plot.classList.contains('active')) {
                        // Focus on this plot
                        this.focusOnPlot(plot);
                    }
                }
            });
        });
        
        // Challenge buttons (delegated event handling)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('challenge-btn')) {
                e.preventDefault();
                const challengeId = e.target.dataset.challengeId;
                const action = e.target.dataset.action;
                
                if (challengeId && action) {
                    if (action === 'start') {
                        this.startChallenge(challengeId);
                    } else if (action === 'details') {
                        this.viewChallengeDetails(challengeId);
                    }
                }
            }
        });
        
        console.log('🔗 Event listeners setup complete');
    }
    
    async performAction(actionType) {
        if (!this.gameEngine) return;
        
        try {
            // Add haptic feedback
            this.telegramIntegration.impactOccurred('medium');
            
            const result = await this.gameEngine.performAction(actionType);
            
            if (result.success) {
                // Add haptic feedback for success
                this.telegramIntegration.notificationOccurred('success');
            } else {
                // Add haptic feedback for failure
                this.telegramIntegration.impactOccurred('heavy');
            }
            
        } catch (error) {
            console.error('Action failed:', error);
            this.gameEngine.uiManager.showActionFeedback('❌ Action failed!');
        }
    }
    
    loadThemePreference() {
        const savedTheme = localStorage.getItem('clickgrow_theme') || 'light';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeButton();
        
        if (this.gameEngine) {
            this.gameEngine.gameState.settings.darkMode = savedTheme === 'dark';
        }
    }
    
    toggleTheme() {
        // Add visual feedback during theme switch
        document.documentElement.classList.add('theme-switching');
        
        // Toggle theme
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('clickgrow_theme', this.currentTheme);
        
        // Update UI elements
        this.updateThemeButton();
        
        // Update game engine settings
        if (this.gameEngine) {
            this.gameEngine.gameState.settings.darkMode = this.currentTheme === 'dark';
            this.gameEngine.saveGameData();
        }
        
        // Update Telegram integration if available
        if (this.telegramIntegration) {
            this.telegramIntegration.updateThemeColors();
        }
        
        // Remove switching class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-switching');
        }, 300);
        
        console.log(`🌙 Theme switched to: ${this.currentTheme}`);
    }
    
    updateThemeButton() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('.btn-icon');
            
            // Add animation class
            themeBtn.classList.add('theme-btn-switching');
            
            // Update icon and title
            if (this.currentTheme === 'dark') {
                icon.textContent = '☀️';
                themeBtn.title = 'Switch to Light Mode';
                themeBtn.classList.add('dark-mode');
                themeBtn.classList.remove('light-mode');
            } else {
                icon.textContent = '🌙';
                themeBtn.title = 'Switch to Dark Mode';
                themeBtn.classList.add('light-mode');
                themeBtn.classList.remove('dark-mode');
            }
            
            // Remove animation class after transition
            setTimeout(() => {
                themeBtn.classList.remove('theme-btn-switching');
            }, 300);
        }
    }
    
    loadGamesContent() {
        const gamesContainer = document.querySelector('.games-content');
        if (!gamesContainer) return;
        
        const games = [
            {
                id: 'water',
                name: 'Precision Watering',
                description: 'Click when the water drop is over the plant!',
                icon: '💧',
                difficulty: 1,
                reward: '5 coins'
            },
            {
                id: 'fertilizer',
                name: 'Fertilizer Mix',
                description: 'Match the fertilizer recipe pattern!',
                icon: '🌿',
                difficulty: 2,
                reward: '8 coins'
            },
            {
                id: 'sunlight',
                name: 'Sunlight Focus',
                description: 'Guide the sunlight beam to the plant!',
                icon: '☀️',
                difficulty: 2,
                reward: '6 coins'
            }
        ];
        
        gamesContainer.innerHTML = `
            <div class="games-header">
                <h2>🎮 Mini-Games</h2>
                <p>Complete challenges to earn extra rewards!</p>
            </div>
            <div class="games-grid">
                ${games.map(game => `
                    <div class="game-card" data-game="${game.id}">
                        <div class="game-icon">${game.icon}</div>
                        <div class="game-info">
                            <div class="game-name">${game.name}</div>
                            <div class="game-description">${game.description}</div>
                            <div class="game-stats">
                                <div class="game-difficulty">
                                    ${Array(3).fill().map((_, i) => 
                                        `<div class="difficulty-dot ${i < game.difficulty ? 'active' : ''}"></div>`
                                    ).join('')}
                                </div>
                                <div class="game-reward">${game.reward}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add click handlers for game cards
        const gameCards = gamesContainer.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.dataset.game;
                this.startGame(gameId);
            });
        });
    }
    
    loadChallengesContent() {
        const challengesContainer = document.querySelector('.challenges-content');
        if (!challengesContainer) return;
        
        challengesContainer.innerHTML = `
            <div class="challenges-header">
                <h2>🎯 Challenges</h2>
                <p>Complete daily and weekly challenges for rewards!</p>
            </div>
            <div class="challenges-list">
                <!-- Challenges will be populated by ChallengeSystem -->
            </div>
        `;
        
        // Update challenges from the system
        this.gameEngine.challengeSystem.updateUI();
    }
    
    startGame(gameId) {
        if (!this.gameEngine || !this.gameEngine.minigameSystem) {
            console.error('Game engine or minigame system not available');
            return;
        }
        
        this.gameEngine.minigameSystem.startGame(gameId);
    }
    
    showGameModal(gameId) {
        const gameModal = document.getElementById('game-modal');
        if (!gameModal) return;
        
        const gameConfig = this.gameEngine.minigameSystem.gameConfigs[gameId];
        if (!gameConfig) return;
        
        gameModal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>${gameConfig.icon} ${gameConfig.name}</h3>
                            <button class="close-btn">&times;</button>
                        </div>
                        <div class="game-instructions">
                            <div class="instructions-title">How to Play</div>
                            <div class="instructions-text">${gameConfig.description}</div>
                        </div>
                        <div class="game-controls">
                            <button class="game-btn primary" onclick="app.startMinigame('${gameId}')">Start Game</button>
                            <button class="game-btn secondary" onclick="app.hideGameModal()">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        gameModal.classList.add('active');
        
        // Add close handler
        const closeBtn = gameModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.gameEngine.minigameSystem.hideGameModal();
            });
        }
    }
    
    hideGameModal() {
        const gameModal = document.getElementById('game-modal');
        if (gameModal) {
            gameModal.classList.remove('active');
        }
    }
    
    async startMinigame(gameId) {
        this.hideGameModal();
        
        try {
            const result = await this.gameEngine.minigameSystem.startMinigame(gameId);
            
            if (result.success) {
                // Update game state
                this.gameEngine.gameState.minigamesCompleted++;
                
                // Update challenge progress
                this.gameEngine.challengeSystem.updateChallengeProgress('minigame', 1);
                
                // Save and update
                this.gameEngine.saveGameData();
                this.gameEngine.updateUI();
                
                // Show success feedback
                this.gameEngine.uiManager.showActionFeedback(`🎮 Game completed! +${result.score} points`);
            }
            
        } catch (error) {
            console.error('Minigame failed:', error);
            this.gameEngine.uiManager.showActionFeedback('❌ Game failed to start');
        }
    }
    
    startChallenge(challengeId) {
        if (!this.gameEngine || !this.gameEngine.challengeSystem) {
            console.error('Game engine or challenge system not available');
            return;
        }
        
        const challenge = this.gameEngine.challengeSystem.getChallenge(challengeId);
        if (!challenge) {
            console.error('Challenge not found:', challengeId);
            return;
        }
        
        this.gameEngine.challengeSystem.startChallenge(challengeId);
    }
    
    viewChallengeDetails(challengeId) {
        if (!this.gameEngine || !this.gameEngine.challengeSystem) {
            console.error('Game engine or challenge system not available');
            return;
        }
        
        const challenge = this.gameEngine.challengeSystem.getChallenge(challengeId);
        if (!challenge) {
            console.error('Challenge not found:', challengeId);
            return;
        }
        
        const progress = this.gameEngine.challengeSystem.getChallengeProgress(challengeId);
        const timeLeft = this.gameEngine.challengeSystem.getTimeLeft(challengeId);
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${challenge.icon} ${challenge.name}</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="challenge-details">
                        <p>${challenge.description}</p>
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
                    </div>
                    <div class="challenge-actions">
                        <button class="challenge-btn primary" onclick="app.gameEngine.challengeSystem.startChallenge('${challenge.id}')">Start Challenge</button>
                        <button class="challenge-btn secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close handler
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
        }
    }
    
    showBuyMeCoffeeModal() {
        const coffeeModal = document.getElementById('coffee-modal');
        if (coffeeModal) {
            coffeeModal.classList.add('active');
        }
    }
    
    hideBuyMeCoffeeModal() {
        const coffeeModal = document.getElementById('coffee-modal');
        if (coffeeModal) {
            coffeeModal.classList.remove('active');
        }
    }
    
    handleCoffeeNotification() {
        this.telegramIntegration.showPopup(
            'Buy Me a Coffee',
            'Support the development of Click&Grow Premium! ☕\n\nComing soon...',
            [
                { text: 'OK', type: 'ok' }
            ]
        );
    }
    
    exportGameData() {
        const gameData = this.gameEngine.getGameState();
        const dataStr = JSON.stringify(gameData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `clickgrow-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.gameEngine.uiManager.showActionFeedback('📁 Game data exported!');
    }
    
    showResetConfirmation() {
        this.telegramIntegration.showConfirm(
            'Reset Game Data',
            'Are you sure you want to reset all your progress? This action cannot be undone.',
            (confirmed) => {
                if (confirmed) {
                    this.gameEngine.resetGame();
                    this.gameEngine.uiManager.showActionFeedback('🔄 Game reset successfully!');
                }
            }
        );
    }
    
    showApp() {
        const app = document.getElementById('app');
        if (app) {
            app.style.display = 'block';
        }
        
        // Hide loading screen
        const loading = document.querySelector('.loading-screen');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    showError(message) {
        console.error('App Error:', message);
        this.telegramIntegration.showAlert(`Error: ${message}`);
    }
    
    // Debug methods
    debug() {
        console.log('=== DEBUG INFO ===');
        console.log('Game State:', this.gameEngine.getGameState());
        console.log('Theme:', this.currentTheme);
        console.log('Telegram Ready:', this.telegramIntegration.isReady());
        console.log('User:', this.telegramIntegration.getUserData());
        console.log('Platform:', this.telegramIntegration.getPlatform());
        console.log('==================');
    }
    
    // Test methods
    testAction() {
        this.performAction('water');
    }
    
    testAchievement() {
        this.gameEngine.uiManager.testAchievement();
    }
    
    testLevelUp() {
        this.gameEngine.setLevel(this.gameEngine.gameState.level + 1);
    }
    
    testParticles() {
        this.gameEngine.particleSystem.createExplosion(100, 100, 'levelup');
    }
    
    focusOnPlot(plot) {
        // Add visual feedback
        plot.style.transform = 'scale(1.05)';
        plot.style.boxShadow = 'var(--shadow-glow)';
        
        setTimeout(() => {
            plot.style.transform = '';
            plot.style.boxShadow = '';
        }, 300);
        
        // Show feedback
        this.gameEngine.uiManager.showActionFeedback('🌱 Focused on main plant!');
        
        // Switch to home tab
        this.gameEngine.uiManager.switchTab('home');
    }
    
    updateGardenStats() {
        const gardenPlants = document.getElementById('garden-plants');
        const gardenVarieties = document.getElementById('garden-varieties');
        const gardenHealth = document.getElementById('garden-health');
        
        if (gardenPlants) gardenPlants.textContent = this.gameEngine.gameState.level;
        if (gardenVarieties) gardenVarieties.textContent = '1'; // For now
        if (gardenHealth) gardenHealth.textContent = this.gameEngine.gameState.health + '%';
    }
    
    updateAchievementProgress() {
        const progressFill = document.getElementById('achievement-progress-fill');
        const unlocked = document.getElementById('achievements-unlocked');
        const total = document.getElementById('achievements-total');
        
        if (this.gameEngine && this.gameEngine.achievementSystem) {
            const achievements = this.gameEngine.achievementSystem.getAchievements();
            const unlockedCount = achievements.filter(a => a.unlocked).length;
            const totalCount = achievements.length;
            
            if (unlocked) unlocked.textContent = unlockedCount;
            if (total) total.textContent = totalCount;
            if (progressFill) {
                const percentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
                progressFill.style.width = percentage + '%';
            }
        }
    }
}

// Global app instance
let app;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    app = new ClickAndGrowApp();
    await app.init();
    
    // Load content for different tabs
    app.loadGamesContent();
    app.loadChallengesContent();
    
    // Make app globally available for debugging
    window.app = app;
    
    console.log('🚀 Click&Grow Premium is ready!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && app && app.isInitialized) {
        // Refresh challenges when page becomes visible
        app.gameEngine.challengeSystem.checkResets();
        app.gameEngine.updateUI();
    }
});

// Handle beforeunload
window.addEventListener('beforeunload', () => {
    if (app && app.gameEngine) {
        app.gameEngine.saveGameData();
    }
});

// Export for global access
if (typeof window !== 'undefined') {
    window.ClickAndGrowApp = ClickAndGrowApp;
}
