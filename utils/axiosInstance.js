import axios from "axios";

export const BASE_URL = "http://localhost:8080";

// export const BASE_URL = "https://backendcrm-vm8o.onrender.com"

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  //  baseURL: "https://backendcrm-vm8o.onrender.com",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers["auth-token"] = token;
  }
  return config;
});

export default axiosInstance;