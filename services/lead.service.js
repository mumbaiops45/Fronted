import { searchByName } from "@/api/paymentApi";



export const  searchByNameService = async(name) =>{
   try {
    const response = await searchByName(name);
    console.log("suraj",response);
    return response;
   } catch (error) {
    const message = 
    error.response?.data?.message ||
    error.response?.data ||
    error.message || 
    "Search name Failed";
    throw new Error(message);
   }
   
}