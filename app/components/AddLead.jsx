
"use client"

import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { BASE_URL } from '@/utils/axiosInstance'

const AddLead = () => {
    const router = useRouter()
    const [activeAction, setActiveAction] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})

    const [formData, setFormData] = useState({
        name: "",
        businessName: "",
        businessType: "",
        phone: "",
        email: "",
        location: "",
        branch: "Bangalore",
        stage: "Lead Capture",
        priority: "Warm",
        source: "Other",
        dealValue: "",
        requirements: "",
        assignedTo: "",
        notes: "",
    })

    const branches = ["Bangalore", "Mumbai", "Mysore"]
    const stages = ["Lead Capture", "Reachable", "Qualified", "Proposal Sent", "Closed Won", "Closed Lost"]
    const priorities = ["Hot", "Warm", "Cool"]
    const sources = ["WhatsApp", "Website Form", "Phone Call", "Referral", "Social Media", "Walk-in", "Other"]

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("Token not found!")
            router.push("/signup")
        }
    }, [])


    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isModalOpen])

    const openModal = (action) => {
        setActiveAction(action)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setActiveAction('')
        setFieldErrors({})
    }

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const handleSave = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("Session expired. Please login again.")
            router.push("/login")
            return
        }

        setFieldErrors({})

        const payload = {
            name: formData.name,
            businessName: formData.businessName,
            businessType: formData.businessType,
            phone: formData.phone,
            email: formData.email,
            location: formData.location,
            branch: formData.branch,
            stage: formData.stage,
            priority: formData.priority,
            source: formData.source,
            dealValue: Number(formData.dealValue),
            assignedTo: formData.assignedTo,
            requirements: formData.requirements,
            notes: formData.notes,
        }

        try {
            // const response = await axios.post("http://localhost:8080/create", payload, {
             const response = await axios.post(`${BASE_URL}/create`, payload, {
                headers: { "auth-token": token }
            })
            console.log("Success:", response.data)
            setFormData({
                name: "", businessName: "", businessType: "",
                phone: "", email: "", location: "",
                branch: "Bangalore", stage: "Lead Capture",
                priority: "Warm", source: "Other",
                dealValue: "", assignedTo: "",
                requirements: "", notes: "",
            })
            setIsModalOpen(false)
        } catch (error) {
            const data = error.response?.data
            if (data?.errors && Array.isArray(data.errors)) {
                const mapped = {}
                data.errors.forEach(err => {
                    mapped[err.path] = err.msg
                })
                setFieldErrors(mapped)
            } else {
                alert(JSON.stringify(data))
            }
        }
    }

    const [selectedDocType, setSelectedDocType] = useState("")
    const [client, setClient] = useState("")
    const [docDate, setDocDate] = useState("")
    const [docName, setDocName] = useState("")
    const [docNotes, setDocNotes] = useState("")
    const [docFile, setDocFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const docTypes = [
        { key: "Invoice", name: "Invoice", desc: "Tax Invoice for closed deal", icon: "🧾" },
        { key: "Quotation", name: "Quotation", desc: "Proposal / price quote", icon: "📋" },
        { key: "MoM", name: "MoM", desc: "Minutes of Meeting notes", icon: "📝" },
        { key: "Client Input", name: "Client Input", desc: "Assets, content, brief from client", icon: "📥" },
    ]

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!selectedDocType) { alert("Please select a document type!"); return }
        if (!docFile) { alert("Please select a file to upload!"); return }
        if (!client) { alert("Please select a client/lead!"); return }

        try {
            setLoading(true)
            const uploadData = new FormData()
            uploadData.append("leadId", client)
            uploadData.append("docType", selectedDocType)
            uploadData.append("description", docNotes || "")
            uploadData.append("documentDate", docDate || new Date().toISOString().split('T')[0])
            uploadData.append("branch", "Bangalore")
            uploadData.append("invoiceAmount", "")
            uploadData.append("file", docFile)

            const token = localStorage.getItem("token")
            if (!token) { alert("Please login first"); setLoading(false); return }

            const response = await axios.post(`${BASE_URL}/document`, uploadData, {
                headers: { "Content-Type": "multipart/form-data", "auth-token": token },
            })
            console.log("Upload successful:", response.data)
            alert("Document uploaded successfully!")
            setSelectedDocType(""); setClient(""); setDocDate("")
            setDocName(""); setDocNotes(""); setDocFile(null)
            const fileInput = document.getElementById('doc-file')
            if (fileInput) fileInput.value = ''
        } catch (error) {
            console.error("Upload error:", error)
            if (error.response) {
                alert(`Upload failed: ${error.response.data.message || error.response.data}`)
            } else {
                alert(`Upload failed: ${error.message}`)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 25 * 1024 * 1024) {
                alert("File size should be less than 25MB")
                e.target.value = ''
                return
            }
            setDocFile(file)
        }
    }

    return (
        <div className="relative p-6 bg-white-100">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">All Leads</h1>
                <div className="flex items-center gap-4">
                    <div className="relative w-64 h-8">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-[12px]">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search Leads"
                            className="pl-8 pr-3 h-full w-full text-[12px] border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={() => openModal('upload')}
                        className="h-8 px-4 bg-blue-500 text-white text-[12px] rounded-lg hover:bg-blue-600 transition"
                    >
                        Upload
                    </button>
                    <button
                        onClick={() => openModal('addLead')}
                        className="h-8 px-4 bg-green-500 text-white text-[12px] rounded-lg hover:bg-green-600 transition"
                    >
                        +Add Lead
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                    <div
                        onClick={closeModal}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />
                    <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-[670px] mx-4 max-h-[90vh] flex flex-col">

                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold z-10"
                        >
                            ✕
                        </button>

                        <div className="overflow-y-auto p-6">
                            {activeAction === 'upload' && (
                                <form
                                    onSubmit={handleUpload}
                                    className="flex flex-col gap-6 w-full text-xs"
                                >
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-xl font-bold text-gray-800">Upload Document</h2>
                                        <p className="text-gray-500 text-sm">Please provide the document details below.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {docTypes.map((doc) => (
                                            <div
                                                key={doc.key}
                                                onClick={() => setSelectedDocType(doc.key)}
                                                className={`flex flex-col gap-1 p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow
                                                    ${selectedDocType === doc.key ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                                            >
                                                <p><strong>{doc.icon} {doc.name}</strong></p>
                                                <p className="text-gray-500 text-sm">{doc.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-gray-600 text-sm font-medium">
                                                    Link to Client/Lead <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={client}
                                                    onChange={(e) => setClient(e.target.value)}
                                                    required
                                                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                                                >
                                                    <option value="">Select lead...</option>
                                                    <option value="69a5537a737fb8a2dfe5bb69">Meera Textiles</option>
                                                    <option value="69a5537a737fb8a2dfe5bb69">Ravi Kumar Foods</option>
                                                    <option value="69a5537a737fb8a2dfe5bb69">Sri Krishna Hotel</option>
                                                    <option value="69a5537a737fb8a2dfe5bb69">Nisha Jewellers</option>
                                                    <option value="69a5537a737fb8a2dfe5bb69">TecStart Solutions</option>
                                                    <option value="69a5537a737fb8a2dfe5bb69">Priya Electronics</option>
                                                    <option value="69a5537a737fb8a2dfe5bb69">Arjun's Dental Clinic</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-gray-600 text-sm font-medium">Document Date</label>
                                                <input
                                                    type="date"
                                                    value={docDate}
                                                    onChange={(e) => setDocDate(e.target.value)}
                                                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-gray-600 text-sm font-medium">Document Name / Reference</label>
                                            <input
                                                type="text"
                                                value={docName}
                                                onChange={(e) => setDocName(e.target.value)}
                                                placeholder="e.g. INV-2026-057 or Project Kickoff"
                                                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-gray-600 text-sm font-medium">Notes / Description</label>
                                            <textarea
                                                value={docNotes}
                                                onChange={(e) => setDocNotes(e.target.value)}
                                                placeholder="Optional context about this document"
                                                rows="3"
                                                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-gray-600 text-sm font-medium">
                                                Select File <span className="text-red-500">*</span>
                                            </label>
                                            <label
                                                htmlFor="doc-file"
                                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-6 py-10 w-full cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                                            >
                                                <span className="text-gray-500">
                                                    {docFile ? docFile.name : "Click or drag file to upload"}
                                                </span>
                                                <span className="text-gray-400 text-xs mt-1">
                                                    Accepted formats: PDF, DOCX, XLSX, ZIP, Images (max 25MB)
                                                </span>
                                            </label>
                                            <input
                                                type="file"
                                                id="doc-file"
                                                accept=".pdf,.docx,.xlsx,.zip,image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 justify-end mt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedDocType(""); setClient(""); setDocDate("")
                                                setDocName(""); setDocNotes(""); setDocFile(null)
                                                const fileInput = document.getElementById('doc-file')
                                                if (fileInput) fileInput.value = ''
                                            }}
                                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`px-5 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition
                                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? 'Uploading...' : 'Upload Document'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* ───── ADD LEAD MODAL ───── */}
                            {activeAction === 'addLead' && (
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Add New Lead</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Client Name', name: 'name' },
                                            { label: 'Business Name', name: 'businessName' },
                                            { label: 'Phone', name: 'phone' },
                                            { label: 'Email', name: 'email' },
                                            { label: 'Branch', name: 'branch', options: branches },
                                            { label: 'Priority', name: 'priority', options: priorities },
                                            { label: 'Source', name: 'source', options: sources },
                                            { label: 'Deal Value', name: 'dealValue' },
                                            { label: 'Assigned To', name: 'assignedTo', options: ['Arjun S', 'Divya M', 'Karthik R'] },
                                            { label: 'Requirements', name: 'requirements' },
                                        ].map((field) => (
                                            <div key={field.name} className="flex flex-col gap-2">
                                                <p className="text-gray-600 text-[12px]">{field.label}</p>

                                                {field.options ? (
                                                    <select
                                                        value={formData[field.name]}
                                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                                        className={`border px-2 h-10 w-full text-[12px] rounded focus:ring-2 focus:outline-none
                                                            ${fieldErrors[field.name]
                                                                ? 'border-red-400 focus:ring-red-300'
                                                                : 'focus:ring-green-400'
                                                            }`}
                                                    >
                                                        <option value="">Select {field.label}</option>
                                                        {field.options.map((opt) => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={field.name === 'dealValue' ? 'number' : 'text'}
                                                        value={formData[field.name]}
                                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                                        placeholder={`Enter ${field.label}`}
                                                        className={`border px-2 h-10 w-full text-[12px] rounded focus:ring-2 focus:outline-none
                                                            ${fieldErrors[field.name]
                                                                ? 'border-red-400 focus:ring-red-300'
                                                                : 'focus:ring-green-400'
                                                            }`}
                                                    />
                                                )}

                                                {/* Inline field error message */}
                                                {fieldErrors[field.name] && (
                                                    <p className="text-red-500 text-[11px] -mt-1">
                                                        {fieldErrors[field.name]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}

                                        <div className="col-span-2 flex justify-end gap-2 mt-2">
                                            <button
                                                className="px-4 py-2 bg-gray-300 text-gray-700 text-[12px] rounded hover:bg-gray-400 transition"
                                                onClick={closeModal}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-green-500 text-white text-[12px] rounded hover:bg-green-600 transition"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddLead