import axios from 'axios';

// Function to get the AccessToken from cookies (using document.cookie)
const getAccessTokenFromCookies = (): string | null => {
    const match = document.cookie.match(/(^| )AccessToken=([^;]+)/);
    return match ? match[2] : null; // Return token or null if not found
};

const getAccessTokenFromStorage = (): string | null => {
    return localStorage.getItem("AccessToken");
};

const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    "https://autoplatz-backend.onrender.com/api";

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Ensures cookies are sent with the request
});

export const getBaseUrl = (): string => {
    const baseUrl = api.defaults.baseURL ?? "";
    return baseUrl.replace('/api', '');
};


// Add an interceptor to include the Bearer token in the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = getAccessTokenFromStorage() ?? getAccessTokenFromCookies();

        // If the token exists, attach it as Bearer token in the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
