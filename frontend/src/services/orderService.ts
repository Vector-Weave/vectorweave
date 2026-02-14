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

type Order = {
    id: number;
    backboneName: string | null;
    fragments: Fragment[];
    mutations: string[];
}

type OrderData = {
    plasmidName: string;
    buildType: 'MULTI_INSERT' | 'MUTAGENESIS' | 'NEW_BACKBONE';

}

export const orderService = {
    //1. Get user backbones if logged in
    getUserBackbones: async (): Promise<Backbone[]> => {
        const response = await api.get('/backbones');       //fix this path based on service class implementation in backend
        return response.data;
    },

    //2. Checkout order
    createOrder: async (orderData: OrderData): Promise<Order> => {
        const response = await api.post('/orders', orderData);
        return response.data;
    }
}