
"use client";

import "./globals.css"
import { usePathname } from "next/navigation";

import Navbar from "./components/Navbar";
import AddLead from "./components/AddLead";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <html lang="en">
      <body className="bg-gray-50">
        {isHomePage ? (
          <div className="h-screen w-full">
            {children}
          </div>
        ) : (
          <div className="flex h-screen">

            <Navbar />
            <div className="flex-1 ml-64 overflow-y-auto">
              <AddLead />
              {children}
            </div>
          </div>
        )}
      </body>

    </html>
  )
}