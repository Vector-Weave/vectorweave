import api from './api'

//type definitions

type Backbone = {
    name: string;
    sequence: string;
}

type Fragment = {
    sequence: string;
    dnaType: string | null;
};

type OrderData = {
    supabaseUserId: string;
    plasmidName: string;
    buildType: 'MULTI_INSERT' | 'MUTAGENESIS' | 'NEW_BACKBONE';
    backboneName: string | null;
    fragments: Fragment[];
    mutations: string[];
    totalPrice: number;
}

type OrderResponse = {
    orderId: number | null;
    plasmidName: string;
    datePlaced: string | null;
    totalPrice: number;
    status: string;
    message: string;
}

export const orderService = {
    //1. Get user backbones if logged in
    getUserBackbones: async (supabaseUserId: string): Promise<Backbone[]> => {
        const response = await api.get(`/api/customers/backbones/${supabaseUserId}`);
        return response.data;
    },

    //2. Create order
    createOrder: async (orderData: OrderData): Promise<OrderResponse> => {
        const response = await api.post('/api/orders', orderData);
        return response.data;
    },

    //3. Get user's order history
    getUserOrders: async (supabaseUserId: string): Promise<OrderResponse[]> => {
        const response = await api.get(`/api/orders/${supabaseUserId}`);
        return response.data;
    }
}