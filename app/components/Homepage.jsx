"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/utils/axiosInstance";

const Homepage = () => {
  const router = useRouter();
  const [role, setRole] = useState("master");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!form.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      tempErrors.email = "Invalid email format";

    if (!form.password) tempErrors.password = "Password is required";
    else if (form.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/login`, {
        email: form.email,
        password: form.password,
        role: role,
      });

      console.log(res.data);
      localStorage.setItem("token", res.data.Authtoken);
      localStorage.setItem("role", role);
      router.push("/dashboard");
    } catch (error) {

      let msg = "Login failed. Please check credentials.";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          msg = error.response.data;
        } else if (error.response.data.message) {
          msg = error.response.data.message;
        } else {

          msg = JSON.stringify(error.response.data);
        }
      }

      setServerError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  };


  return (

    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-[65%] bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white p-10 md:p-20 flex flex-col justify-center">
        <div className="w-full py-6 md:py-8">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-[15px] tracking-widest">NNC</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm md:text-[15px] font-extrabold text-white tracking-wide">NNC CRM</h2>
              <p className="text-blue-200 text-[10px] md:text-[12px] mt-1">Website Development Services</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 md:space-y-0 leading-tight font-syne">
          <p className="text-2xl md:text-[34px] font-[800]">Your leads.</p>
          <p className="text-2xl md:text-[34px] font-[800]">Your pipeline.</p>
          <p className="text-2xl md:text-[34px] font-[800]">Your growth.</p>
        </div>

        <p className="mt-4 md:mt-6 max-w-full md:max-w-lg text-[12px] md:text-[14px] opacity-90 leading-relaxed">
          NNC's complete CRM for managing website development enquiries across
          Bangalore, Mumbai & Mysore — from first contact to project delivery.
        </p>
        <div className="flex overflow-x-auto gap-6 mt-6 md:mt-12">
          <div className="flex-shrink-0">
            <h2 className="text-2xl md:text-3xl font-bold">1,022</h2>
            <p className="text-xs md:text-sm opacity-70">Total Leads</p>
          </div>
          <div className="flex-shrink-0">
            <h2 className="text-2xl md:text-3xl font-bold">₹6.88L</h2>
            <p className="text-xs md:text-sm opacity-70">Revenue</p>
          </div>
          <div className="flex-shrink-0">
            <h2 className="text-2xl md:text-3xl font-bold">3</h2>
            <p className="text-xs md:text-sm opacity-70">Branches</p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[35%] bg-gray-50 px-6 md:px-10 py-10 md:py-16 flex flex-col justify-center">
        <h1 className="text-xl md:text-[26px] font-extrabold mb-2 font-syne">Welcome back</h1>
        <p className="text-gray-600 mb-4 md:mb-6 text-[11px] md:text-[12px]">
          Sign in to your NNC CRM workspace. Select your access role below.
        </p>

        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
          {[
            { id: "master", label: "👑 Master Admin", desc: "Full access" },
            { id: "manager", label: "🏢 Branch Manager", desc: "Branch view" },
            { id: "rep", label: "👤 Sales Rep", desc: "Own leads only" },
            { id: "viewer", label: "👁 Viewer", desc: "Read-only" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRole(item.id)}
              className={`p-2 md:p-3 rounded-lg border text-left transition text-[10px] md:text-[12px] ${role === item.id
                ? "border-blue-500 bg-blue-100"
                : "bg-white hover:border-blue-300"
                }`}
            >
              <p className="font-medium">{item.label}</p>
              <p className="text-gray-500 text-[9px] md:text-[10.5px]">{item.desc}</p>
            </button>
          ))}
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
          <label className="text-xs mb-1 text-gray-600">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@nnc.in"
            className="p-3 mb-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-xs mb-2">
              {errors.email}
            </p>
          )}

          <label className="text-xs mb-1 text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            className="p-3 mb-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
          />
          {errors.password && (
            <p id="password-error" className="text-red-500 text-xs mb-2">
              {errors.password}
            </p>
          )}

          {serverError && (
            <p className="text-red-600 text-sm mb-2" role="alert">
              {serverError}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? "Signing in..." : "Sign In to NNC CRM"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Demo: any email + password works. Master Admin pre-selected
        </p>

        <p className="text-xs text-gray-400 mt-1 text-center">
          © 2026 NNC Website Services. All rights reserved
        </p>
      </div>
    </div>
    
  );
};

export default Homepage;
