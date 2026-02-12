import axios from 'axios';

// API Gateway base URL
const API_BASE_URL = 'http://localhost:3010'; // Adjust port if needed

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies
});

// Request interceptor (Optional now, mainly for other headers if needed)
api.interceptors.request.use(
    (config) => {
        // No need to inject token from localStorage anymore
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                // We use a separate axios instance (or just axios) to avoid infinite loops if this fails
                await axios.post(`${API_BASE_URL}/user/refresh`, {}, {
                    withCredentials: true
                });

                // If successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                console.error("Token refresh failed:", refreshError);
               // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
