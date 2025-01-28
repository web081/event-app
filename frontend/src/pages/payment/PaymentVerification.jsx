import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import backendURL from "../../config";

// Venue?

const PaymentVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const reference = params.get("reference");

        if (!reference) {
          throw new Error("No payment reference found");
        }

        // Changed to match backend route
        const response = await axios.get(
          `${backendURL}/api/payment/verify?reference=${reference}`
        );

        // Get booking details to confirm status
        const bookingResponse = await axios.get(
          `${backendURL}/api/payment/booking/${reference}`
        );

        if (bookingResponse.data.paymentStatus === "completed") {
          navigate(`/payment/success?reference=${reference}`);
        } else {
          navigate(`/payment/failed?reference=${reference}`);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setError(error.message);
        setTimeout(() => {
          navigate("/payment/failed");
        }, 3000);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <p className="text-gray-600">Redirecting to payment failed page...</p>
        </div>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Verifying your payment...</h2>
          <p className="text-gray-600">Please don't close this window</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentVerification;
