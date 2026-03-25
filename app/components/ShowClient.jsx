"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '@/utils/axiosInstance'

const ShowClient = () => {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/allclients`)
                setClients(res.data.AllClients || [])
            } catch (err) {
                console.error(err)
                setError("Failed to fetch clients")
            } finally {
                setLoading(false)
            }
        }

        fetchClients()
    }, [])

    
    const formatINR = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p>Loading clients...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[200px] text-red-500">
                <p>{error}</p>
            </div>
        )
    }

    if (clients.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p>No clients found.</p>
            </div>
        )
    }

    return (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //     {clients.map(client => (
        //         <div key={client._id} className="bg-white shadow rounded-xl p-4">
        //             <h3 className="font-bold text-lg">{client.clientName}</h3>
        //             <p className="text-sm text-gray-500">{client.contactPerson}</p>
        //             <p className="text-sm text-gray-500">{client.location}</p>
        //             <p className="text-sm mt-1">{client.service}</p>
        //             <p className="text-sm text-gray-700 mt-1">{client.description}</p>
        //             <div className="mt-2">
        //                 <p className="text-sm">
        //                     Total Value: <span className="font-bold">{formatINR(client.totalValue)}</span>
        //                 </p>
        //                 <p className="text-sm">
        //                     Amount Received: <span className="font-bold">{formatINR(client.amountReceived)}</span>
        //                 </p>
        //                 <p className="text-sm mt-1">
        //                     Payment Status: <span className="font-medium">{client.paymentStatus}</span>
        //                 </p>
        //                 <p className="text-sm">
        //                     Priority: <span className="font-medium">{client.priority}</span>
        //                 </p>
        //             </div>
        //         </div>
        //     ))}
        // </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {clients.map(client => (
    <div 
      key={client._id} 
      className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300"
    >
     
      <h3 className="font-bold text-[14px] ">{client.clientName}</h3>
      <p className="text-sm text-gray-500">{client.contactPerson}</p>

   
      <div className="mt-2">
        <p className="text-[12px] text-gray-400">{client.location}</p>
        <p className="text-[12px] text-gray-600 mt-1">{client.service}</p>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-[12px]">
          <span className="font-medium">Total:</span>{" "}
          <span className="font-bold text-gray-900">{formatINR(client.totalValue)}</span>
        </p>
        <p className="text-[12px] mt-1">
          <span className="font-medium">Received:</span>{" "}
          <span className="font-bold text-green-600">{formatINR(client.amountReceived)}</span>
        </p>
        <p className="text-[12px] mt-1">
          <span className="font-medium">Status:</span>{" "}
          <span className={`font-semibold ${
            client.paymentStatus === "Paid" ? "text-green-600" :
            client.paymentStatus === "Pending" ? "text-yellow-600" : "text-red-600"
          }`}>
            {client.paymentStatus}
          </span>
        </p>
      </div>
      <div className="mt-3">
        <span className={`inline-block px-3 py-1 text-sm rounded-full font-semibold ${
          client.priority === "High" ? "bg-red-100 text-red-700" :
          client.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
          "bg-green-100 text-green-700"
        }`}>
          {client.priority} 
        </span>
      </div>
    </div>
  ))}
</div>
    )
}

export default ShowClient