import { create } from "zustand";
import { searchByNameService } from "@/services/lead.service";

export const useSearchleadStore = create((set) => ({
    data: [],
    loading: false,
    error: null,

    fetchSearch: async (name) => {
        set({loading: true, error: null});

        try {
            const result = await searchByNameService(name);
            set({data: result ?? [], loading: false});
        } catch (error) {
            set({data: [],  error: error.message, loading: false});
        }
    },

    clearSearch: () => set({data: [], error: null}),
}));