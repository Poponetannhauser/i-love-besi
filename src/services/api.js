const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get stored auth token
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `API Error (${response.status})`;
        try {
            const errData = await response.json();
            if (errData && errData.message) {
                errorMessage = errData.message;
            } else if (errData && errData.Message) {
                errorMessage = errData.Message;
            }
        } catch {
            // fallback if response body is not JSON
        }
        throw new Error(errorMessage);
    }
    return await response.json();
};

export const apiService = {
    // Auth Endpoints
    login: async (emailOrUsername, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUsername, password })
        });
        const data = await handleResponse(response);
        if (data.token) {
            localStorage.setItem('jwt_token', data.token);
        }
        return data;
    },

    register: async (username, email, password, role = 'FieldUser') => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });
        const data = await handleResponse(response);
        if (data.token) {
            localStorage.setItem('jwt_token', data.token);
        }
        return data;
    },

    // Calculator Endpoints
    calculateWeight: async (diameterMm, lengthMeters, quantity, toleranceFactor = 1.0) => {
        const response = await fetch(`${API_BASE_URL}/calculator/weight`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ diameterMm, lengthMeters, quantity, toleranceFactor })
        });
        return await handleResponse(response);
    },

    optimizeCutting: async (cutItems) => {
        const response = await fetch(`${API_BASE_URL}/calculator/optimize-cutting`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cutItems)
        });
        return await handleResponse(response);
    },

    // Ledger Endpoints (Protected by JWT)
    getLedgers: async () => {
        const response = await fetch(`${API_BASE_URL}/ledger`, {
            headers: {
                ...getAuthHeader()
            }
        });
        return await handleResponse(response);
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
        return await handleResponse(response);
    },

    deleteLedger: async (id) => {
        const response = await fetch(`${API_BASE_URL}/ledger/${id}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader()
            }
        });
        return await handleResponse(response);
    }
};
