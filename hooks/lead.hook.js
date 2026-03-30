import { useSearchleadStore } from "@/store/lead.store";

export const leadsearchName  = () => {
    const {data, loading, error, fetchSearch, clearSearch} = useSearchleadStore();

    return {data, loading, error, fetchSearch, clearSearch};
};

