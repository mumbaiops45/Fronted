"use client"

import React, { useState } from "react";
import axios from "axios";

const UploadDoc = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDocType, setSelectedDocType] = useState("");
    const [client, setClient] = useState("");
    const [docDate, setDocDate] = useState("");
    const [docName, setDocName] = useState("");
    const [docNotes, setDocNotes] = useState("");
    const [docFile, setDocFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const docTypes = [
        { key: "Invoice", name: "Invoice", desc: "Tax Invoice for closed deal", icon: "🧾" },
        { key: "Quotation", name: "Quotation", desc: "Proposal / price quote", icon: "📋" },
        { key: "MoM", name: "MoM", desc: "Minutes of Meeting notes", icon: "📝" },
        { key: "Client Input", name: "Client Input", desc: "Assets, content, brief from client", icon: "📥" },
    ];

    const validDocTypes = ["Invoice", "Quotation", "MoM", "Client Input"];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 25 * 1024 * 1024) {
            alert("File size should be less than 25MB");
            e.target.value = "";
            return;
        }
        setDocFile(file);
    };

    const resetForm = () => {
        setSelectedDocType("");
        setClient("");
        setDocDate("");
        setDocName("");
        setDocNotes("");
        setDocFile(null);
        const fileInput = document.getElementById("doc-file");
        if (fileInput) fileInput.value = "";
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedDocType) return alert("Please select a document type!");
        if (!docFile) return alert("Please select a file to upload!");
        if (!client) return alert("Please select a client/lead!");

        if (!validDocTypes.includes(selectedDocType)) {
            return alert(`Invalid document type. Valid types: ${validDocTypes.join(", ")}`);
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("leadId", client);
            formData.append("docType", selectedDocType);
            formData.append("description", docNotes || "");
            formData.append("documentDate", docDate || new Date().toISOString().split("T")[0]);
            formData.append("branch", "Bangalore");
            formData.append("invoiceAmount", "");
            formData.append("file", docFile);

            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return alert("Please login first");
            }

            const response = await axios.post("http://localhost:8080/document", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "auth-token": token,
                },
            });

            alert("Document uploaded successfully!");
            resetForm();
            setModalOpen(false);
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert("Upload failed. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
            >
                Upload Document
            </button>
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center  ">
                 <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
                        <button
                            onClick={() => { setModalOpen(false); resetForm(); }}
                            className="absolute top-2 right-[30px] text-gray-500 hover:text-gray-800 text-xl font-bold "
                        >
                            &times;
                        </button>
                        <form
                            onSubmit={handleUpload}
                            className="flex flex-col gap-6 p-6 bg-white rounded-xl w-full max-w-[700px] text-xs mx-auto max-h-[80vh] overflow-y-auto"
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
                                        <label htmlFor="client-select" className="text-gray-600 text-sm font-medium">
                                            Link to Client/Lead <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="client-select"
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
                                        <p className="text-xs text-gray-500 mt-1">Note: Lead ID must be a valid ObjectId</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="doc-date" className="text-gray-600 text-sm font-medium">Document Date</label>
                                        <input
                                            type="date"
                                            id="doc-date"
                                            value={docDate}
                                            onChange={(e) => setDocDate(e.target.value)}
                                            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="doc-name" className="text-gray-600 text-sm font-medium">Document Name / Reference</label>
                                    <input
                                        type="text"
                                        id="doc-name"
                                        value={docName}
                                        onChange={(e) => setDocName(e.target.value)}
                                        placeholder="e.g. INV-2026-057 or Project Kickoff"
                                        className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="doc-notes" className="text-gray-600 text-sm font-medium">Notes / Description</label>
                                    <textarea
                                        id="doc-notes"
                                        value={docNotes}
                                        onChange={(e) => setDocNotes(e.target.value)}
                                        placeholder="Optional context about this document"
                                        rows="3"
                                        className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="doc-file" className="text-gray-600 text-sm font-medium">
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
                                        required
                                    />
                                </div>
                            </div>


                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedDocType("");
                                        setClient("");
                                        setDocDate("");
                                        setDocName("");
                                        setDocNotes("");
                                        setDocFile(null);
                                        const fileInput = document.getElementById('doc-file');
                                        if (fileInput) fileInput.value = '';
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

                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadDoc;