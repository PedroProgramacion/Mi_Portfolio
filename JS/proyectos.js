/**
 * proyectos.js - Script optimizado para la página de proyectos
 * Autor: Pedro Ortiz Plaza
 * Última actualización: 2025
 */

// ====================== FUNCIONES PRINCIPALES ======================

/**
 * Alterna entre modo claro y oscuro
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    // Actualizar icono
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    // Actualizar el traductor en modo oscuro
    customizeTranslateUI(isDarkMode);
    
    // Disparar evento personalizado
    document.dispatchEvent(new CustomEvent('darkModeChanged'));
}

/**
 * Carga la preferencia de modo oscuro desde localStorage
 * @returns {boolean} Estado del modo oscuro
 */
function loadDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    return isDarkMode;
}

// ====================== SISTEMA DE DESCARGA DE CV PARA PORTFOLIO ======================

/**
 * Clase para gestionar la descarga del CV en el portfolio
 * Adaptada a la estructura de carpetas real del proyecto
 */
class PortfolioCVManager {
    constructor() {
        // RUTAS BASADAS EN TU ESTRUCTURA REAL DE CARPETAS
       // Cambiar en el PortfolioCVManager las rutas para incluir el nombre con tilde
        this.cvPaths = [
            './DOCS/CurrículumVitae-Pedro.pdf',      
            '../DOCS/CurrículumVitae-Pedro.pdf',     
            './CurrículumVitae-Pedro.pdf',           
            '../CurrículumVitae-Pedro.pdf'           
        ];
        
        this.cvFileName = 'CV_Pedro_Ortiz_Plaza.pdf';
        this.isDownloading = false;
    }

