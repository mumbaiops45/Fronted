"use client"

import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from "next/navigation";
import { BASE_URL } from '@/utils/axiosInstance';

const Page = () => {
    const router = useRouter();

    const [formd, setFormd] = useState({
        name: "",
        email: "",
        password: "",
        role: "rep"  
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormd(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const validateForm = () => {
        let tempErrors = {};
        if (!formd.name) tempErrors.name = "Name is required";
        if (!formd.email) tempErrors.email = "Email is required";
        if (!formd.password) tempErrors.password = "Password is required";
        else if (formd.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
        if (!formd.role) tempErrors.role = "Role is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // const res = await axios.post("http://localhost:8080/register", formd);
            const res = await axios.post(`${BASE_URL}/register`, formd);
            console.log("register", res.data.AuthToken)
            localStorage.setItem("token", res.data.AuthToken)
            router.push("/dashboard");
        } catch (error) {
            console.log(error.response?.data || error.message)
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
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            id="role"
                            name='role'
                            value={formd.role}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="master">Master</option>
                            <option value="manager">Manager</option>
                            <option value="rep">Rep</option>
                            <option value="viewer">Viewer</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
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

export default Page;