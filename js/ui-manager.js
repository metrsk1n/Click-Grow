// Click&Grow Premium v0.0.5-alpha - UI Manager

class UIManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.currentTab = 'plant';
        this.isInitialized = false;
        
        console.log('🎨 UIManager created');
    }
    
    async init() {
        try {
            // Initialize UI state
            this.setupInitialState();
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ UIManager initialized');
            
        } catch (error) {
            console.error('❌ UIManager initialization failed:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        // Tab switching
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Theme toggles are managed in app.js (theme-toggle-btn, dark-theme-toggle)

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

        // Modal close buttons
        const closeButtons = document.querySelectorAll('.close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // If closing game modal, ensure proper teardown via MinigameSystem
                const gameModal = document.getElementById('game-modal');
                if (gameModal && gameModal.classList.contains('active')) {
                    this.gameEngine.minigameSystem.hideGameModal();
                } else {
                    this.closeAllModals();
                }
            });
        });

        // Modal overlays
        const modalOverlays = document.querySelectorAll('.modal-overlay');
        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    if (overlay.id === 'game-modal') {
                        // Use system method to stop timers and resolve promises
                        this.gameEngine.minigameSystem.hideGameModal();
                    } else {
                        overlay.classList.remove('active');
                    }
                }
            });
        });

        // ESC key closes active modal; game modal via MinigameSystem
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const gameModal = document.getElementById('game-modal');
                if (gameModal && gameModal.classList.contains('active')) {
                    this.gameEngine.minigameSystem.hideGameModal();
                    return;
                }
                this.closeAllModals();
            }
        });

        // Delegated actions: data-action for robust button wiring
        document.addEventListener('click', (e) => {
            const actionEl = e.target.closest('[data-action]');
            if (!actionEl) return;
            const action = actionEl.getAttribute('data-action');
            switch (action) {
                case 'open-settings':
                    this.showSettings();
                    break;
                case 'close-settings':
                    this.hideSettings();
                    break;
                case 'close-game':
                    if (this.gameEngine?.minigameSystem) {
                        this.gameEngine.minigameSystem.hideGameModal();
                    }
                    break;
                case 'close-coffee': {
                    const coffee = document.getElementById('coffee-modal');
                    if (coffee) coffee.classList.remove('active');
                    break;
                }
                case 'toggle-theme':
                    if (this.gameEngine?.toggleDarkMode) {
                        this.gameEngine.toggleDarkMode();
                    }
                    break;
                case 'switch-tab': {
                    const tab = actionEl.dataset.tab;
                    if (tab) this.switchTab(tab);
                    break;
                }
                case 'start-game': {
                    const game = actionEl.dataset.game;
                    if (game && this.gameEngine?.minigameSystem) {
                        this.gameEngine.minigameSystem.startGame(game);
                    }
                    break;
                }
                default:
                    break;
            }
        });

        console.log('🔗 UI event listeners setup');
    }
    
    setupInitialState() {
        // Hide app initially (will be shown after loading)
        const app = document.getElementById('app');
        if (app) {
            app.style.display = 'none';
        }
        
        // Set initial tab
        this.switchTab('plant');
        
        // Apply saved theme
        const savedTheme = localStorage.getItem('clickgrow_theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            const darkThemeToggle = document.getElementById('dark-theme-toggle');
            if (darkThemeToggle) {
                darkThemeToggle.checked = true;
            }
        }
        
        // Apply saved settings
        const savedSettings = localStorage.getItem('clickgrow_settings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                
                const soundToggle = document.getElementById('sound-toggle');
                if (soundToggle) {
                    soundToggle.checked = settings.soundEnabled !== false;
                }
                
                const notificationsToggle = document.getElementById('notifications-toggle');
                if (notificationsToggle) {
                    notificationsToggle.checked = settings.notifications !== false;
                }


            } catch (error) {
                console.warn('Failed to apply saved settings:', error);
            }
        }
    }
    
    switchTab(tabName) {
        // Update navigation
        const navButtons = document.querySelectorAll('.nav-tab');
        navButtons.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update content sections
        const contentSections = document.querySelectorAll('.tab-content');
        contentSections.forEach(section => {
            if (section.id === `${tabName}-tab`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        this.currentTab = tabName;
        console.log(`📱 Switched to tab: ${tabName}`);
    }
    
    showSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.add('active');
            console.log('⚙️ Settings modal opened');
        }
    }
    
    hideSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.remove('active');
            console.log('⚙️ Settings modal closed');
        }
    }
    
    closeAllModals() {
        // Prefer proper teardown for game modal
        const gameModal = document.getElementById('game-modal');
        if (gameModal && gameModal.classList.contains('active')) {
            this.gameEngine.minigameSystem.hideGameModal();
        }

        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            if (modal.id !== 'game-modal') {
                modal.classList.remove('active');
            }
        });
        console.log('❌ All modals closed');
    }
    
    showActionFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = `action-feedback ${type}`;
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2000);
        
        console.log(`💬 Action feedback: ${message}`);
    }
    
    showAchievementToast(title, description) {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <div class="achievement-title">${title}</div>
                <div class="achievement-description">${description}</div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
        
        console.log(`🏆 Achievement unlocked: ${title}`);
    }

    showLevelUpNotification(level, rewards) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-icon">🎉</div>
            <div class="level-up-content">
                <div class="level-up-title">Level Up!</div>
                <div class="level-up-level">Level ${level}</div>
                <div class="level-up-rewards">
                    +${rewards.coins} 💰
                    ${rewards.gems > 0 ? `+${rewards.gems} 💎` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        console.log(`🎉 Level up notification: Level ${level}`);
    }
    
    updatePlantVisual(level) {
        const plantContainer = document.querySelector('.plant-visual');
        if (plantContainer && this.gameEngine.plantRenderer) {
            this.gameEngine.plantRenderer.renderPlant(level, plantContainer);
        }
        console.log(`Plant visual updated to level ${level}`);
    }
    
    updateAllDisplays(gameState) {
        // Update resource displays
        this.updateResourceDisplay('experience', gameState.experience);
        this.updateResourceDisplay('coins', gameState.coins);
        this.updateResourceDisplay('gems', gameState.gems);
        
        // Update level display
        const levelElement = document.querySelector('.plant-level');
        if (levelElement) {
            levelElement.textContent = `Level ${gameState.level}`;
        }
        
        // Update progress bar
        this.updateProgressBar(gameState);
        
        // Update plant stats
        this.updatePlantStats(gameState);
        
        // Update plant visual
        this.updatePlantVisual(gameState.level);
        
        // Update shop items
        this.updateShopItems();
        
        // Update achievements
        this.updateAchievements();
    }

    updateResourceDisplay(resource, value) {
        const element = document.querySelector(`[data-resource="${resource}"]`);
        if (element) {
            element.textContent = this.formatNumber(value);
        }
    }

    updateProgressBar(gameState) {
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            const requiredExp = this.gameEngine.getRequiredExpForLevel(gameState.level + 1);
            const progress = gameState.level >= 240 ? 100 : (gameState.experience / requiredExp) * 100;
            progressBar.style.width = `${Math.min(100, progress)}%`;
        }
    }

    updatePlantStats(gameState) {
        const happinessElement = document.querySelector('.plant-happiness');
        const healthElement = document.querySelector('.plant-health');
        
        if (happinessElement) {
            happinessElement.textContent = `Happiness: ${gameState.happiness}%`;
        }
        if (healthElement) {
            healthElement.textContent = `Health: ${gameState.health}%`;
        }
    }

    updateShopItems() {
        const shopItems = this.gameEngine.getShopItems();
        const shopContainer = document.querySelector('.shop-items');
        
        if (shopContainer) {
            shopContainer.innerHTML = '';
            
            Object.entries(shopItems).forEach(([id, item]) => {
                const itemElement = this.createShopItemElement(id, item);
                shopContainer.appendChild(itemElement);
            });
        }
    }

    createShopItemElement(id, item) {
        const element = document.createElement('div');
        element.className = 'shop-item';
        element.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
            </div>
            <div class="item-price">
                <span class="price-value">${item.price}</span>
                <span class="price-currency">${item.currency === 'gems' ? '💎' : '💰'}</span>
            </div>
            <button class="buy-btn" data-item="${id}">Buy</button>
        `;
        
        // Add click handler
        const buyBtn = element.querySelector('.buy-btn');
        buyBtn.addEventListener('click', () => {
            const result = this.gameEngine.purchaseShopItem(id);
            if (!result.success) {
                this.showActionFeedback(`❌ ${result.reason === 'insufficient_funds' ? 'Not enough funds!' : 'Purchase failed!'}`);
            }
        });
        
        return element;
    }

    updateAchievements() {
        const achievements = this.gameEngine.achievementSystem.getAllAchievements();
        const achievementsContainer = document.querySelector('.achievements-grid');
        
        if (achievementsContainer) {
            achievementsContainer.innerHTML = '';
            
            achievements.forEach(achievement => {
                const achievementElement = this.createAchievementElement(achievement);
                achievementsContainer.appendChild(achievementElement);
            });
        }
    }

    createAchievementElement(achievement) {
        const isUnlocked = this.gameEngine.achievementSystem.isUnlocked(achievement.id);
        const progress = this.gameEngine.achievementSystem.getAchievementProgress(achievement.id, this.gameEngine.getGameState());
        
        const element = document.createElement('div');
        element.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        element.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                    <span class="progress-text">${progress.current}/${progress.target}</span>
                </div>
            </div>
            <div class="achievement-reward">
                ${achievement.reward.coins ? `+${achievement.reward.coins} 💰` : ''}
                ${achievement.reward.exp ? `+${achievement.reward.exp} ⭐` : ''}
                ${achievement.reward.gems ? `+${achievement.reward.gems} 💎` : ''}
            </div>
        `;
        
        return element;
    }
    
    animateElement(element, animationClass, duration = 1000) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    // Debug methods
    testFeedback() {
        this.showActionFeedback('Test feedback message', 'success');
    }
    
    testAchievement() {
        this.showAchievementToast('Test Achievement', 'This is a test achievement description');
    }
    
    testPlantVisual() {
        this.updatePlantVisual(Math.floor(Math.random() * 50) + 1);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.UIManager = UIManager;
}
