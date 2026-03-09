/**
 * Arte en mis manos - Main Application
 * Core functionality and initialization
 */

// App State
const app = {
    currentUser: null,
    services: [],
    appointments: [],
    gallery: [],
    deferredPrompt: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    loadServices();
    loadGallery();
    setupEventListeners();
    checkAuth();
    setupPWA();
    hideLoadingScreen();
});

/**
 * Initialize Application
 */
function initApp() {
    console.log('🎨 Arte en mis manos - App initialized');
    
    // Set minimum date for booking
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.min = today;
    }
}

/**
 * Hide Loading Screen
 */
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1000);
}

/**
 * Load Services from LocalStorage or use defaults
 */
function loadServices() {
    const savedServices = localStorage.getItem('services');
    
    if (savedServices) {
        app.services = JSON.parse(savedServices);
    } else {
        // Default services
        app.services = [
            {
                id: 1,
                name: 'Manicure Clásico',
                description: 'Cuidado completo de manos con esmaltado tradicional',
                price: 15000,
                duration: 45,
                icon: '💅'
            },
            {
                id: 2,
                name: 'Pedicure Spa',
                description: 'Tratamiento relajante para pies con exfoliación y masaje',
                price: 20000,
                duration: 60,
                icon: '🦶'
            },
            {
                id: 3,
                name: 'Uñas Acrílicas',
                description: 'Extensión de uñas con acabado profesional',
                price: 35000,
                duration: 90,
                icon: '✨'
            },
            {
                id: 4,
                name: 'Nail Art Premium',
                description: 'Diseños personalizados y únicos',
                price: 45000,
                duration: 120,
                icon: '🎨'
            },
            {
                id: 5,
                name: 'Uñas en Gel',
                description: 'Esmaltado semipermanente de larga duración',
                price: 25000,
                duration: 60,
                icon: '💎'
            },
            {
                id: 6,
                name: 'Manicure + Pedicure',
                description: 'Paquete completo de belleza para manos y pies',
                price: 30000,
                duration: 90,
                icon: '✨'
            }
        ];
        localStorage.setItem('services', JSON.stringify(app.services));
    }
    
    renderServices();
    populateServiceSelect();
}

/**
 * Render Services to DOM
 */
function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = app.services.map(service => `
        <div class="service-card" data-aos="fade-up">
            <div class="service-icon">${service.icon}</div>
            <h3 class="service-title">${service.name}</h3>
            <p class="service-description">${service.description}</p>
            <div class="service-price">₡${service.price.toLocaleString()}</div>
            <div class="service-duration">⏱ ${service.duration} minutos</div>
        </div>
    `).join('');
}

/**
 * Populate Service Select in Booking Form
 */
function populateServiceSelect() {
    const serviceSelect = document.getElementById('servicio');
    if (!serviceSelect) return;
    
    // Clear existing options except the first one
    serviceSelect.innerHTML = '<option value="">Selecciona un servicio</option>';
    
    app.services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = `${service.name} - ₡${service.price.toLocaleString()}`;
        serviceSelect.appendChild(option);
    });
}

/**
 * Load Gallery from LocalStorage or use defaults
 */
function loadGallery() {
    const savedGallery = localStorage.getItem('gallery');
    
    if (savedGallery) {
        app.gallery = JSON.parse(savedGallery);
    } else {
        // Default gallery items - URLs verificadas
        app.gallery = [
            { 
                id: 1, 
                title: 'Diseño Floral', 
                image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80'
            },
            { 
                id: 2, 
                title: 'Francés Clásico', 
                image: '/Arte-en-mis-manos/assets/images/gallery/frances.jpg'
            },
            { 
                id: 3, 
                title: 'Nail Art Abstracto', 
                image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&auto=format&fit=crop&q=80'
            },
            { 
                id: 4, 
                title: 'Uñas en Gel', 
                image: '/Arte-en-mis-manos/assets/images/gallery/gel.png'
            },
            { 
                id: 5, 
                title: 'Diseño Minimalista', 
                image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80'
            },
            { 
                id: 6, 
                title: 'Uñas Acrílicas', 
                image: '/Arte-en-mis-manos/assets/images/gallery/acrilicas.png'
            }
        ];
        localStorage.setItem('gallery', JSON.stringify(app.gallery));
    }
    
    renderGallery();
}

/**
 * Render Gallery to DOM
 */
function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = app.gallery.map(item => `
        <div class="gallery-item" data-aos="zoom-in">
            <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy">
            <div class="gallery-overlay">
                <h4 class="gallery-title">${item.title}</h4>
            </div>
        </div>
    `).join('');
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header Scroll Effect
    let lastScroll = 0;
    const header = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Check Authentication Status
 */
function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        app.currentUser = JSON.parse(savedUser);
    }
}

/**
 * Setup PWA Functionality
 */
function setupPWA() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/Arte-en-mis-manos/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    }
    
    // Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        app.deferredPrompt = e;
        showInstallPrompt();
    });
    
    // Install Button
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (app.deferredPrompt) {
                app.deferredPrompt.prompt();
                const { outcome } = await app.deferredPrompt.userChoice;
                console.log(`User response to install prompt: ${outcome}`);
                app.deferredPrompt = null;
                hideInstallPrompt();
            }
        });
    }
    
    // Close Install Prompt
    const installClose = document.getElementById('installClose');
    if (installClose) {
        installClose.addEventListener('click', hideInstallPrompt);
    }
    
    // Check if app is installed
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA installed successfully');
        hideInstallPrompt();
    });
}

/**
 * Show Install Prompt
 */
function showInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        // Show after 3 seconds
        setTimeout(() => {
            installPrompt.style.display = 'block';
        }, 3000);
    }
}

/**
 * Hide Install Prompt
 */
function hideInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.style.display = 'none';
    }
}

/**
 * Format Currency
 */
function formatCurrency(amount) {
    return `₡${amount.toLocaleString('es-CR')}`;
}

/**
 * Format Date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

/**
 * Format Time
 */
function formatTime(timeString) {
    return timeString;
}

/**
 * Show Notification
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--gradient-primary)' : '#FF4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Generate Unique ID
 */
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Export app object for use in other modules
window.app = app;
