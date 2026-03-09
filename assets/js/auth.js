/**
 * Authentication System
 * Handles login, logout, and session management
 */

/**
 * Check Authentication on Page Load
 */
function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // Check if on admin page
    const isAdminPage = window.location.pathname.includes('/admin/');
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (isAdminPage && !isLoginPage) {
        if (!currentUser) {
            // Redirect to login
            window.location.href = 'login.html';
        }
    }
    
    return currentUser;
}

/**
 * Login Function
 */
async function login(email, password) {
    try {
        const user = await API.auth.login(email, password);
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Logout Function
 */
async function logout() {
    try {
        await API.auth.logout();
        window.location.href = '../index.html';
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Get Current User
 */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

/**
 * Check if user is admin
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Export functions
window.auth = {
    checkAuthentication,
    login,
    logout,
    getCurrentUser,
    isAdmin
};
