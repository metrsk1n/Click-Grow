// Click&Grow Premium v0.0.5-alpha - Telegram WebApp Integration

class TelegramIntegration {
    constructor() {
        this.webApp = null;
        this.isInitialized = false;
        // TelegramIntegration created
    }
    
    init() {
        try {
            // Check if Telegram WebApp is available
            if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
                this.webApp = Telegram.WebApp;
                this.setupWebApp();
                this.isInitialized = true;
                // Telegram WebApp initialized
            } else {
                // Telegram WebApp not available, running in standalone mode
            }
        } catch (error) {
            console.error('❌ Telegram WebApp initialization failed:', error);
        }
    }
    
    setupWebApp() {
        if (!this.webApp) return;
        
        // Expand the WebApp to full height
        this.webApp.expand();
        
        // Set up closing confirmation
        this.webApp.enableClosingConfirmation();
        
        // Set up theme colors
        this.updateThemeColors();
        
        // Listen for theme changes
        this.webApp.onEvent('themeChanged', () => {
            this.updateThemeColors();
        });
        
        // Set up main button if needed
        this.setupMainButton();
        
        // Telegram WebApp setup complete
    }
    
    updateThemeColors() {
        if (!this.webApp) return;
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            this.webApp.setHeaderColor('#1a1a1a');
            this.webApp.setBackgroundColor('#0a0a0a');
        } else {
            this.webApp.setHeaderColor('#ffffff');
            this.webApp.setBackgroundColor('#f8fafc');
        }
    }
    
    setupMainButton() {
        if (!this.webApp) return;
        
        // Example: Show main button for special actions
        // this.webApp.MainButton.setText('Buy Premium');
        // this.webApp.MainButton.onClick(() => {
        //     this.showPremiumModal();
        // });
    }
    
    showMainButton(text, callback) {
        if (!this.webApp) return;
        
        this.webApp.MainButton.setText(text);
        this.webApp.MainButton.onClick(callback);
        this.webApp.MainButton.show();
    }
    
    hideMainButton() {
        if (!this.webApp) return;
        
        this.webApp.MainButton.hide();
    }
    
    showAlert(message) {
        if (!this.webApp) {
            alert(message);
            return;
        }
        
        this.webApp.showAlert(message);
    }
    
    showConfirm(message, callback) {
        if (!this.webApp) {
            const result = confirm(message);
            callback(result);
            return;
        }
        
        this.webApp.showConfirm(message, callback);
    }
    
    showPopup(title, message, buttons = []) {
        if (!this.webApp) {
            alert(`${title}\n\n${message}`);
            return;
        }
        
        this.webApp.showPopup({
            title: title,
            message: message,
            buttons: buttons
        });
    }
    
    showScanQrPopup(callback) {
        if (!this.webApp) {
            this.showAlert('QR scanning not available in standalone mode');
            return;
        }
        
        this.webApp.showScanQrPopup({
            text: 'Scan QR code to connect'
        }, callback);
    }
    
    showInvoice(params, callback) {
        if (!this.webApp) {
            this.showAlert('Payment not available in standalone mode');
            return;
        }
        
        this.webApp.showInvoice(params, callback);
    }
    
    // User data methods
    getUserData() {
        if (!this.webApp) {
            return {
                id: 0,
                first_name: 'Guest',
                last_name: 'User',
                username: 'guest',
                language_code: 'en'
            };
        }
        
        return this.webApp.initDataUnsafe?.user || {
            id: 0,
            first_name: 'Guest',
            last_name: 'User',
            username: 'guest',
            language_code: 'en'
        };
    }
    
    getUserId() {
        const userData = this.getUserData();
        return userData.id || 0;
    }
    
    getUserName() {
        const userData = this.getUserData();
        return userData.first_name || 'Guest';
    }
    
    getUserFullName() {
        const userData = this.getUserData();
        const firstName = userData.first_name || '';
        const lastName = userData.last_name || '';
        return `${firstName} ${lastName}`.trim() || 'Guest User';
    }
    
    getUserUsername() {
        const userData = this.getUserData();
        return userData.username || 'guest';
    }
    
    // Chat data methods
    getChatData() {
        if (!this.webApp) {
            return {
                id: 0,
                type: 'private',
                title: 'Click&Grow',
                username: 'clickgrow_bot'
            };
        }
        
        return this.webApp.initDataUnsafe?.chat || {
            id: 0,
            type: 'private',
            title: 'Click&Grow',
            username: 'clickgrow_bot'
        };
    }
    
    getChatId() {
        const chatData = this.getChatData();
        return chatData.id || 0;
    }
    
    getChatType() {
        const chatData = this.getChatData();
        return chatData.type || 'private';
    }
    
    // Platform methods
    getPlatform() {
        if (!this.webApp) return 'unknown';
        return this.webApp.platform || 'unknown';
    }
    
    isMobile() {
        const platform = this.getPlatform();
        return platform === 'ios' || platform === 'android';
    }
    
    isDesktop() {
        const platform = this.getPlatform();
        return platform === 'macos' || platform === 'windows' || platform === 'linux';
    }
    
    // Theme methods
    getColorScheme() {
        if (!this.webApp) return 'light';
        return this.webApp.colorScheme || 'light';
    }
    
    getThemeParams() {
        if (!this.webApp) {
            return {
                bg_color: '#ffffff',
                text_color: '#000000',
                hint_color: '#999999',
                link_color: '#2481cc',
                button_color: '#2481cc',
                button_text_color: '#ffffff'
            };
        }
        
        return this.webApp.themeParams || {};
    }
    
    // Haptic feedback
    impactOccurred(style = 'medium') {
        if (!this.webApp) return;
        
        this.webApp.HapticFeedback.impactOccurred(style);
    }
    
    notificationOccurred(type = 'success') {
        if (!this.webApp) return;
        
        this.webApp.HapticFeedback.notificationOccurred(type);
    }
    
    selectionChanged() {
        if (!this.webApp) return;
        
        this.webApp.HapticFeedback.selectionChanged();
    }
    
    // Back button
    showBackButton(callback) {
        if (!this.webApp) return;
        
        this.webApp.BackButton.onClick(callback);
        this.webApp.BackButton.show();
    }
    
    hideBackButton() {
        if (!this.webApp) return;
        
        this.webApp.BackButton.hide();
    }
    
    // Settings button
    showSettingsButton(callback) {
        if (!this.webApp) return;
        
        this.webApp.SettingsButton.onClick(callback);
        this.webApp.SettingsButton.show();
    }
    
    hideSettingsButton() {
        if (!this.webApp) return;
        
        this.webApp.SettingsButton.hide();
    }
    
    // Menu button
    showMenuButton(callback) {
        if (!this.webApp) return;
        
        this.webApp.MenuButton.onClick(callback);
        this.webApp.MenuButton.show();
    }
    
    hideMenuButton() {
        if (!this.webApp) return;
        
        this.webApp.MenuButton.hide();
    }
    
    // Utility methods
    isReady() {
        return this.isInitialized && this.webApp && this.webApp.isExpanded;
    }
    
    getVersion() {
        if (!this.webApp) return 'unknown';
        return this.webApp.version || 'unknown';
    }
    
    getInitData() {
        if (!this.webApp) return '';
        return this.webApp.initData || '';
    }
    
    getInitDataUnsafe() {
        if (!this.webApp) return {};
        return this.webApp.initDataUnsafe || {};
    }
    
    // Analytics
    sendData(data) {
        if (!this.webApp) return;
        
        this.webApp.sendData(JSON.stringify(data));
    }
    
    // Close WebApp
    close() {
        if (!this.webApp) return;
        
        this.webApp.close();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.TelegramIntegration = TelegramIntegration;
} 