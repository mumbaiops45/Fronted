"use client"


import { useEffect } from "react";
import { addproposalStore ,useProposalStore , proposalListStore} from "@/store/proposal.store";


export const useProposalList = () => {
    const {proposals, loading, error, fetchProposals} = proposalListStore();

    return {
        proposals,
        loading,
        error,
        fetchProposals,
    }
};


export const useProposals = (query) => {
    const {proposals, loading, error, fetchProposals} = useProposalStore();

    useEffect(() =>{
        fetchProposals(query);
    }, [query, fetchProposals]);

    return {
        proposals, loading, error
    };
}



export const useAddProposal  = () => {
    const {createProposal,  proposal, loading, error} = addproposalStore();

    return {
        createProposal,
        proposal,
        loading,
        error
    };
}