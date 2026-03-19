import { addproposalStore } from "@/store/proposal.store";


export const addProposal = () => {
    const {createProposal,  proposal, loading, error} = addproposalStore();

    return {
        createProposal,
        proposal,
        loading,
        error
    };
}