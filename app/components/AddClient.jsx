

'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { addClient } from '@/hooks/addClient.hook'

const AddClient = () => {
  const [open, setOpen] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const { createClient, loading, error } = addClient()


  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  const [formData, setFormData] = useState({
    clientName: '',
    contactPerson: '',
    location: '',
    service: '',
    description: '',
    totalValue: '',
    amountReceived: '',
    proposalDate: '',
    followUpDeadline: '',
    priority: 'Hot',
    paymentStatus: 'Pending',
    nextAction: '',
    lastFollowUpDate: '',
    notes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async () => {
    const errors = {}
    if (!formData.clientName.trim()) errors.clientName = 'Client name is required'
    if (!formData.totalValue || Number(formData.totalValue) <= 0) errors.totalValue = 'Enter a valid amount'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    try {
      const payload = {
        clientName: formData.clientName,
        contactPerson: formData.contactPerson,
        location: formData.location,
        service: formData.service,
        description: formData.description,
        totalValue: Number(formData.totalValue),
        amountReceived: Number(formData.amountReceived || 0),
        proposalDate: formData.proposalDate
          ? new Date(formData.proposalDate + 'T00:00:00').toISOString()
          : null,
        followUpDeadline: formData.followUpDeadline
          ? new Date(formData.followUpDeadline + 'T00:00:00').toISOString()
          : null,
        priority: formData.priority,
        paymentStatus: formData.paymentStatus,
        nextAction: formData.nextAction,
        lastFollowUpDate: formData.lastFollowUpDate
          ? new Date(formData.lastFollowUpDate + 'T00:00:00').toISOString()
          : null,
        notes: formData.notes,
      }

      const res = await createClient(payload)
      console.log("Client created:", res)

    
      setFormData({
        clientName: '',
        contactPerson: '',
        location: '',
        service: '',
        description: '',
        totalValue: '',
        amountReceived: '',
        proposalDate: '',
        followUpDeadline: '',
        priority: 'Hot',
        paymentStatus: 'Pending',
        nextAction: '',
        lastFollowUpDate: '',
        notes: '',
      })
      setFieldErrors({})
      setOpen(false)

    } catch (err) {
      const data = err.response?.data
      if (data?.errors && Array.isArray(data.errors)) {
        const mapped = {}
        data.errors.forEach(e => { mapped[e.path] = e.msg })
        setFieldErrors(mapped)
      }
      console.error("Error creating client:", err)
    }
  }

  const FieldError = ({ name }) =>
    fieldErrors[name]
      ? <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors[name]}</p>
      : null

  const errBorder = (name) =>
    fieldErrors[name]
      ? 'border-red-400 focus:ring-red-300'
      : 'border-gray-300 focus:ring-blue-300'

  return (
    <div className="flex justify-center items-center py-0 lg:py-4 lg:px-4">
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-[11px] font-semibold text-white hover:bg-blue-700 transition"
      >
        + Add Client
      </button>

      <Dialog open={open} onClose={setOpen} className="fixed inset-0 z-50">
        <DialogBackdrop className="fixed w-full inset-0 bg-black/40 backdrop-blur-sm" />
        

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="relative bg-white rounded-lg shadow-xl w-full text-left max-w-[670px] max-h-[90vh] overflow-y-auto p-6 text-[10px]">

              <div className="flex justify-between items-center mb-4">
                <h2 className=" text-[11.5px] font-bold">Add New Client</h2>

                <button  
                onClick={() => setOpen(false)}
                className='font-bold text-[14px]
         cursor-pointer'>✕</button>
              </div>

              <div className="space-y-3">

               
                <div className="flex justify-between gap-3">
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Client Name *</label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      placeholder="e.g. ABC PVT Ltd"
                      className={`w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 `}
                      // className={`w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 ${errBorder('clientName')}`}

                    />
                    <FieldError name="clientName" />
                  </div>
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Contact Person</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="e.g. Mr. Rajesh Kumar"
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-3">
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">City / Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Bangalore"
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Category / Scope</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="">Select Category...</option>
                      <option value="Website Development">Website Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="Web Platform">Web Platform</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="2D Animation">2D Animation</option>
                      <option value="CRM / Software">CRM / Software</option>
                      <option value="Corporate Video">Corporate Video</option>
                      <option value="SEO">SEO</option>
                      <option value="3D + AR Website">3D + AR Website</option>
                      <option value="Website + CRM">Website + CRM</option>
                      <option value="Website + App">Website + App</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                
                <div>
                  <label className="mb-1 font-medium block">Project Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the project scope..."
                    className="w-full border px-3 py-2 rounded text-[10px] h-20 resize-y focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

               
                <div className="flex justify-between gap-3">
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Total Value (₹) *</label>
                    <input
                      type="number"
                      name="totalValue"
                      value={formData.totalValue}
                      onChange={handleChange}
                      placeholder="0"
                      className={`w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 `}
                    />
                    <FieldError name="totalValue" />
                  </div>
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Amount Received (₹)</label>
                    <input
                      type="number"
                      name="amountReceived"
                      value={formData.amountReceived}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>

                
                <div className="flex justify-between gap-3">
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Proposal Date</label>
                    <input
                      type="date"
                      name="proposalDate"
                      value={formData.proposalDate}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Follow-up Deadline</label>
                    <input
                      type="date"
                      name="followUpDeadline"
                      value={formData.followUpDeadline}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>

               
                <div className="flex justify-between gap-3">
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="Hot">🔴 HOT</option>
                      <option value="Warm">🟡 WARM</option>
                      <option value="Watch">🔵 WATCH</option>
                      <option value="Done">✅ DONE</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Pending Status</label>
                    <select
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                      <option value="Followed-Up">Followed-Up</option>
                      <option value="Not Finalised">Not Finalised</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>
                </div>

               
                <div>
                  <label className="mb-1 font-medium block">Next Action</label>
                  <textarea
                    name="nextAction"
                    value={formData.nextAction}
                    onChange={handleChange}
                    placeholder="What needs to happen next? e.g. Call to collect 50% advance"
                    className="w-full border px-3 py-2 rounded text-[10px] h-20 resize-y focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

               
                <div className="flex justify-between gap-3">
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Last Follow-up Date</label>
                    <input
                      type="date"
                      name="lastFollowUpDate"
                      value={formData.lastFollowUpDate}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="mb-1 font-medium block">Notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any additional notes..."
                      className="w-full border px-3 py-2 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>
              </div>

              
              {error && (
                <p className="text-red-500 text-[10px] mt-3">
                  {error?.message || error}
                </p>
              )}

             
              <div className=" px-4 py-3 mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-[10px] rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded text-[10px] hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>

            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default AddClient