/* ==========================================================================
   COMPONENTS.JS - Tienda de Limpieza del Chamaco Perro
   UI Components and DOM manipulation
   ========================================================================== */

// Component Templates
const ComponentTemplates = {
    // Product Card Template
    productCard: (product) => `
        <div class="product-card scroll-animate" data-category="${product.category}" data-product-id="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-icon">
                <i class="${product.icon}"></i>
            </div>
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            
            <div class="product-specs">
                <h4>Especificaciones:</h4>
                <ul>
                    ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="product-price">
                <span class="currency">$</span>${product.price.toFixed(2)}
                ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            
            <div class="product-actions">
                <button class="btn-add-cart ${!product.inStock ? 'disabled' : ''}" 
                        onclick="ProductComponents.addToCart(${product.id})"
                        ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i>
                    ${product.inStock ? 'Agregar' : 'Agotado'}
                </button>
                <button class="btn-favorite" onclick="ProductComponents.toggleFavorite(${product.id})" title="Agregar a favoritos">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `,
    
    // Service Card Template
    serviceCard: (service) => `
        <div class="service-card scroll-animate">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
        </div>
    `,
    
    // Cart Item Template
    cartItem: (item) => `
        <div class="cart-item" data-product-id="${item.productId}">
            <div class="cart-item-image">
                <i class="${item.product.icon}"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="CartComponents.decreaseQuantity(${item.productId})">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       onchange="CartComponents.updateQuantity(${item.productId}, this.value)" min="1">
                <button class="quantity-btn" onclick="CartComponents.increaseQuantity(${item.productId})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="cart-item-remove" onclick="CartComponents.removeItem(${item.productId})" title="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `,
    
    // Contact Card Template
    contactCard: (contact) => `
        <div class="contact-card">
            <div class="contact-icon">
                <i class="${contact.icon}"></i>
            </div>
            <h3>${contact.title}</h3>
            <p>${contact.info}</p>
            <p><small>${contact.subtitle}</small></p>
        </div>
    `,
    
    // Stat Card Template
    statCard: (stat) => `
        <div class="stat-card scroll-animate" data-aos="fade-up" data-aos-delay="${stat.delay}">
            <div class="stat-icon">
                <i class="${stat.icon}"></i>
            </div>
            <div class="stat-number" data-count="${stat.value}">0</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `
};

// Product Components
const ProductComponents = {
    // Render products grid
    renderProducts: (products = []) => {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;
        
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros filtros o términos de búsqueda</p>
                </div>
            `;
            return;
        }
        
        productsGrid.innerHTML = products.map(product => 
            ComponentTemplates.productCard(product)
        ).join('');
        
        // Initialize scroll animations
        AnimationComponents.initScrollAnimations();
    },
    
    // Filter products
    filterProducts: (category) => {
        APP_STATE.currentFilter = category;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${category}"]`).classList.add('active');
        
        // Get and render filtered products
        const products = DataUtils.getProductsByCategory(category);
        const sortedProducts = DataUtils.sortProducts(products, APP_STATE.sortBy, APP_STATE.sortOrder);
        ProductComponents.renderProducts(sortedProducts);
        
        // Save state
        StorageUtils.saveAppState();
    },
    
    // Add product to cart
    addToCart: (productId) => {
        const success = CartUtils.addItem(productId, 1);
        
        if (success) {
            // Update cart UI
            CartComponents.updateCartUI();
            
            // Show success message
            NotificationComponents.showNotification('Producto agregado al carrito', 'success');
            
            // Track analytics
            AnalyticsUtils.trackAddToCart(productId, 1);
            
            // Save cart
            StorageUtils.saveCart();
        } else {
            NotificationComponents.showNotification('No se pudo agregar el producto', 'error');
        }
    },
    
    // Toggle favorite
    toggleFavorite: (productId) => {
        const btn = document.querySelector(`[data-product-id="${productId}"] .btn-favorite`);
        const icon = btn.querySelector('i');
        
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
            icon.className = 'far fa-heart';
            NotificationComponents.showNotification('Eliminado de favoritos', 'info');
        } else {
            btn.classList.add('active');
            icon.className = 'fas fa-heart';
            NotificationComponents.showNotification('Agregado a favoritos', 'success');
        }
    },
    
    // Initialize product filters
    initProductFilters: () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-filter');
                ProductComponents.filterProducts(category);
            });
        });
    }
};

