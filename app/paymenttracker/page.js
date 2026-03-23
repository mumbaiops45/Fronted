"use client"

import React, { useState, useEffect } from "react"
import Newpayment from "../components/Newpayment"
import AddClient from "../components/AddClient"
import ShowClient from "../components/ShowClient"
import ShowPayment from "../components/ShowPayment"

const StatCard = ({ title, value, subtitle, color }) => {
    return (
        <div className={`bg-gray-100 rounded-2xl p-6 border-t-4 ${color} shadow-sm`}>
            <p className="text-[10px] text-gray-600 tracking-wide uppercase">
                {title}
            </p>
            <p className="text-[20px] font-bold mt-3 text-gray-900">{value}</p>
            <p className="text-[10px] text-gray-500 mt-2">{subtitle}</p>
        </div>
    )
}

export default function Page() {
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('tracker');
    

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch("https://backendcrm-vm8o.onrender.com/getdashboards")
                if (!res.ok) throw new Error("Failed to fetch dashboard data")
                const data = await res.json()
                
               
                const formatINR = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`

                
                const mappedStats = [
                    {
                        title: "Total Pipeline",
                        value: formatINR(data.totalPipeline),
                        subtitle: "Confirmed clients only",
                        color: "border-blue-500"
                    },
                    {
                        title: "Total Received",
                        value: formatINR(data.totalReceived),
                        subtitle: `${data.percentCollected || 0}% collect`,
                        color: "border-green-500"
                    },
                    {
                        title: "OUT STANDING",
                        value: formatINR(data.outstanding),
                        subtitle: "Balance to Collect",
                        color: "border-red-500"
                    },
                    {
                        title: "Watching",
                        value: formatINR(data.watching),
                        subtitle: `${data.clientsWatching || 0} client(s)`,
                        color: "border-purple-500"
                    }
                ]

                setStats(mappedStats)
            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading dashboard...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Error: {error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-200 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-4 gap-6 ">
                    {stats.map((item, index) => (
                        <StatCard
                            key={index}
                            title={item.title}
                            value={item.value}
                            subtitle={item.subtitle}
                            color={item.color}
                        />
                    ))}
                </div>
            </div>

            <div className="p-2">
                <div className="flex gap-4 bg-gray-100 p-2 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab("tracker")}
                        className={`px-5 rounded-lg text-[12px] font-medium transition ${
                            activeTab === "tracker" ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        📋 Tracker
                    </button>

                    <button
                        onClick={() => setActiveTab("payment")}
                        className={`px-5 py-2 rounded-lg text-[12px] font-medium transition ${
                            activeTab === "payment" ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        💰 Payment Log
                    </button>

                    <button
                        onClick={() => setActiveTab("calendar")}
                        className={`px-5 py-2 rounded-lg text-[12px] font-medium transition ${
                            activeTab === "calendar" ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        📅 Follow-up Calendar
                    </button>
                </div>

                <div>
                    {activeTab === "tracker" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search client, city, category, project..."
                                        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <select className="border rounded-lg px-3 py-2 text-sm">
                                        <option>HOT</option>
                                        <option>Warm</option>
                                        <option>Cold</option>
                                    </select>
                                    <select className="border rounded-lg px-3 py-2 text-sm">
                                        <option>Partial</option>
                                        <option>Paid</option>
                                        <option>Unpaid</option>
                                    </select>
                                    <p className="text-sm text-gray-500">0 of 0 clients</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AddClient />
                                    <Newpayment />
                                </div>
                            </div>
                         <ShowClient/>
                            {/* <div className="bg-gray-50 border rounded-xl h-[420px] flex flex-col items-center justify-center text-center">
                                <span className="text-4xl mb-3">📋</span>
                                <p className="text-lg font-semibold text-gray-700">
                                    No clients yet
                                </p>
                                <p className="text-sm text-gray-500 mt-1 mb-4">
                                    Add your first client to start tracking payments
                                </p>
                                <AddClient />
                            </div> */}
                        </div>
                    )}

                    {activeTab === "payment" && (
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[12px] text-gray-500">0 payment records</p>
                                <Newpayment />
                            </div>
                            <ShowPayment/>
                            {/* <div className="flex flex-col justify-center items-center h-[300px] text-center bg-white rounded-xl shadow">
                                <span className="text-3xl mb-2">💰</span>
                                <p className="font-bold text-gray-700">No payments logged yet</p>
                                <p className="text-gray-500 text-sm mb-4">
                                    Record every payment received to track collections
                                </p>
                            </div>
                            <Newpayment /> */}
                        </div>
                    )}

                    {activeTab === "calendar" && (
                        <div className="bg-black-200">
                            <div className="flex mt-4">
                                <p className="text-[12px] font-bold mx-3">Follow-Up Schedule</p>
                                <p className="text-[10px]">0 pending clients</p>
                            </div>
                            <div className="flex flex-col justify-center items-center h-[200px] text-center bg-white rounded-xl shadow">
                                <span className="text-2xl">📅</span>
                                <p className="font-bold">All clear!</p>
                                <p>No pending follow-ups right now</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}