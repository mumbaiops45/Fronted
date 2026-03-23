// 'use client'

// import React, { useState } from 'react'
// import AddProposal from '../components/AddProposal'



// const StatCard = ({ title, value, subtitle, color }) => {

//     return (
//         <div className={`bg-gray-100 rounded-2xl p-6 border-t-4 ${color} shadow-sm`}>
//             <p className="text-[10px] text-gray-600 tracking-wide uppercase">
//                 {title}
//             </p>
//             <p className="text-[20px] font-bold mt-3 text-gray-900">{value}</p>

//             <p className="text-[10px] text-gray-500 mt-2">{subtitle}</p>
//         </div>
//     )
// }


// const Page = () => {


//     const stats = [
//         {
//             title: "ACTIVE PIPELINE",
//             value: "₹0",
//             subtitle: "0 Proposal",
//             color: "border-blue-500"
//         },
//         {
//             title: "WEIGJTED FORECAST",
//             value: "₹0",
//             subtitle: "By Win Probability",
//             color: "border-green-500"
//         },
//         {
//             title: "WON THIS PERIOD",
//             value: "₹0",
//             subtitle: " 0 deals closed ",
//             color: "border-red-500"
//         },
//         {
//             title: "CONVERSION RATE",
//             value: "0%",
//             subtitle: " Avg deal :₹0",
//             color: "border-purple-500"
//         }
//     ]

//     const [activeTab, setActiveTab] = useState('revenue');

//     return (
//         <div className="p-4 space-y-4 text-[12px]">

//             <div className="flex justify-between items-center">

//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => setActiveTab('revenue')}
//                         className={`px-4 py-2 rounded-md ${activeTab === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//                             }`}
//                     >
//                         Revenue Dashboard
//                     </button>

//                     <button
//                         onClick={() => setActiveTab('pipeline')}
//                         className={`px-4 py-2 rounded-md ${activeTab === 'pipeline' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//                             }`}
//                     >
//                         Proposal Pipeline
//                     </button>
//                 </div>


//                 <div className="flex gap-4">
//                     <p>Pipeline ₹0</p>
//                     <p>Won: ₹0</p>
//                 </div>
//             </div>


//             <div className="mt-4 border p-4 rounded-md bg-gray-50">
//                 {activeTab === 'revenue' && (

//                     <div className="max-w-7xl mx-auto">
//                         <div className="grid grid-cols-4 gap-6 ">
//                             {stats.map((item, index) => (
//                                 <StatCard
//                                     key={index}
//                                     title={item.title}
//                                     value={item.value}
//                                     subtitle={item.subtitle}
//                                     color={item.color}
//                                 />
//                             ))}

//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'pipeline' && (
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between gap-4">

//                             <div className="flex-1">
//                                 <input
//                                     type="text"
//                                     placeholder="Search client, city, category, project..."
//                                     className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                                 />
//                             </div>
//                             <div className="flex items-center gap-3">

//                                 <select className="border rounded-lg px-3 py-2 text-sm">
//                                     <option>All Cagegories</option>
//                                     <option>Website Development</option>
//                                     <option>Mobile App</option>
//                                     <option>E-Commerce</option>
//                                     <option>Web Platform</option>
//                                     <option>Digital Marketing</option>
//                                     <option>2D Animation</option>
//                                     <option>CRM / Software</option>
//                                     <option>3D + AR Website</option>
//                                     <option>WebSite + CRM</option>
//                                     <option>Corporate Video</option>
//                                     <option>SEO</option>
//                                     <option>Other</option>

//                                 </select>
//                                 <p className="text-sm text-gray-500">0 proposals</p>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <AddProposal />

//                             </div>
//                         </div>
//                         <div className="bg-gray-50 border rounded-xl h-[420px] flex flex-col items-center justify-center text-center">
//                             <span className="text-4xl mb-3">🗂</span>
//                             <p className="text-lg font-semibold text-gray-700">
//                                 Pipeline is empty
//                             </p>
//                             <p className="text-sm text-gray-500 mt-1 mb-4">
//                                 Add your first proposal to start tracking deals
//                             </p>
//                             <AddProposal />
//                         </div>
//                     </div>
//                 )}
//             </div>


