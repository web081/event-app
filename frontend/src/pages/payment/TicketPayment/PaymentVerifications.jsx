import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  XCircle,
  Home,
  RefreshCw,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import backendURL from "../../../config";

const TicketPaymentVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const verificationAttempted = React.useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      // Prevent multiple verification attempts
      if (verificationAttempted.current) {
        return;
      }
      verificationAttempted.current = true;

      const params = new URLSearchParams(location.search);

      try {
        const reference = params.get("reference") || params.get("trxref");
        if (!reference) {
          throw new Error("No payment reference found");
        }

        const response = await axios.get(
          `${backendURL}/api/tickets/payment/verify`,
          {
            params: { reference },
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );

        if (response.data.status) {
          navigate(`/tickets/success?reference=${reference}`);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        const errorMessage = error.response?.data?.message || error.message;
        const reference = params.get("reference");
        setError(errorMessage);
        navigate(
          `/tickets/failed?reference=${reference}&error=${encodeURIComponent(
            errorMessage
          )}`
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [location, navigate, userInfo]);

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

const TicketPaymentSuccess = () => {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const reference = params.get("reference");

        if (!reference) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          `${backendURL}/api/tickets/reference/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );
        setTicketDetails(response.data.tickets);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
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
            Ticket Purchase Successful!
          </h1>

          <p className="text-gray-600 mb-8">
            Your tickets have been confirmed. You will receive a confirmation
            email shortly.
          </p>

          {ticketDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold mb-4">Ticket Details</h2>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Event:</span>{" "}
                  {ticketDetails[0].eventId.title}
                </p>
                <p>
                  <span className="text-gray-600">Quantity:</span>{" "}
                  {ticketDetails.length} ticket(s)
                </p>
                <p>
                  <span className="text-gray-600">Ticket IDs:</span>{" "}
                  {ticketDetails.map((ticket) => ticket.ticketId).join(", ")}
                </p>
                <p>
                  <span className="text-gray-600">Reference:</span>{" "}
                  {ticketDetails[0].paymentReference}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/tickets")}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View My Tickets <ArrowRight className="w-4 h-4" />
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

const TicketPaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const reference = params.get("reference");
  const error = params.get("error");

  const handleRetry = () => {
    // Navigate back to the event page
    const eventId = localStorage.getItem("lastEventId");
    if (eventId) {
      navigate(`/events/${eventId}`);
    } else {
      navigate("/events");
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
            Ticket Purchase Failed
          </h1>

          <p className="text-gray-600 mb-4">
            We couldn't process your ticket purchase successfully.
          </p>

          {error && (
            <p className="text-sm text-red-500 mb-4">
              {decodeURIComponent(error)}
            </p>
          )}

          {reference && (
            <p className="text-sm text-gray-500 mb-8">Reference: {reference}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/events")}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Browse Events <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TicketPaymentVerification, TicketPaymentSuccess, TicketPaymentFailed };
