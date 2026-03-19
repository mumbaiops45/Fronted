
import { useAddClientStore } from "@/store/addClientstore";

export const addClient = () => {
    const {createClient,loading, error,client} = useAddClientStore();

    return {
        createClient ,
        loading, 
        error,
        client
    };
}