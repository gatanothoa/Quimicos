/* ==========================================================================
   DATA.JS - Tienda de Limpieza del Chamaco Perro
   Data management and product catalog
   ========================================================================== */

// Product Categories
const CATEGORIES = {
    ALL: 'all',
    ACIDS: 'acids',
    DETERGENTS: 'detergents',
    DISINFECTANTS: 'disinfectants',
    SOLVENTS: 'solvents',
    INDUSTRIAL: 'industrial'
};

// Product Database
const PRODUCTS = [
    {
        id: 1,
        name: 'Ácido Muriático',
        category: CATEGORIES.ACIDS,
        description: 'Ácido clorhídrico concentrado al 33% para limpieza profunda de superficies, eliminación de óxido y sarro. Ideal para uso industrial y comercial.',
        price: 350.00,
        oldPrice: null,
        currency: 'MXN',
        icon: 'fas fa-flask',
        badge: 'Concentrado',
        specs: [
            'Concentración: 33% HCl',
            'Presentación: 1 litro',
            'Uso: Industrial/Comercial',
            'pH: <1',
            'Densidad: 1.18 g/ml'
        ],
        features: [
            'Elimina óxido y sarro',
            'Limpieza profunda',
            'Concentrado económico',
            'Múltiples usos'
        ],
        inStock: true,
        popular: true
    },
    {
        id: 2,
        name: 'Desinfectante Pine-Sol',
        category: CATEGORIES.DISINFECTANTS,
        description: 'Desinfectante multiusos con aroma a pino natural. Elimina 99.9% de gérmenes y bacterias. Ideal para pisos, superficies y áreas comunes.',
        price: 180.00,
        oldPrice: 220.00,
        currency: 'MXN',
        icon: 'fas fa-spray-can',
        badge: 'Promoción',
        specs: [
            'Concentración: Original',
            'Presentación: 1.8 litros',
            'Aroma: Pino natural',
            'Eficacia: 99.9%',
            'Registro COFEPRIS'
        ],
        features: [
            'Elimina gérmenes',
            'Aroma agradable',
            'Multiusos',
            'Larga duración'
        ],
        inStock: true,
        popular: true
    },
    {
        id: 3,
        name: 'Detergente Industrial',
        category: CATEGORIES.DETERGENTS,
        description: 'Detergente concentrado de alta potencia para uso industrial. Especial para lavandería comercial, hoteles y restaurantes.',
        price: 420.00,
        oldPrice: null,
        currency: 'MXN',
        icon: 'fas fa-soap',
        badge: 'Industrial',
        specs: [
            'Tipo: Concentrado',
            'Presentación: 4 litros',
            'pH: 9-11',
            'Uso: Profesional',
            'Biodegradable: Sí'
        ],
        features: [
            'Alta concentración',
            'Rendimiento superior',
            'Biodegradable',
            'Uso profesional'
        ],
        inStock: true,
        popular: false
    },
    {
        id: 4,
        name: 'Sosa Cáustica',
        category: CATEGORIES.INDUSTRIAL,
        description: 'Hidróxido de sodio en escamas de alta pureza. Ideal para destapar drenajes, limpieza industrial y procesos químicos.',
        price: 290.00,
        oldPrice: null,
        currency: 'MXN',
        icon: 'fas fa-fire',
        badge: 'Peligroso',
        specs: [
            'Pureza: 99% NaOH',
            'Presentación: 1 kg',
            'Estado: Escamas',
            'Solubilidad: Alta',
            'Manejo: Profesional'
        ],
        features: [
            'Alta pureza',
            'Múltiples usos',
            'Acción rápida',
            'Económico'
        ],
        inStock: true,
        popular: false
    },
    {
        id: 5,
        name: 'Cloro Concentrado',
        category: CATEGORIES.DISINFECTANTS,
        description: 'Hipoclorito de sodio al 13% de concentración. Blanqueador y desinfectante de alta potencia para uso comercial e industrial.',
        price: 220.00,
        oldPrice: null,
        currency: 'MXN',
        icon: 'fas fa-droplet',
        badge: 'Concentrado',
        specs: [
            'Concentración: 13% NaClO',
            'Presentación: 1 litro',
            'pH: 11-13',
            'Estabilidad: 6 meses',
            'Uso: Comercial'
        ],
        features: [
            'Blanquea y desinfecta',
            'Alta concentración',
            'Acción inmediata',
            'Económico'
        ],
        inStock: true,
        popular: true
    },
    {
        id: 6,
        name: 'Aceite de Pino',
        category: CATEGORIES.DISINFECTANTS,
        description: 'Aceite de pino natural 55% concentrado. Desinfectante aromático ideal para pisos y superficies con aroma duradero.',
        price: 380.00,
        oldPrice: null,
        currency: 'MXN',
        icon: 'fas fa-leaf',
        badge: 'Natural',
        specs: [
            'Concentración: 55%',
            'Presentación: 1 litro',
            'Origen: Natural',
            'Aroma: Pino',
            'Dilución: 1:20'
        ],
        features: [
            'Aroma natural',
            'Desinfectante',
            'Concentrado',
            'Larga duración'
        ],
        inStock: true,
        popular: false
    },
    {
        id: 7,
        name: 'Desengrasante Industrial',
        category: CATEGORIES.SOLVENTS,
        description: 'Desengrasante de alta potencia para equipos industriales, cocinas comerciales y talleres mecánicos.',
        price: 450.00,
        oldPrice: 520.00,
        currency: 'MXN',
        icon: 'fas fa-tools',
        badge: 'Oferta',
        specs: [
            'Tipo: Alcalino',
            'Presentación: 2 litros',
            'pH: 12-14',
            'Temperatura: Hasta 80°C',
            'Dilución: Variable'
        ],
        features: [
            'Elimina grasa pesada',
            'Acción rápida',
            'Múltiples superficies',
            'Profesional'
        ],
        inStock: true,
        popular: false
    },
    {
        id: 8,
        name: 'Jabón Líquido Antibacterial',
        category: CATEGORIES.DISINFECTANTS,
        description: 'Jabón líquido antibacterial para manos con ingredientes suaves. Ideal para baños públicos y áreas de alto tráfico.',
        price: 165.00,
        oldPrice: null,
        currency: 'MXN',
        icon: 'fas fa-hands-wash',
        badge: 'Suave',
        specs: [
            'Tipo: Antibacterial',
            'Presentación: 2 litros',
            'pH: 6.5-7.5',
            'Fragancia: Neutra',
            'Certificado: COFEPRIS'
        ],
        features: [
            'Antibacterial',
            'Suave con la piel',
            'Sin alcohol',
            'Certificado'
        ],
        inStock: true,
        popular: true
    },
    {
        id: 9,
        name: 'Limpiador Multiusos',
        category: CATEGORIES.DETERGENTS,
        description: 'Limpiador concentrado multiusos para todo tipo de superficies. Fórmula biodegradable y ecológica.',
        price: 195.00,
        oldPrice: null,
        currency: 'MXN',
        icon: 'fas fa-spray-can-sparkles',
        badge: 'Eco',
        specs: [
            'Tipo: Multiusos',
            'Presentación: 1.5 litros',
            'pH: 7-8',
            'Biodegradable: Sí',
            'Concentración: 1:10'
        ],
        features: [
            'Múltiples superficies',
            'Biodegradable',
            'Concentrado',
            'Ecológico'
        ],
        inStock: false,
        popular: false
    },
    {
        id: 10,
        name: 'Removedor de Óxido',
        category: CATEGORIES.ACIDS,
        description: 'Removedor especializado de óxido y corrosión. Fórmula avanzada para metales ferrosos y no ferrosos.',
        price: 520.00,
        oldPrice: null,
        currency: 'MXN',
        icon: 'fas fa-screwdriver-wrench',
        badge: 'Especializado',
        specs: [
            'Tipo: Ácido fosfórico',
            'Presentación: 1 litro',
            'Acción: Convertidor',
            'Tiempo: 15-30 min',
            'Protección: Incluida'
        ],
        features: [
            'Remueve óxido',
            'Convierte residuos',
            'Protege superficies',
            'Fácil aplicación'
        ],
        inStock: true,
        popular: false
    }
];

// Company Information
const COMPANY_INFO = {
    name: 'Tienda de Limpieza del Chamaco Perro',
    slogan: '¡La limpieza más perrona de México!',
    description: 'Distribuidora especializada en productos químicos de limpieza de alta calidad para uso industrial y comercial.',
    founded: 2009,
    experience: new Date().getFullYear() - 2009,
    location: 'Ciudad de México, México',
    contact: {
        phone: '+52 55 1234 5678',
        whatsapp: '+52 55 1234 5678',
        email: 'ventas@chamacoperro.mx',
        emailQuotes: 'cotizaciones@chamacoperro.mx',
        website: 'www.chamacoperro.mx'
    },
    socialMedia: {
        facebook: 'https://facebook.com/chamacoperro',
        instagram: 'https://instagram.com/chamacoperro',
        whatsapp: 'https://wa.me/5255123456788'
    },
    stats: {
        yearsExperience: new Date().getFullYear() - 2009,
        productsAvailable: 250,
        clientsSatisfied: 2500,
        qualityGuaranteed: 100
    }
};

// Services Information
const SERVICES = [
    {
        id: 1,
        name: 'Entrega Rápida',
        description: 'Entregas en 24-48 horas en área metropolitana',
        icon: 'fas fa-shipping-fast',
        features: [
            'Entrega en 24-48 horas',
            'Área metropolitana',
            'Seguimiento en tiempo real',
            'Empaque seguro'
        ]
    },
    {
        id: 2,
        name: 'Venta Mayoreo',
        description: 'Precios especiales para compras al mayoreo',
        icon: 'fas fa-handshake',
        features: [
            'Descuentos por volumen',
            'Precios mayoreo',
            'Crédito empresarial',
            'Facturación'
        ]
    },
    {
        id: 3,
        name: 'Asesoría Técnica',
        description: 'Consultoría especializada para tu industria',
        icon: 'fas fa-user-tie',
        features: [
            'Consultoría especializada',
            'Selección de productos',
            'Optimización de procesos',
            'Capacitación'
        ]
    },
    {
        id: 4,
        name: 'Calidad Garantizada',
        description: 'Productos con certificaciones de calidad',
        icon: 'fas fa-certificate',
        features: [
            'Certificaciones oficiales',
            'Control de calidad',
            'Garantía de satisfacción',
            'Soporte post-venta'
        ]
    }
];

