
import { usePaymentStore } from "@/store/paymentStore";

export const usePayment = () => {
    const {createPayment, loading, error, payment} = usePaymentStore();

    return {
        createPayment ,
        loading, 
        error,
        payment,
    };
};