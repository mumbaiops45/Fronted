
import { create } from "zustand";
import { addClientService } from "@/services/addClientservice";

export const useAddClientStore =  create((set) =>({
    loading: false,
    error: null,
  client: null,


    createClient: async (payload) =>{
        set({loading: true, error: null});

        try {
            const data = await addClientService(payload);
            set({ client: data, loading: false});

            return data;
        } catch (error) {
            
           set({
            error: error.message || "Somethings went wrong",
            loading: false,
           })

           throw error;
        }
    }
}))