// Shopping Cart State
let shoppingCart = {
    items: [],
    total: 0,
    count: 0
};

// Application State
const APP_STATE = {
    currentFilter: CATEGORIES.ALL,
    currentPage: 1,
    itemsPerPage: 6,
    isLoading: false,
    searchQuery: '',
    sortBy: 'name', // name, price, popular
    sortOrder: 'asc' // asc, desc
};

// Utility Functions
const DataUtils = {
    // Get all products
    getAllProducts: () => PRODUCTS,
    
    // Get products by category
    getProductsByCategory: (category) => {
        if (category === CATEGORIES.ALL) {
            return PRODUCTS;
        }
        return PRODUCTS.filter(product => product.category === category);
    },
    
    // Get product by ID
    getProductById: (id) => {
        return PRODUCTS.find(product => product.id === id);
    },
    
    // Search products
    searchProducts: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return PRODUCTS.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
        );
    },
    
    // Get popular products
    getPopularProducts: () => {
        return PRODUCTS.filter(product => product.popular);
    },
    
    // Get products in stock
    getInStockProducts: () => {
        return PRODUCTS.filter(product => product.inStock);
    },
    
    // Sort products
    sortProducts: (products, sortBy, sortOrder) => {
        const sorted = [...products].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'popular':
                    comparison = b.popular - a.popular;
                    break;
                default:
                    comparison = 0;
            }
            
            return sortOrder === 'desc' ? -comparison : comparison;
        });
        
        return sorted;
    },
    
    // Format price
    formatPrice: (price, currency = 'MXN') => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: currency
        }).format(price);
    },
    
    // Get company info
    getCompanyInfo: () => COMPANY_INFO,
    
    // Get services
    getServices: () => SERVICES,
    
    // Get categories
    getCategories: () => CATEGORIES
};

