/* ==========================================================================
   ANIMATIONS.JS - Tienda de Limpieza del Chamaco Perro
   Advanced animations and interactive effects
   ========================================================================== */

// Animation Configuration
const ANIMATION_CONFIG = {
    // Intersection Observer options
    observerOptions: {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px 0px -50px 0px'
    },
    
    // Animation delays
    delays: {
        fast: 100,
        normal: 200,
        slow: 300,
        verySlow: 500
    },
    
    // Animation durations
    durations: {
        fast: 300,
        normal: 600,
        slow: 1000,
        verySlow: 1500
    },
    
    // Easing functions
    easings: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
};

// Advanced Intersection Observer for scroll animations
class ScrollAnimationObserver {
    constructor() {
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.createObserver('fadeIn', this.handleFadeIn.bind(this));
        this.createObserver('slideIn', this.handleSlideIn.bind(this));
        this.createObserver('zoomIn', this.handleZoomIn.bind(this));
        this.createObserver('stagger', this.handleStagger.bind(this));
        this.createObserver('parallax', this.handleParallax.bind(this));
    }
    
    createObserver(name, callback) {
        const observer = new IntersectionObserver(callback, ANIMATION_CONFIG.observerOptions);
        this.observers.set(name, observer);
        
        // Observe elements
        document.querySelectorAll(`[data-animation="${name}"]`).forEach(element => {
            observer.observe(element);
        });
    }
    
    handleFadeIn(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }
    
    handleSlideIn(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const direction = element.getAttribute('data-direction') || 'left';
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0) translateY(0)';
                }, delay);
            }
        });
    }
    
    handleZoomIn(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                }, delay);
            }
        });
    }
    
    handleStagger(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const children = container.querySelectorAll('[data-stagger-item]');
                const baseDelay = parseInt(container.getAttribute('data-delay')) || 0;
                const staggerDelay = parseInt(container.getAttribute('data-stagger-delay')) || 100;
                
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, baseDelay + (index * staggerDelay));
                });
            }
        });
    }
    
    handleParallax(entries) {
        entries.forEach(entry => {
            const element = entry.target;
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            const rect = element.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const parallaxValue = scrolled * speed;
            
            element.style.transform = `translateY(${parallaxValue}px)`;
        });
    }
}

// Text Animation Manager
class TextAnimationManager {
    constructor() {
        this.typewriterElements = [];
        this.init();
    }
    
    init() {
        this.initTypewriter();
        this.initTextReveal();
        this.initCounterAnimations();
    }
    
    initTypewriter() {
        document.querySelectorAll('[data-typewriter]').forEach(element => {
            const text = element.getAttribute('data-typewriter');
            const speed = parseInt(element.getAttribute('data-speed')) || 50;
            
            this.typewriterElements.push({
                element,
                text,
                speed,
                currentIndex: 0,
                isAnimated: false
            });
        });
        
        // Start typewriter when elements are visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const typewriterData = this.typewriterElements.find(
                        data => data.element === entry.target
                    );
                    
                    if (typewriterData && !typewriterData.isAnimated) {
                        this.startTypewriter(typewriterData);
                        typewriterData.isAnimated = true;
                    }
                }
            });
        });
        
        this.typewriterElements.forEach(data => {
            observer.observe(data.element);
        });
    }
    
    startTypewriter(data) {
        const { element, text, speed } = data;
        element.textContent = '';
        
        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
    
    initTextReveal() {
        document.querySelectorAll('[data-text-reveal]').forEach(element => {
            const words = element.textContent.split(' ');
            element.innerHTML = words.map(word => 
                `<span class="word-reveal">${word}</span>`
            ).join(' ');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const words = entry.target.querySelectorAll('.word-reveal');
                        words.forEach((word, index) => {
                            setTimeout(() => {
                                word.style.opacity = '1';
                                word.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    initCounterAnimations() {
        document.querySelectorAll('[data-counter]').forEach(element => {
            const target = parseInt(element.getAttribute('data-counter'));
            const duration = parseInt(element.getAttribute('data-duration')) || 2000;
            const suffix = element.getAttribute('data-suffix') || '';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(element, target, duration, suffix);
                        observer.unobserve(element);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    animateCounter(element, target, duration, suffix) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + suffix;
            }
        }, 16);
    }
}

// Particle Animation System
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            particleCount: options.particleCount || 50,
            particleColor: options.particleColor || '#ffffff',
            particleSize: options.particleSize || 2,
            animationSpeed: options.animationSpeed || 1,
            connectionDistance: options.connectionDistance || 100,
            ...options
        };
        
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.handleResize();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.resizeCanvas();
        this.container.appendChild(this.canvas);
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.animationSpeed,
                vy: (Math.random() - 0.5) * this.options.animationSpeed,
                size: Math.random() * this.options.particleSize + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.particleColor;
            this.ctx.fill();
        });
        
        // Draw connections
        this.drawConnections();
        
        requestAnimationFrame(this.animate.bind(this));
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectionDistance) {
                    const opacity = 1 - (distance / this.options.connectionDistance);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
}

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.points = [];
        this.maxPoints = 20;
        this.init();
    }
    
    init() {
        this.createTrailElements();
        this.bindEvents();
    }
    
    createTrailElements() {
        for (let i = 0; i < this.maxPoints; i++) {
            const point = document.createElement('div');
            point.className = 'mouse-trail-point';
            point.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: var(--primary-color);
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(point);
            this.points.push(point);
        }
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.updateTrail(e.clientX, e.clientY);
        });
        
        document.addEventListener('mouseenter', () => {
            this.showTrail();
        });
        
        document.addEventListener('mouseleave', () => {
            this.hideTrail();
        });
    }
    
    updateTrail(x, y) {
        this.points.forEach((point, index) => {
            setTimeout(() => {
                point.style.left = x + 'px';
                point.style.top = y + 'px';
                point.style.opacity = (this.maxPoints - index) / this.maxPoints;
                point.style.transform = `scale(${(this.maxPoints - index) / this.maxPoints})`;
            }, index * 20);
        });
    }
    
    showTrail() {
        this.points.forEach(point => {
            point.style.display = 'block';
        });
    }
    
    hideTrail() {
        this.points.forEach(point => {
            point.style.opacity = '0';
        });
    }
}

