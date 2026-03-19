import { create } from "zustand";
import { createPaymentService } from "@/services/paymentService";

export const usePaymentStore = create((set) => ({
    loading: false,
    error: null,
    payment: null,

    
    createPayment: async (payload) => {
        set({ loading: true, error: null });

        try {
            const data = await createPaymentService(payload);
            set({ payment: data, loading: false });

            return data;

        } catch (error) {

          

            set({
                error: error.message || "Something went wrong",
                loading: false,
            });

            

            throw error;
        }
    }
}));