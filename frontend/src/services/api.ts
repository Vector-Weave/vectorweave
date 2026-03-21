import axios from 'axios';
import { supabase } from '@/lib/supabase';

/**
 * Axios API Client with Automatic Authentication
 *
 * This creates a configured axios instance that:
 * 1. Points to your backend API
 * 2. Automatically adds JWT tokens to every request
 * 3. Handles authentication errors
 */
const api = axios.create({
    // Use deployed backend URL when provided, fallback to local dev
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

/**
 * REQUEST INTERCEPTOR - Runs BEFORE every API call
 *
 * This is like middleware for your API client.
 * It automatically adds the Authorization header with the JWT token.
 *
 * Flow:
 * 1. You call: api.post('/cart/add', data)
 * 2. Interceptor runs: Gets JWT from Supabase
 * 3. Adds header: Authorization: Bearer <token>
 * 4. Request is sent with auth header
 *
 * Why async?
 * - Need to fetch the session from Supabase (async operation)
 * - Ensures we get the latest token (handles refresh automatically)
 */
api.interceptors.request.use(
    async (config) => {
        try {
            // Get the current session from Supabase
            // This contains the JWT access token
            const { data: { session } } = await supabase.auth.getSession();

            // If user is logged in, add the token to request headers
            if (session?.access_token) {
                config.headers.Authorization = `Bearer ${session.access_token}`;
            }
        } catch (error) {
            console.error('Error getting auth token:', error);
            // Don't block the request - let backend return 401 if needed
        }

        return config;  // Send the modified request
    },
    (error) => {
        // Request setup failed
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR - Runs AFTER every API response
 *
 * Handles authentication errors gracefully.
 *
 * Why do we need this?
 * - If token expires or is invalid → Backend returns 401
 * - We want to handle this globally (don't repeat in every component)
 * - Can redirect to login page automatically
 */
api.interceptors.response.use(
    (response) => {
        // Success - just return the response
        return response;
    },
    async (error) => {
        // Check if error is 401 Unauthorized
        if (error.response?.status === 401) {
            console.warn('Authentication failed - token may be expired or invalid');

            // Clear the user's session
            await supabase.auth.signOut();

            // Redirect to login page
            // Only redirect if we're not already on the auth page
            if (window.location.pathname !== '/auth') {
                window.location.href = '/auth';
            }
        }

        // Re-throw the error so calling code can handle it
        return Promise.reject(error);
    }
);

export default api;
