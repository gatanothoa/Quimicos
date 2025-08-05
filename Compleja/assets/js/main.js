/* ==========================================================================
   MAIN.JS - Tienda de Limpieza del Chamaco Perro
   Main application logic and initialization
   ========================================================================== */

// Application State Manager
class AppStateManager {
    constructor() {
        this.state = {
            isLoaded: false,
            currentSection: 'inicio',
            isMenuOpen: false,
            isCartOpen: false,
            searchQuery: '',
            activeFilter: 'all',
            products: [],
            cart: { items: [], total: 0, count: 0 },
            user: { preferences: {}, favorites: [] }
        };
        
        this.subscribers = new Map();
        this.init();
    }
    
    init() {
        this.loadState();
        this.bindEvents();
        console.log('📊 App State Manager initialized');
    }
    
    // State management
    setState(newState) {
        const previousState = { ...this.state };
        this.state = { ...this.state, ...newState };
        
        // Notify subscribers
        this.notifySubscribers(previousState, this.state);
        
        // Save to localStorage
        this.saveState();
    }
    
    getState() {
        return { ...this.state };
    }
    
    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, []);
        }
        this.subscribers.get(key).push(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }
    
    notifySubscribers(previousState, newState) {
        this.subscribers.forEach((callbacks, key) => {
            if (previousState[key] !== newState[key]) {
                callbacks.forEach(callback => callback(newState[key], previousState[key]));
            }
        });
    }
    
    // Persistence
    saveState() {
        try {
            const stateToSave = {
                cart: this.state.cart,
                user: this.state.user,
                activeFilter: this.state.activeFilter
            };
            localStorage.setItem('chamacoperro_app_state', JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('Could not save app state:', error);
        }
    }
    
    loadState() {
        try {
            const savedState = localStorage.getItem('chamacoperro_app_state');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                this.setState(parsedState);
            }
        } catch (error) {
            console.warn('Could not load app state:', error);
        }
    }
    
    bindEvents() {
        // Save state before page unload
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveState();
            }
        });
    }
}

// Search and Filter Manager
class SearchFilterManager {
    constructor(appState) {
        this.appState = appState;
        this.searchInput = null;
        this.filterButtons = [];
        this.searchResults = [];
        this.init();
    }
    
    init() {
        this.bindSearchEvents();
        this.bindFilterEvents();
        this.loadInitialProducts();
        console.log('🔍 Search and Filter Manager initialized');
    }
    
    bindSearchEvents() {
        this.searchInput = document.getElementById('search-input');
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            this.searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
            this.searchInput.addEventListener('blur', this.handleSearchBlur.bind(this));
        }
    }
    
    bindFilterEvents() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.filterButtons.forEach(button => {
            button.addEventListener('click', this.handleFilter.bind(this));
        });
    }
    
    handleSearch(event) {
        const query = event.target.value.trim().toLowerCase();
        this.appState.setState({ searchQuery: query });
        
        if (query.length > 0) {
            this.performSearch(query);
        } else {
            this.clearSearch();
        }
    }
    
    performSearch(query) {
        const allProducts = DataUtils.getAllProducts();
        const results = allProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.specs.some(spec => spec.toLowerCase().includes(query)) ||
            product.features.some(feature => feature.toLowerCase().includes(query))
        );
        
        this.searchResults = results;
        this.renderSearchResults(results);
        
        // Track search
        try {
            if (typeof AnalyticsUtils !== 'undefined' && typeof AnalyticsUtils.trackSearch === 'function') {
                AnalyticsUtils.trackSearch(query, results.length);
            }
        } catch (error) {
            console.warn('Search tracking failed:', error.message);
        }
    }
    
    clearSearch() {
        this.searchResults = [];
        this.loadFilteredProducts(this.appState.getState().activeFilter);
    }
    
    handleFilter(event) {
        const filter = event.target.getAttribute('data-filter');
        this.appState.setState({ activeFilter: filter });
        
        // Update active filter button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Load filtered products
        this.loadFilteredProducts(filter);
    }
    
    loadFilteredProducts(filter) {
        const products = DataUtils.getProductsByCategory(filter);
        ProductComponents.renderProducts(products);
    }
    
    loadInitialProducts() {
        const initialFilter = this.appState.getState().activeFilter;
        this.loadFilteredProducts(initialFilter);
        
        // Set active filter button
        const activeButton = document.querySelector(`[data-filter="${initialFilter}"]`);
        if (activeButton) {
            this.filterButtons.forEach(btn => btn.classList.remove('active'));
            activeButton.classList.add('active');
        }
    }
    
    renderSearchResults(results) {
        ProductComponents.renderProducts(results);
        
        // Show search info
        this.showSearchInfo(results.length, this.appState.getState().searchQuery);
    }
    
    showSearchInfo(count, query) {
        const existingInfo = document.querySelector('.search-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        const productsSection = document.querySelector('.products-section');
        if (productsSection && query) {
            const info = document.createElement('div');
            info.className = 'search-info';
            info.innerHTML = `
                <p>Se encontraron <strong>${count}</strong> productos para "<em>${query}</em>"</p>
                <button onclick="app.searchFilter.clearSearchInput()" class="btn btn-outline btn-sm">
                    <i class="fas fa-times"></i> Limpiar búsqueda
                </button>
            `;
            
            const container = productsSection.querySelector('.container');
            container.insertBefore(info, container.querySelector('.products-grid'));
        }
    }
    
    clearSearchInput() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.clearSearch();
            this.appState.setState({ searchQuery: '' });
        }
    }
    
    handleSearchFocus() {
        this.searchInput.parentElement.classList.add('focused');
    }
    
    handleSearchBlur() {
        setTimeout(() => {
            this.searchInput.parentElement.classList.remove('focused');
        }, 100);
    }
    
    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Section Manager for single-page navigation