// Cart Management
const CartUtils = {
    // Add item to cart
    addItem: (productId, quantity = 1) => {
        const product = DataUtils.getProductById(productId);
        if (!product || !product.inStock) {
            return false;
        }
        
        const existingItemIndex = shoppingCart.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex > -1) {
            shoppingCart.items[existingItemIndex].quantity += quantity;
        } else {
            shoppingCart.items.push({
                productId: productId,
                product: product,
                quantity: quantity,
                subtotal: product.price * quantity
            });
        }
        
        CartUtils.updateTotals();
        return true;
    },
    
    // Remove item from cart
    removeItem: (productId) => {
        shoppingCart.items = shoppingCart.items.filter(item => item.productId !== productId);
        CartUtils.updateTotals();
    },
    
    // Update item quantity
    updateQuantity: (productId, quantity) => {
        const itemIndex = shoppingCart.items.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
            if (quantity <= 0) {
                CartUtils.removeItem(productId);
            } else {
                shoppingCart.items[itemIndex].quantity = quantity;
                shoppingCart.items[itemIndex].subtotal = shoppingCart.items[itemIndex].product.price * quantity;
                CartUtils.updateTotals();
            }
        }
    },
    
    // Clear cart
    clearCart: () => {
        shoppingCart.items = [];
        CartUtils.updateTotals();
    },
    
    // Update totals
    updateTotals: () => {
        shoppingCart.count = shoppingCart.items.reduce((total, item) => total + item.quantity, 0);
        shoppingCart.total = shoppingCart.items.reduce((total, item) => total + item.subtotal, 0);
    },
    
    // Get cart
    getCart: () => shoppingCart,
    
    // Get cart count
    getCartCount: () => shoppingCart.count,
    
    // Get cart total
    getCartTotal: () => shoppingCart.total
};

// Local Storage Management
const StorageUtils = {
    // Save cart to localStorage
    saveCart: () => {
        try {
            localStorage.setItem('chamacoperro_cart', JSON.stringify(shoppingCart));
        } catch (error) {
            console.warn('Could not save cart to localStorage:', error);
        }
    },
    
    // Load cart from localStorage
    loadCart: () => {
        try {
            const savedCart = localStorage.getItem('chamacoperro_cart');
            if (savedCart) {
                shoppingCart = JSON.parse(savedCart);
                CartUtils.updateTotals();
            }
        } catch (error) {
            console.warn('Could not load cart from localStorage:', error);
            CartUtils.clearCart();
        }
    },
    
    // Save app state
    saveAppState: () => {
        try {
            localStorage.setItem('chamacoperro_state', JSON.stringify(APP_STATE));
        } catch (error) {
            console.warn('Could not save app state to localStorage:', error);
        }
    },
    
    // Load app state
    loadAppState: () => {
        try {
            const savedState = localStorage.getItem('chamacoperro_state');
            if (savedState) {
                Object.assign(APP_STATE, JSON.parse(savedState));
            }
        } catch (error) {
            console.warn('Could not load app state from localStorage:', error);
        }
    }
};

// Analytics Utils
const AnalyticsUtils = {
    // Track product view
    trackProductView: (productId) => {
        console.log(`Product viewed: ${productId}`);
        // Here you would integrate with Google Analytics, Facebook Pixel, etc.
    },
    
    // Track add to cart
    trackAddToCart: (productId, quantity) => {
        console.log(`Product added to cart: ${productId}, quantity: ${quantity}`);
    },
    
    // Track purchase intent
    trackPurchaseIntent: (cartTotal, itemCount) => {
        console.log(`Purchase intent: $${cartTotal}, items: ${itemCount}`);
    },
    
    // Track form submission
    trackFormSubmission: (formType) => {
        console.log(`Form submitted: ${formType}`);
    },
    
    // Track search
    trackSearch: (query, resultCount) => {
        console.log(`Search performed: "${query}", results: ${resultCount}`);
    },
    
    // Track app initialization
    trackAppInitialization: (initTime) => {
        console.log(`App initialized in ${initTime.toFixed(2)}ms`);
        // Here you would send performance metrics to your analytics service
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PRODUCTS,
        CATEGORIES,
        COMPANY_INFO,
        SERVICES,
        DataUtils,
        CartUtils,
        StorageUtils,
        AnalyticsUtils,
        APP_STATE
    };
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    StorageUtils.loadCart();
    StorageUtils.loadAppState();
    console.log('🐕 Data layer initialized successfully!');
});

// Expose globals for debugging and external use
window.PRODUCTS = PRODUCTS;
window.CATEGORIES = CATEGORIES;
window.COMPANY_INFO = COMPANY_INFO;
window.SERVICES = SERVICES;
window.DataUtils = DataUtils;
window.CartUtils = CartUtils;
window.StorageUtils = StorageUtils;
window.AnalyticsUtils = AnalyticsUtils;
window.APP_STATE = APP_STATE;
