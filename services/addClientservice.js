import { addClient } from "@/api/paymentApi";

export const addClientService = async (payload) => {
    try {
        const response = await addClient(payload);
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||  
            error.response?.data ||             
            error.message ||                   
            "Client Creation failed";          

        throw new Error(message);
    }
};