//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                 <a
//                     href="#"
//                     className="bg-white w-full p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                     <h5 className="mb-3 text-[10px] font-semibold tracking-tight text-gray-800 leading-8">
//                         REVENUE BY CATEGORY
//                     </h5>
//                     <p className="text-gray-500 flex justify-between">
//                         No, data yet
//                         <span className="text-red-500 font-bold ml-2">0</span>
//                     </p>
//                 </a>

             
//                 <a
//                     href="#"
//                     className="bg-white w-full p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                     <h5 className="mb-3 text-[10px] font-semibold tracking-tight text-gray-800 leading-8">
//                         WIN / LOSS SUMMARY
//                     </h5>
//                     <p className="flex justify-between">
//                         Total Proposals <span className="text-red-500 font-bold">0</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Active Pipeline <span className="text-red-500 font-bold">0</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Won <span className="text-red-500 font-bold">0</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Lost <span className="text-red-500 font-bold">0</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Conversion Rate <span className="text-red-500 font-bold">0%</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Avg Deal Size <span className="text-red-500 font-bold">₹0</span>
//                     </p>
//                 </a>

              
//                 <a
//                     href="#"
//                     className="bg-white w-full p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                     <h5 className="mb-3 text-[10px] font-bold tracking-tight text-gray-800 leading-8">
//                         Closing Soon
//                     </h5>
//                     <p className="text-gray-500 flex justify-between">
//                         No close dates set
//                         <span className="text-red-500 font-bold ml-2">0</span>
//                     </p>
//                 </a>

//             </div>


//         </div>
//     )
// }

// export default Page


// 'use client'

// import React, { useState, useEffect } from 'react'
// import AddProposal from '../components/AddProposal'

// const StatCard = ({ title, value, subtitle, color }) => {
//     return (
//         <div className={`bg-gray-100 rounded-2xl p-6 border-t-4 ${color} shadow-sm`}>
//             <p className="text-[10px] text-gray-600 tracking-wide uppercase">
//                 {title}
//             </p>
//             <p className="text-[20px] font-bold mt-3 text-gray-900">{value}</p>
//             <p className="text-[10px] text-gray-500 mt-2">{subtitle}</p>
//         </div>
//     )
// }

// const formatINR = (num) => {
//     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num)
// }

// const Page = () => {
//     const [activeTab, setActiveTab] = useState('revenue');
//     const [dashboardData, setDashboardData] = useState({
//         totalPipeline: 0,
//         totalReceived: 0,
//         outstanding: 0,
//         watching: 0
//     })
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         const fetchDashboard = async () => {
//             try {
//                 const response = await fetch('https://backendcrm-vm8o.onrender.com/getdashboards');
//                 const data = await response.json();
//                 setDashboardData(data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching dashboard data:", error);
//                 setLoading(false);
//             }
//         }
//         fetchDashboard();
//     }, [])

//     const stats = [
//         {
//             title: "ACTIVE PIPELINE",
//             // value: loading ? "Loading..." : `₹${dashboardData.totalPipeline}`,
//             value: loading ? "Loading..." : formatINR(dashboardData.totalPipeline),
//             subtitle: `${dashboardData.watching} Proposal`,
//             color: "border-blue-500"
//         },
//         {
//             title: "WEIGHTED FORECAST",
//             // value: loading ? "Loading..." : `₹${dashboardData.totalReceived}`,
//              value: loading ? "Loading..." : formatINR(dashboardData.totalReceived),
//             subtitle: "By Win Probability",
//             color: "border-green-500"
//         },
//         {
//             title: "WON THIS PERIOD",
//             value: loading ? "Loading..." : `₹${dashboardData.totalReceived - dashboardData.outstanding}`,
//             subtitle: "Deals closed",
//             color: "border-red-500"
//         },
//         {
//             title: "CONVERSION RATE",
//             value: loading ? "Loading..." : dashboardData.totalPipeline === 0 ? "0%" : `${Math.round(((dashboardData.totalReceived - dashboardData.outstanding) / dashboardData.totalPipeline) * 100)}%`,
//             subtitle: `Avg deal :₹${dashboardData.totalPipeline === 0 ? 0 : Math.round((dashboardData.totalReceived - dashboardData.outstanding) / dashboardData.totalPipeline)}`,
//             color: "border-purple-500"
//         }
//     ]

//     return (
//         <div className="p-4 space-y-4 text-[12px]">

//             <div className="flex justify-between items-center">
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => setActiveTab('revenue')}
//                         className={`px-4 py-2 rounded-md ${activeTab === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
//                     >
//                         Revenue Dashboard
//                     </button>

//                     <button
//                         onClick={() => setActiveTab('pipeline')}
//                         className={`px-4 py-2 rounded-md ${activeTab === 'pipeline' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
//                     >
//                         Proposal Pipeline
//                     </button>
//                 </div>

//                 <div className="flex gap-4">
//                     <p>Pipeline ₹{dashboardData.totalPipeline}</p>
//                     <p>Won: ₹{dashboardData.totalReceived - dashboardData.outstanding}</p>
//                 </div>
//             </div>

