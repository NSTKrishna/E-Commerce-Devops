import { create } from 'zustand';
import { Request, CreateRequestData } from './types';
import { requestAPI } from './api';

function getErrorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'response' in err) {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        return e.response?.data?.message || e.message || 'An error occurred';
    }
    if (err instanceof Error) return err.message;
    return 'An error occurred';
}

interface RequestState {
    requests: Request[];
    myRequests: Request[];
    currentRequest: Request | null;
    isLoading: boolean;
    error: string | null;
    fetchRequests: () => Promise<void>;
    fetchMyRequests: () => Promise<void>;
    fetchRequestById: (id: number | string) => Promise<void>;
    createRequest: (data: CreateRequestData) => Promise<Request>;
}

export const useRequestStore = create<RequestState>((set) => ({
    requests: [],
    myRequests: [],
    currentRequest: null,
    isLoading: false,
    error: null,
    
    fetchRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await requestAPI.getAll();
            set({ requests: data, isLoading: false });
        } catch (err: unknown) {
            set({ error: getErrorMessage(err), isLoading: false });
        }
    },
    
    fetchMyRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await requestAPI.getMyRequests();
            set({ myRequests: data, isLoading: false });
        } catch (err: unknown) {
            set({ error: getErrorMessage(err), isLoading: false });
        }
    },
    
    fetchRequestById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const data = await requestAPI.getById(id);
            set({ currentRequest: data, isLoading: false });
        } catch (err: unknown) {
            set({ error: getErrorMessage(err), isLoading: false });
        }
    },
    
    createRequest: async (requestData) => {
        set({ isLoading: true, error: null });
        try {
            const data = await requestAPI.create(requestData);
            set((state) => ({ 
                myRequests: [...state.myRequests, data],
                isLoading: false 
            }));
            return data;
        } catch (err: unknown) {
            set({ error: getErrorMessage(err), isLoading: false });
            throw err;
        }
    }
}));
