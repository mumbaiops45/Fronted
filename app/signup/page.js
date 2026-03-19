"use client"

import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from "next/navigation";

const page = () => {

    const router = useRouter();


    const [formd, setformd] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setformd(prev => ({
        ...prev,
        [name]: value
    }));
}

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("submit data", formd);
        try {
            const res = await axios.post("http://localhost:8080/register", formd);

            console.log("register", res.data.AuthToken)
            localStorage.setItem("token" ,res.data.AuthToken)
            router.push("/");
        } catch (error) {
            console.log(error.message)
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name" 
                            name='name'
                            value={formd.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email" 
                            name='email'
                            value={formd.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name='password'
                            value={formd.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                       Signup
                    </button>
                </form>
            </div>
        </div>
    )
}

export default page
