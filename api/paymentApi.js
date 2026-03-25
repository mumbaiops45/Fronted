import axiosInstance from "@/utils/axiosInstance";

export const createPaymentApi = (data) => {
  return axiosInstance.post("/createpayment", data);
};

export const addClient = (data) =>{
    return axiosInstance.post("/addclient", data);
};


export const getAllPropsal = (data) => {
  return axiosInstance.get("/getallproposal", data);
}

export const fetchProposals = async (query) => {
  const url = query ? `/searchproposals?q=${encodeURIComponent(query)}` : `/searchproposals`;
  const response = await axiosInstance.get(url);
  return response.data.proposals;
}

export const addProposal =(data) =>{
  return axiosInstance.post("/createproposal", data);
}   






