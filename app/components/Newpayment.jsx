
"use client";

import { useState, useEffect } from 'react';
import { usePayment } from '@/hooks/usePayment';

const NewPayment = () => {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isTdsChecked, setIsTdsChecked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { createPayment, loading, error } = usePayment();

  const clients = [
    { id: "69b8fbfff41f24b2a43cd231", name: "Aman" },
    { id: "69b8fbfff41f24b2a43cd232", name: "Rahul" },
    { id: "69b8fbfff41f24b2a43cd233", name: "Pawan" },
    { id: "69b8fbfff41f24b2a43cd234", name: "Chaman" },
    { id: "69b8fbfff41f24b2a43cd235", name: "Suraj" },
  ];

  const [formdata, setFormData] = useState({
    dateReceived: '',
    invoiceNumber: "",
    client: "",
    project: '',
    amountReceived: "",
    paymentMode: "",
    tdsClient: 0,
    remarks: '',
  });

  useEffect(() => { setMounted(true); }, []);


  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);


  useEffect(() => {
    const handleClickOutside = () => {
      setIsClientDropdownOpen(false);
      setIsPaymentDropdownOpen(false);
    };
    if (isClientDropdownOpen || isPaymentDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isClientDropdownOpen, isPaymentDropdownOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const errors = {};
    if (!formdata.dateReceived) errors.dateReceived = 'Date is required';
    if (!formdata.client) errors.client = 'Client is required';
    if (!formdata.amountReceived || Number(formdata.amountReceived) <= 0)
      errors.amountReceived = 'Enter a valid amount';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const payload = {
        ...formdata,
        amountReceived: Number(formdata.amountReceived),
        tdsClient: Number(formdata.tdsClient || 0),

        dateReceived: new Date(formdata.dateReceived + 'T00:00:00').toISOString(),
      };

      const res = await createPayment(payload);
      console.log("Created:", res);

      setFormData({
        dateReceived: '',
        invoiceNumber: "",
        client: "",
        project: '',
        amountReceived: "",
        paymentMode: "",
        tdsClient: 0,
        remarks: '',
      });
      setFieldErrors({});
      setIsTdsChecked(false);
      closeModal();
    } catch (err) {

      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        const mapped = {};
        data.errors.forEach(e => { mapped[e.path] = e.msg; });
        setFieldErrors(mapped);
      }
      console.error(err);
    }
  };

  const openModal = () => {
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsClientDropdownOpen(false);
    setIsPaymentDropdownOpen(false);
    setIsTdsChecked(false);
    setFieldErrors({});
  };


  const FieldError = ({ name }) =>
    fieldErrors[name]
      ? <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors[name]}</p>
      : null;


  const errBorder = (name) =>
    fieldErrors[name] ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300';

  return (

    <div className="flex">
      <button
        onClick={openModal}
        className="px-1 h-8 py-2 bg-blue-600 text-[12px] font-bold text-white rounded hover:bg-blue-700 transition"
      >
        + Log New Payment
      </button>

      {mounted && isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-lg w-full max-w-[670px] max-h-[90vh] overflow-y-auto p-6 relative text-[10px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            <h2 className="font-bold mb-2 text-sm">💰 Log New Payment</h2>
            <hr className="mb-4" />

            <form onSubmit={handleSubmit}>
              <div className="space-y-3">


                <div className="flex justify-between gap-2">
                  <div className="w-1/2">
                    <label className="mb-1 block">Date Received *</label>
                    <input
                      type="date"
                      name="dateReceived"
                      value={formdata.dateReceived}
                      onChange={handleChange}
                      className={`w-full border px-2 py-1 rounded text-[11.5px] focus:outline-none focus:ring-2 ${errBorder('dateReceived')}`}
                    />
                    <FieldError name="dateReceived" />
                  </div>
                  <div className="w-1/2">
                    <label className="mb-1 block">Invoice Number</label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formdata.invoiceNumber}
                      placeholder="INV-2026-XXX"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded text-[11.5px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>


                <div>
                  <label className="mb-1 block">Client *</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsClientDropdownOpen(!isClientDropdownOpen);
                        setIsPaymentDropdownOpen(false);
                      }}
                      className={`w-full flex justify-between items-center bg-gray-100 px-3 py-1 rounded text-[11.5px] border ${errBorder('client')}`}
                    >
                      {clients.find(c => c.id === formdata.client)?.name || 'Select the client'}
                      <span>{isClientDropdownOpen ? '▲' : '▼'}</span>
                    </button>
                    {isClientDropdownOpen && (
                      <ul className="absolute left-0 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto z-50">
                        {clients.map((client) => (
                          <li key={client.id}>
                            <button
                              type="button"
                              className={`w-full text-left px-3 py-1 hover:bg-blue-100 text-[11px] ${formdata.client === client.id ? 'font-semibold text-blue-600 bg-blue-50' : ''}`}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, client: client.id }));
                                setFieldErrors(prev => ({ ...prev, client: '' }));
                                setIsClientDropdownOpen(false);
                              }}
                            >
                              {client.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <FieldError name="client" />
                </div>


                <div>
                  <label className="mb-1 block">Project / Scope</label>
                  <input
                    type="text"
                    name="project"
                    value={formdata.project}
                    placeholder="e.g. Website Development"
                    onChange={handleChange}
                    className="w-full border px-3 py-1 rounded text-[11.5px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>


                <div className="flex justify-between gap-2">
                  <div className="w-1/2">
                    <label className="mb-1 block">Amount Received (₹) *</label>
                    <input
                      type="number"
                      name="amountReceived"
                      value={formdata.amountReceived}
                      placeholder="0"
                      onChange={handleChange}
                      className={`w-full border px-3 py-1 rounded text-[11.5px] focus:outline-none focus:ring-2 ${errBorder('amountReceived')}`}
                    />
                    <FieldError name="amountReceived" />
                  </div>
                  <div className="w-1/2">
                    <label className="mb-1 block">Payment Mode</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
                          setIsClientDropdownOpen(false);
                        }}
                        className="w-full flex justify-between items-center bg-gray-100 px-3 py-1 rounded text-[11.5px] border border-gray-300"
                      >
                        {formdata.paymentMode || "Select Mode"}
                        <span>{isPaymentDropdownOpen ? '▲' : '▼'}</span>
                      </button>
                      {isPaymentDropdownOpen && (
                        <ul className="absolute left-0 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto z-50">
                          {['NEFT', 'RTGS', 'UPI', 'Cheque', 'Cash', 'IMPS', 'WIRE'].map((mode) => (
                            <li key={mode}>
                              <button
                                type="button"
                                className={`w-full text-left px-3 py-1 hover:bg-blue-100 text-[11.5px] ${formdata.paymentMode === mode ? 'font-semibold text-blue-600 bg-blue-50' : ''}`}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, paymentMode: mode }));
                                  setIsPaymentDropdownOpen(false);
                                }}
                              >
                                {mode}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>


                <div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="tds-checkbox"
                      className="w-3 h-3 border rounded focus:ring-2 focus:ring-blue-400"
                      checked={isTdsChecked}
                      onChange={(e) => {
                        setIsTdsChecked(e.target.checked);
                        if (!e.target.checked) {
                          setFormData(prev => ({ ...prev, tdsClient: 0 }));
                        }
                      }}
                    />
                    <label htmlFor="tds-checkbox" className="ml-2 text-[11.5px] font-medium">
                      TDS Deducted by Client?
                    </label>
                  </div>
                  {isTdsChecked && (
                    <div>
                      <label className="block text-[11.5px] font-medium mb-1">TDS Amount (₹)</label>
                      <input
                        type="number"
                        name="tdsClient"
                        value={formdata.tdsClient}
                        onChange={handleChange}
                        placeholder="Enter TDS amount"
                        className="w-full border px-3 py-1 rounded text-[11.5px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                  )}
                </div>


                <div>
                  <label className="block text-[11.5px] font-medium mb-1">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formdata.remarks}
                    placeholder="Any notes about this payment"
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded text-[11.5px] h-20 resize-y focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>


                <div className="flex justify-end gap-3 mt-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-[11.5px]"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-[11.5px] hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Payment"}
                  </button>
                </div>

                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

  );
};

export default NewPayment;