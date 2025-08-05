// VALIDADOR AVANZADO DE FORMULARIOS
class FormValidator {
    constructor(form, options = {}) {
        this.form = form;
        this.options = {
            validateOnInput: true,
            validateOnBlur: true,
            showErrorMessages: true,
            errorClass: 'has-error',
            successClass: 'has-success',
            ...options
        };
        
        this.rules = new Map();
        this.customMessages = new Map();
        this.init();
    }
    
    init() {
        this.setupDefaultRules();
        this.bindEvents();
        this.createErrorElements();
    }
    
    setupDefaultRules() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const fieldRules = [];
            
            if (input.hasAttribute('required')) {
                fieldRules.push('required');
            }
            
            if (input.type === 'email') {
                fieldRules.push('email');
            }
            
            if (input.type === 'tel') {
                fieldRules.push('phone');
            }
            
            if (input.type === 'url') {
                fieldRules.push('url');
            }
            
            if (input.hasAttribute('minlength')) {
                fieldRules.push(`minLength:${input.getAttribute('minlength')}`);
            }
            
            if (input.hasAttribute('maxlength')) {
                fieldRules.push(`maxLength:${input.getAttribute('maxlength')}`);
            }
            
            if (input.hasAttribute('pattern')) {
                fieldRules.push(`pattern:${input.getAttribute('pattern')}`);
            }
            
