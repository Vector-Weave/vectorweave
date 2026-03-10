import api from './api';

export interface CartItem {
    cartItemId: number;
    plasmidName: string;
    buildType: string;
    backboneName: string;
    price: number;
    addedAt: string;
}

export interface CartData {
    cartId: number;
    items: CartItem[];
    totalPrice: number;
    itemCount: number;
}

export interface AddToCartData {
    supabaseUserId: string;
    plasmidName: string;
    buildType: string;
    backboneName: string | null;
    fragments: Array<{ sequence: string; dnaType: string }>;
    mutations: string[];
    price: number;
}

export const cartService = {
    addToCart: async (data: AddToCartData): Promise<CartData> => {
        const response = await api.post('/api/cart/add', data);
        return response.data;
    },

    getCart: async (supabaseUserId: string): Promise<CartData> => {
        const response = await api.get(`/api/cart/${supabaseUserId}`);
        return response.data;
    },

    removeFromCart: async (supabaseUserId: string, cartItemId: number): Promise<void> => {
        await api.delete(`/api/cart/${supabaseUserId}/items/${cartItemId}`);
    },

    clearCart: async (supabaseUserId: string): Promise<void> => {
        await api.delete(`/api/cart/${supabaseUserId}/clear`);
    },

    checkout: async (supabaseUserId: string): Promise<any[]> => {
        const response = await api.post(`/api/cart/${supabaseUserId}/checkout`);
        return response.data;
    }
};
