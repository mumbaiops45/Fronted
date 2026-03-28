"use client"

import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { AiFillEye, AiOutlineArrowDown } from "react-icons/ai";
import axios from "axios";
import UploadDoc from "../components/uploadDoc";
import { BASE_URL } from "@/utils/axiosInstance";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = { month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const predefinedClients = [
  "Meera Textiles",
  "Sri Krishna Hotel",
  "Ravi Kumar Foods",
];


const categories = [
  { name: "All", color: "#0066ff" },
  { name: "Invoice", color: "#3ac47d" },
  { name: "Quotation", color: "#4a90e2" },
  { name: "MoM", color: "#f0ad4e" },
  { name: "Client Input", color: "#b584f6" },
];

const Page = () => {
  const [documents, setDocuments] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedClient, setSelectedClient] = useState("");
  const [clientsList, setClientsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [stats, setStats] = useState({
    Invoice: 0,
    Quotation: 0,
    MoM: 0,
    "Client Input": 0
  });

  const [previewUrl, setPreviewUrl] = useState(null);


  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }
      const response = await axios.get(`${BASE_URL}/viewdocument`, {
        headers: {
          "auth-token": token
        }
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setDocuments(response.data.data);


        const newStats = {
          Invoice: 0,
          Quotation: 0,
          MoM: 0,
          "Client Input": 0
        };

        response.data.data.forEach(doc => {
          if (newStats.hasOwnProperty(doc.docType)) {
            newStats[doc.docType] = (newStats[doc.docType] || 0) + 1;
          }
        });

        setStats(newStats);

        const uniqueClientsFromApi = Array.from(
          new Set(response.data.data.map((doc) => doc.lead?.businessName).filter(Boolean))
        );

        const combinedClients = Array.from(new Set([...predefinedClients, ...uniqueClientsFromApi]));

        const clientsDropdown = combinedClients.map((businessName) => ({
          value: businessName,
          label: businessName,
        }));


        setClientsList([{ value: "", label: "All Clients" }, ...clientsDropdown]);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);

      if (err.response) {
        alert(`Failed to fetch documents: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        alert("No response from server. Please check if the server is running.");
      } else {
        alert(`Failed to fetch documents: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };


  const fetchDocumentCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.get(`${BASE_URL}/countdocument`, {
        headers: {
          "auth-token": token
        }
      });


    } catch (err) {
      console.error("Error fetching document count:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchDocumentCount();
  }, []);


  const handleDownloadDocument = async (docId, fileName) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const doc = documents.find(d => d._id === docId);
      if (!doc) {
        alert("Document not found in local data");
        return;
      }

      let response;
      let endpointUsed = "";

      try {

        endpointUsed = `${BASE_URL}/download?docId=${docId}`;


        response = await axios.get(endpointUsed, {
          headers: {
            "auth-token": token
          },
          responseType: 'blob',
          timeout: 10000
        });

      } catch (error3) {
        console.log("Error details:", {
          status: error3.response?.status,
          statusText: error3.response?.statusText,
          data: error3.response?.data
        });

        throw new Error("All download attempts failed");
      }
      if (response.status !== 200) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

      if (!response.data || response.data.size === 0) {
        throw new Error("Downloaded file is empty");
      }
      const contentDisposition = response.headers['content-disposition'];
      let downloadFileName = fileName || 'document';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          downloadFileName = filenameMatch[1].replace(/['"]/g, '');
        }
      }


      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      alert("Document downloaded successfully!");

    } catch (err) {
      console.error("=== Download Failed ===");
      console.error("Error object:", err);

      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);

        let errorMessage = `Download failed (${err.response.status})`;


        if (err.response.data instanceof Blob) {

          const reader = new FileReader();
          reader.onload = () => {
            console.error("Error response text:", reader.result);
            try {
              const errorJson = JSON.parse(reader.result);
              errorMessage = errorJson.message || errorMessage;
            } catch (e) {
              errorMessage = reader.result || errorMessage;
            }
            alert(errorMessage);
          };
          reader.readAsText(err.response.data);
          return;
        } else {
          errorMessage = err.response.data?.message || err.response.statusText || errorMessage;
        }

        if (err.response.status === 401) {
          alert("Unauthorized. Please login again.");
        } else if (err.response.status === 404) {
          alert("Document not found. It may have been deleted.");
        } else if (err.response.status === 400) {
          alert(`Bad request: ${errorMessage}`);
        } else {
          alert(errorMessage);
        }

      } else if (err.request) {

        console.error("No response received:", err.request);
        alert("No response from server. Please check:\n1. Server is running on port 8080\n2. Network connection\n3. CORS configuration");

      } else {

        console.error("Request setup error:", err.message);
        alert(`Download failed: ${err.message}`);
      }

      console.error("Last attempted endpoint:", endpointUsed);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }
      const response = await axios.delete(`${BASE_URL}/${docId}`, {
        headers: {
          "auth-token": token
        }
      });

      if (response.data.success) {
        alert("Document deleted successfully!");
        fetchDocuments();
        fetchDocumentCount();
      } else {
        alert("Failed to delete document");
      }
    } catch (err) {
      console.error("Error deleting document:", err);

      if (err.response) {
        alert(`Failed to delete document: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        alert("No response from server. Please check if the server is running.");
      } else {
        alert(`Failed to delete document: ${err.message}`);
      }
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchCategory = activeCategory === "All" ? true : doc.docType === activeCategory;
    const matchClient = selectedClient ? doc.lead?.businessName === selectedClient : true;
    return matchCategory && matchClient;
  });


  const getDocTypeColor = (docType) => {
    switch (docType) {
      case "Invoice": return "#aee8ca";
      case "Quotation": return "#4a90e2";
      case "MoM": return "#f0ad4e";
      case "Client Input": return "#b584f6";
      default: return "#b584f6";
    }
  };


  const getDocTypeIcon = (docType) => {
    switch (docType) {
      case "Invoice": return "🧾";
      case "Quotation": return "📋";
      case "MoM": return "📝";
      case "Client Input": return "📥";
      default: return "📄";
    }
  };


  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  const handleFileDrop = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }


    const docType = activeCategory === "All" ? "Invoice" : activeCategory;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);

    setUploadStatus("loading");
    setUploadMessage(`Uploading "${file.name}"...`);

    try {
      const response = await axios.post(`${BASE_URL}/document`, formData, {
        headers: {
          "auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadStatus("success");
        setUploadMessage(`✅ "${file.name}" uploaded successfully as ${docType}!`);
        fetchDocuments();
        fetchDocumentCount();
        setTimeout(() => {
          setUploadStatus(null);
          setUploadMessage("");
        }, 3000);
      } else {
        setUploadStatus("error");
        setUploadMessage(`❌ Upload failed: ${response.data.message || "Unknown error"}`);
      }
    } catch (err) {
      setUploadStatus("error");
      setUploadMessage(`❌ Upload failed: ${err.response?.data?.message || err.message}`);
      setTimeout(() => {
        setUploadStatus(null);
        setUploadMessage("");
      }, 4000);
    }
  };

  function getTimeAgo(date) {
    const now = new Date();
    const uploaded = new Date(date);
    const diff = now - uploaded;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (seconds < 60) {
      return `Just now`;
    }
    if (minutes < 60) {
      return `${minutes}min ago`;
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    return `${days}d ago`;
  }

  // function lightenColor(color, percent = 20) {
  //   let colorHex = color;


  //   if (color.startsWith('rgb')) {
  //     colorHex = rgbToHex(color);
  //   }


  //   if (colorHex[0] === "#") {
  //     colorHex = colorHex.slice(1);
  //   }

  //   let r = parseInt(colorHex.substring(0, 2), 16);
  //   let g = parseInt(colorHex.substring(2, 4), 16);
  //   let b = parseInt(colorHex.substring(4, 6), 16);

  //   r = Math.round(r + (255 - r) * (percent / 100));
  //   g = Math.round(g + (255 - g) * (percent / 100));
  //   b = Math.round(b + (255 - b) * (percent / 100));

  //   return `rgb(${r}, ${g}, ${b})`;
  // }

  function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    return `#${((1 << 24) | (parseInt(result[0]) << 16) | (parseInt(result[1]) << 8) | parseInt(result[2]))
      .toString(16)
      .slice(1)}`;
  }

  const recentUploads = [...documents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="font-sans flex flex-col lg:flex-row gap-4 p-2 bg-gray-50 min-h-screen box-border text-xs">
      <div className="flex-1 p-4">
        <div className="flex flex-wrap gap-2 font-bold text-xs">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-2 py-1 rounded-md border-none cursor-pointer font-normal text-sm flex items-center gap-1.5 transition-all ${activeCategory === cat.name
                ? 'text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              style={{
                backgroundColor: activeCategory === cat.name ? cat.color : undefined
              }}
            >
              <span className="text-xl"> {getDocTypeIcon(cat.name)}</span>
              <span>{cat.name}  </span>
              <span className="ml-1">
                {cat.name === "All" ? documents.length : stats[cat.name] || 0}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center text-sm justify-start lg:justify-end" >
          <select
            id="client-select"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-2 py-1 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 w-32 h-7"
          >
            {clientsList.map((client) => (
              <option key={client.value} value={client.value}>
                {client.label}
              </option>
            ))}
          </select>
          <UploadDoc className="w-32 h-5" />
        </div>
        {loading ? (
          <div className=" py-10 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading documents...
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredDocuments.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-10">
                No documents found for selected filters.
              </p>
            )}

            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className="relative group bg-white rounded-xl p-4 shadow-md cursor-pointer flex flex-col gap-2 border border-transparent hover:border-blue-500 transform hover: -translate-y-1 transition-all duration-300"
                title={doc.description || ""}
              >

                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded hover:bg-green-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadDocument(doc._id, doc.originalName);
                    }}
                    title="Download Document"
                  >
                    <AiOutlineArrowDown />
                  </button>
                  <button
                    className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded hover:bg-red-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc._id);
                    }}
                    title="Delete Document"
                  >
                    <MdDelete />
                  </button>
                </div>
                <div
                  className="text-2xl"
                  style={{ color: getDocTypeColor(doc.docType) }}
                >
                  {getDocTypeIcon(doc.docType)}
                </div>
                <div className="font-bold text-[12px] truncate">{doc.originalName}</div>

                <div className="text-[12px] text-gray-500">
                  <div>{doc.lead?.businessName || 'Unknown'} . {doc.dealValue ? new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  }).format(doc.dealValue) : 'N/A'} .{formatDate(doc.docDate)}</div>
                </div>
                <div
                  className="self-start px-3 py-1 rounded-full text-[11px] font-bold text-green"
                  style={{
                    backgroundColor: getDocTypeColor(doc.docType)
                  }}
                >
                  {doc.docType}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".pdf,.docx,.xlsx,.zip,.jpg,.jpeg,.png,.gif,.bmp,.webp"
        onChange={(e) => {
          const files = Array.from(e.target.files);
          if (files.length > 0) handleFileDrop(files);
          e.target.value = "";
        }}
      />
      <aside className="w-full lg:w-80 flex flex-col gap-6 bg-white rounded-xl p-4 lg:p-5 shadow-md h-fit">
        {uploadStatus && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2 transition-all ${uploadStatus === "loading"
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : uploadStatus === "success"
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
              }`}
          >
            {uploadStatus === "loading" && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 flex-shrink-0"></div>
            )}
            <span>{uploadMessage}</span>
          </div>
        )}
        <p className="font-bold text-[14px]">Quick Upload</p>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center text-gray-500 cursor-pointer transition-colors ${uploadStatus === "loading"
            ? "border-blue-300 bg-blue-50 pointer-events-none"
            : "border-gray-300 hover:border-green-400 hover:bg-green-50"
            }`}
          onClick={() => {
            if (uploadStatus === "loading") return;
            document.getElementById("fileInput").click();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-green-400", "bg-green-50");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-green-400", "bg-green-50");
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-green-400", "bg-green-50");
            const files = Array.from(e.dataTransfer.files);
            handleFileDrop(files);
          }}
        >

          {uploadStatus === "loading" ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-sm text-blue-600 font-semibold">Uploading...</div>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2.5 text-gray-400">☁️</div>
              <div className="font-semibold text-lg mb-1.5 text-gray-600">
                Drop files here
              </div>
              <div className="text-[9px] mb-2 text-gray-400">
                or click to browse
                <br />
                PDF, DOCX, XLSX, ZIP, Images
              </div>
              <div className="text-[9px] text-gray-400 mb-2">
                Will upload as:{" "}
                <span
                  className="font-bold"
                  style={{
                    color: categories.find(c => c.name === activeCategory)?.color || "#3ac47d"
                  }}
                >
                  {activeCategory === "All" ? "Invoice" : activeCategory}
                </span>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="bg-[#3ac47d] rounded-full px-2 py-1 text-[9px] text-white">Invoice</span>
                <span className="bg-[#4a90e2] rounded-full px-2.5 py-1 text-[9px] text-white">Quotation</span>
                <span className="bg-[#f0ad4e] rounded-full px-2.5 py-1 text-[9px] text-white">MoM</span>
                <span className="bg-[#b584f6] rounded-full px-2.5 py-1 text-[9px] text-white">Client Input</span>
              </div>
            </>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-[12px] font-semibold">Document Stats</h2>
          {categories
            .filter((cat) => cat.name !== "All")
            .map((cat) => (
              <div
                key={cat.name}
                className="bg-green-50 rounded-xl  p-2.5 mb-2.5 flex items-center justify-between font-semibold"
                style={{ color: cat.color, boxShadow: `0 0 4px ${cat.color}50` }}
              >
                {/* , backgroundColor: lightenColor(cat.color) */}
                <span className="flex items-center gap-2 text-[12px]">
                  <span className="text-xl">{getDocTypeIcon(cat.name)}</span>
                  <span>{cat.name}</span>
                </span>
                {/* <span
                  className="text-white  rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  {stats[cat.name] || 0}
                </span> */}
                <span
                  className="w-7 h-7 flex items-center justify-center font-[800] text-[16px] font-syne "
                  style={{ color: cat.color}}
                >
                  {stats[cat.name] || 0}
                </span>
              </div>
            ))}
          <div className="bg-gray-100 rounded-xl p-2.5 mt-4 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-2 text-[12px]">
              <span>Total Storage</span>
            </span>
            <span className="bg-blue-600 text-white rounded-full w-16 h-7 flex items-center justify-center font-bold text-[12px]">
              12mb
            </span>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold">Recent Upload</h2>

          {recentUploads.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">No uploads yet</p>
          )}

          {recentUploads.map((doc, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-2.5 mb-2 flex items-center gap-3 shadow-sm border border-gray-100"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0  "
                style={{ backgroundColor: `${getDocTypeColor(doc.docType)}20` }}
              >
                {getDocTypeIcon(doc.docType)}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-[12px] truncate">{doc.originalName}</span>
                <span className="text-gray-400 text-[12px]">
                  {doc.uploadedBy?.name || doc.lead?.businessName || "Unknown"} • {getTimeAgo(doc.createdAt)}
                </span>
              </div>
              <span
                className="text-green rounded-full px-2 py-0.5 text-[9px] font-semibold flex-shrink-0"
                style={{ backgroundColor: getDocTypeColor(doc.docType) }}
              >
                {doc.docType}
              </span>
            </div>
          ))}
        </div>

      </aside>
    </div>
  );
};

export default Page;