/**
 * API Module
 * Handles API calls and data synchronization
 * Currently using LocalStorage, ready for backend integration
 */

const API = {
    baseURL: '/api', // Change this to your backend URL
    endpoints: {
        appointments: '/appointments',
        services: '/services',
        gallery: '/gallery',
        auth: '/auth'
    }
};

/**
 * Generic API Request
 */
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(`${API.baseURL}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * GET Request
 */
async function get(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST Request
 */
async function post(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * PUT Request
 */
async function put(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * DELETE Request
 */
async function remove(endpoint) {
    return apiRequest(endpoint, { method: 'DELETE' });
}

/**
 * Appointments API (LocalStorage implementation)
 */
const AppointmentsAPI = {
    /**
     * Get all appointments
     */
    async getAll() {
        return new Promise((resolve) => {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            resolve(appointments);
        });
    },
    
    /**
     * Get appointment by ID
     */
    async getById(id) {
        return new Promise((resolve) => {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const appointment = appointments.find(apt => apt.id === id);
            resolve(appointment);
        });
    },
    
    /**
     * Create new appointment
     */
    async create(appointmentData) {
        return new Promise((resolve) => {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const newAppointment = {
                ...appointmentData,
                id: generateId(),
                createdAt: new Date().toISOString()
            };
            appointments.push(newAppointment);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            resolve(newAppointment);
        });
    },
    
    /**
     * Update appointment
     */
    async update(id, updates) {
        return new Promise((resolve, reject) => {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const index = appointments.findIndex(apt => apt.id === id);
            
            if (index === -1) {
                reject(new Error('Appointment not found'));
                return;
            }
            
            appointments[index] = {
                ...appointments[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('appointments', JSON.stringify(appointments));
            resolve(appointments[index]);
        });
    },
    
    /**
     * Delete appointment
     */
    async delete(id) {
        return new Promise((resolve, reject) => {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const filtered = appointments.filter(apt => apt.id !== id);
            
            if (appointments.length === filtered.length) {
                reject(new Error('Appointment not found'));
                return;
            }
            
            localStorage.setItem('appointments', JSON.stringify(filtered));
            resolve({ success: true });
        });
    }
};

/**
 * Services API (LocalStorage implementation)
 */
const ServicesAPI = {
    /**
     * Get all services
     */
    async getAll() {
        return new Promise((resolve) => {
            const services = JSON.parse(localStorage.getItem('services') || '[]');
            resolve(services);
        });
    },
    
    /**
     * Get service by ID
     */
    async getById(id) {
        return new Promise((resolve) => {
            const services = JSON.parse(localStorage.getItem('services') || '[]');
            const service = services.find(s => s.id == id);
            resolve(service);
        });
    },
    
    /**
     * Create new service
     */
    async create(serviceData) {
        return new Promise((resolve) => {
            const services = JSON.parse(localStorage.getItem('services') || '[]');
            const newService = {
                ...serviceData,
                id: Math.max(0, ...services.map(s => s.id)) + 1,
                createdAt: new Date().toISOString()
            };
            services.push(newService);
            localStorage.setItem('services', JSON.stringify(services));
            resolve(newService);
        });
    },
    
    /**
     * Update service
     */
    async update(id, updates) {
        return new Promise((resolve, reject) => {
            const services = JSON.parse(localStorage.getItem('services') || '[]');
            const index = services.findIndex(s => s.id == id);
            
            if (index === -1) {
                reject(new Error('Service not found'));
                return;
            }
            
            services[index] = {
                ...services[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('services', JSON.stringify(services));
            resolve(services[index]);
        });
    },
    
    /**
     * Delete service
     */
    async delete(id) {
        return new Promise((resolve, reject) => {
            const services = JSON.parse(localStorage.getItem('services') || '[]');
            const filtered = services.filter(s => s.id != id);
            
            if (services.length === filtered.length) {
                reject(new Error('Service not found'));
                return;
            }
            
            localStorage.setItem('services', JSON.stringify(filtered));
            resolve({ success: true });
        });
    }
};

/**
 * Gallery API (LocalStorage implementation)
 */
const GalleryAPI = {
    /**
     * Get all gallery items
     */
    async getAll() {
        return new Promise((resolve) => {
            const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
            resolve(gallery);
        });
    },
    
    /**
     * Add gallery item
     */
    async add(itemData) {
        return new Promise((resolve) => {
            const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
            const newItem = {
                ...itemData,
                id: Math.max(0, ...gallery.map(g => g.id)) + 1,
                createdAt: new Date().toISOString()
            };
            gallery.push(newItem);
            localStorage.setItem('gallery', JSON.stringify(gallery));
            resolve(newItem);
        });
    },
    
    /**
     * Delete gallery item
     */
    async delete(id) {
        return new Promise((resolve, reject) => {
            const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
            const filtered = gallery.filter(g => g.id !== id);
            
            if (gallery.length === filtered.length) {
                reject(new Error('Gallery item not found'));
                return;
            }
            
            localStorage.setItem('gallery', JSON.stringify(filtered));
            resolve({ success: true });
        });
    }
};

/**
 * Auth API (LocalStorage implementation)
 */
const AuthAPI = {
    /**
     * Login
     */
    async login(email, password) {
        return new Promise((resolve, reject) => {
            // Super Admin credentials
            const SUPER_ADMIN = {
                email: 'nelson@nelsystems.com',
                password: '123456789AiDyXm',
                name: 'SuperAdmin',
                role: 'admin'
            };
            
            if (email === SUPER_ADMIN.email && password === SUPER_ADMIN.password) {
                const user = {
                    id: 1,
                    email: SUPER_ADMIN.email,
                    name: SUPER_ADMIN.name,
                    role: SUPER_ADMIN.role,
                    loginAt: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error('Credenciales inválidas'));
            }
        });
    },
    
    /**
     * Logout
     */
    async logout() {
        return new Promise((resolve) => {
            localStorage.removeItem('currentUser');
            resolve({ success: true });
        });
    },
    
    /**
     * Check if user is authenticated
     */
    async checkAuth() {
        return new Promise((resolve) => {
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
            resolve(user);
        });
    }
};

/**
 * Export API modules
 */
window.API = {
    appointments: AppointmentsAPI,
    services: ServicesAPI,
    gallery: GalleryAPI,
    auth: AuthAPI
};
