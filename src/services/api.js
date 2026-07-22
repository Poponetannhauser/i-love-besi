const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get stored auth token
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiService = {
    // Auth Endpoints
    login: async (emailOrUsername, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUsername, password })
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        localStorage.setItem('jwt_token', data.token);
        return data;
    },

    register: async (username, email, password, role = 'FieldUser') => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });
        if (!response.ok) throw new Error('Registration failed');
        const data = await response.json();
        localStorage.setItem('jwt_token', data.token);
        return data;
    },

    // Calculator Endpoints
    calculateWeight: async (diameterMm, lengthMeters, quantity, toleranceFactor = 1.0) => {
        const response = await fetch(`${API_BASE_URL}/calculator/weight`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ diameterMm, lengthMeters, quantity, toleranceFactor })
        });
        return await response.json();
    },

    optimizeCutting: async (cutItems) => {
        const response = await fetch(`${API_BASE_URL}/calculator/optimize-cutting`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cutItems)
        });
        return await response.json();
    },

    // Ledger Endpoints (Protected by JWT)
    getLedgers: async () => {
        const response = await fetch(`${API_BASE_URL}/ledger`, {
            headers: {
                ...getAuthHeader()
            }
        });
        return await response.json();
    },

    saveLedger: async (ledgerData) => {
        const response = await fetch(`${API_BASE_URL}/ledger`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(ledgerData)
        });
        return await response.json();
    },

    deleteLedger: async (id) => {
        const response = await fetch(`${API_BASE_URL}/ledger/${id}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader()
            }
        });
        return await response.json();
    }
};
