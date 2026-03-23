
"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import axios from "axios";


const CITIES = [
    { label: "All",       value: "All"       },
    { label: "Bangalore", value: "bangalore" }, 
    { label: "Mumbai",    value: "mumbai"    },
    { label: "Mysore",    value: "mysore"    }, 
];

const REP_OPTIONS = ["All Reps", "Arjun", "Divya", "Kartik"];

const STAGES = ["Lead Capture", "Reachable", "Qualified", "Proposal", "Closed"];


const STAGE_COLORS = {
    "Lead Capture": { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400"   },
    "Reachable":    { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
    "Qualified":    { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
    "Proposal":     { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
    "Closed":       { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400"  },
};

const PRIORITY_COLORS = {
    Hot:  "bg-red-100 text-red-700",
    Warm: "bg-yellow-100 text-yellow-700",
    Cool: "bg-emerald-100 text-emerald-700",
};

const BANT_COLORS = ["#ef4444", "#f97316", "#3b82f6", "#22c55e"];


const formatCurrency = (val) =>
    val ? `₹ ${Number(val).toLocaleString("en-IN")}` : "₹ 0";


const extractLeads = (data) => {
    if (Array.isArray(data))           return data;
    if (Array.isArray(data?.leads))    return data.leads;
    if (Array.isArray(data?.Allleads)) return data.Allleads;
    if (Array.isArray(data?.data))     return data.data;
    return [];
};



const Spinner = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-600 text-sm font-medium">Loading leads…</p>
    </div>
);

const EmptyState = ({ filtered }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-gray-700 font-semibold text-sm">
            {filtered ? "No leads match your filters" : "No leads found"}
        </p>
        <p className="text-gray-400 text-xs mt-1">
            {filtered
                ? "Try changing the city, rep, or stage filter."
                : "Leads will appear here once added."}
        </p>
    </div>
);

const BantBar = ({ score }) => {
    const pct   = ((score ?? 0) / 4) * 100;
    const color = BANT_COLORS[(score ?? 1) - 1] ?? "#d1d5db";
    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">BANT</span>
                <span className="text-[10px] font-bold text-gray-700">{score ?? 0}/4</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
};

const LeadCard = ({ lead }) => {
    const stageStyle    = STAGE_COLORS[lead.stage] ?? { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-300" };
    const priorityClass = PRIORITY_COLORS[lead.priority] ?? "bg-gray-100 text-gray-600";

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 hover:border-blue-100 cursor-pointer flex flex-col gap-2">
           
            <div className="flex items-start justify-between gap-2">
                <h2 className="text-xs font-bold text-gray-900 leading-tight truncate">
                    {lead.name || "No Name"}
                </h2>
                {lead.priority && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${priorityClass}`}>
                        {lead.priority}
                    </span>
                )}
            </div>

           
            <p className="text-[10.5px] text-gray-500 truncate">
                {lead.branch || "—"}
                {lead.businessName ? ` · ${lead.businessName.split(" ").pop()}` : ""}
            </p>

          
            {lead.source && (
                <p className="text-[10.5px] text-black-400 truncate">
                     {lead.source.trim().split(" ")[0]}
                </p>
            )}

           
            {lead.stage && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium w-fit ${stageStyle.bg} ${stageStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${stageStyle.dot}`} />
                    {lead.stage}
                </span>
            )}

          
            {lead.bant && <BantBar score={lead.bant.score} />}

            
            <p className="text-xs font-bold text-blue-600 mt-auto pt-2 border-t border-gray-50">
                {formatCurrency(lead.dealValue)}
            </p>
        </div>
    );
};


const FilterDropdown = ({ value, options, onChange }) => (
    <Menu as="div" className="relative w-full sm:w-40">
        <MenuButton className="w-full flex justify-between items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition">
            <span className="truncate">{value}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1" />
        </MenuButton>
        <MenuItems className="absolute left-0 z-20 mt-1 w-full bg-white rounded-lg shadow-xl ring-1 ring-black/5 max-h-56 overflow-auto focus:outline-none">
            {options.map((option) => (
                <MenuItem key={option}>
                    {({ active }) => (
                        <button
                            onClick={() => onChange(option)}
                            className={`block w-full text-left px-4 py-2 text-xs transition
                                ${active ? "bg-gray-50" : ""}
                                ${value === option ? "font-semibold text-blue-600 bg-blue-50" : "text-gray-700"}`}
                        >
                            {option}
                        </button>
                    )}
                </MenuItem>
            ))}
        </MenuItems>
    </Menu>
);



const Page = () => {
    const [allLeads,      setAllLeads]      = useState([]); 
    const [leads,         setLeads]         = useState([]); 
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState(null);

    const [selectedCity,  setSelectedCity]  = useState("All");
    const [selectedRep,   setSelectedRep]   = useState("All Reps");
    const [selectedStage, setSelectedStage] = useState("All Stages");


    const fetchLeads = useCallback(async (cityValue = "All") => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");

           
            const url = cityValue === "All"
                ? "https://backendcrm-vm8o.onrender.com/allleads"
                : `https://backendcrm-vm8o.onrender.com/branch/search?location=${cityValue}`;

            const response = await axios.get(url, { headers: { "auth-token": token } });

           
            setAllLeads(extractLeads(response.data));
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err?.response?.data?.message || err.message || "Something went wrong.");
            setAllLeads([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchLeads("All"); }, [fetchLeads]);


    useEffect(() => {
        let filtered = [...allLeads];

        if (selectedRep !== "All Reps") {
            filtered = filtered.filter(
                (l) => l.createdBy?.name === selectedRep || l.rep === selectedRep
            );
        }

        if (selectedStage !== "All Stages") {
            filtered = filtered.filter((l) => l.stage === selectedStage);
        }

        setLeads(filtered);
    }, [allLeads, selectedRep, selectedStage]);

    const handleCityClick = (city) => {
        setSelectedCity(city.label);
        setSelectedRep("All Reps");   
        setSelectedStage("All Stages");
        fetchLeads(city.value);
    };

    const resetFilters = () => {
        setSelectedCity("All");
        setSelectedRep("All Reps");
        setSelectedStage("All Stages");
        fetchLeads("All");
    };

    const hasFilters =
        selectedCity !== "All" ||
        selectedRep  !== "All Reps" ||
        selectedStage !== "All Stages";

   
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <span className="text-5xl">⚠️</span>
                <p className="text-red-600 font-semibold">Something went wrong</p>
                <p className="text-gray-500 text-sm text-center max-w-xs">{error}</p>
                <button
                    onClick={() => {
                        const city = CITIES.find(c => c.label === selectedCity);
                        fetchLeads(city?.value ?? "All");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">

           
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 mb-5">
                <div className="flex flex-wrap items-center gap-3">

                   
                    <div className="flex flex-wrap gap-2">
                        {CITIES.map((city) => (
                            <button
                                key={city.value}
                                onClick={() => handleCityClick(city)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition border ${
                                    selectedCity === city.label
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                {city.label}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-5 bg-gray-200 hidden sm:block" />

                  
                    <FilterDropdown
                        value={selectedRep}
                        options={REP_OPTIONS}
                        onChange={setSelectedRep}
                    />

                  
                    <FilterDropdown
                        value={selectedStage}
                        options={["All Stages", ...STAGES]}
                        onChange={setSelectedStage}
                    />

                  
                    {hasFilters && (
                        <button
                            onClick={resetFilters}
                            className="text-[11px] text-red-500 hover:text-red-700 underline whitespace-nowrap transition"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

           
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-xs text-gray-500">
                    {loading
                        ? "Fetching leads…"
                        : `${leads.length} lead${leads.length !== 1 ? "s" : ""} found`}
                </p>
                {hasFilters && !loading && (
                    <div className="flex flex-wrap gap-1">
                        {selectedCity !== "All" && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full font-medium">
                                {selectedCity}
                            </span>
                        )}
                        {selectedRep !== "All Reps" && (
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] rounded-full font-medium">
                                {selectedRep}
                            </span>
                        )}
                        {selectedStage !== "All Stages" && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] rounded-full font-medium">
                                {selectedStage}
                            </span>
                        )}
                    </div>
                )}
            </div>

           
            {loading ? (
                <Spinner />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {leads.length > 0
                        ? leads.map((lead) => <LeadCard key={lead._id} lead={lead} />)
                        : <EmptyState filtered={hasFilters} />
                    }
                </div>
            )}
        </div>
    );
};

export default Page;
