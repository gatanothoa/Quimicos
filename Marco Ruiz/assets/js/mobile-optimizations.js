// OPTIMIZACIONES ESPECÍFICAS PARA DISPOSITIVOS MÓVILES

const MOBILE_CONFIG = {
    touchEvents: {
        swipeThreshold: 50,
        tapTimeout: 300,
        longPressTimeout: 500
    },
    viewport: {
        minZoom: 0.5,
        maxZoom: 5.0
    },
    performance: {
        scrollThrottle: 16,
        resizeThrottle: 100
    }
};

// OPTIMIZACIÓN DE RENDIMIENTO MÓVIL
const optimizeMobilePerformance = () => {
    if (navigator.connection && navigator.connection.effectiveType === 'slow-2g') {
        document.body.classList.add('low-bandwidth');
    }
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    const criticalResources = [
        'assets/css/responsive.css',
        'assets/images/logo-arcoexpress.svg'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'image';
        document.head.appendChild(link);
    });
};

// GESTOS TÁCTILES AVANZADOS
const setupTouchGestures = () => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        navMenu.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = MOBILE_CONFIG.touchEvents.swipeThreshold;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && diffX > swipeThreshold) {
            closeMenu();
        }
    }
};
const optimizeMobileScroll = () => {
    let isScrolling = false;
    
    const handleScroll = throttle(() => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                updateScrollPosition();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, MOBILE_CONFIG.performance.scrollThrottle);
    
    // Usar passive listeners para mejor performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Scroll suave mejorado para móvil
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Altura del navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil después de click
                if (window.innerWidth <= 767) {
                    closeMenu();
                }
            }
        });
    });
};

// OPTIMIZACIÓN DE FORMULARIOS MÓVIL
const optimizeMobileForms = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'email' || input.type === 'tel') {
            input.addEventListener('focus', () => {
                if (window.innerWidth <= 767) {
                    document.querySelector('meta[name=viewport]').setAttribute(
                        'content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                    );
                }
            });
            
            input.addEventListener('blur', () => {
                if (window.innerWidth <= 767) {
                    document.querySelector('meta[name=viewport]').setAttribute(
                        'content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
                    );
                }
            });
        }
        
        input.addEventListener('input', function() {
            if (this.validity.valid) {
                this.classList.remove('error');
                this.classList.add('valid');
            } else {
                this.classList.remove('valid');
                this.classList.add('error');
            }
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
};

// OPTIMIZACIÓN DE BOTONES FLOTANTES
const optimizeFloatingButtons = () => {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (whatsappBtn) {
        const adjustPosition = () => {
            if (window.innerWidth <= 767) {
                const orientation = getOrientation();
                if (orientation === 'landscape') {
                    whatsappBtn.style.bottom = '10px';
                    whatsappBtn.style.right = '10px';
                } else {
                    whatsappBtn.style.bottom = '20px';
                    whatsappBtn.style.right = '20px';
                }
            }
        };
        adjustPosition();
        window.addEventListener('orientationchange', () => {
            setTimeout(adjustPosition, 100);
        });
        
        whatsappBtn.addEventListener('touchstart', () => {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, { passive: true });
    }
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        });
    }
};

// MANEJO DE CAMBIOS DE ORIENTACIÓN
const handleOrientationChange = () => {
    let lastOrientation = getOrientation();
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            const newOrientation = getOrientation();
            if (newOrientation !== lastOrientation) {
                document.body.classList.toggle('landscape', newOrientation === 'landscape');
                document.body.classList.toggle('portrait', newOrientation === 'portrait');
                
                if (APP_STATE.navOpen) {
                    closeMenu();
                }
                
                window.dispatchEvent(new Event('resize'));
                lastOrientation = newOrientation;
            }
        }, 100);
    });
};

// FUNCIONES DE UTILIDAD PARA MÓVIL
const closeMenu = () => {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        APP_STATE.navOpen = false;
        document.body.style.overflow = 'auto';
    }
};

const updateScrollPosition = () => {
    APP_STATE.scrollPosition = window.pageYOffset;
    
    const navbar = document.getElementById('navbar');
    if (navbar && window.innerWidth <= 767) {
        if (APP_STATE.scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        if (APP_STATE.scrollPosition > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
};

// INICIALIZACIÓN DE OPTIMIZACIONES MÓVIL
const initMobileOptimizations = () => {
    if (window.innerWidth <= 767 || isMobileDevice()) {
        console.log('Inicializando optimizaciones móvil...');
        
        optimizeMobilePerformance();
        setupTouchGestures();
        optimizeMobileScroll();
        optimizeMobileForms();
        optimizeFloatingButtons();
        handleOrientationChange();
        
        document.body.classList.add('mobile-optimized');
        
        console.log('Optimizaciones móvil aplicadas ✅');
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileOptimizations);
} else {
    initMobileOptimizations();
}

window.addEventListener('resize', debounce(() => {
    APP_STATE.isMobile = window.innerWidth <= 767;
    if (APP_STATE.isMobile && !document.body.classList.contains('mobile-optimized')) {
        initMobileOptimizations();
    }
}, 250));
