'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useAddProposal , useProposals } from '@/hooks/proposal.hook'

const defaultFormState = {
  clientName: '',
  contactPerson: '',
  city: '',
  category: 'Website Development',
  dealValue: '',
  stage: 'Lead',
  proposalDate: new Date().toISOString().split('T')[0],
  expectedClose: new Date().toISOString().split('T')[0],
  probability: 50,
  notes: '',
}

const inputFields = [
  { label: 'CLIENT NAME', name: 'clientName', type: 'text', placeholder: 'e.g. ABC Pvt Ltd', required: true },
  { label: 'CONTACT PERSON', name: 'contactPerson', type: 'text', placeholder: 'Name / Designation' },
  { label: 'CITY', name: 'city', type: 'text', placeholder: 'e.g. Mumbai' },
  { label: 'DEAL VALUE (₹)', name: 'dealValue', type: 'number', placeholder: '0', required: true },
  { label: 'PROPOSAL DATE', name: 'proposalDate', type: 'date' },
  { label: 'EXPECTED CLOSE', name: 'expectedClose', type: 'date' },
]

const selectFields = [
  {
    label: 'CATEGORY',
    name: 'category',
    options: [
      'Website Development', 'Mobile App', 'E-Commerce', 'Web Platform',
      'Digital Marketing', '2D Animation', 'CRM / Software', '3D + AR Website',
      'Website + CRM', 'Corporate Video', 'SEO', 'Other'
    ]
  },
  { label: 'STAGE', name: 'stage', options: ['Lead', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'On Hold'] },
]

const AddProposal = () => {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState(defaultFormState)
  const { createProposal, loading, error } = useAddProposal()
  

  const handleOpen = () => {
    setFormState(defaultFormState)
    setOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'dealValue' || name === 'probability' ? Number(value) : value,
    }))
  }

  const handleSave = async () => {
    if (new Date(formState.expectedClose) < new Date(formState.proposalDate)) {
      alert('Expected Close date cannot be before Proposal Date')
      return
    }

    try {
      await createProposal(formState)
      setOpen(false)
      alert('Proposal added successfully!')
    } catch (err) {
      alert(err.message || 'Failed to add proposal')
    }
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
          <div className="flex min-h-full inset-0 bg-black/40 backdrop-blur-sm items-center justify-center p-4">
            <DialogPanel className="w-full max-w-2xl rounded-lg bg-white shadow-xl p-6 text-[12px]">
              <h2 className="text-[12px] font-semibold mb-4">+ Add New Proposal</h2>

              <div className="grid grid-cols-2 gap-4">
                {inputFields.map(({ label, name, type, placeholder, required }) => (
                  <div className="flex flex-col" key={name}>
                    <label className="mb-1 font-medium">{label}{required && '*'}</label>
                    <input
                      type={type}
                      name={name}
                      value={formState[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="border rounded-md px-3 py-2 text-[12px]"
                    />
                  </div>
                ))}

                {selectFields.map(({ label, name, options }) => (
                  <div className="flex flex-col" key={name}>
                    <label className="mb-1 font-medium">{label}</label>
                    <select
                      name={name}
                      value={formState[name]}
                      onChange={handleChange}
                      className="border rounded-md px-3 py-2 text-[12px]"
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="col-span-2">
                  <label className="font-medium mb-1 block">WIN PROBABILITY</label>
                  <div className="relative w-full">
                    <div
                      className="absolute -top-6 bg-blue-600 text-white text-[12px] font-semibold px-2 py-1 rounded"
                      style={{ left: `${((formState.probability - 5) / 95) * 100}%` }}
                    >
                      {formState.probability}%
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      name="probability"
                      value={formState.probability}
                      onChange={handleChange}
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
                    name="notes"
                    value={formState.notes}
                    onChange={handleChange}
                    placeholder="Scope, expectations, blockers..."
                    className="border rounded-md px-3 py-2 h-20 text-[12px]"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-[12px] mt-2">{error}</p>}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-[12px]"
                >
                  {loading ? 'Saving...' : 'Save'}
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