            if (fieldRules.length > 0) {
                this.addRule(input.name || input.id, fieldRules);
            }
        });
    }
    
    addRule(fieldName, rules) {
        this.rules.set(fieldName, Array.isArray(rules) ? rules : [rules]);
        return this;
    }
    
    addCustomMessage(fieldName, rule, message) {
        const key = `${fieldName}.${rule}`;
        this.customMessages.set(key, message);
        return this;
    }
    
    bindEvents() {
        if (this.options.validateOnInput) {
            this.form.addEventListener('input', (e) => {
                if (this.isFormField(e.target)) {
                    this.validateField(e.target);
                }
            });
        }
        
        if (this.options.validateOnBlur) {
            this.form.addEventListener('blur', (e) => {
                if (this.isFormField(e.target)) {
                    this.validateField(e.target);
                }
            }, true);
        }
        
        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
                this.focusFirstError();
            }
        });
    }
    
    createErrorElements() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            const formGroup = field.closest('.form-group');
            if (formGroup && !formGroup.querySelector('.error-message')) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
        });
    }
    
    isFormField(element) {
        return ['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
    }
    
    validateField(field) {
        const fieldName = field.name || field.id;
        const rules = this.rules.get(fieldName);
        
        if (!rules) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        for (const rule of rules) {
            const result = this.applyRule(field, rule);
            if (!result.valid) {
                isValid = false;
                errorMessage = result.message;
                break; // Parar en el primer error
            }
        }
        
        this.updateFieldUI(field, isValid, errorMessage);
        return isValid;
    }
    
    applyRule(field, rule) {
        const value = field.value.trim();
        const [ruleName, ruleParam] = rule.split(':');
        
        switch (ruleName) {
            case 'required':
                return this.validateRequired(value, field);
                
            case 'email':
                return this.validateEmail(value);
                
            case 'phone':
                return this.validatePhone(value);
                
            case 'url':
                return this.validateUrl(value);
                
            case 'minLength':
                return this.validateMinLength(value, parseInt(ruleParam));
                
            case 'maxLength':
                return this.validateMaxLength(value, parseInt(ruleParam));
                
            case 'pattern':
                return this.validatePattern(value, ruleParam);
                
            case 'numeric':
                return this.validateNumeric(value);
                
            case 'alphanumeric':
                return this.validateAlphanumeric(value);
                
            case 'match':
                return this.validateMatch(field, ruleParam);
                
            default:
                return { valid: true };
        }
    }
    
    validateRequired(value, field) {
        let isValid = false;
        
        if (field.type === 'checkbox' || field.type === 'radio') {
            isValid = field.checked;
        } else if (field.tagName === 'SELECT') {
            isValid = value !== '';
        } else {
            isValid = value.length > 0;
        }
        
        return {
            valid: isValid,
            message: isValid ? '' : 'Este campo es requerido'
        };
    }
    
    validateEmail(value) {
        if (!value) return { valid: true }; // Solo validar si tiene valor
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);
        
        return {
            valid: isValid,
            message: isValid ? '' : 'Ingresa un email válido'
        };
    }
    
    validatePhone(value) {
        if (!value) return { valid: true };
        
        // Permitir números, espacios, guiones, paréntesis y +
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        const isValid = phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
        
        return {
            valid: isValid,
            message: isValid ? '' : 'Ingresa un teléfono válido (mínimo 10 dígitos)'
        };
    }
    
    validateUrl(value) {
        if (!value) return { valid: true };
        
        try {
            new URL(value);
            return { valid: true };
        } catch {
            return {
                valid: false,
                message: 'Ingresa una URL válida'
            };
        }
    }
    
    validateMinLength(value, minLength) {
        const isValid = value.length >= minLength;
        
        return {
            valid: isValid,
            message: isValid ? '' : `Mínimo ${minLength} caracteres`
        };
    }
    
    validateMaxLength(value, maxLength) {
        const isValid = value.length <= maxLength;
        
        return {
            valid: isValid,
            message: isValid ? '' : `Máximo ${maxLength} caracteres`
        };
    }
    
    validatePattern(value, pattern) {
        if (!value) return { valid: true };
        
        const regex = new RegExp(pattern);
        const isValid = regex.test(value);
        
        return {
            valid: isValid,
            message: isValid ? '' : 'Formato no válido'
        };
    }
    
    validateNumeric(value) {
        if (!value) return { valid: true };
        
        const isValid = /^\d+$/.test(value);
        
        return {
            valid: isValid,
            message: isValid ? '' : 'Solo se permiten números'
        };
    }
    
    validateAlphanumeric(value) {
        if (!value) return { valid: true };
        
        const isValid = /^[a-zA-Z0-9]+$/.test(value);
        
        return {
            valid: isValid,
            message: isValid ? '' : 'Solo se permiten letras y números'
        };
    }
    
    validateMatch(field, targetFieldName) {
        const targetField = this.form.querySelector(`[name="${targetFieldName}"], #${targetFieldName}`);
        const isValid = targetField && field.value === targetField.value;
        
        return {
            valid: isValid,
            message: isValid ? '' : 'Los campos no coinciden'
        };
    }
    
    updateFieldUI(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message');
        
        // Limpiar clases anteriores
        formGroup.classList.remove(this.options.errorClass, this.options.successClass);
        
        if (!isValid) {
            formGroup.classList.add(this.options.errorClass);
            if (errorElement && this.options.showErrorMessages) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
        } else if (field.value.trim()) {
            formGroup.classList.add(this.options.successClass);
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        } else {
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    }
    
    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    focusFirstError() {
        const firstError = this.form.querySelector(`.${this.options.errorClass} input, .${this.options.errorClass} select, .${this.options.errorClass} textarea`);
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    reset() {
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove(this.options.errorClass, this.options.successClass);
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    }
}

// AUTOCOMPLETADO Y SUGERENCIAS
class AutoComplete {
    constructor(input, options = {}) {
        this.input = input;
        this.options = {
            minLength: 2,
            maxResults: 10,
            delay: 300,
            source: [],
            ...options
        };
        
        this.timeout = null;
        this.dropdown = null;
        this.selectedIndex = -1;
        this.init();
    }
    
    init() {
        this.createDropdown();
        this.bindEvents();
    }
    
    createDropdown() {
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'autocomplete-dropdown';
        this.dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid var(--gray-300);
            border-top: none;
            border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
            box-shadow: var(--shadow-lg);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        
        const container = this.input.parentNode;
        container.style.position = 'relative';
        container.appendChild(this.dropdown);
    }
    
    bindEvents() {
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('blur', () => this.handleBlur());
        this.input.addEventListener('focus', (e) => this.handleInput(e));
        
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }
    
    handleInput(e) {
        const query = e.target.value.trim();
        
        clearTimeout(this.timeout);
        
        if (query.length < this.options.minLength) {
            this.hideDropdown();
            return;
        }
        
        this.timeout = setTimeout(() => {
            this.search(query);
        }, this.options.delay);
    }
    
    handleKeydown(e) {
        if (!this.isDropdownVisible()) return;
        
        const items = this.dropdown.querySelectorAll('.autocomplete-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.highlightItem();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.highlightItem();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectItem(items[this.selectedIndex]);
                }
                break;
                
            case 'Escape':
                this.hideDropdown();
                break;
        }
    }
    
    handleBlur() {
        // Retrasar para permitir clicks en el dropdown
        setTimeout(() => {
            this.hideDropdown();
        }, 150);
    }
    
    async search(query) {
        let results = [];
        
        if (typeof this.options.source === 'function') {
            results = await this.options.source(query);
        } else if (Array.isArray(this.options.source)) {
            results = this.options.source.filter(item => 
                item.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        results = results.slice(0, this.options.maxResults);
        this.showResults(results);
    }
    
    showResults(results) {
        if (results.length === 0) {
            this.hideDropdown();
            return;
        }
        
        this.dropdown.innerHTML = results.map((result, index) => `
            <div class="autocomplete-item" data-index="${index}" style="
                padding: var(--spacing-md);
                cursor: pointer;
                border-bottom: 1px solid var(--gray-200);
                transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='var(--light-blue)'" 
               onmouseout="this.style.backgroundColor='transparent'">
                ${this.highlightMatch(result, this.input.value)}
            </div>
        `).join('');
        
        // Vincular eventos de clic
        this.dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => this.selectItem(item));
        });
        
        this.selectedIndex = -1;
        this.showDropdown();
    }
    
    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }
    
    selectItem(item) {
        this.input.value = item.textContent;
        this.hideDropdown();
        this.input.focus();
        
        // Activar evento de cambio
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        
        if (this.options.onSelect) {
            this.options.onSelect(item.textContent);
        }
    }
    
    highlightItem() {
        const items = this.dropdown.querySelectorAll('.autocomplete-item');
        
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.style.backgroundColor = 'var(--primary-color)';
                item.style.color = 'white';
            } else {
                item.style.backgroundColor = 'transparent';
                item.style.color = 'inherit';
            }
        });
    }
    
    showDropdown() {
        this.dropdown.style.display = 'block';
    }
    
    hideDropdown() {
        this.dropdown.style.display = 'none';
        this.selectedIndex = -1;
    }
    
    isDropdownVisible() {
        return this.dropdown.style.display === 'block';
    }
}

