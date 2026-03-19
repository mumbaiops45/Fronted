// import React from "react";

// /** A direct replica of the provided "MARCH2026-REVENUETARGET" UI,
//  *  built with React + Tailwind CSS. Copy and paste into your project. */
// const RevenueCard = () => {
//   // Static data based on the image
//   const month = "March 2026";
//   const targetAmount = "5.0L";
//   const collectedAmount = "0";
//   const remainingAmount = "5.0L";
//   const day = 16;
//   const totalDays = 31;
//   const projectedShortfall = "5.0L";

//   // Generate the long vertical scale numbers (from ~3,000 up to 751,000 as in image)
//   const scaleNumbers = [
//     3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000,
//     17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000,
//     30000, 31000, 32000, 33000, 34000, 35000, 36000, 37000, 38000, 39000, 40000, 41000, 42000,
//     43000, 44000, 45000, 46000, 47000, 48000, 49000, 50000, 51000, 52000, 53000, 54000, 55000,
//     56000, 57000, 58000, 59000, 60000, 61000, 62000, 63000, 64000, 65000, 66000, 67000, 68000,
//     69000, 70000, 71000, 72000, 73000, 74000, 75000, 76000, 77000, 78000, 79000, 80000, 81000,
//     82000, 83000, 84000, 85000, 86000, 87000, 88000, 89000, 90000, 91000, 92000, 93000, 94000,
//     95000, 96000, 97000, 98000, 99000, 100000, 101000, 102000, 103000, 104000, 105000, 106000,
//     107000, 108000, 109000, 110000, 111000, 112000, 113000, 114000, 115000, 116000, 117000,
//     118000, 119000, 120000, 121000, 122000, 123000, 124000, 125000, 126000, 127000, 128000,
//     129000, 130000, 131000, 132000, 133000, 134000, 135000, 136000, 137000, 138000, 139000,
//     140000, 141000, 142000, 143000, 144000, 145000, 146000, 147000, 148000, 149000, 150000,
//     151000, 152000, 153000, 154000, 155000, 156000, 157000, 158000, 159000, 160000, 161000,
//     162000, 163000, 164000, 165000, 166000, 167000, 168000, 169000, 170000, 171000, 172000,
//     173000, 174000, 175000, 176000, 177000, 178000, 179000, 180000, 181000, 182000, 183000,
//     184000, 185000, 186000, 187000, 188000, 189000, 190000, 191000, 192000, 193000, 194000,
//     195000, 196000, 197000, 198000, 199000, 200000, 201000, 202000, 203000, 204000, 205000,
//     206000, 207000, 208000, 209000, 210000, 211000, 212000, 213000, 214000, 215000, 216000,
//     217000, 218000, 219000, 220000, 221000, 222000, 223000, 224000, 225000, 226000, 227000,
//     228000, 229000, 230000, 231000, 232000, 233000, 234000, 235000, 236000, 237000, 238000,
//     239000, 240000, 241000, 242000, 243000, 244000, 245000, 246000, 247000, 248000, 249000,
//     250000, 251000, 252000, 253000, 254000, 255000, 256000, 257000, 258000, 259000, 260000,
//     261000, 262000, 263000, 264000, 265000, 266000, 267000, 268000, 269000, 270000, 271000,
//     272000, 273000, 274000, 275000, 276000, 277000, 278000, 279000, 280000, 281000, 282000,
//     283000, 284000, 285000, 286000, 287000, 288000, 289000, 290000, 291000, 292000, 293000,
//     294000, 295000, 296000, 297000, 298000, 299000, 300000, 301000, 302000, 303000, 304000,
//     305000, 306000, 307000, 308000, 309000, 310000, 311000, 312000, 313000, 314000, 315000,
//     316000, 317000, 318000, 319000, 320000, 321000, 322000, 323000, 324000, 325000, 326000,
//     327000, 328000, 329000, 330000, 331000, 332000, 333000, 334000, 335000, 336000, 337000,
//     338000, 339000, 340000, 341000, 342000, 343000, 344000, 345000, 346000, 347000, 348000,
//     349000, 350000, 351000, 352000, 353000, 354000, 355000, 356000, 357000, 358000, 359000,
//     360000, 361000, 362000, 363000, 364000, 365000, 366000, 367000, 368000, 369000, 370000,
//     371000, 372000, 373000, 374000, 375000, 376000, 377000, 378000, 379000, 380000, 381000,
//     382000, 383000, 384000, 385000, 386000, 387000, 388000, 389000, 390000, 391000, 392000,
//     393000, 394000, 395000, 396000, 397000, 398000, 399000, 400000, 401000, 402000, 403000,
//     404000, 405000, 406000, 407000, 408000, 409000, 410000, 411000, 412000, 413000, 414000,
//     415000, 416000, 417000, 418000, 419000, 420000, 421000, 422000, 423000, 424000, 425000,
//     426000, 427000, 428000, 429000, 430000, 431000, 432000, 433000, 434000, 435000, 436000,
//     437000, 438000, 439000, 440000, 441000, 442000, 443000, 444000, 445000, 446000, 447000,
//     448000, 449000, 450000, 451000, 452000, 453000, 454000, 455000, 456000, 457000, 458000,
//     459000, 460000, 461000, 462000, 463000, 464000, 465000, 466000, 467000, 468000, 469000,
//     470000, 471000, 472000, 473000, 474000, 475000, 476000, 477000, 478000, 479000, 480000,
//     481000, 482000, 483000, 484000, 485000, 486000, 487000, 488000, 489000, 490000, 491000,
//     492000, 493000, 494000, 495000, 496000, 497000, 498000, 499000, 500000, 501000, 502000,
//     503000, 504000, 505000, 506000, 507000, 508000, 509000, 510000, 511000, 512000, 513000,
//     514000, 515000, 516000, 517000, 518000, 519000, 520000, 521000, 522000, 523000, 524000,
//     525000, 526000, 527000, 528000, 529000, 530000, 531000, 532000, 533000, 534000, 535000,
//     536000, 537000, 538000, 539000, 540000, 541000, 542000, 543000, 544000, 545000, 546000,
//     547000, 548000, 549000, 550000, 551000, 552000, 553000, 554000, 555000, 556000, 557000,
//     558000, 559000, 560000, 561000, 562000, 563000, 564000, 565000, 566000, 567000, 568000,
//     569000, 570000, 571000, 572000, 573000, 574000, 575000, 576000, 577000, 578000, 579000,
//     580000, 581000, 582000, 583000, 584000, 585000, 586000, 587000, 588000, 589000, 590000,
//     591000, 592000, 593000, 594000, 595000, 596000, 597000, 598000, 599000, 600000, 601000,
//     602000, 603000, 604000, 605000, 606000, 607000, 608000, 609000, 610000, 611000, 612000,
//     613000, 614000, 615000, 616000, 617000, 618000, 619000, 620000, 621000, 622000, 623000,
//     624000, 625000, 626000, 627000, 628000, 629000, 630000, 631000, 632000, 633000, 634000,
//     635000, 636000, 637000, 638000, 639000, 640000, 641000, 642000, 643000, 644000, 645000,
//     646000, 647000, 648000, 649000, 650000, 651000, 652000, 653000, 654000, 655000, 656000,
//     657000, 658000, 659000, 660000, 661000, 662000, 663000, 664000, 665000, 666000, 667000,
//     668000, 669000, 670000, 671000, 672000, 673000, 674000, 675000, 676000, 677000, 678000,
//     679000, 680000, 681000, 682000, 683000, 684000, 685000, 686000, 687000, 688000, 689000,
//     690000, 691000, 692000, 693000, 694000, 695000, 696000, 697000, 698000, 699000, 700000,
//     701000, 702000, 703000, 704000, 705000, 706000, 707000, 708000, 709000, 710000, 711000,
//     712000, 713000, 714000, 715000, 716000, 717000, 718000, 719000, 720000, 721000, 722000,
//     723000, 724000, 725000, 726000, 727000, 728000, 729000, 730000, 731000, 732000, 733000,
//     734000, 735000, 736000, 737000, 738000, 739000, 740000, 741000, 742000, 743000, 744000,
//     745000, 746000, 747000, 748000, 749000, 750000, 751000,
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
//       <div className="max-w-6xl w-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
//         {/* Header with title and edit */}
//         <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
//           <h1 className="text-xl font-bold tracking-tight text-gray-800">
//             MARCH2026-REVENUETARGET
//           </h1>
//           <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
//             <span>Edit Target</span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//               />
//             </svg>
//           </button>
//         </div>

