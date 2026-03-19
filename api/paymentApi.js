import axiosInstance from "@/utils/axiosInstance";

export const createPaymentApi = (data) => {
  return axiosInstance.post("/createpayment", data);
};

export const addClient = (data) =>{
    return axiosInstance.post("/addclient", data);
};

export const addProposal =(data) =>{
  return axiosInstance.post("/createproposal", data);
}
