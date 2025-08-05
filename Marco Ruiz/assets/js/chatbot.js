// SISTEMA DE CHATBOT INTERACTIVO
class ArcoBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupQuickActions();
    }
    
    bindEvents() {
        const chatbotButton = document.getElementById('chatbot-button');
        const chatbotClose = document.getElementById('chatbot-close');
        const chatbotSend = document.getElementById('chatbot-send');
        const messageInput = document.getElementById('chatbot-message-input');
        
        chatbotButton?.addEventListener('click', () => this.toggleChat());
        chatbotClose?.addEventListener('click', () => this.closeChat());
        
        chatbotSend?.addEventListener('click', () => this.sendMessage());
        messageInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
        
        document.addEventListener('click', (e) => {
            const chatWindow = document.getElementById('chatbot-window');
            const chatButton = document.getElementById('chatbot-button');
            
            if (this.isOpen && 
                !chatWindow?.contains(e.target) && 
                !chatButton?.contains(e.target)) {
                this.closeChat();
            }
        });
    }
    
    setupQuickActions() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const action = e.target.getAttribute('data-action');
                this.handleQuickAction(action);
            }
        });
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        const chatWindow = document.getElementById('chatbot-window');
        const chatButton = document.getElementById('chatbot-button');
        
        if (chatWindow && chatButton) {
            this.isOpen = true;
            chatWindow.classList.add('active');
            chatButton.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                const messageInput = document.getElementById('chatbot-message-input');
                messageInput?.focus();
            }, 300);
            
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
    }
    
    closeChat() {
        const chatWindow = document.getElementById('chatbot-window');
        const chatButton = document.getElementById('chatbot-button');
        
        if (chatWindow && chatButton) {
            this.isOpen = false;
            chatWindow.classList.remove('active');
            chatButton.style.transform = '';
        }
    }
    
    sendMessage() {
        const messageInput = document.getElementById('chatbot-message-input');
        const message = messageInput?.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Agregar mensaje del usuario
        this.addUserMessage(message);
        messageInput.value = '';
        
        // Simular respuesta del bot
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.handleBotResponse(message);
        }, 1500 + Math.random() * 1000);
    }
    
    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;
        
        const messageHtml = `
            <div class="message user-message">
                <div class="message-content">
                    <p>${this.escapeHtml(message)}</p>
                </div>
                <div class="message-avatar">
                    <div style="background: linear-gradient(135deg, #4FC3F7, #29B6F6); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">
                        TU
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
        this.scrollToBottom();
        this.messages.push({ type: 'user', content: message, timestamp: new Date() });
    }
    
    addBotMessage(message, includeQuickActions = false) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;
        
        const quickActionsHtml = includeQuickActions ? `
            <div class="quick-actions">
                <button class="quick-btn" data-action="productos">🏷️ Ver Productos</button>
                <button class="quick-btn" data-action="servicios">🔧 Servicios</button>
                <button class="quick-btn" data-action="contacto">📞 Contacto</button>
                <button class="quick-btn" data-action="whatsapp">💬 WhatsApp</button>
            </div>
        ` : '';
        
        const messageHtml = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <img src="assets/images/chatbot-robot.svg" alt="ArcoBot">
                </div>
                <div class="message-content">
                    <p>${message}</p>
                    ${quickActionsHtml}
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
        this.scrollToBottom();
        this.messages.push({ type: 'bot', content: message, timestamp: new Date() });
    }
    
    handleBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';
        let showActions = false;
        
        // Respuestas básicas basadas en palabras clave
        if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('saludos')) {
            response = '¡Hola! 👋 ¿En qué puedo ayudarte hoy? Soy tu asistente virtual de ArcoExpress.';
            showActions = true;
        }
        else if (lowerMessage.includes('etiqueta') || lowerMessage.includes('termica')) {
            response = '🏷️ Tenemos una amplia gama de etiquetas térmicas de alta calidad. Ofrecemos diferentes tamaños, materiales y adhesivos permanentes. ¿Te gustaría conocer más detalles específicos?';
            showActions = true;
        }
        else if (lowerMessage.includes('ribbon') || lowerMessage.includes('cinta')) {
            response = '🎗️ Nuestros ribbons de transferencia térmica son compatibles con todas las marcas principales. Tenemos opciones de cera, resina y mixtos para diferentes necesidades de impresión.';
            showActions = true;
        }
        else if (lowerMessage.includes('impresora') || lowerMessage.includes('zebra') || lowerMessage.includes('honeywell') || lowerMessage.includes('tsc')) {
            response = '🖨️ Trabajamos con las mejores marcas: Zebra, Honeywell y TSC. Ofrecemos tanto impresoras industriales como de escritorio, con soporte técnico especializado y garantía extendida.';
            showActions = true;
        }
        else if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cotiza')) {
            response = '💰 Para brindarte el mejor precio, necesito conocer tus requerimientos específicos. Te recomiendo contactar directamente a nuestro equipo de ventas para una cotización personalizada.';
            showActions = true;
        }
        else if (lowerMessage.includes('servicio') || lowerMessage.includes('soporte') || lowerMessage.includes('mantenimiento')) {
            response = '🔧 Ofrecemos servicios completos: maquila e impresión de etiquetas, señalización industrial, soporte técnico especializado y consultoría. ¿Qué servicio te interesa más?';
            showActions = true;
        }
        else if (lowerMessage.includes('contacto') || lowerMessage.includes('telefono') || lowerMessage.includes('llamar')) {
            response = '📞 Puedes contactarnos en:\n• Teléfono: +222 210 61 44\n• Email: ventas@arcoexpress.mx\n• WhatsApp: +52 222 750 68 55\n\n¡Estamos listos para ayudarte!';
        }
        else if (lowerMessage.includes('gracias') || lowerMessage.includes('perfecto') || lowerMessage.includes('excelente')) {
            response = '😊 ¡De nada! Me alegra poder ayudarte. Si tienes más preguntas sobre nuestros productos o servicios, no dudes en preguntarme.';
            showActions = true;
        }
        else if (lowerMessage.includes('adios') || lowerMessage.includes('hasta luego') || lowerMessage.includes('nos vemos')) {
            response = '👋 ¡Hasta luego! Fue un placer ayudarte. Recuerda que estoy aquí cuando necesites información sobre ArcoExpress. ¡Que tengas un excelente día!';
        }
        else {
            // Respuesta por defecto
            response = 'Entiendo tu consulta. Como especialistas en etiquetas térmicas, ribbons e impresoras con más de 20 años de experiencia, estoy aquí para ayudarte. ¿Podrías ser más específico sobre lo que necesitas?';
            showActions = true;
        }
        
        this.addBotMessage(response, showActions);
    }
    
    handleQuickAction(action) {
        let response = '';
        
        switch (action) {
            case 'productos':
                response = '🏷️ Nuestros productos principales son:\n\n• **Etiquetas Térmicas**: Diferentes tamaños y materiales\n• **Ribbons**: Cera, resina y mixtos\n• **Impresoras**: Zebra, Honeywell, TSC\n\n¿Qué producto te interesa más?';
                break;
            case 'servicios':
                response = '🔧 Ofrecemos estos servicios:\n\n• Maquila e impresión de etiquetas\n• Señalización e identificación industrial\n• Soporte técnico especializado\n• Consultoría en procesos de etiquetado\n\n¿Sobre qué servicio quieres saber más?';
                break;
            case 'contacto':
                response = '📞 **Información de Contacto:**\n\n• **Teléfonos**: +222 210 61 44 / +222 210 61 40\n• **Email**: ventas@arcoexpress.mx\n• **WhatsApp**: +52 222 750 68 55\n\n¡Contáctanos por el medio que prefieras!';
                break;
            case 'whatsapp':
                response = '💬 ¡Perfecto! Te redirijo a nuestro WhatsApp donde podrás hablar directamente con nuestro equipo de ventas.';
                // Abrir WhatsApp después de un momento
                setTimeout(() => {
                    window.open('https://api.whatsapp.com/send?phone=522227506855&text=Hola, vengo del chatbot de la página web y me gustaría obtener más información.', '_blank');
                }, 1000);
                break;
            default:
                response = 'Lo siento, no entendí esa acción. ¿En qué más puedo ayudarte?';
        }
        
        // Simular typing para acciones rápidas
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.addBotMessage(response, true);
        }, 800);
    }
    
    showTyping() {
        this.isTyping = true;
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator?.classList.add('active');
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator?.classList.remove('active');
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// INICIALIZACIÓN DEL CHATBOT
document.addEventListener('DOMContentLoaded', () => {
    window.arcoBot = new ArcoBot();
    
    console.log('ArcoBot inicializado correctamente');
});
