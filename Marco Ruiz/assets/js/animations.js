// CONTROLADOR DE EFECTOS PARALLAX
class ParallaxController {
    constructor() {
        this.elements = $$('[data-parallax]');
        this.isActive = window.innerWidth > 768;
        this.init();
    }
    
    init() {
        if (!this.isActive) return;
        
        this.bindEvents();
        this.update();
    }
    
    bindEvents() {
        window.addEventListener('scroll', throttle(() => this.update(), 16));
        window.addEventListener('resize', debounce(() => this.handleResize(), 250));
    }
    
    update() {
        if (!this.isActive) return;
        
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrollTop * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    handleResize() {
        const wasActive = this.isActive;
        this.isActive = window.innerWidth > 768;
        
        if (wasActive && !this.isActive) {
            this.elements.forEach(element => {
                element.style.transform = '';
            });
        } else if (!wasActive && this.isActive) {
            this.update();
        }
    }
}

// ANIMACIONES DE ENTRADA AL HACER SCROLL
class EnhancedScrollAnimations {
    constructor() {
        this.observer = null;
        this.elements = new Map();
        this.init();
    }
    
    init() {
        this.setupObserver();
        this.findElements();
    }
    
    setupObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => this.handleIntersection(entry));
        }, options);
    }
    
    findElements() {
        $$('[data-aos]').forEach(element => {
            this.observeElement(element);
        });
        
        $$('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(element => {
            this.observeElement(element);
        });
    }
    
    observeElement(element) {
        const config = {
            animation: element.getAttribute('data-aos') || this.getAnimationFromClass(element),
            delay: parseInt(element.getAttribute('data-aos-delay')) || 0,
            duration: parseInt(element.getAttribute('data-aos-duration')) || 800,
            easing: element.getAttribute('data-aos-easing') || 'ease-out',
            offset: parseInt(element.getAttribute('data-aos-offset')) || 100,
            once: element.hasAttribute('data-aos-once'),
            triggered: false
        };
        
        this.elements.set(element, config);
        this.observer.observe(element);
    }
    
    getAnimationFromClass(element) {
        if (element.classList.contains('scroll-reveal')) return 'fade-up';
        if (element.classList.contains('scroll-reveal-left')) return 'fade-right';
        if (element.classList.contains('scroll-reveal-right')) return 'fade-left';
        if (element.classList.contains('scroll-reveal-scale')) return 'zoom-in';
        return 'fade-up';
    }
    
    handleIntersection(entry) {
        const element = entry.target;
        const config = this.elements.get(element);
        
        if (!config) return;
        
        if (entry.isIntersecting && !config.triggered) {
            this.triggerAnimation(element, config);
            config.triggered = true;
            
            if (config.once) {
                this.observer.unobserve(element);
            }
        } else if (!entry.isIntersecting && !config.once && config.triggered) {
            this.resetAnimation(element);
            config.triggered = false;
        }
    }
    
    triggerAnimation(element, config) {
        setTimeout(() => {
            element.classList.add('aos-animated', 'revealed');
            
            // Aplicar animación CSS
            element.style.animationName = this.getAnimationName(config.animation);
            element.style.animationDuration = `${config.duration}ms`;
            element.style.animationTimingFunction = config.easing;
            element.style.animationFillMode = 'both';
            
        }, config.delay);
    }
    
    resetAnimation(element) {
        element.classList.remove('aos-animated', 'revealed');
        element.style.animationName = '';
    }
    
    getAnimationName(animation) {
        const animationMap = {
            'fade-up': 'fadeInUp',
            'fade-down': 'fadeInDown',
            'fade-left': 'fadeInLeft',
            'fade-right': 'fadeInRight',
            'zoom-in': 'zoomIn',
            'zoom-out': 'zoomOut',
            'slide-up': 'slideInUp',
            'slide-down': 'slideInDown',
            'slide-left': 'slideInLeft',
            'slide-right': 'slideInRight',
            'flip-x': 'flipInX',
            'flip-y': 'flipInY'
        };
        
        return animationMap[animation] || 'fadeInUp';
    }
}

