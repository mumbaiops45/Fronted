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

export const searchByName = async (query) => {
    if (!query || query.trim() === "") return []; 
    const url = `/search?name=${encodeURIComponent(query)}`;
    console.log("Request URL:", url);
    const response = await axiosInstance.get(url);
    console.log("djfdf", response.data.leads);
    return response.data.leads; 
}

export const fetchProposals = async (query) => {
  const url = query ? `/searchproposals?q=${encodeURIComponent(query)}` : `/searchproposals`;
  const response = await axiosInstance.get(url);
  return response.data.proposals;
}


export const addProposal =(data) =>{
  return axiosInstance.post("/createproposal", data);
}   






