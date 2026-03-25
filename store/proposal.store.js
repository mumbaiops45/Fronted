import { create } from "zustand";
import {getPropsalService, addPropsalService , getProposals } from "@/services/proposal.service";
import { fetchProposals } from "@/api/paymentApi";

export const proposalListStore = create((set) => ({
    proposals: [],
    loading: false,
    error: null,

    fetchProposals: async () => {
        set({loading: true, error: null});

        try {
            const data = await getPropsalService();
            set({proposals: data , loading: false});
            return data;
        } catch (error) {
            set({
                error: error.message || "Failed to fetch proposals",
                loading: false,
            });
            throw error;
        }
    },
}));

export const useProposalStore = create((set) => ({
    proposals: [],
    loading: false,
    error: null,

    fetchProposals: async(query) => {
        set({loading: true, error: null});

        try {
            const data = await getProposals(query);
            set({proposals: data, loading: false});
        } catch (error) {
            set({error: error.message || "Somethings went wrong", loading: false})
        }
    }
}))

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