// MÁSCARAS DE ENTRADA PARA CAMPOS
class InputMask {
    constructor(input, mask, options = {}) {
        this.input = input;
        this.mask = mask;
        this.options = {
            placeholder: '_',
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.applyMask();
    }
    
    bindEvents() {
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('paste', (e) => this.handlePaste(e));
    }
    
    handleInput(e) {
        this.applyMask();
    }
    
    handleKeydown(e) {
        // Permitir teclas de navegación y control
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if (allowedKeys.includes(e.key)) return;
        
        // Prevenir entrada si se alcanzó la longitud máxima
        if (this.input.value.length >= this.mask.length && !e.ctrlKey) {
            e.preventDefault();
        }
    }
    
    handlePaste(e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        this.input.value = pastedText;
        this.applyMask();
    }
    
    applyMask() {
        const value = this.input.value.replace(/\D/g, ''); // Solo números
        let result = '';
        let valueIndex = 0;
        
        for (let i = 0; i < this.mask.length && valueIndex < value.length; i++) {
            if (this.mask[i] === '9') {
                result += value[valueIndex];
                valueIndex++;
            } else {
                result += this.mask[i];
            }
        }
        
        this.input.value = result;
    }
}

// ADMINISTRADOR PRINCIPAL DE FORMULARIOS
class FormManager {
    constructor() {
        this.validators = new Map();
        this.autoCompletes = new Map();
        this.masks = new Map();
        this.init();
    }
    
    init() {
        this.setupForms();
        this.setupAutoComplete();
        this.setupInputMasks();
        this.setupCustomBehaviors();
    }
    
