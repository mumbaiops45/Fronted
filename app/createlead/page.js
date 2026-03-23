
"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const page = () => {
     const router = useRouter();
      const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Not found token");
            router.push("/signup"); 
        }
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        businessName: "",
        businessType: "",
        phone: "",
        email: "",
        location: "",
        branch: "Bangalore",
        stage: "Lead Capture",
        priority: "Warm",
        source: "Other",
        dealValue: 12300,
        requirements: "",
        notes: "",
    });

    const branches = ["Bangalore", "Mumbai", "Mysore"];
    const stages = ["Lead Capture", "Reachable", "Qualified", "Proposal Sent", "Closed Won", "Closed Lost"];
    const priorities = ["Hot", "Warm", "Cool"];
    const sources = ["WhatsApp", "Website Form", "Phone Call", "Referral", "Social Media", "Walk-in", "Other"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Lead Data:", formData);
    const token = localStorage.getItem("token"); 

    try {
        const resp = await axios.post(
            "https://backendcrm-vm8o.onrender.com/create",
            formData,
            {
                headers: {
                    "auth-token": token
                }
            }
        );
        console.log(resp);
        setFormData({
            name: "",
            businessName:"",
            businessType: "",
            phone: "",
            email: "",
            location: "",
            branch: "Bangalore",
            stage: "Lead Capture",
            priority: "Warm",
            source: "Other",
            dealValue: 12300,
            requirements: "",
            notes: "",
        });
        setShowModal(false);
    } catch (error) {
        console.log(error.message);
        alert("Failed to submit form. Data is not lost.");
    }
};

    return (
        <>      
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
            {/* <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Lead</h2> */}
            <form onSubmit={handleSubmit} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

               
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Business Name</label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="ABC Pvt Ltd"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

              
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Business Type</label>
                    <input
                        type="text"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        placeholder="IT, Retail, etc."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

            
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

               
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

               
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Branch</label>
                    <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        {branches.map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </div>

               
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Stage</label>
                    <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        {stages.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

               
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        {priorities.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>

               
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Source</label>
                    <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        {sources.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

               
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Deal Value</label>
                    <input
                        type="number"
                        name="dealValue"
                        value={formData.dealValue}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Requirements</label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="Enter requirements"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Additional notes"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 lg:col-span-4">
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
          </>
    )
}

export default page