class SectionManager {
    constructor(appState) {
        this.appState = appState;
        this.sections = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.bindNavigationEvents();
        this.initSectionObserver();
        console.log('📄 Section Manager initialized');
    }
    
    bindNavigationEvents() {
        // Handle navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }
    
    handleNavigation(event) {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            this.navigateToSection(sectionId);
        }
    }
    
    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            // Update URL without page reload
            history.pushState({ section: sectionId }, '', `#${sectionId}`);
            
            // Scroll to section
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Update app state
            this.appState.setState({ currentSection: sectionId });
            
            // Update active navigation
            this.updateActiveNavigation(sectionId);
        }
    }
    
    updateActiveNavigation(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    handlePopState(event) {
        if (event.state && event.state.section) {
            this.navigateToSection(event.state.section);
        }
    }
    
    initSectionObserver() {
        // Observe sections to update navigation
        const sections = document.querySelectorAll('section[id]');
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionId = entry.target.id;
                    this.appState.setState({ currentSection: sectionId });
                    this.updateActiveNavigation(sectionId);
                }
            });
        }, {
            threshold: [0.5],
            rootMargin: '-80px 0px -80px 0px'
        });
        
        sections.forEach(section => {
            this.observer.observe(section);
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0,
            memoryUsage: 0
        };
        
        this.init();
    }
    
    init() {
        this.measureLoadTime();
        this.measureRenderTime();
        this.monitorMemoryUsage();
        this.reportMetrics();
        console.log('⚡ Performance Monitor initialized');
    }
    
    measureLoadTime() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
            
            console.log(`📊 Page load time: ${this.metrics.loadTime}ms`);
        });
    }
    
    measureRenderTime() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.renderTime = entry.startTime;
                    console.log(`🎨 First contentful paint: ${this.metrics.renderTime}ms`);
                }
            }
        });
        
        observer.observe({ entryTypes: ['paint'] });
    }
    
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
            }, 5000);
        }
    }
    
    reportMetrics() {
        // Report to analytics service (placeholder)
        setTimeout(() => {
            console.log('📈 Performance metrics:', this.metrics);
        }, 5000);
    }
}

// Error Handler
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.init();
    }
    
    init() {
        // Global error handling
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
        
        // Custom error reporting
        this.setupCustomErrorReporting();
        
        console.log('🚨 Error Handler initialized');
    }
    
    handleError(event) {
        const error = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
            timestamp: new Date().toISOString()
        };
        
        this.logError(error);
        this.reportError(error);
    }
    
    handlePromiseRejection(event) {
        const error = {
            message: 'Unhandled Promise Rejection',
            reason: event.reason,
            timestamp: new Date().toISOString()
        };
        
        this.logError(error);
        this.reportError(error);
    }
    
    logError(error) {
        this.errors.push(error);
        console.error('Application Error:', error);
        
        // Show user-friendly error message
        if (typeof NotificationComponents !== 'undefined') {
            NotificationComponents.showNotification(
                'Ha ocurrido un error. Nuestro equipo ha sido notificado.',
                'error'
            );
        }
    }
    
    reportError(error) {
        // Report to error tracking service (placeholder)
        // In production, this would send to Sentry, LogRocket, etc.
        console.log('Reporting error to tracking service:', error);
    }
    
    setupCustomErrorReporting() {
        // Custom error method for manual error reporting
        window.reportError = (message, context = {}) => {
            const error = {
                message,
                context,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            this.logError(error);
            this.reportError(error);
        };
    }
}

// Main Application Class
class ChamacoPerroApp {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
        this.initStartTime = performance.now();
        