//         <div className="flex flex-col md:flex-row">
//           {/* LEFT PANEL – Pipeline by stage and metrics */}
//           <div className="w-full md:w-64 bg-gray-50 p-5 border-r border-gray-200 flex flex-col gap-5">
//             <div>
//               <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
//                 Pipeline by stage
//               </h2>
//               <div className="mt-2 space-y-4">
//                 {/* 0% collected doughnut mimic */}
//                 <div className="flex items-center gap-3">
//                   <div className="relative h-12 w-12 flex-shrink-0">
//                     <svg className="h-12 w-12" viewBox="0 0 40 40">
//                       <circle
//                         cx="20"
//                         cy="20"
//                         r="16"
//                         fill="transparent"
//                         stroke="#e5e7eb"
//                         strokeWidth="3"
//                       />
//                       <circle
//                         cx="20"
//                         cy="20"
//                         r="16"
//                         fill="transparent"
//                         stroke="#3b82f6"
//                         strokeWidth="3"
//                         strokeDasharray="100.5"
//                         strokeDashoffset="100.5" // 0% progress
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <div className="text-2xl font-bold text-gray-800">0%</div>
//                     <div className="text-xs text-gray-500">of {targetAmount}</div>
//                   </div>
//                 </div>

//                 {/* Collected / remaining */}
//                 <div className="border-t border-gray-200 pt-3 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Collected</span>
//                     <span className="font-semibold text-gray-800">{collectedAmount}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Remaining</span>
//                     <span className="font-semibold text-gray-800">{remainingAmount}</span>
//                   </div>
//                 </div>

