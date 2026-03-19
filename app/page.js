
'use client'

import Image from "next/image";

import UploadDoc from "./components/uploadDoc";
import LeadDetails from "./components/LeadDetails";
import Newpayment from "./components/Newpayment";
import AddClient from "./components/AddClient";
import AddProposal from "./components/AddProposal";
import ShowClient from "./components/ShowClient";
import ShowPayment from "./components/ShowPayment";
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <>
    <h1>This is Home Page</h1>

    {/* <UploadDoc/>
    <LeadDetails/> */}
    {/* <Newpayment/>
    <AddClient/> */}
    {/* <AddProposal/> */}
    {/* <ShowClient/> */}
    {/* <ShowPayment/> */}
    <Dashboard />
    </>
  );
}
