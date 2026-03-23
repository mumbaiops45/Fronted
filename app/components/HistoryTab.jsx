// "use client";

// import React from 'react'

// const HistoryTab = ({lead}) => {

    

//     const history = Array.isArray(lead?.activityTimeline)
//     ? lead.activityTimeline: [];

//     console.log("👉 HISTORY TYPE:", typeof history);
//     console.log("👉 IS ARRAY:", Array.isArray(history));
//     console.log("👉 LENGTH:", history?.length);

//     if(history.length === 0){
//         return (
//            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
//                 <span className="text-4xl">📜</span>
//                 <p className="text-sm font-semibold text-gray-700 mt-2">
//                     No activity history 
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1 max-w-xs">
//                     Lead activity events will be recorded here.
//                 </p>
//             </div> 
//         )
//     }
//   return (
//     <div className="p-4 text-[12px]">
//             <h3 className="font-semibold text-gray-500 mb-4 uppercase">
//                 Activity Timeline
//             </h3>

//             <div className="relative pl-6 border-l border-gray-200 space-y-6">
//                 {history.map((item, i) => (
//                     <div key={i} className="relative">

//                         {/* Dot */}
//                         <div className="absolute -left-[9px] top-1 w-3 h-3 rounded-full bg-blue-500" />

//                         {/* Content */}
//                         <div>
//                             <p className="font-semibold text-gray-900 flex items-center gap-2">
//                                 <span>{item.icon || "•"}</span>
//                                 {item.title || "Event"}
//                             </p>

//                             {item.detail && (
//                                 <p className="text-gray-600 mt-0.5">
//                                     {item.detail}
//                                 </p>
//                             )}

//                             <p className="text-gray-400 mt-0.5">
//                                 {item.timestamp || ""}
//                                 {item.agent ? ` · ${item.agent}` : ""}
//                             </p>
//                         </div>

//                     </div>
//                 ))}
//             </div>
//         </div>
//   )
// }

// export default HistoryTab


"use client";

import React from "react";

const HistoryTab = ({ lead }) => {

    // 🔥 PRINT EVERYTHING
    console.log("👉 FULL LEAD OBJECT:", lead);
    console.log("👉 activityTimeline RAW:", lead?.activityTimeline);

    const history = Array.isArray(lead?.activityTimeline)
        ? lead.activityTimeline
        : [];

    console.log("👉 HISTORY TYPE:", typeof history);
    console.log("👉 IS ARRAY:", Array.isArray(history));
    console.log("👉 LENGTH:", history.length);

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <span className="text-4xl">📜</span>
                <p className="text-sm font-semibold text-gray-700 mt-2">
                    No activity history
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Lead activity events will be recorded here.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 text-[12px]">
            <h3 className="font-semibold text-gray-500 mb-4 uppercase">
                Activity Timeline
            </h3>

            <div className="relative pl-6 border-l border-gray-200 space-y-6">
                {history.map((item, i) => (
                    <div key={i} className="relative">

                        <div className="absolute -left-[9px] top-1 w-3 h-3 rounded-full bg-blue-500" />

                        <div>
                            <p className="font-semibold text-gray-900 flex items-center gap-2">
                                <span>{item.icon || "•"}</span>
                                {item.title || "Event"}
                            </p>

                            {item.detail && (
                                <p className="text-gray-600 mt-0.5">
                                    {item.detail}
                                </p>
                            )}

                            <p className="text-gray-400 mt-0.5">
                                {item.timestamp || ""}
                                {item.agent ? ` · ${item.agent}` : ""}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryTab;