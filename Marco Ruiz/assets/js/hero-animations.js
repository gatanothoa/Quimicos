// ANIMACIONES ESPECIALES PARA LA SECCIÓN HERO
document.addEventListener('DOMContentLoaded', function() {
    
    function animateYearCounter() {
        const heroCard = document.querySelector('.hero-card');
        
        if (heroCard) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        heroCard.classList.add('animate-in');
                        
                        setInterval(() => {
                            heroCard.style.transform = 'perspective(1000px) rotateY(-10deg) scale(1.02)';
                            setTimeout(() => {
                                heroCard.style.transform = 'perspective(1000px) rotateY(-10deg) scale(1)';
                            }, 200);
                        }, 8000);
                    }
                });
            }, {
                threshold: 0.3
            });
            
            observer.observe(heroCard);
        }
    }
    
    function addParticleEffects() {
        const heroCard = document.querySelector('.hero-card');
        
        if (heroCard) {
            heroCard.addEventListener('mouseenter', () => {
                createParticles(heroCard);
            });
        }
    }
    
    function createParticles(container) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'hero-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                    border-radius: 50%;
                    pointer-events: none;
                    animation: particleFloat 2s ease-out forwards;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    z-index: 10;
                `;
                
                container.appendChild(particle);
                
                // Remover partícula después de la animación
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 100);
        }
    }
    
    function typewriterEffect() {
        const title = document.querySelector('.hero-title');
        if (title) {
            const text = title.innerHTML;
            title.innerHTML = '';
            title.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    title.innerHTML = text.slice(0, i + 1);
                    i++;
                } else {
                    clearInterval(timer);
                    setTimeout(() => {
                        title.style.borderRight = 'none';
                    }, 1000);
                }
            }, 50);
        }
    }
    
    animateYearCounter();
    addParticleEffects();
    
    setTimeout(typewriterEffect, 1000);
});

// ESTILOS CSS PARA LAS ANIMACIONES
const additionalStyles = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
    
    .hero-card.animate-in {
        animation: slideInFromRight 1s ease-out;
    }
    
    @keyframes slideInFromRight {
        0% {
            transform: perspective(1000px) rotateY(-45deg) translateX(100px);
            opacity: 0;
        }
        100% {
            transform: perspective(1000px) rotateY(-10deg) translateX(0);
            opacity: 1;
        }
    }
    
    .hero-particle {
        animation: particleFloat 2s ease-out forwards;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
