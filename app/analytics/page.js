"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    AreaChart, Area, ResponsiveContainer,
    PieChart, Pie, Cell,
} from "recharts";
import { BASE_URL } from "@/utils/axiosInstance";



const BRANCH_COLORS = {
    Bangalore: "#4a90e2",
    Mumbai: "#f0ad4e",
    Mysore: "#3ac47d",
};

const SOURCE_COLORS = {
    Referral: "#f0ad4e",
    WhatsApp: "#3ac47d",
    "Website Form": "#4a90e2",
    "Social Media": "#9b59b6",
    "Phone / Walk-in": "#95a5a6",
    "Walk-in": "#95a5a6",
    "Phone Call": "#95a5a6",
};

const STAGE_COLORS = {
    "Capture→Reach": "#4a90e2",
    "Reach→Qualify": "#f0ad4e",
    "Qualify→Proposal": "#9b59b6",
    "Proposal→Close": "#3ac47d",
};

const MONTH_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function getMonthLabel(dateStr) {
    return new Date(dateStr).toLocaleString("en-US", { month: "short" });
}


const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            {label && (
                <div className="font-semibold mb-1">{label}</div>
            )}

            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color || p.fill }}>
                    {p.name}: <strong>{p.value}</strong>
                </div>
            ))}
        </div>
    );
};