// Ripple Effect Manager
class RippleEffectManager {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn, .card, .product-card');
            if (target) {
                this.createRipple(e, target);
            }
        });
    }
    
    createRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Ensure element has relative positioning
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Floating Elements Manager
class FloatingElementsManager {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        document.querySelectorAll('[data-float]').forEach(element => {
            const amplitude = parseFloat(element.getAttribute('data-amplitude')) || 10;
            const speed = parseFloat(element.getAttribute('data-speed')) || 2000;
            const delay = parseFloat(element.getAttribute('data-delay')) || 0;
            
            this.elements.push({
                element,
                amplitude,
                speed,
                delay,
                startY: 0
            });
        });
        
        this.animate();
    }
    
    animate() {
        const currentTime = Date.now();
        
        this.elements.forEach(({ element, amplitude, speed, delay, startY }) => {
            const elapsed = currentTime + delay;
            const y = startY + Math.sin(elapsed / speed) * amplitude;
            element.style.transform = `translateY(${y}px)`;
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Loading Animation Manager
class LoadingAnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.createLoadingAnimations();
        this.handlePageLoad();
    }
    
    createLoadingAnimations() {
        // Add CSS for loading animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .word-reveal {
                display: inline-block;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.5s ease;
            }
            
            .mouse-trail-point {
                will-change: transform, opacity;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    handlePageLoad() {
        window.addEventListener('load', () => {
            // Hide loading screen with animation
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 1000);
            }
            
            // Trigger entrance animations
            this.triggerEntranceAnimations();
        });
    }
    
    triggerEntranceAnimations() {
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero .animate-on-load');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}

// Performance Monitor
class AnimationPerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.fps = 60;
        this.init();
    }
    
    init() {
        this.monitor();
        this.optimizeForDevice();
    }
    
    monitor() {
        this.frameCount++;
        const currentTime = Date.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Adjust animations based on performance
            if (this.fps < 30) {
                this.reduceAnimationComplexity();
            } else if (this.fps > 55) {
                this.increaseAnimationComplexity();
            }
        }
        
        requestAnimationFrame(this.monitor.bind(this));
    }
    
    optimizeForDevice() {
        // Detect device capabilities
        const isLowEnd = navigator.hardwareConcurrency < 4 || 
                        navigator.deviceMemory < 4 ||
                        /Android/.test(navigator.userAgent);
        
        if (isLowEnd) {
            document.body.classList.add('low-performance');
            this.disableExpensiveAnimations();
        }
    }
    
    reduceAnimationComplexity() {
        document.body.classList.add('reduced-animations');
    }
    
    increaseAnimationComplexity() {
        document.body.classList.remove('reduced-animations');
    }
    
    disableExpensiveAnimations() {
        // Disable particle systems
        document.querySelectorAll('.particle-system').forEach(system => {
            system.style.display = 'none';
        });
        
        // Simplify transitions
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
}

// Main Animation Manager
class AnimationManager {
    constructor() {
        this.modules = new Map();
        this.init();
    }
    
    init() {
        // Initialize all animation modules
        this.modules.set('scrollAnimations', new ScrollAnimationObserver());
        this.modules.set('textAnimations', new TextAnimationManager());
        this.modules.set('rippleEffects', new RippleEffectManager());
        this.modules.set('floatingElements', new FloatingElementsManager());
        this.modules.set('loadingAnimations', new LoadingAnimationManager());
        this.modules.set('performanceMonitor', new AnimationPerformanceMonitor());
        
        // Initialize mouse trail only on desktop
        if (!this.isMobile()) {
            this.modules.set('mouseTrail', new MouseTrail());
        }
        
        // Initialize particle systems
        this.initParticleSystems();
        
        console.log('✨ Animation systems initialized successfully!');
    }
    
    initParticleSystems() {
        document.querySelectorAll('[data-particles]').forEach(container => {
            const options = {
                particleCount: parseInt(container.getAttribute('data-particle-count')) || 50,
                particleColor: container.getAttribute('data-particle-color') || '#ffffff',
                animationSpeed: parseFloat(container.getAttribute('data-animation-speed')) || 1
            };
            
            new ParticleSystem(container, options);
        });
    }
    
    isMobile() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Public API for controlling animations
    pause() {
        document.body.classList.add('animations-paused');
    }
    
    resume() {
        document.body.classList.remove('animations-paused');
    }
    
    reduceMotion() {
        document.body.classList.add('reduced-motion');
    }
    
    enableMotion() {
        document.body.classList.remove('reduced-motion');
    }
}

// Initialize animation manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
    
    // Initialize animation manager
    window.animationManager = new AnimationManager();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationManager,
        ScrollAnimationObserver,
        TextAnimationManager,
        ParticleSystem,
        MouseTrail,
        RippleEffectManager,
        FloatingElementsManager,
        ANIMATION_CONFIG
    };
}
