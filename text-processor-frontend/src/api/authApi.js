import { API_BASE_URL } from '../config/api';

export const simulatedLogin = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email, password }),
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error || 'Login failed');
    }
    return data;
};

export const simulatedSignUp = async (email, password, name = '') => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email, password, name }),
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error || 'Sign up failed');
    }
    return data;
};