// Cart Components
const CartComponents = {
    // Update cart UI
    updateCartUI: () => {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartItems = document.getElementById('cart-items');
        
        const cart = CartUtils.getCart();
        
        // Update cart count
        if (cartCount) {
            cartCount.textContent = cart.count;
            cartCount.style.display = cart.count > 0 ? 'flex' : 'none';
        }
        
        // Update cart total
        if (cartTotal) {
            cartTotal.textContent = cart.total.toFixed(2);
        }
        
        // Update cart items
        if (cartItems) {
            if (cart.items.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Tu carrito está vacío</h3>
                        <p>Agrega algunos productos para comenzar</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = cart.items.map(item => 
                    ComponentTemplates.cartItem(item)
                ).join('');
            }
        }
    },
    
    // Show cart modal
    showCart: () => {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            CartComponents.updateCartUI();
        }
    },
    
    // Hide cart modal
    hideCart: () => {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    // Increase quantity
    increaseQuantity: (productId) => {
        const cart = CartUtils.getCart();
        const item = cart.items.find(item => item.productId === productId);
        if (item) {
            CartUtils.updateQuantity(productId, item.quantity + 1);
            CartComponents.updateCartUI();
            StorageUtils.saveCart();
        }
    },
    
    // Decrease quantity
    decreaseQuantity: (productId) => {
        const cart = CartUtils.getCart();
        const item = cart.items.find(item => item.productId === productId);
        if (item && item.quantity > 1) {
            CartUtils.updateQuantity(productId, item.quantity - 1);
            CartComponents.updateCartUI();
            StorageUtils.saveCart();
        }
    },
    
    // Update quantity
    updateQuantity: (productId, quantity) => {
        const newQuantity = Math.max(1, parseInt(quantity) || 1);
        CartUtils.updateQuantity(productId, newQuantity);
        CartComponents.updateCartUI();
        StorageUtils.saveCart();
    },
    
    // Remove item
    removeItem: (productId) => {
        CartUtils.removeItem(productId);
        CartComponents.updateCartUI();
        StorageUtils.saveCart();
        NotificationComponents.showNotification('Producto eliminado del carrito', 'info');
    },
    
    // Clear cart
    clearCart: () => {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            CartUtils.clearCart();
            CartComponents.updateCartUI();
            StorageUtils.saveCart();
            NotificationComponents.showNotification('Carrito vaciado', 'info');
        }
    },
    
    // Checkout
    checkout: () => {
        const cart = CartUtils.getCart();
        if (cart.items.length === 0) {
            NotificationComponents.showNotification('El carrito está vacío', 'warning');
            return;
        }
        
        // Generate WhatsApp message
        const message = CartComponents.generateWhatsAppMessage(cart);
        const whatsappUrl = `https://wa.me/5255123456788?text=${encodeURIComponent(message)}`;
        
        // Track analytics
        AnalyticsUtils.trackPurchaseIntent(cart.total, cart.count);
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        NotificationComponents.showNotification('Redirigiendo a WhatsApp...', 'success');
    },
    
    // Generate WhatsApp message
    generateWhatsAppMessage: (cart) => {
        const company = DataUtils.getCompanyInfo();
        let message = `🛒 *Solicitud de Cotización - ${company.name}*\n\n`;
        message += `Hola! Me interesa cotizar los siguientes productos:\n\n`;
        
        cart.items.forEach((item, index) => {
            message += `${index + 1}. *${item.product.name}*\n`;
            message += `   Cantidad: ${item.quantity}\n`;
            message += `   Precio unitario: $${item.product.price.toFixed(2)}\n`;
            message += `   Subtotal: $${item.subtotal.toFixed(2)}\n\n`;
        });
        
        message += `💰 *Total: $${cart.total.toFixed(2)} MXN*\n\n`;
        message += `Por favor, envíenme una cotización formal con:\n`;
        message += `• Precios actualizados\n`;
        message += `• Disponibilidad\n`;
        message += `• Tiempos de entrega\n`;
        message += `• Condiciones de pago\n\n`;
        message += `¡Gracias! 🐕`;
        
        return message;
    },
    
    // Initialize cart events
    initCartEvents: () => {
        // Cart button
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', CartComponents.showCart);
        }
        
        // Modal close
        const modalClose = document.getElementById('modal-close');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (modalClose) {
            modalClose.addEventListener('click', CartComponents.hideCart);
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', CartComponents.hideCart);
        }
        
        // Clear cart button
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', CartComponents.clearCart);
        }
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', CartComponents.checkout);
        }
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                CartComponents.hideCart();
            }
        });
    }
};

