import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Building2,
  Clock,
  Users,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Alert } from "../components/tools/Alert";
import backendURL from "../config";

const BookVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    eventDate: "",
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if not logged in
    if (!userInfo) {
      navigate("/login", { state: { from: `/bookVenue/${id}` } });
      return;
    }
    // Create axios instance with auth header
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Fetch venue details
    const fetchVenue = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/getVenueById/${id}`,
          axiosConfig
        );
        setVenue(response?.data);
        console.log(response?.data.title, "response.data");
        // Pre-fill user data if available
        setBookingData((prev) => ({
          ...prev,
          fullName: userInfo.username || "",
          email: userInfo.email || "",
          phoneNumber: userInfo.phoneNumber || "",
        }));
      } catch (error) {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          navigate("/login", { state: { from: `/book-venue/${id}` } });
          return;
        }
        showAlert(
          error.response?.data?.message || "Error fetching venue details",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id, userInfo, navigate]);

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!bookingData.eventDate) {
      showAlert("Please fill in all required fields", "error");
      setLoading(false);
      return;
    }

    try {
      // In your BookVenue component, before initializing payment:
      localStorage.setItem("lastBookingVenueId", id);
      const paymentData = {
        email: bookingData.email,
        amount: venue.pricingDetails.initialPayment * 100,
        metadata: {
          venueId: id,
          userId: userInfo._id,
          eventDate: bookingData.eventDate,
          fullName: bookingData.fullName,
          phoneNumber: bookingData.phoneNumber,
        },
      };

      console.log("Sending payment data:", paymentData);

      const response = await axios.post(
        `${backendURL}/api/initialize`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment initialization response:", response.data);

      if (response.data.status && response.data.authorization_url) {
        showAlert("Redirecting to payment page...", "info");

        // Use window.location.href for more reliable redirect
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error(
          response.data.message || "Invalid payment URL received"
        );
      }
    } catch (error) {
      console.error("Payment initialization error:", error);

      if (error.response?.status === 401) {
        navigate("/login", { state: { from: `/book-venue/${id}` } });
        return;
      }

      showAlert(
        error.response?.data?.message ||
          error.message ||
          "Payment initialization failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Booking details</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Venue Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{venue.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Capacity: {venue.capacity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Duration: {venue.duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  {venue.address.area}, {venue.address.state}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <h3 className="font-semibold mb-2">Pricing</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Initial Payment: ₦
                  {venue.pricingDetails.initialPayment.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Total Amount: ₦
                  {venue.pricingDetails.totalpayment.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Payment Duration: {venue.pricingDetails.duration}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Booking Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={bookingData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={bookingData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={bookingData.eventDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-auto mt-6 py-2 px-4 bg-hoverBtn text-white rounded-md transition duration-300 group overflow-hidden border border-transparent group-hover:border-hoverBtn disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span
                className={`relative z-10 ${
                  loading
                    ? "opacity-50"
                    : "transition-colors group-hover:text-hoverBtn group-hover:font-bold"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </span>
              <span className="absolute inset-0 w-full h-full bg-white rounded-md transform scale-0 transition-transform group-hover:scale-100"></span>
            </button>
          </form>
        </div>
      </div> */}
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
            Booking Details
          </h1>

          {/* Venue Details Card */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Venue Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{venue?.title}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  Capacity: {venue?.capacity}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  Duration: {venue?.duration}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {venue?.address?.area}, {venue?.address?.state}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold mb-3 text-gray-800">
                Pricing Details
              </h3>
              <div className="space-y-2 text-sm sm:text-base">
                <p className="text-gray-700">
                  Initial Payment: ₦
                  {venue?.pricingDetails?.initialPayment?.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  Total Amount: ₦
                  {venue?.pricingDetails?.totalpayment?.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  Payment Duration: {venue?.pricingDetails?.duration}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Booking Information
            </h2>

            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={bookingData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={bookingData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={bookingData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-auto mt-6 py-2 px-4 bg-hoverBtn text-white rounded-md transition duration-300 group overflow-hidden border border-transparent group-hover:border-hoverBtn disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span
                className={`relative z-10 ${
                  loading
                    ? "opacity-50"
                    : "transition-colors group-hover:text-hoverBtn group-hover:font-bold"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </span>
              <span className="absolute inset-0 w-full h-full bg-white rounded-md transform scale-0 transition-transform group-hover:scale-100"></span>
            </button>
          </form>
        </div>
      </div>
      {alert.show && (
        <Alert severity={alert.type} className="mb-6">
          {alert.message}
        </Alert>
      )}
    </>
  );
};

export default BookVenue;
