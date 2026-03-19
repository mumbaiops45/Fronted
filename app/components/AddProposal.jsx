'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'


const AddProposal = () => {
  const [open, setOpen] = useState(false)
  const [probability, setProbability] = useState(50)

  const handleOpen = () => {
    setProbability(50)
    setOpen(true)
  }

  return (
    <div>
      <button
        onClick={handleOpen}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-gray-800"
      >
        Add Proposal
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-2xl rounded-lg bg-white shadow-xl p-6 text-[12px]">

           
              <div className="flex items-center gap-3 mb-6">
               
                <h2 className="text-[12px] font-semibold">+ Add New Proposal</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">CLIENT NAME *</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC Pvt Ltd"
                    className="border rounded-md px-3 py-2 text-[12px]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">CONTACT PERSON</label>
                  <input
                    type="text"
                    placeholder="Name / Designation"
                    className="border rounded-md px-3 py-2 text-[12px]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-medium">CITY</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore"
                    className="border rounded-md px-3 py-2 text-[12px]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-medium">CATEGORY</label>
                  <select className="border rounded-md px-3 py-2 text-[12px]">
                    <option value="">Select...</option>
                    <option>Website Development</option>
                    <option>Mobile App</option>
                    <option>E-Commerce</option>
                    <option>Web Platform</option>
                    <option>Digital Marketing</option>
                    <option>2D Animation</option>
                    <option>CRM / Software</option>
                    <option>3D + AR Website</option>
                    <option>Website + CRM</option>
                    <option>Corporate Video</option>
                    <option>SEO</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">DEAL VALUE (₹) *</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="border rounded-md px-3 py-2 text-[12px]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">STAGE</label>
                  <select className="border rounded-md px-3 py-2 text-[12px]">
                    <option>Lead</option>
                    <option>Proposal Sent</option>
                    <option>Negotiation</option>
                    <option>Won</option>
                    <option>Lost</option>
                    <option>On Hold</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">PROPOSAL DATE</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="border rounded-md px-3 py-2 text-[12px]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">EXPECTED CLOSE</label>
                  <input
                    type="date"
                    className="border rounded-md px-3 py-2 text-[12px]"
                  />
                </div>

            
                <div className="col-span-2">
                  <label className="font-medium mb-1 block">WIN PROBABILITY</label>

                  <div className="relative w-full">
              
                    <div
                      className="absolute -top-6 bg-blue-600 text-white text-[12px] font-semibold px-2 py-1 rounded"
                      style={{ left: `${((probability - 5) / 95) * 100}%` }}
                    >
                      {probability}%
                    </div>

                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={probability}
                      onChange={(e) => setProbability(Number(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-between text-[12px] text-gray-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
                <div className="col-span-2 flex flex-col">
                  <label className="mb-1 font-medium">NOTES</label>
                  <textarea
                    placeholder="Scope, expectations, blockers..."
                    className="border rounded-md px-3 py-2 h-20 text-[12px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-[12px]"
                >
                  Save
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-[12px]"
                >
                  Cancel
                </button>
              </div>

            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default AddProposal