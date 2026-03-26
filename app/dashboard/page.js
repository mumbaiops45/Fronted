
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/utils/axiosInstance";



function getToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    ""
  );
}

function authHeaders() {
  const t = getToken();
  return {
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  };
}

function fmtRev(n) {
  if (!n) return "₹0";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

const BRANCH_COLORS = {
  Bangalore: { dot: "bg-blue-500" },
  Mumbai: { dot: "bg-yellow-400" },
  Mysore: { dot: "bg-green-500" },
};
const DEFAULT_COLOR = { dot: "bg-purple-500" };

function KPICard({ icon, label, value, sub, subColor = "text-green-500", accent }) {
  const am = { blue: "bg-blue-500", green: "bg-green-500", yellow: "bg-yellow-400", purple: "bg-purple-500" };
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${am[accent] || "bg-blue-500"}`} />
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs font-semibold text-gray-400 uppercase">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className={`text-xs font-medium mt-0.5 ${subColor}`}>{sub}</p>
    </div>
  );
}

function FunnelBar({ label, value, max, color }) {
  const cm = { blue: "bg-blue-500", indigo: "bg-indigo-400", yellow: "bg-yellow-400", purple: "bg-purple-500", green: "bg-green-500" };
  const pct = max > 0 ? Math.max(value > 0 ? 3 : 0, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded h-6 overflow-hidden">
        <div className={`h-full rounded ${cm[color]} flex items-center px-2 transition-all duration-700`} style={{ width: `${pct}%` }}>
          {value > 0 && <span className="text-xs font-bold text-white">{value}</span>}
        </div>
      </div>
      <span className="text-sm text-gray-500 w-12 text-right">{value}</span>
    </div>
  );
}

function DebugPanel({ results }) {
  const [open, setOpen] = useState(false);
  const storedToken = typeof window !== "undefined"
    ? (localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("authToken") || null)
    : null;
  return (
    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-amber-800">⚠️ No data loaded</p>
          <p className="text-xs text-amber-600 mt-0.5">API may need auth token or CORS fix. Click details to diagnose.</p>
        </div>
        <button onClick={() => setOpen(!open)} className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-800 font-semibold px-3 py-1.5 rounded transition-colors">
          {open ? "Hide" : "Show details"}
        </button>
      </div>
      {open && (
        <div className="mt-4 space-y-3">
          <div className="bg-white rounded-lg p-3 border border-amber-100">
            <p className="text-xs font-bold text-gray-700 mb-1">🔑 Auth Token</p>
            {storedToken
              ? <p className="text-xs font-mono text-green-600 break-all">✅ Found: {storedToken.substring(0, 40)}…</p>
              : <p className="text-xs text-red-500">❌ No token found</p>
            }
          </div>
          {results.map((r) => (
            <div key={r.url} className="bg-white rounded-lg p-3 border border-amber-100">
              <p className="text-xs font-mono font-bold text-gray-700">{r.url}</p>
              <p className={`text-xs mt-1 ${r.ok ? "text-green-600" : "text-red-500"}`}>
                {r.ok ? `✅ ${r.status} OK` : `❌ Status ${r.status} — ${r.error}`}
              </p>
              {r.body && <pre className="text-xs text-gray-400 mt-1 overflow-auto max-h-20 bg-gray-50 p-2 rounded">{JSON.stringify(r.body, null, 2)}</pre>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [branch, setBranch] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debugRes, setDebugRes] = useState([]);
  const [showactivity, setshowactivity] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [documentData, setDocumentData] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);

  useEffect(() => {
    const Activity = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/getrecent`);
        setshowactivity(res.data.activities);
      } catch (error) { console.log(error.message); }
    }
    Activity();
  }, []);

  const handleViewAll = async () => {
    try {
      if (!showAll) {
        const res = await axios.get(`${BASE_URL}/last20day`);
        setshowactivity(res.data.activities);
        setShowAll(true);
      } else {
        const res = await axios.get(`${BASE_URL}/getrecent`);
        setshowactivity(res.data.activities);
        setShowAll(false);
      }
    } catch (error) { console.log(error.message); }
  }




  const fetchDocumentCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;


      const response = await axios.get(`${BASE_URL}/countdocument`, {
        headers: {
          "auth-token": token
        }
      });

      if (response.data.success) {
        const { byType, total } = response.data.data;

        console.log("Document counts by type:", byType);
        console.log("Total documents:", total);
        setDocumentData(byType);
        setTotalDocuments(total);
      }
    } catch (err) {
      console.error("Error fetching document count:", err);
    }
  };

  useEffect(() => {
    fetchDocumentCount();
  }, []);

  useEffect(() => {
    const endpoints = [
      { key: "branch", url: `${BASE_URL}/branch123` },
      { key: "monthly", url: `${BASE_URL}/monthly` },
      { key: "source", url: `${BASE_URL}/source` },
    ];
    const results = [];
    Promise.all(
      endpoints.map(({ key, url }) =>
        fetch(url, { headers: authHeaders() })
          .then(async (r) => {
            let body = null;
            try { body = await r.json(); } catch (_) { }
            results.push({ url, ok: r.ok, status: r.status, body, error: r.ok ? null : (body?.message || r.statusText) });
            return { key, ok: r.ok, body };
          })
          .catch((e) => {
            results.push({ url, ok: false, status: 0, error: e.message, body: null });
            return { key, ok: false, body: null };
          })
      )
    ).then((all) => {
      all.forEach(({ key, ok, body }) => {
        if (!ok || !body?.success) return;
        if (key === "branch") setBranch(body.data);
        if (key === "monthly") setMonthly(body.data);
        if (key === "source") setSource(body.data);
      });
      setDebugRes(results);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading analytics…</p>
        </div>
      </div>
    );
  }

  const hasData = branch || monthly || source;
  const branches = branch ? Object.entries(branch) : [];
  const totalLeads = branches.reduce((a, [, d]) => a + (d.total || 0), 0);
  const totalClosed = branches.reduce((a, [, d]) => a + (d.closed || 0), 0);
  const totalRevenue = branches.reduce((a, [, d]) => a + (d.revenue || 0), 0);
  const overallConv = totalLeads ? ((totalClosed / totalLeads) * 100).toFixed(1) : "0.0";
  const activeMonth = monthly ? [...monthly].reverse().find((m) => m.enquiries > 0) : null;
  const funnelMap = {};
  branches.forEach(([, d]) => (d.stages || []).forEach((s) => { funnelMap[s.stage] = (funnelMap[s.stage] || 0) + s.count; }));
  const funnelMax = funnelMap["Lead Capture"] || totalLeads || 1;
  const sortedBranches = [...branches].sort((a, b) => b[1].convRate - a[1].convRate);
  const bestBranch = sortedBranches[0];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {!hasData && <DebugPanel results={debugRes} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            icon="📋"
            label="Total Enquiries"
            value={totalLeads.toLocaleString("en-IN")}
            sub={activeMonth ? `↑ ${activeMonth.enquiries} this month` : "No enquiries yet"}
            accent="blue"
          />
          <KPICard
            icon="✅"
            label="Deals Closed"
            value={totalClosed}
            sub={activeMonth ? `↑ ${activeMonth.closed} this month` : "—"}
            accent="green"
          />
          <KPICard
            icon="💰"
            label="Total Revenue"
            value={fmtRev(totalRevenue)}
            sub={activeMonth ? `↑ ${fmtRev(activeMonth.revenue)} this month` : "—"}
            accent="yellow"
          />
          <KPICard
            icon="🎯"
            label="Conversion Rate"
            value={`${overallConv}%`}
            sub="Target: 10%"
            subColor="text-gray-400"
            accent="purple"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <header className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-bold text-gray-900">Sales Funnel — All Branches</h2>
                <span className="text-[12px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {totalLeads} leads
                </span>
              </header>

              {branches.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">No branch data loaded</p>
              ) : (
                <div className="space-y-3 ">
                  <FunnelBar label="Lead Capture" value={funnelMap["Lead Capture"] || 0} max={funnelMax} color="blue" />
                  <FunnelBar label="Reachable" value={funnelMap["Reachable"] || 0} max={funnelMax} color="indigo" />
                  <FunnelBar label="Qualified" value={funnelMap["Qualified"] || 0} max={funnelMax} color="yellow" />
                  <FunnelBar label="Proposal Sent" value={funnelMap["Proposal Sent"] || 0} max={funnelMax} color="purple" />
                  <FunnelBar label="Closed Won" value={funnelMap["Closed Won"] || 0} max={funnelMax} color="green" />
                </div>
              )}
            </section>
            <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900 text-base">Recent Activity</h3>
                <button
                  onClick={handleViewAll}
                  className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                  aria-label="Toggle view all recent activity"
                >
                  {showAll ? "Hide" : "View all →"}
                </button>
              </div>

              <ul
                className={`space-y-3 max-h-96 ${showactivity?.length > 5
                    ? "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    : "overflow-y-hidden"
                  }`}
              >
                {showactivity
                  ?.sort((a, b) => new Date(b.activityTime || 0) - new Date(a.activityTime || 0))
                  .map((activity, index) => {
                    const diffMs = new Date() - new Date(activity.activityTime || 0);
                    const diffMins = Math.floor(diffMs / (1000 * 60));
                    const diffHrs = Math.floor(diffMins / 60);
                    const diffDays = Math.floor(diffHrs / 24);
                    const timeDisplay =
                      diffMins < 60
                        ? `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
                        : diffHrs < 24
                          ? `${diffHrs} hr${diffHrs !== 1 ? "s" : ""} ago`
                          : `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

                    return (
                      <li
                        key={index}
                        className="flex flex-col rounded-md p-3 hover:bg-gray-50 transition cursor-default"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-gray-700 text-xs font-medium mb-1">
                          <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
                          {activity.type && <span>{activity.type} —</span>}
                          {activity.leadName && <span className="font-semibold">{activity.leadName}</span>}
                          {activity.amount !== undefined && (
                            <span>
                              · ₹{new Intl.NumberFormat("en-IN").format(activity.amount)}
                            </span>
                          )}
                          {activity.user && (
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-[10px] font-semibold select-text">
                              {activity.user}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 ml-4 text-xs select-none">
                          {timeDisplay}
                          {activity.branch ? ` · ${activity.branch}` : ""}
                        </div>
                        <hr className="mt-2 border-gray-200" />
                      </li>
                    );
                  })}
              </ul>
            </section>

          </div>


          <div className="space-y-8">
            <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-[14px] font-bold text-gray-900 mb-4">Branch Performance</h3>
              {sortedBranches.length === 0 ? (
                <p className="text-center text-gray-400 py-6 text-sm">No data</p>
              ) : (
                sortedBranches.map(([name, d]) => {
                  const c = BRANCH_COLORS[name] || DEFAULT_COLOR;
                  return (
                    <div key={name}
                    className="py-3 px-4 mb-2 border border-gray-200 rounded-lg ">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center  gap-2 text-[12px] font-bold text-gray-700">
                          <span>🏢</span>
                          <span>{name}</span>
                        </div>
                        <span className="text-[12px] font-bold text-blue-600">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(d.revenue)}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-2 text-[12px] text-gray-500">
                        <span>
                          Leads <b className="text-gray-700">{d.total}</b>
                        </span>
                        <span>
                          Closed <b className="text-gray-700">{d.closed}</b>
                        </span>
                        <span>
                          Rate <b className="text-gray-700">{d.convRate}%</b>
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${c.dot}`}
                          style={{ width: `${Math.min(d.convRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}

              {bestBranch && (
                <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-100 text-[11px] text-blue-600">
                  💡 {bestBranch[0]}'s {bestBranch[1].convRate}% conv. rate leads. Replicate for +{fmtRev(Math.round(bestBranch[1].revenue * 0.4))}.
                </div>
              )}
            </section>
            <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100 space-y-2">
              <div className="flex justify-between items-center text-[14px] font-bold">
                <h3>Today's Follow-ups</h3>
                <p className="text-[12px] text-red-600">3 overdue</p>
              </div>
              {[
                { name: "Nisha Jewellers", status: "Urgent", desc: "Day6 - Final follow-up due", color: "red" },
                { name: "Ravi Kumar Foods", status: "Today", desc: "Day2- Check-in call", color: "orange" },
                { name: "TechStart Solutions", status: "Due", desc: "Send proposal today", color: "orange" },
              ].map((f, idx) => (
                <div
                  key={idx}
                  className={`bg-${f.color}-100 rounded-lg p-2 shadow-inner border border-gray-200`}
                >
                  <p className="text-[12px] font-semibold mb-1 text-gray-800">{f.name}</p>
                  <div className="flex justify-between items-center text-[12px]">
                    <p className=" text-gray-600">{f.desc}</p>
                    <span
                      className={`inline-block text-${f.color}-500 text-[12px] font-bold px-3 py-1 rounded-full`}
                    >
                      {f.status}
                    </span>
                  </div>
                </div>
              ))}
            </section>
            <section className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center text-sm space-y-0 max-w-md mx-auto">
              <div className="text-4xl">📁</div>
              <p className="text-[12px] font-bold">{totalDocuments} Documents</p>
              <p className="text-[11px] text-gray-600">
                {documentData.map((doc) => `${doc.count} ${doc._id}`).join(" · ")}
              </p>
              <button
                onClick={() => (window.location.href = "/document")}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg py-2 mt-3 text-sm font-semibold"
              >
                Open Documents →
              </button>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}