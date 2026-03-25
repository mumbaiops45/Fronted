
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils/axiosInstance';

const ShowPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/payments`)
      .then((response) => {
        setPayments(response.data.payments);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching payments:', err);
        setError('Failed to fetch payments.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500 text-center mt-4">Loading payments...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  

  return (
   

    <div className="p-2 max-w-7xl mx-auto">
  <h1 className="text-xl font-bold mb-3 text-center text-gray-900">
    Payments Log 
  </h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {payments.length === 0 ? (
      <p className="col-span-full text-center text-gray-500 italic">
        No payments found.
      </p>
    ) : (
      payments.map((payment) => (
        <div
          key={payment._id}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-transform transform hover:-translate-y-1"
        >
          
          <h2 className="font-extrabold text-[14px] mb-4 text-indigo-600">
            Invoice: {payment.invoiceNumber}
          </h2>
          <p className="mb-2">
            <span className="font-bold text-[14px] text-gray-700">Client:</span>{" "}
            <span className="text-gray-900 text-[14px]">{payment.client}</span>
          </p>
          
          <p className="mb-4">
            <span className="font-bold text-[14px] text-gray-700">Project:</span>{" "}
            <span className="text-gray-900 text-[14px]">{payment.project}</span>
          </p>

          
          <p className="mb-2  text-[14px] flex items-center gap-2">
            <span className="font-bold text-[14px] text-gray-700">Amount : ₹</span>
            <span>{payment.amountReceived}</span>
          </p>

          
          <p className="mb-4">
            <span className="font-bold text-[14px] text-gray-700">TDS:</span>{" "}
            <span className="text-gray-900">₹{payment.tdsClient}</span>
          </p>

         
          <p className="mb-4">
            <span className="font-bold text-[14px] text-gray-700">Payment Mode:</span>{" "}
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                payment.paymentMode === "NEFT"
                  ? "bg-green-100 text-green-800"
                  : payment.paymentMode === "Cash"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {payment.paymentMode}
            </span>
          </p>

          
          <p className="mb-4 text-gray-600 text-sm italic">
            <span className="font-semibold text-gray-700">Date Received:</span>{" "}
            {new Date(payment.dateReceived).toLocaleString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          
          {payment.remarks && (
            <p className="text-gray-700 border-t pt-3 mt-3 text-sm">
              <span className="font-semibold">Remarks:</span> {payment.remarks}
            </p>
          )}
        </div>
      ))
    )}
  </div>
</div>
  );
};

export default ShowPayment;