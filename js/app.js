// Click&Grow Premium v0.0.5-alpha - Main Application

class ClickAndGrowApp {
    constructor() {
        this.gameEngine = null;
        this.telegramIntegration = null;
        this.currentTheme = 'light';
        this.isInitialized = false;
        
        // Click&Grow Premium v0.0.5a starting
    }
    
    async init() {
        try {
            // Initializing Click&Grow Premium
            
            // Initialize Telegram integration first
            this.telegramIntegration = new TelegramIntegration();
            this.telegramIntegration.init();
            
            // Initialize game engine
            const userId = this.telegramIntegration?.getUserId?.() ?? 0;
            this.gameEngine = new GameEngine(userId);
            await this.gameEngine.init();
            
            // Expose for systems expecting window.app.gameEngine
            if (typeof window !== 'undefined') {
                window.app = window.app || {};
                window.app.gameEngine = this.gameEngine;
            }
            
            // Initialize UI manager with game engine
            this.gameEngine.uiManager = new UIManager(this.gameEngine);
            await this.gameEngine.uiManager.init();
            
            // Initialize particle system
            this.gameEngine.particleSystem.init();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load theme preference
            this.loadThemePreference();
            
            // Check if this is first time user
            this.checkFirstTimeUser();
            
            // Show the app
            this.showApp();
            
            // Update UI - now safe since UIManager is fully initialized
            if (this.gameEngine.uiManager && this.gameEngine.uiManager.isInitialized) {
                this.gameEngine.updateUI();
            }
            
            // Force update achievements
            this.gameEngine.achievementSystem.filterAchievements('all');
            
            this.isInitialized = true;
            // Click&Grow Premium initialized successfully
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showError('Failed to initialize app');
        }
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('clickgrow_theme') || 'light';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (this.gameEngine) {
            this.gameEngine.gameState.settings.darkMode = savedTheme === 'dark';
        }
        
        // Update toggle button icon/title
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            const icon = btn.querySelector('.btn-icon');
            if (icon) icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
            btn.title = savedTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark';
        }
        
        // Sync Telegram UI colors if available
        this.telegramIntegration?.updateThemeColors?.();
    }
    
    checkFirstTimeUser() {
        const hasSeenTutorial = localStorage.getItem('clickgrow_tutorial_completed');
        if (!hasSeenTutorial) {
            localStorage.setItem('clickgrow_tutorial_completed', 'true');
            this.gameEngine.uiManager.showActionFeedback('🌱 Welcome to Click&Grow Premium!');
        }
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
        
        // Show home tab by default
        this.gameEngine.uiManager.switchTab('home');
    }
    
    showError(message) {
        console.error('App Error:', message);
        if (this.telegramIntegration) {
            this.telegramIntegration.showAlert(`Error: ${message}`);
        }
    }
    
    loadGamesContent() {
        // Loading games content
        // Games content loading logic will be implemented here
        // For now, just log that it's called to prevent errors
    }
    
    loadChallengesContent() {
        // Loading challenges content
        // Challenges content loading logic will be implemented here
        // For now, just log that it's called to prevent errors
    }

    setupEventListeners() {
        // Settings modal
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            const closeBtn = settingsModal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.gameEngine.uiManager.hideSettings();
                });
            }
            
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
            const themeToggle = document.getElementById('theme-toggle-btn');
            if (themeToggle) {
                themeToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleTheme();
                });
            }
            
            // Event listeners setup complete
        }
    }
    
    async performAction(actionType) {
        if (!this.gameEngine) return;
        
        try {
            // Add haptic feedback
            this.telegramIntegration.impactOccurred('medium');
            
            // Call GameEngine performAction directly (UIManager doesn't have performAction method)
            this.gameEngine.performAction(actionType);
            
            // Add haptic feedback for success
            this.telegramIntegration.notificationOccurred('success');
            
        } catch (error) {
            console.error('Action failed:', error);
            this.gameEngine.uiManager.showActionFeedback('❌ Action failed!');
        }
    }
    
    // Deprecated: achievements header progress removed
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
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.currentTheme = newTheme;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('clickgrow_theme', newTheme);
        this.gameEngine.gameState.settings.darkMode = newTheme === 'dark';
        this.gameEngine.saveGameData();
        
        // Update toggle button icon/title
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            const icon = btn.querySelector('.btn-icon');
            if (icon) icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            btn.title = newTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark';
        }
        
        // Sync Telegram UI colors if available
        this.telegramIntegration?.updateThemeColors?.();
    }
}

// Global app instance
let app;

// Global test function
window.testAchievements = () => {
    if (app && app.gameEngine) {
        app.testAchievement();
    } else {
        // App not initialized
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    app = new ClickAndGrowApp();
    await app.init();
    
    // Load content for different tabs
    app.loadGamesContent();
    app.loadChallengesContent();
    
    // Make app globally available for debugging
    window.app = app;
    
    // Click&Grow Premium is ready
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
