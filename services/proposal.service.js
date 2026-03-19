
import { addProposal } from "@/api/paymentApi";

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

