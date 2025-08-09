// Offline stub for Telegram WebApp API
// Loads only when official script is not available (standalone/offline mode)
// Provides no-op implementations to avoid runtime errors.

(function () {
    if (typeof window === 'undefined') return;
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        // Real Telegram API present, do nothing.
        return;
    }

    function noop() {}

    const dummyButton = {
        show: noop,
        hide: noop,
        onClick: noop,
        setText: noop
    };

    const webAppStub = {
        // Layout
        expand: noop,
        enableClosingConfirmation: noop,
        setHeaderColor: noop,
        setBackgroundColor: noop,
        onEvent: noop,
        // Main button and others
        MainButton: { ...dummyButton },
        BackButton: { ...dummyButton },
        SettingsButton: { ...dummyButton },
        MenuButton: { ...dummyButton },
        // Haptic feedback
        HapticFeedback: {
            impactOccurred: noop,
            notificationOccurred: noop,
            selectionChanged: noop
        },
        // Meta info
        version: 'stub',
        platform: 'standalone',
        isExpanded: true,
        colorScheme: 'light',
        themeParams: {},
        // Data & communication
        initData: '',
        initDataUnsafe: {},
        sendData: noop,
        showAlert: message => alert(message),
        showConfirm: (message, cb) => {
            const res = confirm(message);
            cb && cb(res);
        },
        showPopup: noop,
        showScanQrPopup: noop,
        showInvoice: noop,
        close: noop
    };

    window.Telegram = { WebApp: webAppStub };
    // Loaded Telegram WebApp stub (offline mode)
})();