        this.init();
    }
    
    async init() {
        try {
            console.log('🐕 Initializing Chamaco Perro Application...');
            
            // Initialize core modules
            await this.initCoreModules();
            
            // Initialize feature modules
            await this.initFeatureModules();
            
            // Initialize UI modules
            await this.initUIModules();
            
            // Final setup
            this.finalizeInitialization();
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }
    
    async initCoreModules() {
        // App State Manager
        this.appState = new AppStateManager();
        this.modules.set('appState', this.appState);
        
        // Error Handler
        this.errorHandler = new ErrorHandler();
        this.modules.set('errorHandler', this.errorHandler);
        
        // Performance Monitor
        this.performanceMonitor = new PerformanceMonitor();
        this.modules.set('performanceMonitor', this.performanceMonitor);
        
        console.log('✅ Core modules initialized');
    }
    
    async initFeatureModules() {
        try {
            // Check if required modules are available
            if (typeof DataUtils === 'undefined') {
                throw new Error('DataUtils not available');
            }
            
            // Search and Filter Manager
            this.searchFilter = new SearchFilterManager(this.appState);
            this.modules.set('searchFilter', this.searchFilter);
            
            // Section Manager
            this.sectionManager = new SectionManager(this.appState);
            this.modules.set('sectionManager', this.sectionManager);
            
            console.log('✅ Feature modules initialized');
        } catch (error) {
            console.warn('⚠️ Feature modules initialization with fallback:', error.message);
            
            // Fallback initialization
            this.initFallbackFeatures();
        }
    }
    
    initFallbackFeatures() {
        // Basic fallback functionality without dependencies
        console.log('🔧 Initializing fallback features...');
        
        // Basic navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
        
        // Basic menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const nav = document.getElementById('nav');
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }
        
        // Basic contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Gracias por tu mensaje. Te contactaremos pronto.');
            });
        }
    }
    
    async initUIModules() {
        try {
            // Wait for components to be ready
            if (typeof ComponentsInit !== 'undefined') {
                // Components are already initialized by components.js
                console.log('✅ UI components ready');
            } else {
                console.warn('⚠️ ComponentsInit not found, using fallback UI');
                this.initFallbackUI();
            }
            
            // Initialize additional UI features
            this.initProgressiveEnhancements();
            
            console.log('✅ UI modules initialized');
        } catch (error) {
            console.warn('⚠️ UI modules initialization failed, using fallback:', error.message);
            this.initFallbackUI();
        }
    }
    
    initFallbackUI() {
        console.log('🔧 Initializing fallback UI...');
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }
        
        // Basic back to top
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.style.display = 'flex';
                } else {
                    backToTop.style.display = 'none';
                }
            });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Basic cart functionality
        const cartBtn = document.getElementById('cart-btn');
        const cartModal = document.getElementById('cart-modal');
        const modalClose = document.getElementById('modal-close');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (cartBtn && cartModal) {
            cartBtn.addEventListener('click', () => {
                cartModal.style.display = 'flex';
            });
            
            [modalClose, modalOverlay].forEach(element => {
                if (element) {
                    element.addEventListener('click', () => {
                        cartModal.style.display = 'none';
                    });
                }
            });
        }
    }
    
    initProgressiveEnhancements() {
        // Service Worker registration
        this.registerServiceWorker();
        
        // Web App Manifest support
        this.initWebAppFeatures();
        
        // Advanced user interactions
        this.initAdvancedInteractions();
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registered:', registration);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    }
    
    initWebAppFeatures() {
        // Add to home screen prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button or notification
            this.showInstallPrompt(deferredPrompt);
        });
    }
    
    showInstallPrompt(deferredPrompt) {
        // Create install prompt
        const installBanner = document.createElement('div');
        installBanner.className = 'install-banner';
        installBanner.innerHTML = `
            <div class="install-content">
                <i class="fas fa-mobile-alt"></i>
                <span>¿Instalar Chamaco Perro como app?</span>
                <button class="btn btn-primary btn-sm" id="install-btn">Instalar</button>
                <button class="btn btn-outline btn-sm" id="dismiss-btn">Ahora no</button>
            </div>
        `;
        
        document.body.appendChild(installBanner);
        
        // Handle install
        document.getElementById('install-btn').addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
                installBanner.remove();
            });
        });
        
        // Handle dismiss
        document.getElementById('dismiss-btn').addEventListener('click', () => {
            installBanner.remove();
        });
    }
    
    initAdvancedInteractions() {
        // Keyboard shortcuts
        this.initKeyboardShortcuts();
        
        // Gesture support
        this.initGestureSupport();
        
        // Voice commands (if supported)
        this.initVoiceCommands();
    }
    
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl/Cmd + Shift + C for cart
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                if (typeof CartComponents !== 'undefined') {
                    CartComponents.showCart();
                }
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                if (typeof CartComponents !== 'undefined') {
                    CartComponents.hideCart();
                }
            }
        });
    }
    
    initGestureSupport() {
        // Touch gestures for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;
            
            // Swipe gestures
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe left - next section
                    this.handleSwipeLeft();
                } else {
                    // Swipe right - previous section
                    this.handleSwipeRight();
                }
            }
        });
    }
    
    handleSwipeLeft() {
        // Navigate to next section
        console.log('Swipe left detected');
    }
    
    handleSwipeRight() {
        // Navigate to previous section
        console.log('Swipe right detected');
    }
    
    initVoiceCommands() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // Voice command implementation would go here
            console.log('Voice commands available');
        }
    }
    
    finalizeInitialization() {
        const initTime = performance.now() - this.initStartTime;
        
        // Mark app as initialized
        this.isInitialized = true;
        this.appState.setState({ isLoaded: true });
        
        // Hide loading screen
        try {
            if (typeof LoadingComponents !== 'undefined' && typeof LoadingComponents.hideLoading === 'function') {
                LoadingComponents.hideLoading();
            } else {
                // Fallback: Hide loading screen manually
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
                console.log('💫 Loading screen hidden manually');
            }
        } catch (error) {
            console.warn('Loading screen hide failed:', error.message);
            // Force hide loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }
        
        // Track initialization
        try {
            if (typeof AnalyticsUtils !== 'undefined' && typeof AnalyticsUtils.trackAppInitialization === 'function') {
                AnalyticsUtils.trackAppInitialization(initTime);
            } else {
                console.log('📊 Analytics not available, skipping tracking');
            }
        } catch (error) {
            console.warn('Analytics tracking failed:', error.message);
        }
        
        console.log(`🎉 Chamaco Perro App initialized successfully in ${initTime.toFixed(2)}ms`);
        
        // Dispatch ready event
        document.dispatchEvent(new CustomEvent('chamacoPerroReady', {
            detail: { app: this, initTime }
        }));
    }
    
    handleInitializationError(error) {
        console.error('🚨 Application initialization failed:', error);
        
        // Show fallback UI
        document.body.innerHTML = `
            <div class="error-fallback">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Error de Inicialización</h2>
                    <p>No se pudo cargar la aplicación correctamente.</p>
                    <button onclick="window.location.reload()" class="btn btn-primary">
                        Recargar Página
                    </button>
                </div>
            </div>
        `;
    }
    
    // Public API
    getModule(name) {
        return this.modules.get(name);
    }
    
    getState() {
        return this.appState.getState();
    }
    
    setState(newState) {
        return this.appState.setState(newState);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐕 DOM ready, checking dependencies...');
    
    // Check if required dependencies are available
    const requiredGlobals = ['DataUtils', 'PRODUCTS', 'CartUtils', 'AnalyticsUtils'];
    const missingDeps = requiredGlobals.filter(dep => typeof window[dep] === 'undefined');
    
    if (missingDeps.length > 0) {
        console.warn('Missing dependencies:', missingDeps);
        console.log('Available globals:', Object.keys(window).filter(key => 
            key.includes('Utils') || key.includes('PRODUCTS') || key.includes('Components') || key.includes('CATEGORIES')
        ));
        
        // Wait a bit more for dependencies to load
        setTimeout(() => {
            const stillMissing = requiredGlobals.filter(dep => typeof window[dep] === 'undefined');
            if (stillMissing.length === 0) {
                console.log('✅ Dependencies loaded after delay, initializing app...');
                window.app = new ChamacoPerroApp();
            } else {
                console.error('❌ Still missing dependencies after delay:', stillMissing);
                // Try to initialize anyway with fallback
                console.log('🔧 Attempting fallback initialization...');
                window.app = new ChamacoPerroApp();
            }
        }, 2000); // Increased timeout
    } else {
        // All dependencies available, initialize immediately
        console.log('✅ All dependencies available, initializing app...');
        window.app = new ChamacoPerroApp();
    }
});

// Fallback initialization after page load
window.addEventListener('load', () => {
    if (!window.app) {
        console.log('🔄 Fallback initialization attempt...');
        setTimeout(() => {
            if (!window.app && typeof ChamacoPerroApp !== 'undefined') {
                console.log('🚀 Creating app instance via fallback...');
                window.app = new ChamacoPerroApp();
            }
        }, 500);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ChamacoPerroApp,
        AppStateManager,
        SearchFilterManager,
        SectionManager,
        PerformanceMonitor,
        ErrorHandler
    };
}
