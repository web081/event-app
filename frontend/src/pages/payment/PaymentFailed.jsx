// PaymentFailed.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { XCircle, RefreshCcw, Home } from "lucide-react";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const reference = params.get("reference");

  const handleRetry = () => {
    // Navigate back to the booking page
    const venueId = localStorage.getItem("lastBookingVenueId");
    if (venueId) {
      navigate(`/bookVenue/${venueId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>

          <p className="text-gray-600 mb-4">
            We couldn't process your payment successfully.
          </p>

          {reference && (
            <p className="text-sm text-gray-500 mb-8">Reference: {reference}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again <RefreshCcw className="w-4 h-4" />
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
export default PaymentFailed;
