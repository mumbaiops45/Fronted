"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const AVATAR_COLORS = ["#f0ad4e", "#4a90e2", "#3ac47d", "#ee813d", "#9b59b6", "#1abc9c"];
const RANK_COLORS = { 1: "#f0ad4e", 2: "#94a3b8", 3: "#cd7f32" };
function parseRevenue(str = "") {
  if (!str) return 0;
  const match = str.match(/[\d.]+/);
  if (!match) return 0;
  let num = parseFloat(match[0]);
  if (str.includes("L")) num *= 100000;
  if (str.includes("K")) num *= 1000;
  return isNaN(num) ? 0 : num;
}

function getInitials(name = "") {
  if (!name || name === "unknown") return "NA";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatRevenue(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
}

function formatINR(val) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(val);
}

function getTimeAgo(dateStr) {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function avatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function buildBranchLabel(branches) {
  const arr = [...branches];
  const hasBlr = arr.includes("Bangalore");
  const hasMys = arr.includes("Mysore");
  const hasMum = arr.includes("Mumbai");
  if (hasBlr && hasMys) return "BLR + MYS";
  if (hasBlr) return "Bangalore";
  if (hasMum) return "Mumbai";
  if (hasMys) return "Mysore";
  return arr.join(", ");
}

function generateActivityLog(leads) {
  const activities = [];
  const sorted = [...leads].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  sorted.slice(0, 12).forEach((l) => {
    const rep = l.assignedTo || l.name || "Rep";
    const biz = l.businessName || "Unknown";
    const stage = l.stage || "";
    const date = l.updatedAt || l.createdAt;

    if (stage === "Closed Won") {
      activities.push({ rep, text: `closed ${biz}`, amount: l.dealValue, dot: "#3ac47d", date });
    } else if (stage === "Proposal Sent") {
      activities.push({ rep, text: `sent proposal — ${biz}`, dot: "#4a90e2", date });
    } else if (stage === "Qualified") {
      const score = l.bant?.score || 0;
      activities.push({ rep, text: `qualified ${biz} (BANT ${score}/4)`, dot: "#f0ad4e", date });
    } else if (stage === "Lead Capture") {
      activities.push({ rep, text: `captured lead — ${biz}`, dot: "#94a3b8", date });
    } else {
      activities.push({ rep, text: `moved ${biz} → ${stage}`, dot: "#94a3b8", date });
    }
  });

  return activities.slice(0, 6);
}

export default function Page() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [top3, setTop3] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("https://backendcrm-vm8o.onrender.com/leaderboard");
        console.log("Leaderboard response:", response.data);
        let leaderboardData = [];
        if (response.data.success && response.data.data) {
          leaderboardData = response.data.data;
        } else if (Array.isArray(response.data)) {
          leaderboardData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          leaderboardData = response.data.data;
        }
        
        setTop3(leaderboardData);
      } catch (err) {
        console.error("Leaderboard error:", err);
        setError(`Failed to load leaderboard: ${err.message}`);
      }
    };
    
    fetchLeaderboard();
  }, []);
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://backendcrm-vm8o.onrender.com/allleads", {
          headers: { 
            "auth-token": token || "",
            "Content-Type": "application/json"
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        console.log("Leads response:", json);
        let leadsData = [];
        if (json.Allleads) {
          leadsData = json.Allleads;
        } else if (json.leads) {
          leadsData = json.leads;
        } else if (json.data) {
          leadsData = json.data;
        } else if (Array.isArray(json)) {
          leadsData = json;
        }
        
        setLeads(Array.isArray(leadsData) ? leadsData : []);
      } catch (e) {
        console.error("Error fetching leads:", e);
        setError(`Failed to load leads: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, []);

  const repStats = useMemo(() => {
    const map = {};
    leads.forEach((l) => {
      const repName = l.assignedTo || l.createdBy?.name || l.name || "Unknown";
      const key = repName;

      if (!map[key]) {
        map[key] = {
          id: key,
          name: repName,
          branches: new Set(),
          leads: 0,
          contacted: 0,
          qualified: 0,
          proposals: 0,
          closed: 0,
          revenue: 0,
          docs: 0,
        };
      }
      const r = map[key];
      r.leads++;
      if (l.branch) r.branches.add(l.branch);
      if (["Qualified", "Proposal Sent", "Closed Won", "Closed Lost"].includes(l.stage)) r.contacted++;
      if (["Qualified", "Proposal Sent", "Closed Won"].includes(l.stage)) r.qualified++;
      if (["Proposal Sent", "Closed Won"].includes(l.stage)) r.proposals++;
      if (l.stage === "Closed Won") {
        r.closed++;
        r.revenue += l.dealValue || 0;
      }
      if (Array.isArray(l.documents)) r.docs += l.documents.length;
    });

    return Object.values(map)
      .map((r) => ({
        ...r,
        branchLabel: buildBranchLabel(r.branches),
        closeRate: r.proposals > 0 ? Math.round((r.closed / r.proposals) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [leads]);

  const activityLog = useMemo(() => generateActivityLog(leads), [leads]);
  const maxTop3Revenue = top3.length > 0 ? Math.max(...top3.map(t => parseRevenue(t.revenue))) : 1;

  function rateColor(rate) {
    if (rate >= 30) return "#3ac47d";
    if (rate >= 20) return "#4a90e2";
    return "#f0ad4e";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-9 h-9 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-5 text-slate-800 text-[13px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-5 p-4 bg-white rounded-2xl shadow-md">
          <h2 className="font-bold text-base text-slate-800 mb-1">🏆 Top Performers</h2>

          {top3.length > 0 ? (
            top3.map((rep) => {
              const rank = rep.rank;
              const revenueValue = parseRevenue(rep.revenue);
              const pct = maxTop3Revenue > 0 ? Math.round((revenueValue / maxTop3Revenue) * 100) : 0;

              return (
                <div key={rep.rank} className="flex items-start gap-3">
                  <span
                    className="w-6 text-[13px] font-bold shrink-0 pt-3"
                    style={{ color: RANK_COLORS[rank] || "#94a3b8" }}
                  >
                    {rank}
                  </span>

                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: avatarColor(rep.name) }}
                  >
                    {rep.initials || getInitials(rep.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-[13px] text-slate-800">{rep.name}</span>
                      <div className="flex gap-4 shrink-0">
                        <div className="text-center">
                          <div className="font-extrabold text-[15px] text-slate-800">{rep.closed}</div>
                          <div className="text-[10px] text-slate-400">Closed</div>
                        </div>
                        <div className="text-center">
                          <div className="font-extrabold text-[15px] text-green-500">{rep.revenue}</div>
                          <div className="text-[10px] text-slate-400">Revenue</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 mb-1.5">{rep.branch}</div>

                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: avatarColor(rep.name) }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-slate-400 py-8">
              {loading ? "Loading..." : "No leaderboard data available"}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="font-bold text-sm mb-4">Activity Log — Today</p>
          <div className="flex flex-col gap-3.5">
            {activityLog.length > 0 ? (
              activityLog.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div
                    className="w-2 h-2 rounded-full mt-1 shrink-0"
                    style={{ background: a.dot }}
                  />
                  <div>
                    <div className="text-[13px] text-slate-900 leading-tight">
                      <strong className="text-[12px]">{a.rep}</strong>{" "}
                      <span className="text-slate-500 text-[12px]">{a.text}</span>
                      {a.amount && (
                        <span className="text-slate-500"> · {formatINR(a.amount)}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{getTimeAgo(a.date)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">No recent activity</div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <p className="font-bold text-sm mb-4">Performance Breakdown</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                {["REP", "BRANCH", "LEADS", "CONTACTED", "QUALIFIED", "PROPOSALS", "CLOSED", "CLOSE RATE", "REVENUE", "DOCS UPLOADED"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-[11px] font-bold text-slate-400 border-b border-slate-100 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {repStats.length > 0 ? (
                repStats.map((rep) => (
                  <tr key={rep.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] shrink-0"
                          style={{ background: avatarColor(rep.name) }}
                        >
                          {getInitials(rep.name)}
                        </div>
                        <span className="font-semibold">{rep.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{rep.branchLabel}</td>
                    <td className="px-3 py-3 text-slate-600">{rep.leads}</td>
                    <td className="px-3 py-3 text-slate-600">{rep.contacted}</td>
                    <td className="px-3 py-3 text-slate-600">{rep.qualified}</td>
                    <td className="px-3 py-3 text-slate-600">{rep.proposals}</td>
                    <td className="px-3 py-3 text-slate-600">{rep.closed}</td>
                    <td className="px-3 py-3">
                      <span
                        className="px-3 py-[3px] rounded-md font-bold text-xs"
                        style={{
                          background: `${rateColor(rep.closeRate)}18`,
                          color: rateColor(rep.closeRate),
                        }}
                      >
                        {rep.closeRate}%
                      </span>
                    </td>
                    <td className="px-3 py-3 font-bold text-blue-500 whitespace-nowrap">
                      {formatINR(rep.revenue)}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{rep.docs}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-slate-400">
                    No performance data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}