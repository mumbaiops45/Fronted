import { createPaymentApi } from "@/api/paymentApi";

export const createPaymentService = async (payload) => {
    try {
        const response = await createPaymentApi(payload);
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||  
            error.response?.data ||             
            error.message ||                   
            "Payment creation failed";          

        throw new Error(message);
    }
};