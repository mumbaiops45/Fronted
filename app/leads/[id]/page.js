"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const page = () => {

      const params = useParams();
    const id = params.id; 
    const router = useRouter();

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLead = async () => {
            if (!id) return; 
            
            try {
                const token = localStorage.getItem("token");
                console.log("Fetching lead with ID:", id);
                console.log("Token:", token ? "Present" : "Missing");
                
                const response = await axios.get(`http://localhost:8080/leads/${id}`, {
                    headers: {
                        "auth-token": token
                    }
                });
                
                console.log("API Response:", response.data);
                
               
                if (response.data.lead) {
                    setLead(response.data.lead);
                } else if (response.data.data) {
                    setLead(response.data.data);
                } else {
                    setLead(response.data);
                }
                
            } catch (err) {
                console.error("Error fetching lead:", err);
                if (err.response) {
                    setError(`Server error: ${err.response.status} - ${err.response.data.message || err.message}`);
                } else if (err.request) {
                    setError("No response from server. Please check if the server is running.");
                } else {
                    setError(err.message || "Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchLead();
    }, [id]);

     if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-blue-600 text-lg font-medium">Loading lead details...</p>
            </div>
        );
    }

      
    
  return (
    <div>
    
         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-6 text-white">
          <div className="flex items-center space-x-4">
            
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center font-semibold text-lg shadow">
              {lead?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-lg font-semibold">{lead?.name}</h2>
              <p className="text-gray-300 text-sm">
                {lead?.businessName || "Business Name"}
              </p>
            </div>

          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-sm space-y-4">

          <div className="grid grid-cols-2 gap-4">
            
            <div>
              <p className="text-gray-400 text-xs uppercase">Phone</p>
              <p className="font-medium text-gray-800">
                {lead?.phone || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">Email</p>
              <p className="font-medium text-gray-800">
                {lead?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">Location</p>
              <p className="font-medium text-gray-800">
                {lead?.location || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">Branch</p>
              <p className="font-medium text-gray-800">
                {lead?.branch || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">Business Type</p>
              <p className="font-medium text-gray-800">
                {lead?.businessType || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">Source</p>
              <p className="font-medium text-gray-800">
                {lead?.source || "N/A"}
              </p>
            </div>

          </div>

          {/* Deal Value Highlight */}
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center">
            <span className="text-gray-500 text-sm">Deal Value</span>
            <span className="text-lg font-semibold text-green-600">
              ₹{lead?.dealValue
                ? lead.dealValue.toLocaleString("en-IN")
                : "0"}
            </span>
          </div>

        </div>

      </div>
    </div>
    </div>
  )
}

export default page
