import "./globals.css";

import Navbar from "./components/Navbar";
import AddLead from "./components/AddLead";


export default function RootLayout({ children }) {
  return (
    // <html lang="en">
    //   <body className="bg-gray-50">
    //     <div className="flex min-h-screen">
    //       <Navbar />
    //       <div className="flex-1 ml-64 ">
    //         <AddLead />
    //         {children}
    //       </div>
    //     </div>
    //   </body>
    // </html>

    <html lang="en">
  <body className="bg-gray-50 overflow-hidden">
    <div className="flex h-screen">
      <Navbar />
      
      <div className="flex-1 ml-64 overflow-y-auto">
        <AddLead />
        {children}
      </div>
    </div>
  </body>
</html>
  );
}