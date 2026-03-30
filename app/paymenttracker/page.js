"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Newpayment from "../components/Newpayment"
import AddClient from "../components/AddClient"
import ShowClient from "../components/ShowClient"
import ShowPayment from "../components/ShowPayment"
import { BASE_URL } from "@/utils/axiosInstance"

const StatCard = ({ title, value, subtitle, color }) => {
    return (
        <div className={`bg-gray-100 rounded-2xl p-6 border-t-4 ${color} shadow-sm`}>
            <p className="text-[10px] text-gray-600 tracking-wide uppercase">{title}</p>
            <p className="text-[20px] font-bold mt-3 text-gray-900">{value}</p>
            <p className="text-[10px] text-gray-500 mt-2">{subtitle}</p>
        </div>
    )
}

export default function Page() {
    const [stats, setStats] = useState([])
    const [loadingStats, setLoadingStats] = useState(true)
    const [errorStats, setErrorStats] = useState(null)
    const [activeTab, setActiveTab] = useState('tracker')
    const [search, setSearch] = useState("")
    const [clients, setClients] = useState([])
    const [filteredClients, setFilteredClients] = useState([])
    const [loadingClients, setLoadingClients] = useState(true)
    const [errorClients, setErrorClients] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("")
    const [paymentFilter, setPaymentFilter] = useState("");


    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch(`${BASE_URL}/getdashboards`)
                if (!res.ok) throw new Error("Failed to fetch dashboard data")
                const data = await res.json()

                const formatINR = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`

                const mappedStats = [
                    { title: "Total Pipeline", value: formatINR(data.totalPipeline), subtitle: "Confirmed clients only", color: "border-blue-500" },
                    { title: "Total Received", value: formatINR(data.totalReceived), subtitle: `${data.percentCollected || 0}% collect`, color: "border-green-500" },
                    { title: "OUT STANDING", value: formatINR(data.outstanding), subtitle: "Balance to Collect", color: "border-red-500" },
                    { title: "Watching", value: formatINR(data.watching), subtitle: `${data.clientsWatching || 0} client(s)`, color: "border-purple-500" }
                ]

                setStats(mappedStats)
            } catch (err) {
                console.error(err)
                setErrorStats(err.message)
            } finally {
                setLoadingStats(false)
            }
        }

        fetchDashboard()
    }, [])

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/searchClients`)
                if (res.data && res.data.clients) {
                    setClients(res.data.clients)
                    setFilteredClients(res.data.clients)
                } else {
                    setClients([])
                    setFilteredClients([])
                }
            } catch (err) {
                console.error(err)
                setErrorClients("Failed to fetch clients. Check API server.")
                setClients([])
                setFilteredClients([])
            } finally {
                setLoadingClients(false)
            }
        }

        fetchClients()
    }, [])


    useEffect(() => {
        let filtered = [...clients]

        if (search) {
            const lowerSearch = search.toLowerCase()
            filtered = filtered.filter(client =>
                client.clientName?.toLowerCase().includes(lowerSearch) ||
                client.location?.toLowerCase().includes(lowerSearch) ||
                client.service?.toLowerCase().includes(lowerSearch) ||
                client.project?.toLowerCase().includes(lowerSearch)
            )
        }
        if (priorityFilter) {
            filtered = filtered.filter(client => client.priority === priorityFilter)
        }
        if (paymentFilter) {
            filtered = filtered.filter(clients => clients.paymentStatus === paymentFilter)
        }

        setFilteredClients(filtered)
    }, [search, clients, priorityFilter, paymentFilter])

    if (loadingStats) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading dashboard...</p></div>
    }
    if (errorStats) {
        return <div className="min-h-screen flex items-center justify-center text-red-500"><p>Error: {errorStats}</p></div>
    }
    return (


        <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {stats.map((item, index) => (
                        <StatCard key={index} title={item.title} value={item.value} subtitle={item.subtitle} color={item.color} />
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 bg-gray-100 p-2 rounded-xl mb-4">
                    <button onClick={() => setActiveTab("tracker")} className={`px-4 sm:px-5 rounded-lg text-[12px] sm:text-sm font-medium transition ${activeTab === "tracker" ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-200"}`}>📋 Tracker</button>
                    <button onClick={() => setActiveTab("payment")} className={`px-4 sm:px-5 py-2 rounded-lg text-[12px] sm:text-sm font-medium transition ${activeTab === "payment" ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-200"}`}>💰 Payment Log</button>
                    <button onClick={() => setActiveTab("calendar")} className={`px-4 sm:px-5 py-2 rounded-lg text-[12px] sm:text-sm font-medium transition ${activeTab === "calendar" ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-200"}`}>📅 Follow-up Calendar</button>
                </div>
                <div>
                    {activeTab === "tracker" && (
                        <div className="space-y-4">
                            <div className="flex flex-col
                            lg:flex-row lg:items-center lg:justify-between  gap-4 mb-4 mx-2 sm:px-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search client, city, category, project..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full text-[12px]  border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <select
                                        value={priorityFilter}
                                        onChange={(e) => setPriorityFilter(e.target.value)}
                                        className="border rounded-lg px-3 py-2 text-[12px] ">
                                        <option value="">All Priorities</option>
                                        <option value="Hot">HOT</option>
                                        <option value="Warm">Warm</option>
                                        <option value="Cold">Cold</option>
                                    </select>
                                    <select
                                        value={paymentFilter}
                                        onChange={(e) => setPaymentFilter(e.target.value)}
                                        className="border rounded-lg px-3 py-2 text-[12px] "
                                    >
                                        <option value="">All Payments</option>
                                        <option value="Partial">Partial</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Unpaid">Unpaid</option>
                                    </select>
                                    <p className="text-sm text-gray-500">{filteredClients.length} of {clients.length} clients</p>
                                </div>
                                <div className="flex  items-center">
                                    <AddClient />
                                    <Newpayment />
                                </div>
                            </div>


                            {loadingClients && <p>Loading clients...</p>}
                            {errorClients && <p className="text-red-500">{errorClients}</p>}
                            {!loadingClients && filteredClients.length === 0 && !errorClients && (
                                <p className="text-gray-500">No clients found.</p>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2     
                            lg:grid-cols-3            
                              gap-6">
                                {filteredClients.map((client) => (
                                    <div key={client._id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
                                        <h2 className="text-[12px] font-bold">{client.clientName}</h2>
                                        <p className="text-[12px] text-gray-600">{client.contactPerson}</p>
                                        <p className="text-[12px] text-gray-500">{client.location}</p>
                                         <p className="text-[12px] text-dark-500 ">{client.service}</p>
                                        {/* <p className="text-[12px] text-blue-500 ">{client.service}</p> */}
                                        <div className="text-[12px] flex justify-between mt-3">
                                            <p>Total: ₹{client.totalValue}</p>
                                            <p>Received: ₹{client.amountReceived}</p>
                                        </div>
                                        <div className="flex text-[12px] justify-between mt-2">
                                            <p>Status: {client.paymentStatus}</p>
                                            <p className={`font-semibold ${client.priority === "Hot" ? "text-red-500" : "text-gray-500"}`}>{client.priority}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "payment" && (
                        <div className="w-full">
                            <div className="flex  flex-col sm:flex-row justify-between items-start sm:items-center  mb-4 gap-2 sm:gap-0">
                                <p className="text-[12px] text-gray-500">0 payment records</p>
                                <Newpayment />
                            </div>
                            <ShowPayment />
                        </div>
                    )}

                    {activeTab === "calendar" && (
                        <div className="flex flex-col justify-center items-center h-[200px] text-center bg-white rounded-xl shadow">
                            <span className="text-2xl">📅</span>
                            <p className="font-bold">All clear!</p>
                            <p>No pending follow-ups right now</p>
                        </div>
                    )}
                </div>
            </div>
        </div>


    )
}



