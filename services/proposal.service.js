
import { addProposal, getAllPropsal , fetchProposals } from "@/api/paymentApi";


export const getPropsalService = async(payload) =>{
    try {
        const response = await getAllPropsal(payload);
        return response.data;
    } catch (error) {
        const message = 
        error.response?.data?.message || error.response?.data || error.message || "Get all Proposal failed";
        throw new Error(message);
    }
}

export const getProposals = async(query) => {
    try {
       const proposals = await fetchProposals(query);
       return proposals;
    } catch (error) {
        console.log("Error fetching proposals:", error);
        throw error;
    }
}


export const addPropsalService = async (payload) =>{
    try {
        const response = await addProposal(payload);
        return response.data;
    } catch (error) {
        const message = 
        error.response?.data?.message ||
        error.response?.data ||
        error.message || 
        "Proposal Creation failed";


        throw new Error(message);
    }
};



