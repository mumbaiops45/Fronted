
"use client";
import { useState, useEffect } from "react";
import "./globals.css"
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import AddLead from "./components/AddLead";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

 useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 786);
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
 } , []);

  return (
    <html lang="en">
      <body className="bg-gray-50">
        {isHomePage ? (
          <div className="h-screen w-full">
            {children}
          </div>
        ) : (
          <div className="flex h-screen">
            {isMobile && !isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)}
            className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded"
              >
              ☰
            </button>

            )}
            {(isMobile ? isSidebarOpen : true) && (
            <Navbar 
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            />
            )}
            <div className={`${isMobile ? "flex-1" : "flex-1 ml-64"} overflow-y-auto`}>
              <AddLead />
              {children}
            </div>
          </div>
        )}
      </body>

    </html>
  )
}