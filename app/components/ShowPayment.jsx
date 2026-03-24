
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils/axiosInstance';

const ShowPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // axios.get('http://localhost:8080/payments')
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Payments List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No payments found.</p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg mb-2">Invoice: {payment.invoiceNumber}</h2>
              <p><span className="font-medium">Client:</span> {payment.client}</p>
              <p><span className="font-medium">Project:</span> {payment.project}</p>
              <p><span className="font-medium">Amount Received:</span> ₹{payment.amountReceived}</p>
              <p><span className="font-medium">TDS:</span> ₹{payment.tdsClient}</p>
              <p><span className="font-medium">Payment Mode:</span> {payment.paymentMode}</p>
              <p><span className="font-medium">Date Received:</span> {new Date(payment.dateReceived).toLocaleString()}</p>
              <p><span className="font-medium">Remarks:</span> {payment.remarks}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShowPayment;