"use client"

import React, { useEffect, useState, useCallback } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import axios from "axios";


const formatCurrency = (value) => {
    if (!value && value !== 0) return "₹ 0";
    return `₹ ${Number(value).toLocaleString("en-IN")}`;
};

const daysSince = (dateStr) => {
    if (!dateStr) return "0d";
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    return `${diff}d`;
};


const toDisplayString = (val, fallback = "Not specified") => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === "string") return val.trim() || fallback;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (Array.isArray(val)) return val.map((v) => toDisplayString(v)).join(", ") || fallback;
    if (typeof val === "object") {
        if (val.amount !== undefined) return formatCurrency(val.amount);
        if (val.name !== undefined)   return String(val.name);
        if (val.value !== undefined)  return String(val.value);
        if (val.label !== undefined)  return String(val.label);
        if (val.text !== undefined)   return String(val.text);
        try {
            return JSON.stringify(val);
        } catch {
            return fallback;
        }
    }
    return fallback;
};


const toBantConfirmed = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === "boolean") return val;
    if (typeof val === "object" && val !== null) {
        if (typeof val.confirmed === "boolean") return val.confirmed;
        if (typeof val.status === "boolean")    return val.status;
      
        return Object.keys(val).length > 0;
    }
    return Boolean(val);
};



const BRANCH_COLORS = {
    Bangalore: "bg-blue-100 text-blue-700",
    Mumbai:    "bg-amber-100 text-amber-700",
    Mysore:    "bg-emerald-100 text-emerald-700",
};

const STAGE_COLORS = {
    "Lead Capture": "bg-blue-100 text-blue-700",
    Capture:        "bg-blue-100 text-blue-700",
    Reachable:      "bg-indigo-100 text-indigo-700",
    Qualified:      "bg-yellow-100 text-yellow-700",
    Proposal:       "bg-purple-100 text-purple-700",
    Closed:         "bg-emerald-100 text-emerald-700",
};

const PRIORITY_COLORS = {
    Hot:  "bg-red-100 text-red-700",
    Warm: "bg-yellow-100 text-yellow-700",
    Cool: "bg-emerald-100 text-emerald-700",
};

const getBantColor = (score) => {
    if (score === 4) return "bg-emerald-100 text-emerald-700";
    if (score >= 2)  return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
};



const EmptyState = ({ icon = "📭", title = "No data found", subtitle = "" }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <span className="text-4xl mb-3">{icon}</span>
        <p className="text-gray-700 font-semibold text-sm">{title}</p>
        {subtitle && <p className="text-gray-400 text-xs mt-1 max-w-xs leading-relaxed">{subtitle}</p>}
    </div>
);



const Spinner = ({ label = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-blue-600 text-sm">{label}</p>
    </div>
);



const Badge = ({ label, colorClass = "bg-gray-100 text-gray-700" }) => (
    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${colorClass}`}>
        {toDisplayString(label, "N/A")}
    </span>
);


const ProfileTab = ({ lead }) => {
    if (!lead) return <EmptyState icon="👤" title="No profile data available" />;

    const stageTimestamps = Array.isArray(lead.stageHistory) && lead.stageHistory.length > 0
        ? lead.stageHistory
        : null;

    const fields = [
        { label: "Phone",    value: lead.phone },
        { label: "Email",    value: lead.email },
        { label: "Business", value: lead.businessName },
        { label: "Industry", value: lead.industry || lead.businessName?.split(" ")[1] },
        { label: "Location", value: lead.location || lead.branch },
        { label: "Source",   value: lead.source?.trim().split(" ")[0] },
        { label: "Rep",      value: lead.createdBy?.name },
        { label: "Branch",   value: lead.branch },
    ];

    return (
        <div className="px-6 py-4 text-sm space-y-6">
            <div>
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Contact Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {fields.map(({ label, value }) => (
                        <div key={label}>
                            <div className="text-gray-400 text-[10px] font-medium">{label}</div>
                            <div className="text-gray-900 text-xs mt-0.5 break-words">
                                {toDisplayString(value)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-100" />

            <div>
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Stage Timestamps
                </h3>
                {stageTimestamps ? (
                    <div className="space-y-2">
                        {stageTimestamps.map((entry, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                            >
                                <span className="text-gray-700 text-xs font-medium">
                                    {toDisplayString(entry.from)} → {toDisplayString(entry.to)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-900 text-xs font-semibold">
                                        {toDisplayString(entry.duration, "—")}
                                    </span>
                                    <span className="text-emerald-500 text-sm">✓</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon="🕐"
                        title="No stage history recorded"
                        subtitle="Stage transitions will appear here as the lead progresses."
                    />
                )}
            </div>
        </div>
    );
};



const BantTab = ({ lead }) => {
    const bant = lead?.bant;

    if (!bant) {
        return (
            <EmptyState
                icon="📊"
                title="No BANT data available"
                subtitle="BANT details will appear once the lead is qualified."
            />
        );
    }

    
    const score = typeof bant.score === "number"
        ? bant.score
        : typeof bant === "object" && typeof bant.score === "number"
            ? bant.score
            : 0;

    const scoreLabel =
        score === 4 ? "HOT Lead – Prioritise" :
        score >= 2  ? "WARM Lead – Follow up"  :
                      "COOL Lead – Nurture";

   
    const cards = [
        {
            key: "B", full: "Budget",
            gradient: "from-indigo-50 to-indigo-100",
            rawValue:   bant.budget,
            rawConfirm: bant.budgetConfirmed,
        },
        {
            key: "A", full: "Authority",
            gradient: "from-yellow-50 to-yellow-100",
            rawValue:   bant.authority,
            rawConfirm: bant.authorityConfirmed,
        },
        {
            key: "N", full: "Need",
            gradient: "from-emerald-50 to-emerald-100",
            rawValue:   bant.need,
            rawConfirm: bant.needConfirmed,
        },
        {
            key: "T", full: "Timeline",
            gradient: "from-red-50 to-red-100",
            rawValue:   bant.timeline,
            rawConfirm: bant.timelineConfirmed,
        },
    ];

    return (
        <div className="space-y-5 p-6 text-xs">
          
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col gap-1">
                <p className="font-bold text-gray-900">BANT Score: {score}/4</p>
                <p className="text-gray-600">{scoreLabel}</p>
            </div>

           
            <div className="grid grid-cols-2 gap-4">
                {cards.map(({ key, full, gradient, rawValue, rawConfirm }) => {
                    
                    const displayValue = toDisplayString(rawValue);
                    const isConfirmed = rawConfirm !== undefined
                        ? toBantConfirmed(rawConfirm)
                        : toBantConfirmed(rawValue);

                    return (
                        <div
                            key={key}
                            className={`bg-gradient-to-br ${gradient} rounded-xl p-4 shadow hover:shadow-md transition`}
                        >
                            <h2 className="text-gray-500 font-semibold uppercase tracking-wide mb-1 text-[10px]">
                                {key} – {full}
                            </h2>
                            <p className="text-gray-900 font-bold text-xs leading-snug">{displayValue}</p>
                            <p className={`font-medium mt-1 text-[10px] ${isConfirmed ? "text-emerald-600" : "text-gray-400"}`}>
                                {isConfirmed ? "✔ Confirmed" : "✗ Unconfirmed"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};



const FollowUpTab = ({ lead }) => {
    const cadence = lead?.followUpCadence;
    if (!Array.isArray(cadence) || cadence.length === 0) {
        return (
            <EmptyState
                icon="📅"
                title="No follow-up cadence set"
                subtitle="Follow-up steps will appear here once scheduled."
            />
        );
    }

    return (
        <div className="p-6 space-y-4 text-xs">
            <h3 className="font-bold text-gray-900">Follow-Up Cadence</h3>
            <div className="space-y-3">
                {cadence.map((step, i) => (
                    <div
                        key={i}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50 rounded-xl p-3 shadow-sm hover:shadow-md transition gap-2"
                    >
                        <span className="font-semibold text-gray-700 w-16">Day {toDisplayString(step.day)}</span>
                        <span className="text-gray-900 font-medium flex-1">{toDisplayString(step.action, "—")}</span>
                        <span className="text-gray-400 w-36">{toDisplayString(step.channel, "—")}</span>
                        <span className={`font-semibold ${step.done ? "text-emerald-500" : "text-amber-500"}`}>
                            {step.done ? "Done ✔" : "Pending"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};



const CallsTab = ({ lead }) => {
    const logs = lead?.communicationLog;
    if (!Array.isArray(logs) || logs.length === 0) {
        return (
            <EmptyState
                icon="📞"
                title="No communication logs yet"
                subtitle="Calls, WhatsApp messages, and emails will appear here."
            />
        );
    }

    return (
        <div className="p-4 space-y-4 text-xs">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Communication Log</h3>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-[11px]">
                    + Log
                </button>
            </div>
            <div className="space-y-3">
                {logs.map((log, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-xl shadow hover:shadow-md transition">
                        <p className="font-semibold text-gray-700">
                            {toDisplayString(log.type, "Activity")} – {toDisplayString(log.agent, "Unknown")}
                        </p>
                        <p className="text-gray-900 mt-1">{toDisplayString(log.note, "No details recorded.")}</p>
                        <p className="text-gray-400 mt-1">{toDisplayString(log.timestamp, "—")}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};



const HistoryTab = ({ lead }) => {
    const history = lead?.activityTimeline;
    if (!Array.isArray(history) || history.length === 0) {
        return (
            <EmptyState
                icon="📜"
                title="No activity history"
                subtitle="Lead activity events will be recorded here."
            />
        );
    }

    return (
        <div className="p-4 text-xs">
            <h3 className="font-semibold text-gray-900 mb-6">Activity Timeline</h3>
            <div className="relative pl-10 space-y-6">
                {history.map((item, i) => (
                    <div key={i} className="relative flex">
                        <div className="absolute -left-1 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-[11px]">
                            {toDisplayString(item.icon, "•")}
                        </div>
                        <div className="ml-8">
                            <p className="font-semibold text-gray-700">{toDisplayString(item.title, "Event")}</p>
                            <p className="text-gray-900 mt-0.5">{toDisplayString(item.detail, "")}</p>
                            <p className="text-gray-400 mt-0.5">
                                {toDisplayString(item.timestamp, "")}
                                {item.agent ? ` · ${toDisplayString(item.agent)}` : ""}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



const DocsTab = ({ lead }) => {
    const docs = lead?.documents;
    if (!Array.isArray(docs) || docs.length === 0) {
        return (
            <EmptyState
                icon="📁"
                title="No documents uploaded"
                subtitle="Proposals, contracts, and files will appear here."
            />
        );
    }

    return (
        <div className="p-6 space-y-3 text-xs">
            <h3 className="font-semibold text-gray-900 mb-4">Documents ({docs.length})</h3>
            {docs.map((doc, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-lg">📄</span>
                        <div>
                            <p className="font-medium text-gray-800">
                                {toDisplayString(doc.name, `Document ${i + 1}`)}
                            </p>
                            <p className="text-gray-400 text-[10px]">
                                {toDisplayString(doc.type, "File")}
                                {doc.size ? ` · ${toDisplayString(doc.size)}` : ""}
                            </p>
                        </div>
                    </div>
                    {doc.url && (
                        <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            View
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
};



const NotesTab = ({ leadId, existingNotes = [] }) => {
    const [note, setNote]           = useState("");
    const [savedNotes, setSavedNotes] = useState([]);

    useEffect(() => {
        setSavedNotes([]);
        setNote("");
    }, [leadId]);

    const handleSave = () => {
        const trimmed = note.trim();
        if (!trimmed) return;
        setSavedNotes(prev => [{
            text:   trimmed,
            author: "Current User",
            time:   new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        }, ...prev]);
        setNote("");
    };

    const normalisedExisting = existingNotes.map((n) => ({
        text:   typeof n === "string" ? n : toDisplayString(n.text ?? n.note ?? n.content ?? n),
        author: toDisplayString(n.author ?? n.createdBy?.name, "Team"),
        time:   toDisplayString(n.time ?? n.createdAt ?? n.timestamp, ""),
    }));

    const allNotes = [...savedNotes, ...normalisedExisting];

    return (
        <div className="px-6 py-4 w-full">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Add Note</h2>
            <textarea
                rows={3}
                className="w-full rounded-lg bg-white px-3 py-2 text-sm text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a note about this lead..."
            />
            <button
                onClick={handleSave}
                disabled={!note.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
                Save Note
            </button>

            <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Notes ({allNotes.length})
                </h3>
                {allNotes.length === 0 ? (
                    <EmptyState icon="📝" title="No notes yet" subtitle="Add the first note for this lead above." />
                ) : (
                    <div className="space-y-3">
                        {allNotes.map((n, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-100 transition"
                            >
                                <p className="text-gray-900 text-xs leading-relaxed">{n.text}</p>
                                <p className="text-gray-400 text-[10px] mt-2">
                                    {n.author}{n.time ? ` · ${n.time}` : ""}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



const TABS = ["Profile", "BANT", "Follow-Up", "Calls/WA", "History", "Docs", "Notes"];

const LeadPanel = ({ isOpen, onClose, lead, details, loading }) => {
    const [activeTab, setActiveTab] = useState("Profile");

    useEffect(() => {
        if (isOpen) setActiveTab("Profile");
    }, [lead?._id, isOpen]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[560px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition z-10"
                    aria-label="Close panel"
                >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>

                {loading ? (
                    <Spinner label="Loading lead details..." />
                ) : !details ? (
                    <EmptyState
                        icon="🔍"
                        title="No details found"
                        subtitle="This lead may have been removed or there was a network error."
                    />
                ) : (
                    <div className="flex flex-col h-full overflow-hidden">
                      
                        <div className="px-6 pt-6 pb-3 flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-900 pr-8">
                                {toDisplayString(details.name, "Unknown Lead")}
                            </h1>
                            <p className="text-gray-500 text-xs mt-1">
                                {[details.industry, details.branch, details.createdBy?.name]
                                    .filter(Boolean)
                                    .map((v) => toDisplayString(v))
                                    .join(" · ") || "No additional info"}
                            </p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <Badge
                                    label={details.stage}
                                    colorClass={STAGE_COLORS[details.stage] || "bg-gray-100 text-gray-700"}
                                />
                                <Badge
                                    label={details.priority}
                                    colorClass={PRIORITY_COLORS[details.priority] || "bg-gray-100 text-gray-700"}
                                />
                                <span className="text-xs font-semibold text-blue-600 self-center">
                                    {formatCurrency(details.dealValue)}
                                </span>
                            </div>
                        </div>

                       
                        <div className="flex items-center gap-1 border-b border-gray-200 px-4 pb-2 flex-shrink-0 overflow-x-auto">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap px-3 py-1.5 rounded text-[10px] font-medium transition flex-shrink-0 ${
                                        activeTab === tab
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                       
                        <div className="flex-1 overflow-y-auto">
                            {activeTab === "Profile"   && <ProfileTab  lead={details} />}
                            {activeTab === "BANT"      && <BantTab     lead={details} />}
                            {activeTab === "Follow-Up" && <FollowUpTab lead={details} />}
                            {activeTab === "Calls/WA"  && <CallsTab    lead={details} />}
                            {activeTab === "History"   && <HistoryTab  lead={details} />}
                            {activeTab === "Docs"      && <DocsTab     lead={details} />}
                            {activeTab === "Notes"     && (
                                <NotesTab
                                    leadId={details._id}
                                    existingNotes={Array.isArray(details.notes) ? details.notes : []}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};



const FilterDropdown = ({ value, options, onChange }) => (
    <Menu as="div" className="relative w-full sm:w-36">
        <MenuButton className="w-full flex justify-between items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition">
            <span className="truncate">{value}</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />
        </MenuButton>
        <MenuItems className="absolute left-0 mt-1 w-44 bg-white shadow-xl rounded-lg max-h-56 overflow-auto ring-1 ring-black/5 focus:outline-none z-50">
            {options.map((option) => (
                <MenuItem key={option}>
                    {({ active }) => (
                        <button
                            onClick={() => onChange(option)}
                            className={`block w-full text-left px-4 py-2 text-xs transition ${
                                active ? "bg-gray-50" : ""
                            } ${
                                value === option ? "font-semibold text-blue-600 bg-blue-50" : "text-gray-700"
                            }`}
                        >
                            {option}
                        </button>
                    )}
                </MenuItem>
            ))}
        </MenuItems>
    </Menu>
);



const HEADERS = ["Name / Contact", "Business", "Branch", "Source", "Stage", "BANT", "Priority", "Value", "Days", "Documents", "Rep"];

const DEFAULT_FILTERS = {
    branch:   "All Branch",
    status:   "All Stages",
    priority: "All Priority",
    social:   "All Sources",
    repo:     "All Reps",
};

const FILTER_CONFIG = [
    { key: "branch",   options: ["All Branch",   "Bangalore", "Mumbai", "Mysore"],                                        paramKey: "location" },
    { key: "status",   options: ["All Stages",   "Lead Capture", "Reachable", "Qualified", "Proposal", "Closed"],         paramKey: "stage"    },
    { key: "priority", options: ["All Priority", "Hot", "Warm", "Cool"],                                                   paramKey: "priority" },
    { key: "social",   options: ["All Sources",  "Whatsapp", "Website Form", "Social", "Phone"],                          paramKey: "source"   },
    { key: "repo",     options: ["All Reps",     "Arjun", "Divya", "Kartik"],                                             paramKey: "rep"      },
];

const Page = () => {
    const [leads, setLeads]                           = useState([]);
    const [loading, setLoading]                       = useState(true);
    const [error, setError]                           = useState(null);
    const [selectedLead, setSelectedLead]             = useState(null);
    const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);
    const [loadingDetails, setLoadingDetails]         = useState(false);
    const [isPanelOpen, setIsPanelOpen]               = useState(false);
    const [filters, setFilters]                       = useState(DEFAULT_FILTERS);

    const hasActiveFilters = useCallback(
        () => Object.values(filters).some((v) => !v.startsWith("All")),
        [filters]
    );

    const buildQueryString = useCallback(() => {
        const params = new URLSearchParams();
        FILTER_CONFIG.forEach(({ key, paramKey }) => {
            const val = filters[key];
            if (val && !val.startsWith("All")) params.append(paramKey, val);
        });
        return params.toString();
    }, [filters]);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const qs    = buildQueryString();
            const url   = qs
                ? `http://localhost:8080/leads/search?${qs}`
                : "http://localhost:8080/allleads";

            const response = await axios.get(url, { headers: { "auth-token": token } });
            const data = response.data?.leads ?? response.data?.Allleads ?? response.data;
            setLeads(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching leads:", err);
            setError(err?.response?.data?.message || err.message || "Failed to fetch leads. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [buildQueryString]);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    const fetchLeadDetails = async (leadId) => {
        if (!leadId) return;
        setLoadingDetails(true);
        setSelectedLeadDetails(null);
        try {
            const token    = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/leads/${leadId}`, {
                headers: { "auth-token": token },
            });
            const detail = response.data?.lead ?? response.data?.data ?? response.data;
            setSelectedLeadDetails(detail || null);
        } catch (err) {
            console.error("Error fetching lead details:", err);
            setSelectedLeadDetails(null);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleRowClick = (lead) => {
        setSelectedLead(lead);
        setIsPanelOpen(true);
        fetchLeadDetails(lead._id);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setSelectedLead(null);
        setSelectedLeadDetails(null);
    };

    const setFilter    = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    const activeFilterLabels = FILTER_CONFIG
        .filter(({ key }) => !filters[key].startsWith("All"))
        .map(({ key }) => filters[key]);

    if (error && leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <span className="text-5xl">⚠️</span>
                <p className="text-red-600 font-semibold text-lg">Something went wrong</p>
                <p className="text-gray-500 text-sm max-w-sm text-center">{error}</p>
                <button
                    onClick={fetchLeads}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            <LeadPanel
                isOpen={isPanelOpen}
                onClose={closePanel}
                lead={selectedLead}
                details={selectedLeadDetails}
                loading={loadingDetails}
            />

            <div className="w-full p-4">
              
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                            Filter
                        </span>
                        {FILTER_CONFIG.map(({ key, options }) => (
                            <FilterDropdown
                                key={key}
                                value={filters[key]}
                                options={options}
                                onChange={(val) => setFilter(key, val)}
                            />
                        ))}
                        {hasActiveFilters() && (
                            <button
                                onClick={resetFilters}
                                className="text-[11px] text-red-500 hover:text-red-700 underline whitespace-nowrap transition"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>

               
                <div className="mb-3 flex justify-between items-center flex-wrap gap-2">
                    <p className="text-xs text-gray-500">
                        {loading
                            ? "Fetching leads…"
                            : `${leads.length} lead${leads.length !== 1 ? "s" : ""} found`}
                    </p>
                    {activeFilterLabels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {activeFilterLabels.map((label) => (
                                <span
                                    key={label}
                                    className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full font-medium"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <Spinner label="Loading leads…" />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px] text-left">
                                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                                    <tr>
                                        {HEADERS.map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 font-semibold whitespace-nowrap uppercase text-[9px] tracking-wider"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {leads.length > 0 ? (
                                        leads.map((lead) => (
                                            <tr
                                                key={lead._id}
                                                onClick={() => handleRowClick(lead)}
                                                className="hover:bg-blue-50 transition cursor-pointer"
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <p className="font-semibold text-gray-900">
                                                        {toDisplayString(lead.name, "—")}
                                                    </p>
                                                    <p className="text-gray-400 text-[10px] mt-0.5">
                                                        {toDisplayString(lead.phone, "—")}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                                                    {toDisplayString(lead.businessName?.split(" ").pop(), "N/A")}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        label={lead.branch}
                                                        colorClass={BRANCH_COLORS[lead.branch] || "bg-gray-100 text-gray-700"}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge label={lead.source?.trim().split(" ")[0]} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        label={lead.stage?.trim().split(/\s+/).pop()}
                                                        colorClass={STAGE_COLORS[lead.stage] || "bg-gray-100 text-gray-700"}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        label={lead.bant?.score != null ? `${lead.bant.score}/4` : "0/4"}
                                                        colorClass={getBantColor(lead.bant?.score ?? 0)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        label={lead.priority}
                                                        colorClass={PRIORITY_COLORS[lead.priority] || "bg-gray-100 text-gray-700"}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-blue-600 whitespace-nowrap">
                                                    {formatCurrency(lead.dealValue)}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {daysSince(lead.createdAt)}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {Array.isArray(lead.documents) && lead.documents.length > 0
                                                        ? `${lead.documents.length} doc${lead.documents.length !== 1 ? "s" : ""}`
                                                        : "0 docs"}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                                                    {toDisplayString(lead.createdBy?.name, "N/A")}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={HEADERS.length}>
                                                <EmptyState
                                                    icon="🔍"
                                                    title="No leads match your filters"
                                                    subtitle="Try adjusting or resetting the filters above to see more results."
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Page;