// PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import axios from "axios";
import backendURL from "../../config";

const PaymentSuccess = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const reference = params.get("reference");

        if (!reference) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          `${backendURL}/api/booking/${reference}`
        );
        setBookingDetails(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-8">
            Your venue booking has been confirmed. You will receive a
            confirmation email shortly.
          </p>

          {bookingDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold mb-4">Booking Details</h2>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Reference:</span>{" "}
                  {bookingDetails.paymentReference}
                </p>
                <p>
                  <span className="text-gray-600">Amount Paid:</span> ₦
                  {(bookingDetails.amount / 100).toLocaleString()}
                </p>
                <p>
                  <span className="text-gray-600">Event Date:</span>{" "}
                  {new Date(bookingDetails.eventDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/User/DashBoard")}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Bookings <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Return Home <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