//                 {/* No proposals yet */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
//                   <p className="text-xs text-gray-500 uppercase">No proposals yet</p>
//                   <p className="text-lg font-bold text-gray-400">—</p>
//                 </div>

//                 {/* Day 16 of 31 */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-3">
//                   <p className="text-xs text-gray-500">Day {day} of {totalDays}</p>
//                   <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
//                     <div
//                       className="bg-blue-500 h-2 rounded-full"
//                       style={{ width: `${(day / totalDays) * 100}%` }}
//                     />
//                   </div>
//                 </div>

//                 {/* Projected shortfall */}
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                   <p className="text-xs text-gray-600">△ Projected shortfall at current run rates:</p>
//                   <p className="text-lg font-bold text-red-600">{projectedShortfall}</p>
//                 </div>

//                 {/* Add collection button */}
//                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 transition">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                   </svg>
//                   <span>Add Collection</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT PANEL – Vertical scale (long number list) */}
//           <div className="flex-1 bg-white p-4 overflow-x-auto">
//             <div className="mb-3 px-2">
//               <h2 className="text-sm font-semibold text-gray-700">
//                 March 2026 Revenue Target
//               </h2>
//             </div>
//             <div
//               className="grid grid-flow-col auto-cols-max gap-x-6 gap-y-1 justify-start"
//               style={{
//                 // Approx 4 columns to mimic dense packing; we just need the vertical strip look
//                 gridTemplateRows: "repeat(20, minmax(0, auto))",
//               }}
//             >
//               {scaleNumbers.map((num, idx) => (
//                 <div
//                   key={idx}
//                   className="text-xs text-gray-600 font-mono tabular-nums hover:bg-gray-100 px-1.5 py-0.5 rounded"
//                 >
//                   {num.toLocaleString()}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom bar (just for decoration) */}
//         <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 text-xs text-gray-400 flex justify-between">
//           <span>Revenue target • {targetAmount}</span>
//           <span>Updated today</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RevenueCard;