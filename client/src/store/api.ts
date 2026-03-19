import axios from 'axios';
import { CreateOfferData, CreateRequestData } from './types';

export interface AuthCredentials { email: string; password: string; name?: string; }
export interface ProfileUpdateData { name?: string; email?: string; password?: string; }

const api = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const authAPI = {
    login: async (credentials: AuthCredentials) => {
        const res = await api.post('/auth/login', credentials);
        return res.data;
    },
    register: async (credentials: AuthCredentials) => {
        const res = await api.post('/auth/register', credentials);
        return res.data;
    },
    getProfile: async () => {
        const res = await api.get('/auth/profile');
        return res.data;
    },
    updateProfile: async (data: ProfileUpdateData) => {
        const res = await api.put('/auth/profile', data);
        return res.data;
    },
};

export const requestAPI = {
    create: async (data: CreateRequestData) => {
        const res = await api.post('/requests', data);
        return res.data;
    },
    getAll: async () => {
        const res = await api.get('/requests');
        return res.data;
    },
    getMyRequests: async () => {
        const res = await api.get('/requests/myrequests');
        return res.data;
    },
    getById: async (id: string | number) => {
        const res = await api.get(`/requests/${id}`);
        return res.data;
    },
};

export const offerAPI = {
    create: async (data: CreateOfferData) => {
        const res = await api.post('/offers', data);
        return res.data;
    },
    getMyOffers: async () => {
        const res = await api.get('/offers/myoffers');
        return res.data;
    },
    getOffersByRequest: async (requestId: string | number) => {
        const res = await api.get(`/offers/request/${requestId}`);
        return res.data;
    },
};

export default api;
