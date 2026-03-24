"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/axiosInstance";


const stageColors = {
  Enquiries: "bg-blue-600",
  Reachable: "bg-blue-400",
  Qualified: "bg-orange-500",
  Proposal: "bg-purple-500",
  Closed: "bg-green-500"
};

const Page = () => {
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        // const res = await axios.get("http://localhost:8080/performance", {
        const res = await axios.get(`${BASE_URL}/performance`, {
          headers: {
            "auth-token": token,
          },
        });

        if (res.data.success) {
          setPerformanceData(res.data.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const formatValue = (value, unit) => {
    if (unit === "₹") {
      return `₹${value.toLocaleString()}`;
    }
    return `${value}${unit}`;
  };

  

  const getProgressColor = (percent) => {
    if (percent < 40) return "bg-red-500";
    if (percent < 70) return "bg-yellow-500";
    if (percent <= 100) return "bg-green-500";
    return "bg-blue-500";
  };

  
  
 

  const [revenuess, setrevenuess] = useState([]);

  useEffect(() => {
    const Revenuess = async () => {
      const token = localStorage.getItem("token");
      try {
        // const res = await axios.get("http://localhost:8080/projection", {
        const res = await axios.get(`${BASE_URL}/projection`, {
          headers: {
            "auth-token": token
          }
        });

        if (res.data.success) {
          setrevenuess([res.data.data]);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    Revenuess();
  }, []);



  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranch = async () => {
      const token = localStorage.getItem("token");

      try {
        // const res = await axios.get("http://localhost:8080/branch", {
        const res = await axios.get(`${BASE_URL}/branch`, {
          headers: {
            "auth-token": token
          }
        });

        if (res.data.success) {
          setBranches(res.data.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchBranch();
  }, []);

  const formatCurrency = (num) => {
    return "₹" + num.toLocaleString();
  };

  const getPercent = (branch, stageCount) => {
    if (branch.enquiries === 0) return 0;
    return Math.round((stageCount / branch.enquiries) * 100);
  };

  const currentRevenue = branches.reduce((sum, b) => sum + b.revenue, 0);

  const currentDeals = branches.reduce((sum, b) => {
    const closed = b.stages.find((s) => s.stage === "Closed");
    return sum + (closed ? closed.count : 0);
  }, 0);

  const optimizedTarget = currentRevenue * 2.05;
  const uplift = optimizedTarget - currentRevenue;

  if (!revenuess) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {performanceData.map((item, index) => {

            const percent = Math.min(
              Math.round((item.value / item.target) * 100),
              100
            );

            return (
              <div
                key={index}
                className="bg-white rounded-xl  shadow-md hover:shadow-xl transition-all duration-300 p-1 border border-gray-100"
              >

                <h3 className="text-gray-600 mx-2 mt-2 text-[12px] font-bold tracking-wide mb-1">
                  {item.name}
                </h3>

                <p className="text-xl  mx-2 font-bold text-gray-900 ">
                  {formatValue(item.value, item.unit)}
                </p>

                <p className="text-sm mx-2 text-gray-500 ">
                  Target{" "}
                  <span className="font-semibold mx-2 text-gray-700">
                    {formatValue(item.target, item.unit)}
                  </span>
                </p>


                <div className="w-full  bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(percent)}`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <p className="text-xs mx-2 text-gray-500 mt-2 font-medium">
                  {percent}% Completed
                </p>

              </div>
            );
          })}

        </div>


      </div>

       <div className="grid grid-cols-2 gap-6 p-6 bg-gray-100 min-h-screen">

      {branches.map((branch) => (
        <div
          key={branch.branch}
          className="bg-white rounded-xl shadow p-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-[13px] font-bold">
              🏢 {branch.branch}
            </h2>
            {branch.tag && (
              <span
                className={`px-3 py-1 text-[11px] rounded-full ${
                  branch.tag === "Best"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {branch.tag}
              </span>
            )}
          </div>

          <p className="text-gray-500 text-[11px] mb-2">
            {branch.enquiries} enquiries · {formatCurrency(branch.revenue)}
          </p>

          <hr/>

          <div className="space-y-3 my-4">
            {branch.stages.map((stage) => {

              const percent = getPercent(branch, stage.count);
              return (
                <div key={stage.stage} className="flex items-center gap-3">

                  <span className="w-24 text-[11px] text-gray-600">
                    {stage.stage}
                  </span>

                  <div className="flex-1 bg-gray-200 rounded h-4 relative">

                    <div
                      className={`h-4 rounded text-white text-xs flex items-center px-2 ${stageColors[stage.stage]}`}
                      style={{ width: `${percent}%` }}
                    >
                      {stage.count}
                    </div>

                  </div>

                  <span className="text-[11px] text-gray-600 w-10">
                    {percent}%
                  </span>

                </div>
              );
            })}
          </div>

        
          {branch.insight && (
            <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[11px] p-3 rounded">
              {branch.insight}
            </div>
          )}

        </div>
      ))}

   
      <div className="bg-white  rounded-xl shadow p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-[13px] font-bold">💰 Revenue Projection</h2>
          <span className="text-blue-600 bg-blue-100 text-[11px] px-3 py-1 rounded-full">
            Optimised
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex text-[11px] justify-between">
            <span className="text-gray-600">Current Revenue</span>
            <span className="font-bold">
              {formatCurrency(currentRevenue)}
            </span>
          </div>

          <div className="flex text-[11px] justify-between bg-green-50 p-2 rounded">
            <span className="text-green-700">
              Optimised Target
            </span>
            <span className="text-green-700 font-[800] text-[14px]">
              {formatCurrency(Math.round(optimizedTarget))}
            </span>
          </div>

          <div className="flex text-[11px] justify-between bg-blue-50 p-2 rounded">
            <span className="text-blue-700">
              Potential Uplift
            </span>
            <span className="text-blue-700 font-[800] text-[14px]">
              +{formatCurrency(Math.round(uplift))}
            </span>
          </div>

          <div className="flex text-[11px] justify-between">
            <span className="text-gray-600">Current Deals</span>
            <span className="font-[800] text-[14px]">
              {currentDeals} deals
            </span>
          </div>
          <div className="flex text-[11px] justify-between">
            <span className="text-gray-600">Target Deals</span>
            <span className="font-extrabold text-[14px]">
             {revenuess.map((st, index) =>(
            <div key={index} className="revenue-card">
               <p>{st.targetDeals} deals</p>
            </div>
          ))} 
            </span>

          </div>
        </div>
        <p className="text-[12px]">Same lead volume. Lift reachability→85%, qualification→71%, close rate→37%.</p>
      </div>

    </div>
    
    
    </div>
   


  );
};

export default Page;