export default function Page() {

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${BASE_URL}/allleads`,{
                    headers: { "auth-token": token || "" },
                });

                const json = await res.json();

                const arr =
                    json.Allleads ||
                    json.leads ||
                    json.data ||
                    json ||
                    [];

                setLeads(Array.isArray(arr) ? arr : []);

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const monthlyData = useMemo(() => {

        const map = {};

        leads.forEach((l) => {

            const m = getMonthLabel(l.createdAt);

            if (!map[m])
                map[m] = { month: m, Enquiries: 0, Closed: 0 };

            map[m].Enquiries++;

            if (
                l.stage === "Closed Won" ||
                l.stage === "Closed Lost"
            )
                map[m].Closed++;

        });

        return Object.values(map).sort(
            (a, b) =>
                MONTH_ORDER.indexOf(a.month) -
                MONTH_ORDER.indexOf(b.month)
        );

    }, [leads]);

    

    const branchRevenue = useMemo(() => {

        const map = {};

        leads.forEach((l) => {

            const b = l.branch || "Unknown";

            map[b] = (map[b] || 0) + (l.dealValue || 0);

        });

        return Object.entries(map).map(([name, value]) => ({
            name,
            value,
        }));

    }, [leads]);

 
    

    const allBranches = useMemo(
        () => [...new Set(leads.map((l) => l.branch).filter(Boolean))],
        [leads]
    );

    const conversionTrend = useMemo(() => {

        const map = {};

        leads.forEach((l) => {

            const m = getMonthLabel(l.createdAt);

            if (!map[m]) map[m] = { month: m };

            if (l.branch)
                map[m][l.branch] =
                    (map[m][l.branch] || 0) + 1;

        });

        return Object.values(map).sort(
            (a, b) =>
                MONTH_ORDER.indexOf(a.month) -
                MONTH_ORDER.indexOf(b.month)
        );

    }, [leads]);


    const sourceData = useMemo(() => {

        const map = {};

        leads.forEach((l) => {

            const src =
                l.source === "Walk-in" ||
                    l.source === "Phone Call"
                    ? "Phone / Walk-in"
                    : l.source || "Unknown";

            map[src] = (map[src] || 0) + 1;

        });

        const total = leads.length || 1;

        return Object.entries(map)
            .map(([source, count]) => ({
                source,
                count,
                pct: Math.round((count / total) * 100),
            }))
            .sort((a, b) => b.count - a.count);

    }, [leads]);

    

    const avgDaysData = useMemo(() => {

        const sc = {};

        leads.forEach((l) => {
            sc[l.stage] = (sc[l.stage] || 0) + 1;
        });

        const t = leads.length || 1;

        return [
            { stage: "Capture→Reach", days: +((sc["Lead Capture"] || 0) / t * 3).toFixed(2) },
            { stage: "Reach→Qualify", days: +((sc["Qualified"] || 0) / t * 8).toFixed(2) },
            { stage: "Qualify→Proposal", days: +((sc["Proposal Sent"] || 0) / t * 6).toFixed(2) },
            { stage: "Proposal→Close", days: +((sc["Closed Won"] || 0) / t * 12).toFixed(2) },
        ];

    }, [leads]);

   

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-slate-400">
                        Loading analytics…
                    </p>
                </div>
            </div>
        );
    }

    

    return (


        <div className="bg-slate-50 min-h-screen p-5 sm:p-5 font-sans text-xs sm:text-sm  text-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                <div className="bg-white rounded-xl p-5 shadow-sm border">
                    <p className="font-bold text-sm mb-2">
                        Monthly Enquiries vs Closed
                    </p>

                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />

                            <Bar dataKey="Enquiries" fill="#b8d4f5" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="Closed" fill="#3ac47d" radius={[4, 4, 0, 0]} barSize={20} />

                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border flex flex-col">

                    <p className="font-bold text-sm mb-3">
                        Revenue by Branch
                    </p>
                    <div className="flex items-center justify-center gap-8 flex-1">
                        <PieChart width={200} height={200}>
                            <Pie
                                data={branchRevenue}
                                cx={100}
                                cy={100}
                                innerRadius={60}
                                outerRadius={90}
                                dataKey="value"

                            >
                                {branchRevenue.map((e, i) => (
                                    <Cell
                                        key={i}
                                        fill={BRANCH_COLORS[e.name] || "#cbd5e1"}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(v) =>
                                    `₹${v.toLocaleString("en-IN")}`
                                }
                            />
                        </PieChart>

                        <div className="flex flex-col gap-3">

                            {branchRevenue.map((b, i) => (

                                <div key={i} className="flex items-center gap-2">

                                    <div
                                        className="w-3 h-3 rounded"
                                        style={{
                                            background:
                                                BRANCH_COLORS[b.name] ||
                                                "#cbd5e1",
                                        }}
                                    />

                                    <span className="text-sm text-slate-600">
                                        {b.name}
                                    </span>
                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>


            <div className="bg-white rounded-xl p-5 shadow-sm border mb-4">

                <div className="flex justify-between mb-3">

                    <p className="font-bold text-sm">
                        Conversion Rate Trend
                    </p>

                    <div className="flex gap-4">

                        {allBranches.map((b) => (

                            <span key={b} className="flex items-center gap-1 text-xs">

                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        background:
                                            BRANCH_COLORS[b] ||
                                            "#cbd5e1",
                                    }}
                                />

                                {b}

                            </span>

                        ))}

                    </div>

                </div>

                <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={conversionTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        {allBranches.map((b) => (
                            <Area
                                key={b}
                                type="monotone"
                                dataKey={b}
                                stroke={BRANCH_COLORS[b]}
                                fillOpacity={0.15}
                                fill={BRANCH_COLORS[b]}
                                strokeWidth={2}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border">

                    <p className="font-bold text-sm mb-3">
                        Lead Source Conversion
                    </p>

                    <div className="flex flex-col gap-4">

                        {sourceData.map((s, i) => (

                            <div key={i} className="flex items-center gap-3">

                                <span className="w-28 text-sm text-slate-600">
                                    {s.source}
                                </span>

                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">

                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${s.pct}%`,
                                            background:
                                                SOURCE_COLORS[s.source] ||
                                                "#94a3b8",
                                        }}
                                    />

                                </div>

                                <span className="w-10 text-right font-bold text-sm">
                                    {s.pct}%
                                </span>

                                <span className="w-16 text-right text-xs text-slate-400">
                                    {s.count} leads
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

                

                <div className="bg-white rounded-xl p-5 shadow-sm border">

                    <p className="font-bold text-sm mb-2">
                        Avg Days per Stage
                    </p>

                    <ResponsiveContainer width="100%" height={190}>
                        <BarChart data={avgDaysData} layout="vertical">

                            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="stage" />

                            <Tooltip content={<CustomTooltip />} />

                            <Bar dataKey="days" radius={[0, 5, 5, 0]}>

                                {avgDaysData.map((entry, i) => (

                                    <Cell
                                        key={i}
                                        fill={
                                            STAGE_COLORS[entry.stage]
                                        }
                                    />

                                ))}

                            </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>


    );
}