// Script para el modo oscuro
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '🌙'; // Modo oscuro activo
    } else {
        darkModeToggle.textContent = '☀️'; // Modo claro activo
    }
});

// Script del Traductor de Google
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'es', // Idioma original de la página
        includedLanguages: 'es,en,fr,de,it,pt,zh-CN,ja', // Idiomas permitidos
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// Cargar el script de Google Translate dinámicamente
function loadGoogleTranslateScript() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
}

// Inicializar el traductor cuando la página cargue
window.addEventListener('load', () => {
    loadGoogleTranslateScript();
});