    setupForms() {
        $$('form[data-validate]').forEach(form => {
            const validator = new FormValidator(form);
            this.validators.set(form, validator);
            
            // Configurar reglas personalizadas si existen
            const customRules = form.getAttribute('data-rules');
            if (customRules) {
                try {
                    const rules = JSON.parse(customRules);
                    Object.entries(rules).forEach(([field, fieldRules]) => {
                        validator.addRule(field, fieldRules);
                    });
                } catch (e) {
                    console.warn('Invalid rules format:', customRules);
                }
            }
        });
    }
    
    setupAutoComplete() {
        // Autocompletado para campos de empresa
        $$('input[name="company"]').forEach(input => {
            const autoComplete = new AutoComplete(input, {
                source: this.getCompanySuggestions.bind(this),
                minLength: 2
            });
            this.autoCompletes.set(input, autoComplete);
        });
        
        // Autocompletado para ciudades
        $$('input[data-autocomplete="city"]').forEach(input => {
            const autoComplete = new AutoComplete(input, {
                source: this.getCitySuggestions.bind(this),
                minLength: 2
            });
            this.autoCompletes.set(input, autoComplete);
        });
    }
    
    setupInputMasks() {
        // Máscara para teléfonos
        $$('input[type="tel"]').forEach(input => {
            const mask = new InputMask(input, '(999) 999-9999');
            this.masks.set(input, mask);
        });
        
        // Máscara personalizada basada en atributo data-mask
        $$('input[data-mask]').forEach(input => {
            const maskPattern = input.getAttribute('data-mask');
            const mask = new InputMask(input, maskPattern);
            this.masks.set(input, mask);
        });
    }
    
    setupCustomBehaviors() {
        // Contadores de caracteres
        $$('textarea[maxlength]').forEach(textarea => {
            this.setupCharacterCounter(textarea);
        });
        
        // Campos de archivo con preview
        $$('input[type="file"][data-preview]').forEach(input => {
            this.setupFilePreview(input);
        });
    }
    
    setupCharacterCounter(textarea) {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--gray-500);
            margin-top: var(--spacing-sm);
        `;
        
        textarea.parentNode.appendChild(counter);
        
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} caracteres restantes`;
            counter.style.color = remaining < 20 ? '#dc3545' : 'var(--gray-500)';
        };
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    }
    
    setupFilePreview(input) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'file-preview';
        input.parentNode.appendChild(previewContainer);
        
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            previewContainer.innerHTML = '';
            
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.cssText = `
                            max-width: 200px;
                            max-height: 200px;
                            object-fit: cover;
                            border-radius: var(--border-radius-md);
                            margin: var(--spacing-sm);
                        `;
                        previewContainer.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }
    
    async getCompanySuggestions(query) {
        // Simulación de búsqueda de empresas
        const companies = [
            'Walmart de México', 'FEMSA', 'América Móvil', 'Grupo Bimbo',
            'CEMEX', 'Grupo Televisa', 'Liverpool', 'Soriana',
            'Elektra', 'Coppel', 'Grupo México', 'Banorte'
        ];
        
        return companies.filter(company => 
            company.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    async getCitySuggestions(query) {
        // Simulación de búsqueda de ciudades
        const cities = [
            'Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla',
            'Tijuana', 'León', 'Juárez', 'Torreón', 'Querétaro',
            'San Luis Potosí', 'Mérida', 'Mexicali', 'Aguascalientes'
        ];
        
        return cities.filter(city => 
            city.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    getValidator(form) {
        return this.validators.get(form);
    }
    
    validateAllForms() {
        let allValid = true;
        
        this.validators.forEach((validator, form) => {
            if (!validator.validateForm()) {
                allValid = false;
            }
        });
        
        return allValid;
    }
    
    resetAllForms() {
        this.validators.forEach((validator, form) => {
            form.reset();
            validator.reset();
        });
    }
}

// Inicializar cuando el DOM esté listo
// INICIALIZACIÓN DEL SISTEMA DE FORMULARIOS
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.formManager = new FormManager();
    });
} else {
    window.formManager = new FormManager();
}
