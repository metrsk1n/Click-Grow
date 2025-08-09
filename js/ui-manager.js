// Click&Grow Premium v0.0.5-alpha - UI Manager

class UIManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.currentTab = 'plant';
        this.isInitialized = false;
        
        // UIManager created
    }
    
    async init() {
        try {
            // Initialize UI state
            this.setupInitialState();
            this.setupEventListeners();
            
            this.isInitialized = true;
            // UIManager initialized
            
        } catch (error) {
            console.error('❌ UIManager initialization failed:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        // Tab switching
        const navButtons = document.querySelectorAll('.nav-tab');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Top navigation tabs (Home, Shop, Achievements)
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const name = tab.dataset.tab;
                if (name) this.switchTab(name);
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

        // Plant name: open edit modal
        const editPlantNameBtn = document.getElementById('edit-plant-name');
        if (editPlantNameBtn) {
            editPlantNameBtn.addEventListener('click', () => {
                this.openPlantNameModal();
            });
        }

        // Plant name modal controls
        const savePlantNameBtn = document.getElementById('save-plant-name');
        const skipPlantNameBtn = document.getElementById('skip-plant-name');
        const closePlantNameBtn = document.getElementById('close-plant-name');
        const nameInput = document.getElementById('plant-name-input');

        if (savePlantNameBtn && nameInput) {
            savePlantNameBtn.addEventListener('click', () => {
                const raw = nameInput.value.trim();
                const name = raw.substring(0, 20);
                if (name.length === 0) {
                    this.showActionFeedback('❌ Name cannot be empty');
                    return;
                }
                this.setPlantName(name);
                this.closePlantNameModal();
                this.showActionFeedback(`✅ Plant named: ${name}`, 'success');
            });
        }

        if (skipPlantNameBtn) {
            skipPlantNameBtn.addEventListener('click', () => {
                this.closePlantNameModal();
            });
        }

        if (closePlantNameBtn) {
            closePlantNameBtn.addEventListener('click', () => {
                this.closePlantNameModal();
            });
        }

        // Suggested names fill input
        document.querySelectorAll('.name-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-name') || '';
                const input = document.getElementById('plant-name-input');
                if (input) input.value = val;
            });
        });

        // Profile actions: Export data
        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                try {
                    const state = this.gameEngine.getGameState();
                    const data = JSON.stringify(state, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'clickgrow-save.json';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    this.showActionFeedback('📤 Data exported');
                } catch (err) {
                    console.error('Export failed:', err);
                    this.showActionFeedback('❌ Export failed', 'error');
                }
            });
        }

        // Profile actions: Reset game
        const resetBtn = document.getElementById('reset-game-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const ok = confirm('Сбросить прогресс? This cannot be undone.');
                if (ok) {
                    this.gameEngine.resetGame();
                    this.showActionFeedback('🔄 Game reset');
                }
            });
        }

        // Extra safety: challenge details button handler (in addition to data-action switch)
        document.addEventListener('click', (e) => {
            const detailsBtn = e.target.closest('.challenge-btn.secondary[data-action="details"]');
            if (detailsBtn) {
                e.preventDefault();
                e.stopPropagation();
                const challengeId = detailsBtn.dataset.challengeId;
                if (challengeId) this.showChallengeDetails(challengeId);
            }
        });

        // Extra safety: challenge start button handler (in addition to data-action switch)
        document.addEventListener('click', (e) => {
            const startBtn = e.target.closest('.challenge-btn.primary[data-action="start"]');
            if (startBtn) {
                e.preventDefault();
                e.stopPropagation();
                const challengeId = startBtn.dataset.challengeId;
                if (challengeId) {
                    const ok = this.gameEngine.challengeSystem.startChallenge(challengeId);
                    if (ok) {
                        this.showActionFeedback('🚀 Challenge started!');
                        this.gameEngine.challengeSystem.updateUI();
                    } else {
                        this.showActionFeedback('❌ Unable to start challenge', 'error');
                    }
                }
            }
        });

        // Delegated actions: data-action for robust button wiring
        document.addEventListener('click', (e) => {
            const actionEl = e.target.closest('[data-action]');
            if (!actionEl) {
                // Check for shop category buttons
                const shopCategoryBtn = e.target.closest('.category-btn');
                if (shopCategoryBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove active from all shop categories
                    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                    // Add active to clicked
                    shopCategoryBtn.classList.add('active');
                    // Filter items
                    const category = shopCategoryBtn.dataset.category;
                    if (category) {
                        this.filterShopItems(category);
                    }
                    return;
                }
                
                // Check for achievement category buttons
                const achievementCategoryBtn = e.target.closest('.achievement-category');
                if (achievementCategoryBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove active from all achievement categories
                    document.querySelectorAll('.achievement-category').forEach(b => b.classList.remove('active'));
                    // Add active to clicked
                    achievementCategoryBtn.classList.add('active');
                    // Filter achievements
                    const category = achievementCategoryBtn.dataset.category;
                    if (category) {
                        this.filterAchievements(category);
                    }
                    return;
                }
                
                // Check for challenge details button
                const challengeDetailsBtn = e.target.closest('[data-challenge-id]');
                if (challengeDetailsBtn && challengeDetailsBtn.textContent.includes('Details')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const challengeId = challengeDetailsBtn.dataset.challengeId;
                    if (challengeId) {
                        this.showChallengeDetails(challengeId);
                    }
                    return;
                }
                
                // Check for garden focus button
                const focusBtn = e.target.closest('.plot-btn');
                if (focusBtn && focusBtn.textContent.includes('Focus')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.focusOnMainPlant();
                    return;
                }
                
                return;
            }
            
            const action = actionEl.getAttribute('data-action');
            switch (action) {
                case 'open-settings': this.showSettings(); break;
                case 'close-settings': this.hideSettings(); break;
                case 'close-game': this.gameEngine?.minigameSystem?.hideGameModal(); break;
                case 'close-coffee': document.getElementById('coffee-modal')?.classList.remove('active'); break;
                case 'toggle-theme': this.gameEngine?.toggleDarkMode(); break;
                case 'switch-tab': this.switchTab(actionEl.dataset.tab); break;
                case 'start-game': this.gameEngine?.minigameSystem?.startGame(actionEl.dataset.game); break;
                case 'start': {
                    const challengeId = actionEl.dataset.challengeId;
                    const ok = this.gameEngine?.challengeSystem?.startChallenge(challengeId);
                    if (ok) {
                        this.showActionFeedback('🚀 Challenge started!');
                        this.gameEngine.challengeSystem.updateUI();
                    } else {
                        this.showActionFeedback('❌ Unable to start challenge', 'error');
                    }
                    break;
                }
                case 'details': this.showChallengeDetails(actionEl.dataset.challengeId); break;
                case 'water': this.gameEngine?.minigameSystem?.startGame('water'); break;
                case 'fertilizer': this.gameEngine?.minigameSystem?.startGame('fertilizer'); break;
                case 'sunlight': this.gameEngine?.minigameSystem?.startGame('sunlight'); break;
                default: break;
            }
        });

        // UI event listeners setup complete
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
        
        // Force update achievements if switching to achievements tab
        if (tabName === 'achievements' && this.gameEngine.achievementSystem) {
            this.gameEngine.achievementSystem.filterAchievements('all');
        }
        
        // Ensure shop content populates immediately when entering Shop tab
        if (tabName === 'shop') {
            this.updateShopItems();
            this.updateShopBalance();
        }
    }
    
    showSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.add('active');
            // Settings modal opened
        }
    }
    
    hideSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.remove('active');
            // Settings modal closed
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
        // All modals closed
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
        
        // Action feedback shown
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
        
        // Achievement unlocked
    }

    showLevelUpNotification(level, rewards) {
        // Simple feedback without annoying notification
        this.showActionFeedback(`Level ${level} reached! +${rewards.coins} 💰`);
        // Level up
    }
    
    updatePlantVisual(level) {
        // Prevent unnecessary re-renders
        if (this._lastPlantLevel === level) return;
        this._lastPlantLevel = level;
        
        const plantContainer = document.querySelector('.plant-visual');
        if (plantContainer && this.gameEngine.plantRenderer) {
            this.gameEngine.plantRenderer.renderPlant(level, plantContainer);
        }
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
        
        // Update plant name display
        const plantNameElement = document.getElementById('plant-name');
        if (plantNameElement) {
            plantNameElement.textContent = gameState.plantName || 'Sprout';
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
        
        // Update achievement count
        this.updateAchievementCount();
        
        // Update home counters (streak, daily goal)
        this.updateDailyAndStreak(gameState);
    }

    updateResourceDisplay(resource, value) {
        // Support both data-resource and legacy id-based selectors
        const element =
            document.querySelector(`[data-resource="${resource}"]`) ||
            document.getElementById(resource);
        if (element) {
            element.textContent = this.formatNumber(value);
        }
    }

    updateProgressBar(gameState) {
        const progressBar = document.getElementById('growth-progress');
        if (progressBar) {
            // Prefer engine API; fallback to local curve if not available to avoid init crash
            const getReq = this.gameEngine && typeof this.gameEngine.getRequiredExpForLevel === 'function'
                ? (lvl) => this.gameEngine.getRequiredExpForLevel(lvl)
                : (lvl) => {
                    const L = Math.max(1, Number(lvl) || 1);
                    const base = 100; // same default curve as engine
                    return Math.floor(base * Math.pow(1.2, L - 1));
                };

            const requiredExp = getReq(gameState.level + 1) || 1;
            const progress = gameState.level >= 240 ? 100 : (gameState.experience / requiredExp) * 100;
            const clamped = Math.min(100, Math.max(0, progress));
            progressBar.style.width = `${clamped}%`;

            // Also update the textual percentage if present
            const growthValue = document.getElementById('growth-value');
            if (growthValue) {
                growthValue.textContent = `${Math.round(clamped)}%`;
            }
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

    filterShopItems(category) {
        const shopItems = this.gameEngine.getShopItems();
        const shopContainer = document.querySelector('.shop-items');
        
        if (shopContainer) {
            shopContainer.innerHTML = '';
            
            let filteredItems = Object.entries(shopItems);
            
            if (category !== 'all') {
                filteredItems = filteredItems.filter(([id, item]) => item.category === category);
            }
            
            if (filteredItems.length === 0) {
                shopContainer.innerHTML = `
                    <div class="no-items">
                        <div class="no-items-icon">🛍️</div>
                        <div class="no-items-text">No items found</div>
                        <div class="no-items-subtext">Try a different category!</div>
                    </div>
                `;
                return;
            }
            
            filteredItems.forEach(([id, item]) => {
                const itemElement = this.createShopItemElement(id, item);
                shopContainer.appendChild(itemElement);
            });
        }
    }

    createShopItemElement(id, item) {
        const element = document.createElement('div');
        element.className = `shop-item ${item.category}`;
        element.innerHTML = `
            <div class="shop-item-header">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-info">
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-description">${item.description}</div>
                </div>
            </div>
            <div class="shop-item-price">
                <span class="price-amount">${item.price.coins || item.price.gems || 0}</span>
                <span class="price-icon">${item.price.gems ? '💎' : '🪙'}</span>
            </div>
            <div class="shop-item-actions">
                <button class="shop-btn primary" data-item="${id}">Buy Now</button>
                <button class="shop-btn secondary" data-item="${id}" data-action="info">Info</button>
            </div>
        `;
        
        // Add click handlers
        const buyBtn = element.querySelector('.shop-btn.primary');
        buyBtn.addEventListener('click', () => {
            const result = this.gameEngine.purchaseShopItem(id);
            if (result.success) {
                this.showActionFeedback(`✅ ${item.name} purchased successfully!`);
                this.updateShopBalance();
            } else {
                if (result.reason === 'insufficient_funds') {
                    alert('Not Enough Money');
                } else {
                    this.showActionFeedback(`❌ Purchase failed!`);
                }
            }
        });
        
        const infoBtn = element.querySelector('.shop-btn.secondary');
        infoBtn.addEventListener('click', () => {
            this.showItemInfo(id, item);
        });
        
        return element;
    }

    updateShopBalance() {
        const gameState = this.gameEngine.getGameState();
        // Use global header counters
        const coinsElement = document.getElementById('coins');
        const gemsElement = document.getElementById('gems');
        
        if (coinsElement) coinsElement.textContent = gameState.coins;
        if (gemsElement) gemsElement.textContent = gameState.gems;
    }

    showItemInfo(id, item) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-container shop-modal">
                <div class="modal-content">
                    <div class="modal-header shop-header">
                        <div class="item-icon-large">${item.icon}</div>
                        <div class="item-header-info">
                            <h3 class="item-title">${item.name}</h3>
                            <div class="item-category-badge ${item.category}">${item.category}</div>
                        </div>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body shop-body">
                        <div class="item-description">
                            <p>${item.description}</p>
                        </div>
                        
                        <div class="item-details-grid">
                            <div class="detail-card">
                                <div class="detail-icon">💰</div>
                                <div class="detail-content">
                                    <span class="detail-label">Price: </span>
                                    <span class="detail-value price-value">
                                        ${item.price.coins || item.price.gems} ${item.price.gems ? '💎' : '🪙'}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="detail-card">
                                <div class="detail-icon">📦</div>
                                <div class="detail-content">
                                    <span class="detail-label">type: </span>
                                    <span class="detail-value">${item.category}</span>
                                </div>
                            </div>
                            
                            ${item.rarity ? `
                                <div class="detail-card rarity-${item.rarity}">
                                    <div class="detail-icon">⭐</div>
                                    <div class="detail-content">
                                        <span class="detail-label">Rarity</span>
                                        <span class="detail-value rarity-value">${item.rarity}</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        ${item.effects ? `
                            <div class="effects-section">
                                <h4 class="effects-title">✨ Effects</h4>
                                <div class="effects-grid">
                                    ${Object.entries(item.effects).map(([key, value]) => `
                                        <div class="effect-card">
                                            <div class="effect-icon">${this.getEffectIcon(key)}</div>
                                            <div class="effect-info">
                                                <span class="effect-name">${this.formatEffectName(key)}</span>
                                                <span class="effect-value">+${value}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        ${item.duration ? `
                            <div class="duration-section">
                                <div class="duration-card">
                                    <div class="duration-icon">⏱️</div>
                                    <div class="duration-info">
                                        <span class="duration-label">Duration</span>
                                        <span class="duration-value">${item.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer shop-footer">
                        <button class="shop-btn secondary close-secondary">
                            <span class="btn-icon">❌</span>
                            <span class="btn-text">Close</span>
                        </button>
                        <button class="shop-btn primary buy-primary">
                            <span class="btn-icon">🛒</span>
                            <span class="btn-text">Buy Now</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close handlers
        const closeBtn = modal.querySelector('.close-btn');
        const closeSecondary = modal.querySelector('.close-secondary');
        [closeBtn, closeSecondary].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            });
        });
        
        // Add buy handler
        const buyBtn = modal.querySelector('.buy-primary');
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                const result = this.gameEngine.purchaseShopItem(id);
                if (result.success) {
                    this.showActionFeedback(`✅ ${item.name} purchased successfully!`, 'success');
                    this.updateShopBalance();
                    modal.classList.remove('active');
                    setTimeout(() => modal.remove(), 300);
                } else {
                    if (result.reason === 'insufficient_funds') {
                        alert('Not enough a money!');
                    } else {
                        this.showActionFeedback(`❌ Purchase failed!`, 'error');
                    }
                }
            });
        }
    }

    // Helper methods for shop modal
    getEffectIcon(effectType) {
        const icons = {
            'health': '❤️',
            'happiness': '😊',
            'growth': '🌱',
            'experience': '⭐',
            'coins': '🪙',
            'gems': '💎',
            'speed': '⚡',
            'luck': '🍀',
            'power': '💪',
            'magic': '✨'
        };
        return icons[effectType] || '🔮';
    }

    formatEffectName(effectType) {
        return effectType.charAt(0).toUpperCase() + effectType.slice(1);
    }

    showChallengeDetails(challengeId) {
        const challenge = this.gameEngine.challengeSystem.getChallenge(challengeId);
        if (!challenge) {
            this.showActionFeedback('❌ Challenge not found!');
            return;
        }

        const progressPercent = this.gameEngine.challengeSystem.getChallengeProgress(challengeId);
        const isCompleted = this.gameEngine.challengeSystem.isChallengeCompleted(challengeId);
        const timeLeft = this.gameEngine.challengeSystem.getTimeLeft(challengeId);
        const current = typeof challenge.current === 'number'
            ? challenge.current
            : Math.round((Math.max(0, Math.min(100, progressPercent)) / 100) * (challenge.target || 0));
        const rewardsHtml = Array.isArray(challenge.rewards) && challenge.rewards.length
            ? challenge.rewards.map(r => `<div class="reward-badge">+${r.amount} ${r.icon || ''}</div>`).join('')
            : [
                challenge.reward?.coins ? `<div class="reward-badge">+${challenge.reward.coins} 🪙</div>` : '',
                challenge.reward?.exp ? `<div class="reward-badge">+${challenge.reward.exp} ⭐</div>` : '',
                challenge.reward?.gems ? `<div class="reward-badge">+${challenge.reward.gems} 💎</div>` : ''
              ].join('');

        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${challenge.icon} ${challenge.name}</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${challenge.description}</p>
                        <div class="challenge-details">
                            <div class="detail-item">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value">${challenge.type}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Target:</span>
                                <span class="detail-value">${challenge.target}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Progress:</span>
                                <span class="detail-value">${current}/${challenge.target}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value ${isCompleted ? 'completed' : 'active'}">${isCompleted ? '✅ Completed' : '🎯 In Progress'}</span>
                            </div>
                            ${timeLeft ? `
                                <div class="detail-item">
                                    <span class="detail-label">Time left:</span>
                                    <span class="detail-value">${timeLeft}</span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="challenge-rewards">
                            <h4>🎁 Rewards:</h4>
                            <div class="rewards-list">
                                ${rewardsHtml}
                            </div>
                        </div>
                        <div class="challenge-progress-bar">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min(100, progressPercent)}%"></div>
                            </div>
                            <div class="progress-text">${Math.min(100, Math.round(progressPercent))}%</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="shop-btn secondary">Close</button>
                        ${(isCompleted || progressPercent >= 100) ? '<button class="shop-btn primary">Claim Reward</button>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close handler
        const closeBtn = modal.querySelector('.close-btn');
        const closeSecondary = modal.querySelector('.shop-btn.secondary');
        [closeBtn, closeSecondary].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.remove();
            });
        });
        
        // Add claim reward handler
        const claimBtn = modal.querySelector('.shop-btn.primary');
        if (claimBtn && (isCompleted || progressPercent >= 100)) {
            claimBtn.addEventListener('click', () => {
                const result = this.gameEngine.challengeSystem.claimChallengeReward(challengeId);
                if (result.success) {
                    this.showActionFeedback('🎉 Challenge completed! Rewards claimed!');
                    this.gameEngine.updateUI();
                    modal.remove();
                } else {
                    this.showActionFeedback('❌ ' + result.reason || 'Failed to claim reward!');
                }
            });
        }
    }

    filterAchievements(category) {
        // Delegate to AchievementSystem for correct category mapping and rendering
        if (this.gameEngine?.achievementSystem) {
            this.gameEngine.achievementSystem.filterAchievements(category);
        }
    }

    updateProfileStatistics(gameState) {
        // Update dynamic profile statistics
        const profileLevel = document.getElementById('profile-level');
        const profileExperience = document.getElementById('profile-experience');
        const profileTotalCoins = document.getElementById('profile-total-coins');
        const profileGamesPlayed = document.getElementById('profile-games-played');
        const profileChallenges = document.getElementById('profile-challenges');
        const profileBestStreak = document.getElementById('profile-best-streak');

        if (profileLevel) {
            profileLevel.textContent = gameState.level || 1;
        }

        if (profileExperience) {
            const totalExp = gameState.experience || 0;
            profileExperience.textContent = this.formatNumber(totalExp);
        }

        if (profileTotalCoins) {
            // Calculate total coins earned (current + spent)
            const totalEarned = (gameState.coins || 0) + (gameState.totalCoinsSpent || 0);
            profileTotalCoins.textContent = this.formatNumber(totalEarned);
        }

        if (profileGamesPlayed) {
            profileGamesPlayed.textContent = gameState.statistics?.gamesPlayed || 0;
        }

        if (profileChallenges) {
            const completedChallenges = gameState.statistics?.challengesCompleted || 0;
            profileChallenges.textContent = completedChallenges;
        }

        if (profileBestStreak) {
            profileBestStreak.textContent = gameState.statistics?.bestStreak || 0;
        }

        // Update garden statistics
        this.updateGardenStatistics(gameState);
    }

    updateGardenStatistics(gameState) {
        const gardenPlants = document.getElementById('garden-plants');
        const gardenVarieties = document.getElementById('garden-varieties');
        const gardenHealth = document.getElementById('garden-health');

        if (gardenPlants) {
            gardenPlants.textContent = gameState.statistics?.plantsOwned || 1;
        }

        if (gardenVarieties) {
            gardenVarieties.textContent = gameState.statistics?.plantVarieties || 1;
        }

        if (gardenHealth) {
            const health = Math.round(gameState.health || 100);
            gardenHealth.textContent = `${health}%`;
        }
    }

    updateAllDisplays(gameState) {
        // Update main UI elements
        this.updateProgressBar(gameState);
        this.updateResourceDisplays(gameState);
        this.updatePlantStats(gameState);
        this.updateProfileStatistics(gameState);
        this.updateShopBalance();
        
        // Update home counters (streak, daily goal, achievements)
        this.updateDailyAndStreak(gameState);
        this.updateAchievementCount();
    }

    updateResourceDisplays(gameState) {
        // Update coins and gems display
        const coinsElements = document.querySelectorAll('.coins-value, #coins-display');
        const gemsElements = document.querySelectorAll('.gems-value, #gems-display');
        
        coinsElements.forEach(el => {
            if (el) el.textContent = this.formatNumber(gameState.coins || 0);
        });
        
        gemsElements.forEach(el => {
            if (el) el.textContent = this.formatNumber(gameState.gems || 0);
        });
    }

    updatePlantStats(gameState) {
        // Update plant statistics
        const healthBar = document.getElementById('health-progress');
        const happinessBar = document.getElementById('happiness-progress');
        const levelDisplay = document.getElementById('level-display');
        
        if (healthBar) {
            healthBar.style.width = `${Math.max(0, Math.min(100, gameState.health || 100))}%`;
        }
        
        if (happinessBar) {
            happinessBar.style.width = `${Math.max(0, Math.min(100, gameState.happiness || 100))}%`;
        }
        
        if (levelDisplay) {
            levelDisplay.textContent = gameState.level || 1;
        }
    }

    updateAchievements() {
        const achievementsContainer = document.querySelector('.achievements-list');
        if (!achievementsContainer) return;

        achievementsContainer.innerHTML = '';

        // If system exists, render from system
        if (this.gameEngine?.achievementSystem?.getAllAchievements) {
            const achievements = this.gameEngine.achievementSystem.getAllAchievements();
            achievements.forEach(achievement => {
                const achievementElement = this.createAchievementElement(achievement);
                achievementsContainer.appendChild(achievementElement);
            });
            return;
        }

        // Fallback static achievements if system is missing
        const fallbackAchievements = [
            { id: 'first_water', name: 'First Water', description: 'Water your plant once', icon: '💧', rarity: 'common', reward: { coins: 10 }, current: 0, target: 1 },
            { id: 'sun_bath', name: 'Sun Bath', description: 'Give sunlight 3 times', icon: '☀️', rarity: 'common', reward: { coins: 15 }, current: 0, target: 3 },
            { id: 'fert_fan', name: 'Fertilizer Fan', description: 'Use fertilizer 5 times', icon: '🧪', rarity: 'uncommon', reward: { coins: 25 }, current: 0, target: 5 },
            { id: 'daily_care', name: 'Daily Care', description: 'Open the app 7 days in a row', icon: '📅', rarity: 'rare', reward: { coins: 50, gems: 1 }, current: 0, target: 7 },
            { id: 'happy_plant', name: 'Happy Plant', description: 'Reach 100% happiness', icon: '😊', rarity: 'rare', reward: { gems: 2 }, current: 0, target: 100 },
            { id: 'healthy_plant', name: 'Healthy Plant', description: 'Reach 100% health', icon: '❤️', rarity: 'epic', reward: { coins: 100, gems: 3 }, current: 0, target: 100 },
        ];
        fallbackAchievements.forEach(a => {
            const element = document.createElement('div');
            element.className = `achievement-item locked ${a.rarity}`;
            const percentage = Math.min(100, Math.round((a.current / a.target) * 100));
            element.innerHTML = `
                <div class="achievement-icon">${a.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${a.name}</div>
                    <div class="achievement-description">${a.description}</div>
                    <div class="achievement-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="progress-text">${a.current}/${a.target}</span>
                    </div>
                </div>
                <div class="achievement-rewards">
                    ${a.reward?.coins ? `<div class="reward-badge">+${a.reward.coins} 🪙</div>` : ''}
                    ${a.reward?.gems ? `<div class="reward-badge">+${a.reward.gems} 💎</div>` : ''}
                </div>
                <div class="achievement-rarity ${a.rarity}">${a.rarity}</div>
            `;
            achievementsContainer.appendChild(element);
        });
    }

    createAchievementElement(achievement) {
        const isUnlocked = this.gameEngine.achievementSystem.isUnlocked(achievement.id);
        const progress = this.gameEngine.achievementSystem.getAchievementProgress(achievement.id, this.gameEngine.getGameState());
        
        const element = document.createElement('div');
        element.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`;
        element.innerHTML = `
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
            <div class="achievement-rarity ${achievement.rarity}">${achievement.rarity}</div>
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
        // Handle non-numeric values that might cause [object] display
        if (typeof num !== 'number' || isNaN(num)) {
            return '0';
        }
        
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

    focusOnMainPlant() {
        // Switch to home tab first
        this.switchTab('home');
        
        // Wait a bit for tab switch to complete, then create effects
        setTimeout(() => {
            const plantContainer = document.getElementById('plant-container');
            if (plantContainer) {
                // Add focus animation class
                plantContainer.classList.add('plant-focus-animation');
                
                // Create particle effects with proper coordinates
                if (this.gameEngine.particleSystem) {
                    const rect = plantContainer.getBoundingClientRect();
                    // Ensure we have valid coordinates
                    if (rect.width > 0 && rect.height > 0) {
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        this.gameEngine.particleSystem.createFocusEffect(centerX, centerY);
                    } else {
                        // Fallback to viewport center if container not properly sized
                        const centerX = window.innerWidth / 2;
                        const centerY = window.innerHeight / 2;
                        this.gameEngine.particleSystem.createFocusEffect(centerX, centerY);
                    }
                }
                
                // Show feedback
                this.showActionFeedback('🌱 Focusing on your plant!', 'success');
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    plantContainer.classList.remove('plant-focus-animation');
                }, 2000);
            }
        }, 100); // Small delay to ensure tab switch is complete
    }

    updateAchievementCount() {
        const achievementsCountElement = document.getElementById('achievements-count');
        if (achievementsCountElement && this.gameEngine.achievementSystem) {
            const unlockedCount = this.gameEngine.achievementSystem.getUnlockedCount();
            achievementsCountElement.textContent = unlockedCount;
        }
    }

    openPlantNameModal() {
        const modal = document.getElementById('plant-name-modal');
        const input = document.getElementById('plant-name-input');
        if (input) {
            input.value = this.gameEngine?.gameState?.plantName || '';
            input.focus();
        }
        if (modal) modal.classList.add('active');
    }

    closePlantNameModal() {
        const modal = document.getElementById('plant-name-modal');
        if (modal) modal.classList.remove('active');
    }

    setPlantName(name) {
        if (!this.gameEngine) return;
        this.gameEngine.gameState.plantName = name;
        this.gameEngine.saveGameData();
        const plantNameElement = document.getElementById('plant-name');
        if (plantNameElement) plantNameElement.textContent = name;
    }

    updateDailyAndStreak(gameState) {
        // Streak in Home header
        const streakEl = document.getElementById('streak');
        if (streakEl) {
            const current = (gameState.statistics && typeof gameState.statistics.currentStreak === 'number')
                ? gameState.statistics.currentStreak
                : (typeof gameState.currentStreak === 'number' ? gameState.currentStreak : 0);
            streakEl.textContent = current;
        }

        // Daily goal counter (progress/target)
        const dailyEl = document.getElementById('daily-goal');
        if (dailyEl) {
            const daily = gameState.daily || {};
            const progress = typeof daily.progress === 'number'
                ? daily.progress
                : (gameState.statistics && typeof gameState.statistics.dailyProgress === 'number'
                    ? gameState.statistics.dailyProgress
                    : 0);
            const target = typeof daily.target === 'number'
                ? daily.target
                : (gameState.statistics && typeof gameState.statistics.dailyTarget === 'number'
                    ? gameState.statistics.dailyTarget
                    : 100);
            const clamped = Math.max(0, Math.min(progress, target));
            dailyEl.textContent = `${clamped}/${target}`;
        }
    }
}

// Donate (Buy Me a Coffee -> Donation Alerts)
const donateBtn = document.getElementById('buy-coffee-btn');
if (donateBtn) {
    donateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            window.open('https://www.donationalerts.com/r/msd1shka', '_blank');
        } catch (err) {
            console.warn('Failed to open Donation Alerts:', err);
        }
    });
}

// Modal primary CTA
const donateCta = document.getElementById('coffee-notify-btn');
if (donateCta) {
    donateCta.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            window.open('https://www.donationalerts.com/r/msd1shka', '_blank');
        } finally {
            document.getElementById('coffee-modal')?.classList.remove('active');
        }
    });
}

// Export
if (typeof window !== 'undefined') {
    window.UIManager = UIManager;
}