// Form Components
const FormComponents = {
    // Handle contact form
    handleContactForm: (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!FormComponents.validateContactForm(data)) {
            return;
        }
        
        // Generate WhatsApp message
        const message = FormComponents.generateContactMessage(data);
        const whatsappUrl = `https://wa.me/5255123456788?text=${encodeURIComponent(message)}`;
        
        // Track analytics
        AnalyticsUtils.trackFormSubmission('contact');
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        NotificationComponents.showNotification('Redirigiendo a WhatsApp...', 'success');
        
        // Reset form
        e.target.reset();
    },
    
    // Validate contact form
    validateContactForm: (data) => {
        const required = ['name', 'email', 'subject', 'message'];
        const missing = required.filter(field => !data[field] || data[field].trim() === '');
        
        if (missing.length > 0) {
            NotificationComponents.showNotification(
                `Por favor completa los campos: ${missing.join(', ')}`, 
                'error'
            );
            return false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            NotificationComponents.showNotification('Por favor ingresa un email válido', 'error');
            return false;
        }
        
        return true;
    },
    
    // Generate contact message
    generateContactMessage: (data) => {
        const company = DataUtils.getCompanyInfo();
        let message = `📞 *Contacto - ${company.name}*\n\n`;
        message += `*Nombre:* ${data.name}\n`;
        message += `*Email:* ${data.email}\n`;
        if (data.phone) message += `*Teléfono:* ${data.phone}\n`;
        if (data.company) message += `*Empresa:* ${data.company}\n`;
        message += `*Asunto:* ${data.subject}\n\n`;
        message += `*Mensaje:*\n${data.message}\n\n`;
        message += `Por favor contáctenme para brindarme más información. ¡Gracias! 🐕`;
        
        return message;
    },
    
    // Initialize forms
    initForms: () => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', FormComponents.handleContactForm);
        }
    }
};

// Navigation Components
const NavigationComponents = {
    // Handle smooth scrolling
    initSmoothScrolling: () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },
    
    // Handle mobile menu
    initMobileMenu: () => {
        const menuToggle = document.getElementById('menu-toggle');
        const nav = document.getElementById('nav');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
            
            // Close menu when clicking on links
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                });
            });
        }
    },
    
    // Handle header scroll effect
    initHeaderScroll: () => {
        const header = document.getElementById('header');
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    },
    
    // Handle back to top button
    initBackToTop: () => {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// Animation Components
const AnimationComponents = {
    // Initialize scroll animations
    initScrollAnimations: () => {
        const animatedElements = document.querySelectorAll('.scroll-animate');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    },
    
    // Initialize counter animations
    initCounterAnimations: () => {
        const counters = document.querySelectorAll('[data-count]');
        
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    AnimationComponents.animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    },
    
    // Animate counter
    animateCounter: (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }
};

// Notification Components
const NotificationComponents = {
    // Show notification
    showNotification: (message, type = 'info', duration = 3000) => {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${NotificationComponents.getIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: NotificationComponents.getColor(type),
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out'
        });
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    },
    
    // Get icon for notification type
    getIcon: (type) => {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },
    
    // Get color for notification type
    getColor: (type) => {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || '#3498db';
    }
};

// Loading Components
const LoadingComponents = {
    // Show loading screen
    showLoading: () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    },
    
    // Hide loading screen
    hideLoading: () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1000);
        }
    }
};

// Initialize all components
const ComponentsInit = {
    init: () => {
        // Initialize navigation
        NavigationComponents.initSmoothScrolling();
        NavigationComponents.initMobileMenu();
        NavigationComponents.initHeaderScroll();
        NavigationComponents.initBackToTop();
        
        // Initialize animations
        AnimationComponents.initScrollAnimations();
        AnimationComponents.initCounterAnimations();
        
        // Initialize product components
        ProductComponents.initProductFilters();
        
        // Initialize cart
        CartComponents.initCartEvents();
        CartComponents.updateCartUI();
        
        // Initialize forms
        FormComponents.initForms();
        
        console.log('🧩 Components initialized successfully!');
    }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', ComponentsInit.init);

// Expose components globally for debugging and external use
window.NavigationComponents = NavigationComponents;
window.AnimationComponents = AnimationComponents;
window.ProductComponents = ProductComponents;
window.CartComponents = CartComponents;
window.FormComponents = FormComponents;
window.LoadingComponents = LoadingComponents;
window.ComponentsInit = ComponentsInit;

// For module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NavigationComponents,
        AnimationComponents,
        ProductComponents,
        CartComponents,
        FormComponents,
        LoadingComponents,
        ComponentsInit
    };
}
