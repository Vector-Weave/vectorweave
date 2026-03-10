import api from './api';

export interface CreateCheckoutSessionRequest {
  supabaseUserId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const stripeService = {
  createCheckoutSession: async (request: CreateCheckoutSessionRequest): Promise<CreateCheckoutSessionResponse> => {
    const response = await api.post('/api/stripe/create-checkout-session', request);
    return response.data;
  },

  verifySession: async (sessionId: string) => {
    const response = await api.get(`/api/stripe/verify-session/${sessionId}`);
    return response.data;
  }
};
