import { create } from "zustand";
import {addPropsalService} from "@/services/proposal.service";

export const addproposalStore = create((set) =>({
    loading: false,
    error: null,
    proposal: null,

     createProposal: async (payload) =>{
        set({loading: true, error: null});

        try {
            const data = await addPropsalService(payload);
            set({proposal: data, loading: false});

            return data;

        } catch (error) {

            set({
                error: error.message || "Somethings went wrong",
                loading: false,
            });

            throw error;
            
        }
     }
    
}))