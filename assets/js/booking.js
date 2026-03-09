/**
 * Booking System
 * Handles appointment booking functionality
 */

// Booking Modal Elements
const bookingModal = document.getElementById('bookingModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const bookingForm = document.getElementById('bookingForm');
const reservarBtns = document.querySelectorAll('#reservarBtn, #heroReservarBtn');

/**
 * Initialize Booking System
 */
document.addEventListener('DOMContentLoaded', () => {
    setupBookingListeners();
    loadAppointments();
});

/**
 * Setup Booking Event Listeners
 */
function setupBookingListeners() {
    // Open modal buttons
    reservarBtns.forEach(btn => {
        btn.addEventListener('click', openBookingModal);
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closeBookingModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeBookingModal);
    }
    
    // Handle form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    });
}

/**
 * Open Booking Modal
 */
function openBookingModal() {
    if (bookingModal) {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form
        if (bookingForm) {
            bookingForm.reset();
        }
    }
}

/**
 * Close Booking Modal
 */
function closeBookingModal() {
    if (bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Handle Booking Form Submission
 */
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(bookingForm);
    const appointmentData = {
        id: generateId(),
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        servicio: formData.get('servicio'),
        fecha: formData.get('fecha'),
        hora: formData.get('hora'),
        comentarios: formData.get('comentarios') || '',
        estado: 'pendiente',
        createdAt: new Date().toISOString()
    };
    
    // Validate data
    if (!validateAppointment(appointmentData)) {
        return;
    }
    
    // Get service details
    const service = app.services.find(s => s.id == appointmentData.servicio);
    if (service) {
        appointmentData.serviceName = service.name;
        appointmentData.servicePrice = service.price;
    }
    
    // Save appointment
    try {
        await saveAppointment(appointmentData);
        
        // Show success message
        showNotification('¡Cita reservada con éxito! Nos pondremos en contacto contigo pronto.', 'success');
        
        // Send WhatsApp message
        sendWhatsAppConfirmation(appointmentData);
        
        // Close modal
        closeBookingModal();
        
        // Reset form
        bookingForm.reset();
        
    } catch (error) {
        console.error('Error saving appointment:', error);
        showNotification('Hubo un error al reservar la cita. Por favor, intenta de nuevo.', 'error');
    }
}

/**
 * Validate Appointment Data
 */
function validateAppointment(data) {
    // Validate name
    if (!data.nombre || data.nombre.trim().length < 3) {
        showNotification('Por favor, ingresa tu nombre completo.', 'error');
        return false;
    }
    
    // Validate phone
    const phoneRegex = /^[0-9+\s-]+$/;
    if (!data.telefono || !phoneRegex.test(data.telefono)) {
        showNotification('Por favor, ingresa un número de teléfono válido.', 'error');
        return false;
    }
    
    // Validate service
    if (!data.servicio) {
        showNotification('Por favor, selecciona un servicio.', 'error');
        return false;
    }
    
    // Validate date
    const selectedDate = new Date(data.fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Por favor, selecciona una fecha válida.', 'error');
        return false;
    }
    
    // Validate time
    if (!data.hora) {
        showNotification('Por favor, selecciona una hora.', 'error');
        return false;
    }
    
    // Check if time slot is available
    if (!isTimeSlotAvailable(data.fecha, data.hora)) {
        showNotification('Esta hora ya está reservada. Por favor, selecciona otra.', 'error');
        return false;
    }
    
    return true;
}

/**
 * Check if time slot is available
 */
function isTimeSlotAvailable(fecha, hora) {
    const appointments = app.appointments || [];
    const existingAppointment = appointments.find(
        apt => apt.fecha === fecha && apt.hora === hora && apt.estado !== 'cancelada'
    );
    return !existingAppointment;
}

/**
 * Save Appointment to LocalStorage
 */
async function saveAppointment(appointmentData) {
    return new Promise((resolve) => {
        // Load existing appointments
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Add new appointment
        appointments.push(appointmentData);
        
        // Save to localStorage
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        // Update app state
        app.appointments = appointments;
        
        resolve();
    });
}

/**
 * Load Appointments from LocalStorage
 */
function loadAppointments() {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
        app.appointments = JSON.parse(savedAppointments);
    }
}

/**
 * Send WhatsApp Confirmation
 */
function sendWhatsAppConfirmation(appointment) {
    const message = `¡Hola! He reservado una cita:\n\n` +
                   `📅 Fecha: ${formatDate(appointment.fecha)}\n` +
                   `🕐 Hora: ${appointment.hora}\n` +
                   `💅 Servicio: ${appointment.serviceName}\n` +
                   `👤 Nombre: ${appointment.nombre}\n` +
                   `📱 Teléfono: ${appointment.telefono}\n` +
                   `${appointment.comentarios ? `📝 Comentarios: ${appointment.comentarios}` : ''}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/50687409343?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab after a short delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1500);
}

/**
 * Get Appointment by ID
 */
function getAppointmentById(id) {
    return app.appointments.find(apt => apt.id === id);
}

/**
 * Update Appointment
 */
function updateAppointment(id, updates) {
    const index = app.appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
        app.appointments[index] = { ...app.appointments[index], ...updates };
        localStorage.setItem('appointments', JSON.stringify(app.appointments));
        return true;
    }
    return false;
}

/**
 * Delete Appointment
 */
function deleteAppointment(id) {
    app.appointments = app.appointments.filter(apt => apt.id !== id);
    localStorage.setItem('appointments', JSON.stringify(app.appointments));
}

/**
 * Get Appointments by Date
 */
function getAppointmentsByDate(date) {
    return app.appointments.filter(apt => apt.fecha === date);
}

/**
 * Get Upcoming Appointments
 */
function getUpcomingAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return app.appointments.filter(apt => {
        return apt.fecha >= today && apt.estado !== 'cancelada';
    }).sort((a, b) => {
        if (a.fecha === b.fecha) {
            return a.hora.localeCompare(b.hora);
        }
        return a.fecha.localeCompare(b.fecha);
    });
}

/**
 * Get Past Appointments
 */
function getPastAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return app.appointments.filter(apt => apt.fecha < today)
        .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/**
 * Get Appointments Statistics
 */
function getAppointmentsStats() {
    const total = app.appointments.length;
    const pending = app.appointments.filter(apt => apt.estado === 'pendiente').length;
    const confirmed = app.appointments.filter(apt => apt.estado === 'confirmada').length;
    const completed = app.appointments.filter(apt => apt.estado === 'completada').length;
    const cancelled = app.appointments.filter(apt => apt.estado === 'cancelada').length;
    
    return {
        total,
        pending,
        confirmed,
        completed,
        cancelled
    };
}

// Export functions for admin panel
window.bookingSystem = {
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
    getUpcomingAppointments,
    getPastAppointments,
    getAppointmentsStats
};
