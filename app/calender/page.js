
"use client"

import React, { useState } from "react";

const tasks = [
  { date: "Today", title: "Day 6 Final", client: "Nisha Jewellers", owner: "Divya M", status: "Overdue" },
  { date: "Today", title: "Day 2 Check-in", client: "Ravi Kumar Foods", owner: "Karthik R", status: "Overdue" },
  { date: "Mar 2", title: "Send Proposal", client: "TechStart Solutions", owner: "Karthik R", status: "Today" },
  { date: "Mar 3", title: "Qualify Call", client: "Priya Electronics", owner: "Arjun S", status: "Today" },
  { date: "Mar 4", title: "Day 4 Case Study", client: "Meena's Bakery", owner: "Divya M", status: "Today" },
];

const page = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month)
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} />);
  }

  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(
      <div
        key={i}
        className="p-5 sm:p-5 rounded hover:bg-blue-100 cursor-pointer transition-colors text-xs sm:text-sm"
      >
        {i}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans flex flex-col md:flex-row gap-4 md:gap-6">
      <div className="w-full md:w-2/3 bg-white shadow rounded p-4 sm:p-6 flex flex-col">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded bg-gray-100 text-[12px] sm:text-base cursor-pointer"
            >
              ‹
            </button>
            <h1 className="text-[14px] sm:text-lg font-bold text-gray-800">
              {monthNames[month]} {year}
            </h1>
            <button
              onClick={nextMonth}
              className="p-2 rounded bg-gray-100 text-[12px] sm:text-base cursor-pointer"
            >
              ›
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 ml-auto">
            {["Urgent", "Task", "Done", "Follow-up"].map((status) => (
              <span
                key={status}
                className={`px-2 py-1 rounded-full 
        ${status === "Urgent" ? "bg-red-100 text-red-800" : ""}
        ${status === "Task" ? "bg-blue-100 text-blue-800" : ""}
        ${status === "Done" ? "bg-green-100 text-green-800" : ""}
        ${status === "Follow-up" ? "bg-orange-100 text-orange-800" : ""}
        font-medium text-[10px] sm:text-xs`}
              >
                ● {status}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 border divide-y divide-gray-300 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div
              key={day}
              className=" text-[10px] sm:text-sm border-b border-gray-300 bg-slate-50 text-black"
            >
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className="border-r border-b border-gray-300 p-1 sm:p-2"
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-white shadow rounded p-4 sm:p-6 flex-1 overflow-y-auto max-h-[400px] sm:max-h-[500px] md:max-h-full">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[12px] font-bold">Upcoming</p>
            <p className="text-red-800 text-[12px] bg-red-100 p-2 rounded-md">3 overdue</p>
          </div>
          <div className="space-y-1  sm:space-y-3 ">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className={`flex   justify-between  items-center p-3 rounded border ${task.status === "Overdue" ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
              >
                <div>
                  <p className="text-gray-600 text-[10px] sm:text-xs">{task.status}</p>
                  <p className="font-bold text-gray-800 text-[12px] sm:text-sm">{task.client}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs">{task.title} · {task.owner}</p>
                </div>
                {task.status && (
                  <span
                    className={`px-2 py-1 text-[10px] sm:text-xs rounded ${task.status === "Overdue"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {task.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default page;

