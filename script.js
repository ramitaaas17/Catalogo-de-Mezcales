// Variable en memoria para reemplazar localStorage
let ageVerified = false;

// Verificación de edad
document.addEventListener('DOMContentLoaded', function() {
    const ageModal = document.getElementById('ageModal');
    const ageYes = document.getElementById('ageYes');
    const ageNo = document.getElementById('ageNo');
    const body = document.body;
    
    // Verificar si ya se verificó la edad (usando variable en memoria)
    if (!ageVerified) {
        // Agregar clase para ocultar contenido principal
        body.classList.add('age-restricted');
        // Mostrar modal
        ageModal.style.display = 'flex';
    } else {
        // Ocultar modal
        ageModal.style.display = 'none';
        body.classList.remove('age-restricted');
    }
    
    // Botón SÍ
    ageYes.addEventListener('click', function() {
        ageVerified = true; // Usar variable en memoria
        ageModal.style.display = 'none';
        body.classList.remove('age-restricted');
    });
    
    // Botón NO
    ageNo.addEventListener('click', function() {
        alert('Debes ser mayor de 18 años para acceder a este contenido.');
        window.location.href = 'https://www.google.com';
    });
});

// Notification Banner
document.addEventListener('DOMContentLoaded', function() {
    const notification = document.getElementById('disclaimerNotification');
    const closeBtn = document.getElementById('closeNotification');
    const body = document.body;
    
    // Mostrar notificación después de un pequeño delay
    setTimeout(() => {
        notification.classList.add('show');
        body.classList.add('notification-visible');
    }, 500);
    
    // Cerrar notificación
    closeBtn.addEventListener('click', function() {
        notification.classList.remove('show');
        body.classList.remove('notification-visible');
        
        // Remover completamente después de la animación
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    });
});
// Funcionalidad para expandir imágenes
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.image-modal .close');
    const productImages = document.querySelectorAll('.product-image img');

    // Agregar evento click a todas las imágenes de productos
    productImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            modal.classList.add('active');
            modalImg.src = this.src;
            modalImg.alt = this.alt;
        });
    });

    // Cerrar modal al hacer clic en la X
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    // Cerrar modal al hacer clic fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
});

// ===== SISTEMA DE CONTACTO WHATSAPP =====

// Configuración del número de WhatsApp (cambiar por el número real)
const WHATSAPP_NUMBER = '5539700671'; // Formato: 52 + código de área + número

// ===== FUNCIONES PRINCIPALES =====

// Función para formatear mensaje de producto
function formatProductMessage(productInfo) {
    const message = `¡Hola! Me interesa conocer más sobre este mezcal:

🍃 *${productInfo.name}*
📋 Descripción: ${productInfo.description}
🎯 Graduación: ${productInfo.grade}
📏 Tamaño: ${productInfo.size}
💰 Precio: ${productInfo.price}

¿Podrían proporcionarme más información sobre disponibilidad y proceso de compra?

¡Gracias!`;
    
    return encodeURIComponent(message);
}

// Función para crear URL de WhatsApp
function createWhatsAppURL(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// Función para obtener información del producto
function getProductInfo(productCard) {
    const productName = productCard.querySelector('.product-name').textContent;
    const productDescription = productCard.querySelector('.product-description').textContent;
    const productGrade = productCard.querySelector('.product-grade').textContent;
    const productSize = productCard.querySelector('.product-size').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    
    return {
        name: productName,
        description: productDescription,
        grade: productGrade,
        size: productSize,
        price: productPrice
    };
}

// ===== MANEJO DE CONTACTO POR PRODUCTO =====

// Función para manejar contacto específico de producto
function handleProductContact(event) {
    event.preventDefault();
    
    // Encontrar la tarjeta del producto
    const productCard = event.target.closest('.product-card');
    
    if (!productCard) {
        console.error('No se pudo encontrar la información del producto');
        return;
    }
    
    // Obtener información del producto
    const productInfo = getProductInfo(productCard);
    
    // Formatear mensaje
    const message = formatProductMessage(productInfo);
    
    // Crear URL de WhatsApp
    const whatsappURL = createWhatsAppURL(message);
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Opcional: Tracking de eventos (Google Analytics, etc.)
    trackContactEvent('product_contact', productInfo.name);
}

// ===== MANEJO DE CONTACTO GENERAL =====

// Función para manejar contacto general
function handleGeneralContact(event) {
    event.preventDefault();
    
    const generalMessage = `¡Hola! Me gustaría conocer más sobre sus mezcales artesanales.

¿Podrían enviarme información sobre:
- Catálogo completo de productos
- Precios y disponibilidad
- Proceso de compra
- Información sobre la empresa

¡Gracias por su atención!`;
    
    const message = encodeURIComponent(generalMessage);
    const whatsappURL = createWhatsAppURL(message);
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Tracking opcional
    trackContactEvent('general_contact', 'header_contact');
}

// ===== SISTEMA DE FILTROS =====

// Función para manejar filtros de productos
function handleFilterTabs() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            // Obtener filtro seleccionado
            const filter = button.getAttribute('data-filter');
            
            // Filtrar productos
            filterProducts(filter, productCards);
        });
    });
}

// Función para filtrar productos (mejorada)
function filterProducts(filter, productCards) {
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Animar entrada de forma más suave
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ===== EFECTOS DE SCROLL =====

// Función para manejar efectos de scroll en el navbar
function handleScrollEffects() {
    const header = document.querySelector('.header');
    let ticking = false;
    
    function updateScrollEffect() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffect);
            ticking = true;
        }
    });
}

// Función para animaciones al hacer scroll (mejorada)
function handleScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos con clase fade-in de forma más segura
    setTimeout(() => {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => {
            if (el && typeof el.getBoundingClientRect === 'function') {
                observer.observe(el);
            }
        });
    }, 100);
}

// ===== NAVEGACIÓN SUAVE =====

// Función para navegación suave
function handleSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FUNCIONES DE UTILIDAD =====

// Función para tracking de eventos (opcional)
function trackContactEvent(eventType, productName) {
    // Aquí puedes integrar Google Analytics, Facebook Pixel, etc.
    console.log(`Evento de contacto: ${eventType} - ${productName}`);
    
    // Ejemplo para Google Analytics 4
    // gtag('event', eventType, {
    //     'custom_parameter': productName
    // });
}

// Función para validar número de WhatsApp
function validateWhatsAppNumber() {
    if (WHATSAPP_NUMBER === '5215551234567') {
        console.warn('¡Recuerda cambiar el número de WhatsApp por el número real!');
    }
}

// ===== INICIALIZACIÓN =====

// Función principal de inicialización (mejorada)
function initializeApp() {
    // Validar configuración
    validateWhatsAppNumber();
    
    // Verificar que los elementos existan antes de configurar
    const productButtons = document.querySelectorAll('.product-btn');
    const whatsappButtons = document.querySelectorAll('.whatsapp');
    const productCards = document.querySelectorAll('.product-card');
    
    // Configurar event listeners para botones de contacto de productos
    if (productButtons.length > 0) {
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('product-btn')) {
                handleProductContact(event);
            }
        });
    }
    
    // Configurar event listeners para contacto general
    if (whatsappButtons.length > 0) {
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('whatsapp')) {
                handleGeneralContact(event);
            }
        });
    }
    
    // Inicializar filtros solo si existen elementos
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        handleFilterTabs();
    }
    
    // Inicializar efectos de scroll
    handleScrollEffects();
    
    // Inicializar animaciones de scroll con delay
    setTimeout(() => {
        handleScrollAnimations();
    }, 500);
    
    // Inicializar navegación suave
    handleSmoothNavigation();
    
    // Aplicar estilos iniciales a las tarjetas de productos
    if (productCards.length > 0) {
        productCards.forEach((card, index) => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            
            // Añadir delay escalonado para efecto visual
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }
    
    console.log('Sistema de contacto WhatsApp inicializado correctamente');
}

// ===== CONFIGURACIÓN ADICIONAL =====

// Función para configurar número de WhatsApp desde fuera
function setWhatsAppNumber(number) {
    WHATSAPP_NUMBER = number;
    console.log(`Número de WhatsApp actualizado: ${number}`);
}

// Función para personalizar mensaje de producto
function customizeProductMessage(customTemplate) {
    // Permite personalizar el template del mensaje
    window.customProductTemplate = customTemplate;
}

// ===== MANEJO DE ERRORES =====

// Manejo global de errores
window.addEventListener('error', (event) => {
    console.error('Error en el sistema de contacto:', event.error);
});

// ===== INICIO DE LA APLICACIÓN =====

// Función de inicialización segura
function safeInitialize() {
    try {
        initializeApp();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        // Fallback básico sin animaciones
        basicInitialize();
    }
}

// Inicialización básica sin animaciones complejas
function basicInitialize() {
    // Solo contacto básico sin animaciones
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('product-btn')) {
            handleProductContact(event);
        }
        if (event.target.classList.contains('whatsapp')) {
            handleGeneralContact(event);
        }
    });
    
    console.log('Inicialización básica completada');
}

// Múltiples métodos de inicialización para máxima compatibilidad
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInitialize);
} else if (document.readyState === 'interactive') {
    setTimeout(safeInitialize, 100);
} else {
    safeInitialize();
}

// Backup adicional
window.addEventListener('load', () => {
    setTimeout(() => {
        // Verificar que todo esté funcionando
        if (typeof handleProductContact === 'undefined') {
            console.log('Ejecutando inicialización de respaldo...');
            basicInitialize();
        }
    }, 200);
});