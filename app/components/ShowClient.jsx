"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ShowClient = () => {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await axios.get("https://backendcrm-vm8o.onrender.com/allclients")
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

    // Helper to format numbers in Indian Rupees format
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
                <div key={client._id} className="bg-white shadow rounded-xl p-4">
                    <h3 className="font-bold text-lg">{client.clientName}</h3>
                    <p className="text-sm text-gray-500">{client.contactPerson}</p>
                    <p className="text-sm text-gray-500">{client.location}</p>
                    <p className="text-sm mt-1">{client.service}</p>
                    <p className="text-sm text-gray-700 mt-1">{client.description}</p>
                    <div className="mt-2">
                        <p className="text-sm">
                            Total Value: <span className="font-bold">{formatINR(client.totalValue)}</span>
                        </p>
                        <p className="text-sm">
                            Amount Received: <span className="font-bold">{formatINR(client.amountReceived)}</span>
                        </p>
                        <p className="text-sm mt-1">
                            Payment Status: <span className="font-medium">{client.paymentStatus}</span>
                        </p>
                        <p className="text-sm">
                            Priority: <span className="font-medium">{client.priority}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ShowClient