// EFECTOS DE HOVER INTERACTIVOS
class HoverEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCardHovers();
        this.setupButtonHovers();
        this.setupImageHovers();
    }
    
    setupCardHovers() {
        $$('.product-card, .service-item, .enhanced-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => this.handleCardEnter(e));
            card.addEventListener('mouseleave', (e) => this.handleCardLeave(e));
            card.addEventListener('mousemove', (e) => this.handleCardMove(e));
        });
    }
    
    setupButtonHovers() {
        $$('.btn').forEach(button => {
            button.addEventListener('mouseenter', (e) => this.handleButtonEnter(e));
            button.addEventListener('mouseleave', (e) => this.handleButtonLeave(e));
        });
    }
    
    setupImageHovers() {
        $$('.hero-card img, .product-image img').forEach(img => {
            img.addEventListener('mouseenter', (e) => this.handleImageEnter(e));
            img.addEventListener('mouseleave', (e) => this.handleImageLeave(e));
        });
    }
    
    handleCardEnter(e) {
        const card = e.currentTarget;
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Efecto de elevación
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = '';
        card.style.boxShadow = '';
    }
    
    handleCardMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `translateY(-8px) scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    handleButtonEnter(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    handleButtonLeave(e) {
        // Limpiar ripples restantes
        const ripples = e.currentTarget.querySelectorAll('.ripple');
        ripples.forEach(ripple => ripple.remove());
    }
    
    handleImageEnter(e) {
        const img = e.currentTarget;
        img.style.transition = 'transform 0.5s ease-out';
        img.style.transform = 'scale(1.1) rotate(2deg)';
    }
    
    handleImageLeave(e) {
        const img = e.currentTarget;
        img.style.transform = '';
    }
}

// ANIMACIONES DE TEXTO INTERACTIVAS
class TextAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupTypewriter();
        this.setupCountUp();
        this.setupTextReveal();
    }
    
    setupTypewriter() {
        $$('[data-typewriter]').forEach(element => {
            this.typewriterEffect(element);
        });
    }
    
    typewriterEffect(element) {
        const text = element.getAttribute('data-typewriter');
        const speed = parseInt(element.getAttribute('data-typewriter-speed')) || 100;
        const delay = parseInt(element.getAttribute('data-typewriter-delay')) || 0;
        
        setTimeout(() => {
            element.innerHTML = '';
            let i = 0;
            
            const type = () => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    element.classList.add('typing-complete');
                }
            };
            
            type();
        }, delay);
    }
    
    setupCountUp() {
        $$('[data-countup]').forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.countUpAnimation(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    countUpAnimation(element) {
        const endValue = parseInt(element.getAttribute('data-countup'));
        const duration = parseInt(element.getAttribute('data-countup-duration')) || 2000;
        const prefix = element.getAttribute('data-countup-prefix') || '';
        const suffix = element.getAttribute('data-countup-suffix') || '';
        
        let startValue = 0;
        const increment = endValue / (duration / 16);
        
        const counter = () => {
            startValue += increment;
            if (startValue < endValue) {
                element.textContent = prefix + Math.floor(startValue) + suffix;
                requestAnimationFrame(counter);
            } else {
                element.textContent = prefix + endValue + suffix;
            }
        };
        
        counter();
    }
    
    setupTextReveal() {
        $$('[data-text-reveal]').forEach(element => {
            this.textRevealEffect(element);
        });
    }
    
    textRevealEffect(element) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span class="word">${word.split('').map(char => 
                `<span class="char">${char}</span>`
            ).join('')}</span>`
        ).join(' ');
        
        const chars = element.querySelectorAll('.char');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chars.forEach((char, index) => {
                        setTimeout(() => {
                            char.style.transform = 'translateY(0)';
                            char.style.opacity = '1';
                        }, index * 50);
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
        
        // Estilos iniciales
        chars.forEach(char => {
            char.style.display = 'inline-block';
            char.style.transform = 'translateY(20px)';
            char.style.opacity = '0';
            char.style.transition = 'all 0.3s ease-out';
        });
    }
}