//             <div className="mt-4 border p-4 rounded-md bg-gray-50">
//                 {activeTab === 'revenue' && (
//                     <div className="max-w-7xl mx-auto">
//                         <div className="grid grid-cols-4 gap-6">
//                             {stats.map((item, index) => (
//                                 <StatCard
//                                     key={index}
//                                     title={item.title}
//                                     value={item.value}
//                                     subtitle={item.subtitle}
//                                     color={item.color}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                {activeTab === 'pipeline' && (
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between gap-4">

//                             <div className="flex-1">
//                                 <input
//                                     type="text"
//                                     placeholder="Search client, city, category, project..."
//                                     className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                                 />
//                             </div>
//                             <div className="flex items-center gap-3">

//                                 <select className="border rounded-lg px-3 py-2 text-sm">
//                                     <option>All Cagegories</option>
//                                     <option>Website Development</option>
//                                     <option>Mobile App</option>
//                                     <option>E-Commerce</option>
//                                     <option>Web Platform</option>
//                                     <option>Digital Marketing</option>
//                                     <option>2D Animation</option>
//                                     <option>CRM / Software</option>
//                                     <option>3D + AR Website</option>
//                                     <option>WebSite + CRM</option>
//                                     <option>Corporate Video</option>
//                                     <option>SEO</option>
//                                     <option>Other</option>

//                                 </select>
//                                 <p className="text-sm text-gray-500">0 proposals</p>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <AddProposal />

//                             </div>
//                         </div>
//                         <div className="bg-gray-50 border rounded-xl h-[420px] flex flex-col items-center justify-center text-center">
//                             <span className="text-4xl mb-3">🗂</span>
//                             <p className="text-lg font-semibold text-gray-700">
//                                 Pipeline is empty
//                             </p>
//                             <p className="text-sm text-gray-500 mt-1 mb-4">
//                                 Add your first proposal to start tracking deals
//                             </p>
//                             <AddProposal />
//                         </div>
//                     </div>
//                 )}
//             </div>


//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                 <a
//                     href="#"
//                     className="bg-white w-full p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                     <h5 className="mb-3 text-[10px] font-semibold tracking-tight text-gray-800 leading-8">
//                         REVENUE BY CATEGORY
//                     </h5>
//                     <p className="text-gray-500 flex justify-between">
//                         No, data yet
//                         <span className="text-red-500 font-bold ml-2">0</span>
//                     </p>
//                 </a>

             
//                 <a
//                     href="#"
//                     className="bg-white w-full p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                     <h5 className="mb-3 text-[10px] font-semibold tracking-tight text-gray-800 leading-8">
//                         WIN / LOSS SUMMARY
//                     </h5>
//                     <p className="flex justify-between">
//                         Total Proposals <span className="text-red-500 font-bold">0</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Active Pipeline <span className="text-red-500 font-bold">0</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Won <span className="text-red-500 font-bold">0</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Lost <span className="text-red-500 font-bold">0</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Conversion Rate <span className="text-red-500 font-bold">0%</span>
//                     </p>
//                     <hr className="my-1" />
//                     <p className="flex justify-between">
//                         Avg Deal Size <span className="text-red-500 font-bold">₹0</span>
//                     </p>
//                 </a>

              
//                 <a
//                     href="#"
//                     className="bg-white w-full p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                     <h5 className="mb-3 text-[10px] font-bold tracking-tight text-gray-800 leading-8">
//                         Closing Soon
//                     </h5>
//                     <p className="text-gray-500 flex justify-between">
//                         No close dates set
//                         <span className="text-red-500 font-bold ml-2">0</span>
//                     </p>
//                 </a>

//             </div>


//         </div>
//     )
// }

// export default Page


'use client'

import React, { useState, useEffect } from 'react'
import AddProposal from '../components/AddProposal'

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

// Formatter for Indian currency
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

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch('https://backendcrm-vm8o.onrender.com/getdashboardss');
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
        <div className="p-4 space-y-4 text-[12px]">

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
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

                <div className="flex gap-4">
                    <p>Pipeline {loading ? "..." : formatINR(dashboardData.activePipeline.value)}</p>
                    <p>Won: {loading ? "..." : formatINR(dashboardData.wonThisPeriod.value)}</p>
                </div>
            </div>

            <div className="mt-4 border p-4 rounded-md bg-gray-50">
                {activeTab === 'revenue' && (
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-4 gap-6">
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
                                    <option>All Cagegories</option>
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
                                <p className="text-sm text-gray-500">0 proposals</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <AddProposal />

                            </div>
                        </div>
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
                        No, data yet
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