    /**
     * Inicializa el sistema de descarga
     */
    init() {
        const downloadBtn = document.getElementById('download-cv');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadCV();
            });
            console.log('✓ Sistema de descarga de CV inicializado');
        }
    }

    /**
     * Verifica si un archivo existe
     * @param {string} url - URL del archivo
     * @returns {Promise<boolean>}
     */
    async checkFileExists(url) {
        try {
            const response = await fetch(url, { 
                method: 'HEAD',
                cache: 'no-cache'
            });
            return response.ok && response.status === 200;
        } catch (error) {
            return false;
        }
    }

    /**
     * Busca el CV en las rutas definidas
     * @returns {Promise<string|null>}
     */
    async findCV() {
        console.log('Buscando CV en las siguientes rutas:');
        
        for (const path of this.cvPaths) {
            console.log(`  Probando: ${path}`);
            
            if (await this.checkFileExists(path)) {
                console.log(`  ✓ Encontrado: ${path}`);
                return path;
            }
        }
        
        console.error('  ✗ No se encontró el CV en ninguna ruta');
        return null;
    }

    /**
     * Inicia la descarga del CV
     * @param {string} path - Ruta del archivo
     */
    initiateDownload(path) {
        try {
            console.log(`Descargando: ${path}`);
            
            const link = document.createElement('a');
            link.href = path;
            link.download = this.cvFileName;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
            
            this.showNotification('Descarga iniciada correctamente', 'success');
            console.log('✓ Descarga completada');
            
        } catch (error) {
            console.error('Error en la descarga:', error);
            this.showNotification('Error al iniciar la descarga', 'error');
        }
    }

    /**
     * Función principal de descarga
     */
    async downloadCV() {
        if (this.isDownloading) {
            this.showNotification('Descarga en progreso...', 'info');
            return;
        }

        this.isDownloading = true;
        this.showNotification('Buscando archivo...', 'info');

        try {
            const cvPath = await this.findCV();
            
            if (cvPath) {
                this.initiateDownload(cvPath);
            } else {
                this.showNotification('No se encontró el archivo CV', 'error');
                this.showAlternativeOptions();
            }
        } catch (error) {
            console.error('Error en downloadCV:', error);
            this.showNotification('Error al buscar el archivo', 'error');
            this.showAlternativeOptions();
        } finally {
            this.isDownloading = false;
        }
    }

    /**
     * Muestra notificaciones temporales
     * @param {string} message - Mensaje
     * @param {string} type - Tipo: success, error, info
     */
    showNotification(message, type = 'info') {
        // Evitar duplicados
        const existing = Array.from(document.querySelectorAll('.portfolio-cv-notification'))
            .find(n => n.textContent.includes(message));
        
        if (existing) return;

        const notification = document.createElement('div');
        notification.className = `portfolio-cv-notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${this.getIcon(type)}</span>
            <span class="notification-text">${message}</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            background: this.getColor(type),
            color: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '10000',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px'
        });
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Obtiene el icono según el tipo
     */
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Obtiene el color según el tipo
     */
    getColor(type) {
        const colors = {
            success: '#4a6fa8',
            error: '#e63946',
            info: '#2a9d8f'
        };
        return colors[type] || colors.info;
    }

    /**
     * Muestra opciones alternativas cuando no se encuentra el CV
     */
    showAlternativeOptions() {
        if (document.querySelector('.portfolio-cv-modal')) {
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'portfolio-cv-modal';
        modal.innerHTML = `
            <div class="portfolio-cv-modal-content">
                <div class="portfolio-cv-modal-header">
                    <h3>Archivo de CV no encontrado</h3>
                    <button class="portfolio-cv-modal-close" onclick="this.closest('.portfolio-cv-modal').remove()">×</button>
                </div>
                <div class="portfolio-cv-modal-body">
                    <p>No se pudo encontrar el archivo de CV en las ubicaciones esperadas.</p>
                    <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                        Puedes solicitar el CV por email, reintentar la descarga o explorar mi portfolio.
                    </p>
                    <div class="portfolio-cv-modal-actions">
                        <button class="portfolio-cv-btn portfolio-cv-btn-primary" onclick="portfolioCVManager.contactForCV()">
                            📧 Solicitar CV por email
                        </button>
                        <button class="portfolio-cv-btn portfolio-cv-btn-secondary" onclick="portfolioCVManager.retryDownload()">
                            🔄 Reintentar descarga
                        </button>
                        <button class="portfolio-cv-btn portfolio-cv-btn-secondary" onclick="portfolioCVManager.closeModal()">
                            📂 Continuar navegando
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Agregar estilos (solo una vez)
        if (!document.getElementById('portfolio-cv-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'portfolio-cv-modal-styles';
            styles.textContent = `
                .portfolio-cv-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                    animation: fadeIn 0.3s ease;
                }
                .portfolio-cv-modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.3s ease;
                }
                .portfolio-cv-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }
                .portfolio-cv-modal-header h3 {
                    margin: 0;
                    color: #333;
                    font-size: 1.3rem;
                }
                .portfolio-cv-modal-close {
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #666;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                .portfolio-cv-modal-close:hover {
                    background: #f5f5f5;
                }
                .portfolio-cv-modal-body {
                    padding: 20px;
                }
                .portfolio-cv-modal-body p {
                    margin: 0 0 10px 0;
                    line-height: 1.6;
                }
                .portfolio-cv-modal-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 20px;
                }
                .portfolio-cv-btn {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 600;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .portfolio-cv-btn-primary {
                    background: #4a6fa8;
                    color: white;
                }
                .portfolio-cv-btn-primary:hover {
                    background: #357abd;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(74, 111, 168, 0.4);
                }
                .portfolio-cv-btn-secondary {
                    background: #f8f9fa;
                    color: #333;
                    border: 2px solid #dee2e6;
                }
                .portfolio-cv-btn-secondary:hover {
                    background: #e9ecef;
                    border-color: #adb5bd;
                    transform: translateY(-2px);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(modal);

        // Cerrar al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Abre el cliente de email
     */
    contactForCV() {
        const subject = encodeURIComponent('Solicitud de CV - Pedro Ortiz Plaza');
        const body = encodeURIComponent(`Hola Pedro,

Me gustaría solicitar tu CV actualizado.

Gracias,`);
        
        window.location.href = `mailto:ortizplazapedro5@gmail.com?subject=${subject}&body=${body}`;
        
        this.closeModal();
        this.showNotification('Abriendo cliente de email...', 'success');
    }

    /**
     * Reintenta la descarga
     */
    async retryDownload() {
        this.closeModal();
        await this.downloadCV();
    }

    /**
     * Cierra el modal
     */
    closeModal() {
        const modal = document.querySelector('.portfolio-cv-modal');
        if (modal) modal.remove();
    }
}

// ====================== INICIALIZACIÓN ======================

// Crear instancia global
const portfolioCVManager = new PortfolioCVManager();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        portfolioCVManager.init();
    });
} else {
    portfolioCVManager.init();
}

// Exportar para uso global
window.portfolioCVManager = portfolioCVManager;

console.log('✓ Portfolio CV Manager cargado');


// ====================== GOOGLE TRANSLATE MEJORADO ======================

/**
 * Inicializa el componente Google Translate
 */
function initGoogleTranslate() {
    // Verificar si ya está cargado
    if (window.google && google.translate) {
        googleTranslateElementInit();
        return;
    }

    // Crear script si no existe
    if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
    }
}

/**
 * Callback para inicializar Google Translate
 * Esta función debe estar disponible globalmente
 */
function googleTranslateElementInit() {
    if (!window.google || !google.translate) {
        setTimeout(googleTranslateElementInit, 100);
        return;
    }

    new google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'en,es,fr,de,it,pt', // Idiomas principales
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');

    // Personalizar después de cargar
    setTimeout(() => customizeTranslateUI(document.body.classList.contains('dark-mode')), 500);
}

/**
 * Personaliza la UI del traductor de Google
 * @param {boolean} isDarkMode - Si está en modo oscuro
 */
function customizeTranslateUI(isDarkMode = false) {
    // Eliminar estilos anteriores si existen
    const oldStyle = document.getElementById('google-translate-custom-style');
    if (oldStyle) oldStyle.remove();

    const style = document.createElement('style');
    style.id = 'google-translate-custom-style';
    style.textContent = `
        .goog-te-gadget {
            color: transparent !important;
            font-size: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .goog-te-gadget-simple {
            background-color: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} !important;
            border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} !important;
            padding: 8px 12px !important;
            border-radius: 20px !important;
            height: auto !important;
            display: flex !important;
            align-items: center !important;
            transition: all 0.3s ease !important;
            cursor: pointer;
        }
        
        .goog-te-gadget-simple:hover {
            background-color: ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} !important;
        }
        
        .goog-te-gadget-simple img, .goog-te-gadget-simple span {
            display: none !important;
        }
        
        .goog-te-gadget-simple:after {
            content: "🌐 Traducir" !important;
            color: ${isDarkMode ? 'var(--text-light, #fff)' : 'var(--dark-color, #333)'} !important;
            font-family: 'Poppins', sans-serif !important;
            font-size: 0.9rem !important;
            font-weight: 500 !important;
        }
        
        .goog-te-menu-frame {
            box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
            border-radius: 12px !important;
            margin-top: 10px !important;
            max-width: 200px !important;
            border: none !important;
        }
        
        .goog-te-menu2 {
            background-color: ${isDarkMode ? '#333' : '#fff'} !important;
            border: none !important;
        }
        
        .goog-te-menu2-item div, .goog-te-menu2-item-selected div {
            color: ${isDarkMode ? '#e0e0e0' : '#333'} !important;
            font-family: 'Poppins', sans-serif !important;
            padding: 8px 12px !important;
        }
        
        .goog-te-menu2-item:hover, .goog-te-menu2-item-selected {
            background-color: ${isDarkMode ? '#444' : '#f5f5f5'} !important;
        }
        
        /* Ocultar elementos no deseados */
        .goog-te-banner-frame, 
        .goog-te-balloon-frame,
        .skiptranslate {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Recarga el widget de Google Translate
 */
function reloadGoogleTranslate() {
    if (window.google && google.translate) {
        const translateElement = document.querySelector('.goog-te-menu-frame');
        if (translateElement) {
            translateElement.style.display = 'none';
            setTimeout(() => {
                translateElement.style.display = '';
            }, 100);
        }
    }
}

// ====================== ANIMACIONES Y EFECTOS ======================

/**
 * Configura las animaciones para los elementos de la página
 */
function setupAnimations() {
    // Animación para los badges "Nuevo"
    const badges = document.querySelectorAll('.project-card__badge');
    badges.forEach(badge => {
        if (badge.textContent.trim() === '') {
            badge.style.display = 'none';
        } else {
            badge.style.animation = 'pulse 2s infinite';
        }
    });

    // Añadir estilos de animación dinámicamente
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .fade-in {
            opacity: 0;
            animation: fadeIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
        }
        
        .slide-in {
            opacity: 0;
            animation: slideIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
        }
        
        .scale-in {
            opacity: 0;
            animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
        }
        
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
    `;
    document.head.appendChild(animationStyles);
    
    // Aplicar clases de animación a elementos específicos
    const animateElements = () => {
        const header = document.querySelector('.header');
        if (header) header.classList.add('fade-in');
        
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.add('fade-in', 'delay-1');
        
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.classList.add('fade-in', `delay-${index + 1}`);
        });
        
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.classList.add('scale-in');
            card.style.animationDelay = `${0.2 + (index * 0.1)}s`;
        });
    };
    
    // Ejecutar animaciones cuando la página haya cargado
    if (document.readyState === 'complete') {
        animateElements();
    } else {
        window.addEventListener('load', animateElements);
    }
}

/**
 * Configura el efecto de scroll para la barra de navegación
 */
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Función para actualizar clase según posición de scroll
    const updateNavbar = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    // Inicializar estado y añadir event listener
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
}

/**
 * Configura el menú móvil
 */
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.navbar__mobile-toggle');
    const navMenu = document.querySelector('.navbar__menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', 
                navMenu.classList.contains('active') ? 'true' : 'false');
        });
        
        // Cerrar menú al hacer clic en enlaces
        const navLinks = navMenu.querySelectorAll('.navbar__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ====================== INICIALIZACIÓN ======================

/**
 * Inicializa todas las funcionalidades cuando el DOM esté listo
 */
function init() {
    // 1. Modo oscuro
    loadDarkMode();
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }

    // 2. Configurar scroll del navbar
    setupNavbarScroll();
    
    // 3. Configurar menú móvil
    setupMobileMenu();

    // 4. Inicializar traductor
    initGoogleTranslate();

    // 5. Configurar animaciones
    setupAnimations();

    // 6. Configurar descarga del CV
    const downloadLinks = [
        document.getElementById('download-cv'),
        document.getElementById('download-cv-btn')
    ];
    
    downloadLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                downloadCV();
            });
        }
    });
    
    // Escuchar cambios en modo oscuro para actualizar traductor
    document.addEventListener('darkModeChanged', reloadGoogleTranslate);
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Hacer disponible la función del traductor globalmente
window.googleTranslateElementInit = googleTranslateElementInit;