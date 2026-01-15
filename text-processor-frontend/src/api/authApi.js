export const simulatedLogin = async (email, password) => {
    const response = await fetch('http://127.0.0.1:8000/login', {
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
    const response = await fetch('http://127.0.0.1:8000/register', {
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

