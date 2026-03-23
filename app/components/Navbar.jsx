"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import { RxDashboard } from "react-icons/rx";
import { MdOutlineSpaceDashboard, MdLeaderboard } from "react-icons/md";
import { BsFileBarGraphFill } from "react-icons/bs";
import { GoPersonFill } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { IoIosDocument } from "react-icons/io";
import { GoPulse } from "react-icons/go";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(" ");



  useEffect(() => {
    const checkLogin = () =>{
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

    return () => window.removeEventListener("storage", checkLogin);
  },[]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

 
  const linkClass = (path) =>
    `flex items-center rounded-md px-3 py-2 text-[12px] font-medium transition ${
      pathname.startsWith(path)
        ? "bg-blue-100 text-blue-600"
        : "text-gray-800 hover:bg-gray-100 hover:text-black"
    }`;

    const roleMap = {
      master: {
        name: "Master Admin",
        desc: "All Branches",
        badge: "MASTER",
      },
      manager: {
        name: "Branch Manager",
        desc: "Branch View",
        badge: "MANAGER",
      },
      rep: {
        name: "Sales Rep",
        desc: "Own Leads",
        badge: "REP",
      },
      viewer: {
        name: "Viewer",
        desc: "Read Only",
        Badge: "VIEWER"
      }
    }

  return (
    <nav className="w-64 h-screen fixed left-0 top-0 bg-white overflow-y-auto scrollbar-hide">
      <div className="flex flex-col h-full px-4 py-6">
        
        
        <div className="flex gap-4 pb-3 w-fit">
          <div className="w-14 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-[14px] tracking-wider">
              NNC
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <h1 className="text-[14px] font-extrabold text-gray-900 tracking-wide">
              NNC CRM
            </h1>
            <p className="text-[12px] text-gray-500">Website Services</p>
          </div>
        </div>

       
        <div className="flex flex-col space-y-3 flex-grow">

        
          <div>
            <span className="text-[12px] text-gray-500 mb-2">Overview</span>
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              <RxDashboard className="mr-2" />
              Dashboard
            </Link>
          </div>

         
          <div>
            <span className="text-[12px] text-gray-500 mb-2">Sales</span>

            <Link href="/leads" className={linkClass("/leads")}>
              <MdOutlineSpaceDashboard className="mr-2" />
              All Lead
            </Link>

            <Link href="/pipeline" className={linkClass("/pipeline")}>
              <GoPersonFill className="mr-2" />
              Pipeline
            </Link>

            <Link href="/calender" className={linkClass("/calender")}>
              <SlCalender className="mr-2" />
              Calendar
            </Link>
          </div>

          <div>
            <span className="text-[12px] text-gray-500">Documents</span>
            <Link href="/document" className={linkClass("/document")}>
              <IoIosDocument className="mr-2" />
              Documents
            </Link>
          </div>

         
          <div>
            <span className="text-[12px] text-gray-500">Analytics</span>

            <Link href="/analytics" className={linkClass("/analytics")}>
              <GoPulse className="mr-2" />
              Analytics
            </Link>

            <Link href="/leaderboard" className={linkClass("/leaderboard")}>
              <MdLeaderboard className="mr-2" />
              Leaderboard
            </Link>
            <Link href="/paymenttracker" className={linkClass("/paymenttracker")}>
              <MdLeaderboard className="mr-2" />
              Payment Track
            </Link>

            <Link href="/revenuedash" className={linkClass("/revenuedash")}>
              <MdLeaderboard className="mr-2" />
              Revenue Dashboard
            </Link>
          </div>
          <Link href="/branchreport" className={linkClass("/branchreport")}>
            <BsFileBarGraphFill className="mr-2" />
            Branch Report
          </Link>
        </div>
        <div className="flex flex-col space-y-3 mt-auto">
          {/* {!isLoggedIn ? (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>

              <Link href="/signup" className={linkClass("/signup")}>
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-black hover:bg-red-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            >
              Logout
            </button>
          )} */}

          {!isLoggedIn ? (
            <>
            <Link href="/login" className={linkClass("/login")}>Login</Link>
 
            <Link href="/signup" className={linkClass("/signup")}>Signup</Link>
            </>
          ) :(
            <div 
            onClick={handleLogout}
            className="flex items-center gap-3  rounded-lg cursor-pointer hover: bg-gray-100 transition">

              <div className="w-10 h-10 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold">
                {userRole?.slice(0,2).toUpperCase()}
              </div>
               <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-bold">
                  {roleMap[userRole]?.name}
                </span>
                <span className="text-xs text-gray-500">{roleMap[userRole]?.desc}</span>
               </div>

               <span className="ml-auto text-[10px] px-2 py-1 bg-yellow-400 rounded-full font-bold">
                {roleMap[userRole]?.badge}
               </span>
            </div>
          )
        }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;