// EFECTOS DE SCROLL SUAVE Y PROGRESO
class SmoothScrollEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupProgressBar();
        this.setupScrollIndicators();
    }
    
    setupProgressBar() {
        // Crear barra de progreso
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);
        
        const bar = progressBar.querySelector('.scroll-progress-bar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            bar.style.width = scrollPercent + '%';
        });
    }
    
    setupScrollIndicators() {
        $$('[data-scroll-indicator]').forEach(element => {
            const target = element.getAttribute('data-scroll-indicator');
            const targetElement = $(target);
            
            if (targetElement) {
                const indicator = document.createElement('div');
                indicator.className = 'scroll-indicator-dot';
                element.appendChild(indicator);
                
                window.addEventListener('scroll', () => {
                    const elementTop = targetElement.offsetTop;
                    const elementHeight = targetElement.offsetHeight;
                    const scrollTop = window.pageYOffset + window.innerHeight / 2;
                    
                    if (scrollTop >= elementTop && scrollTop <= elementTop + elementHeight) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            }
        });
    }
}

// GESTOS TÁCTILES PARA MÓVIL
class TouchGestures {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.minSwipeDistance = 50;
        this.init();
    }
    
    init() {
        this.setupSwipeGestures();
        this.setupPinchZoom();
    }
    
    setupSwipeGestures() {
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }
    
    handleTouchStart(e) {
        this.startX = e.changedTouches[0].screenX;
        this.startY = e.changedTouches[0].screenY;
    }
    
    handleTouchEnd(e) {
        this.endX = e.changedTouches[0].screenX;
        this.endY = e.changedTouches[0].screenY;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const deltaX = this.endX - this.startX;
        const deltaY = this.endY - this.startY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
            if (deltaX > 0) {
                this.onSwipeRight();
            } else {
                this.onSwipeLeft();
            }
        }
        
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > this.minSwipeDistance) {
            if (deltaY > 0) {
                this.onSwipeDown();
            } else {
                this.onSwipeUp();
            }
        }
    }
    
    onSwipeLeft() {
        if (APP_STATE.navOpen) {
            const navModule = window.app?.modules?.find(m => m instanceof Navigation);
            if (navModule) navModule.closeMobileMenu();
        }
    }
    
    onSwipeRight() {
        if (!APP_STATE.navOpen && APP_STATE.isMobile) {
            const navModule = window.app?.modules?.find(m => m instanceof Navigation);
            if (navModule) navModule.toggleMobileMenu();
        }
    }
    
    onSwipeUp() {
        window.scrollBy({ top: -100, behavior: 'smooth' });
    }
    
    onSwipeDown() {
        window.scrollBy({ top: 100, behavior: 'smooth' });
    }
    
    setupPinchZoom() {
        $$('.no-zoom').forEach(element => {
            element.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }
}

// ADMINISTRADOR PRINCIPAL DE ANIMACIONES
class AnimationsManager {
    constructor() {
        this.modules = [];
        this.init();
    }
    
    init() {
        if (!this.supportsAnimations()) {
            console.warn('Animations not supported, falling back to static experience');
            return;
        }
        
        this.modules.push(new ParallaxController());
        this.modules.push(new EnhancedScrollAnimations());
        this.modules.push(new HoverEffects());
        this.modules.push(new TextAnimations());
        this.modules.push(new SmoothScrollEffects());
        
        if ('ontouchstart' in window) {
            this.modules.push(new TouchGestures());
        }
        
        this.addRippleStyles();
        
        console.log('Animations initialized successfully');
    }
    
    supportsAnimations() {
        return typeof window.requestAnimationFrame === 'function' &&
               'IntersectionObserver' in window;
    }
    
    addRippleStyles() {
        if ($('#ripple-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                z-index: 9999;
                background: rgba(0, 102, 204, 0.1);
            }
            
            .scroll-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                width: 0%;
                transition: width 0.1s ease-out;
            }
            
            .scroll-indicator-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--gray-400);
                transition: all 0.3s ease;
            }
            
            .scroll-indicator-dot.active {
                background: var(--primary-color);
                transform: scale(1.5);
            }
        `;
        
        document.head.appendChild(style);
    }
}

// INICIALIZACIÓN DE SISTEMA DE ANIMACIONES
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AnimationsManager();
    });
} else {
    new AnimationsManager();
}
