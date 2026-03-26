'use client'

import React, { useState, useEffect } from 'react'
import AddProposal from '../components/AddProposal'
import { BASE_URL } from '@/utils/axiosInstance'
import { useProposalList } from '@/hooks/proposal.hook'

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

const formatINR = (num) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num)
}

const Page = () => {
    const [activeTab, setActiveTab] = useState('revenue');
    const [dashboardData, setDashboardData] = useState({
        activePipeline: { value: 0, count: 0 },
        weightedForecast: 0,
        wonThisPeriod: { value: 0, count: 0 },
        conversionRate: "0.00",
        avgDealValue: 0
    })
    const [loading, setLoading] = useState(true)
    
    const [searchText, setSearchText] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All Categories')

    const { proposals, error, fetchProposals } = useProposalList();

    
    useEffect(() => {
        fetchProposals(searchText, selectedCategory)
    }, [searchText, selectedCategory, fetchProposals])

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch(`${BASE_URL}/getdashboardss`);
                const data = await response.json();
                setDashboardData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        }
        fetchDashboard();
    }, [])

    const stats = [
        {
            title: "ACTIVE PIPELINE",
            value: loading ? "Loading..." : formatINR(dashboardData.activePipeline.value),
            subtitle: `${dashboardData.activePipeline.count} Proposal`,
            color: "border-blue-500"
        },
        {
            title: "WEIGHTED FORECAST",
            value: loading ? "Loading..." : formatINR(dashboardData.weightedForecast),
            subtitle: "By Win Probability",
            color: "border-green-500"
        },
        {
            title: "WON THIS PERIOD",
            value: loading ? "Loading..." : formatINR(dashboardData.wonThisPeriod.value),
            subtitle: `${dashboardData.wonThisPeriod.count} Deals closed`,
            color: "border-red-500"
        },
        {
            title: "CONVERSION RATE",
            value: loading ? "Loading..." : `${parseFloat(dashboardData.conversionRate).toFixed(2)}%`,
            subtitle: `Avg deal : ${formatINR(dashboardData.avgDealValue)}`,
            color: "border-purple-500"
        }
    ]

    return (

        <div className="p-4 bg-slate-50 space-y-4 text-[12px]">

            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 sm:gap-0">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTab('revenue')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Revenue Dashboard
                    </button>

                    <button
                        onClick={() => setActiveTab('pipeline')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'pipeline' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Proposal Pipeline
                    </button>
                </div>

                <div className="flex flex-wrap gap-4">
                    <p>Pipeline {loading ? "..." : formatINR(dashboardData.activePipeline.value)}</p>
                    <p>Won: {loading ? "..." : formatINR(dashboardData.wonThisPeriod.value)}</p>
                </div>
            </div>

            <div className="mt-4 border p-4 rounded-md bg-gray-50">
                {activeTab === 'revenue' && (
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-col-2 lg:grid-cols-4 gap-6">
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
                )}

                {activeTab === 'pipeline' && (
                    <div className="space-y-4">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search client, city, category, project..."
                                    className="w-full  border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    className="border rounded-lg px-3 py-2 text-sm"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option>All Categories</option>
                                    <option>Website Development</option>
                                    <option>Mobile App</option>
                                    <option>E-Commerce</option>
                                    <option>Web Platform</option>
                                    <option>Digital Marketing</option>
                                    <option>2D Animation</option>
                                    <option>CRM / Software</option>
                                    <option>3D + AR Website</option>
                                    <option>WebSite + CRM</option>
                                    <option>Corporate Video</option>
                                    <option>SEO</option>
                                    <option>Other</option>
                                </select>
                                <p className="text-sm text-gray-500">
                                    {proposals.allProposal ? proposals.allProposal.length : 0} proposals
                                </p>
                            </div>

                            {/* <div className="flex items-center gap-3"> */}
                                <AddProposal />
                            {/* </div> */}
                        </div>

                        {proposals.allProposal && proposals.allProposal.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {proposals.allProposal.map((proposal) => (
                                    <div
                                        key={proposal._id}
                                        className="bg-white border border-gray-200 rounded-xl shadow-md  hover:shadow-lg transition-shadow duration-300 flex 
                                        p-4 sm:p-6
                                        flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flexjustify-between items-start mb-2 sm:mb-4">
                                                <h3 className="text-[16px] font-bold text-gray-900">{proposal.clientName}</h3>
                                                <span
                                                    className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${proposal.Stage === "Lead"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : proposal.Stage === "Proposal Sent"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : proposal.Stage === "Won"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {proposal.Stage}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-3">{proposal.category}</p>

                                            <div className="space-y-2 text-gray-700 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">City:</span>
                                                    <span>{proposal.city}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">Deal:</span>
                                                    <span>₹{proposal.dealValue.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">Proposal:</span>
                                                    <span>{new Date(proposal.proposalDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">Expected Close:</span>
                                                    <span>{new Date(proposal.expectedClose).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">Probability:</span>
                                                    <span>{proposal.probability}%</span>
                                                </div>
                                                {proposal.notes && (
                                                    <div>
                                                        <span className="font-medium text-gray-800">Notes:</span>
                                                        <p className="mt-1 text-gray-700 text-sm">{proposal.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 border rounded-xl h-[420px] flex flex-col items-center justify-center text-center">
                                <span className="text-4xl mb-3">🗂</span>
                                <p className="text-lg font-semibold text-gray-700">
                                    Pipeline is empty
                                </p>
                                <p className="text-sm text-gray-500 mt-1 mb-4">
                                    Add your first proposal to start tracking deals
                                </p>
                                <AddProposal />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <a
                    href="#"
                    className="bg-white w-full p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                    <h5 className="mb-3 text-[10px] font-semibold tracking-tight text-gray-800 leading-8">
                        REVENUE BY CATEGORY
                    </h5>
                    <p className="text-gray-500 flex justify-between">
                        No data yet
                        <span className="text-red-500 font-bold ml-2">0</span>
                    </p>
                </a>

                <a
                    href="#"
                    className="bg-white w-full p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                    <h5 className="mb-3 text-[10px] font-semibold tracking-tight text-gray-800 leading-8">
                        WIN / LOSS SUMMARY
                    </h5>
                    <p className="flex justify-between">
                        Total Proposals <span className="text-red-500 font-bold">0</span>
                    </p>
                    <hr className="my-1" />
                    <p className="flex justify-between">
                        Active Pipeline <span className="text-red-500 font-bold">0</span>
                    </p>
                    <hr className="my-1" />
                    <p className="flex justify-between">
                        Won <span className="text-red-500 font-bold">0</span>
                    </p>
                    <hr className="my-1" />
                    <p className="flex justify-between">
                        Lost <span className="text-red-500 font-bold">0</span>
                    </p>
                    <hr className="my-1" />
                    <p className="flex justify-between">
                        Conversion Rate <span className="text-red-500 font-bold">0%</span>
                    </p>
                    <hr className="my-1" />
                    <p className="flex justify-between">
                        Avg Deal Size <span className="text-red-500 font-bold">₹0</span>
                    </p>
                </a>

                <a
                    href="#"
                    className="bg-white w-full p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                    <h5 className="mb-3 text-[10px] font-bold tracking-tight text-gray-800 leading-8">
                        Closing Soon
                    </h5>
                    <p className="text-gray-500 flex justify-between">
                        No close dates set
                        <span className="text-red-500 font-bold ml-2">0</span>
                    </p>
                </a>
            </div>
        </div>
    )
}

export default Page