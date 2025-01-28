import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Building,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { Card, CardContent, CardHeader } from "@mui/material";
import backendURL from "../config";

const VenueInterestPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    eventDate: "",
    timeSlot: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });

  useEffect(() => {
    console.log("Venue ID:", id);
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendURL}/api/getVenueById/${id}`);
        const data = await response.json();
        setVenue(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching venue details:", error);
        setSubmitStatus({
          type: "error",
          message: "Failed to load venue details. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id]);

  const handleAlertShow = (status) => {
    setSubmitStatus(status);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Updated handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userInfo?.token) {
        handleAlertShow({
          type: "error",
          message: "Please login to submit an interest request",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const formattedDate = new Date(formData.eventDate).toISOString();

      const response = await fetch(`${backendURL}/api/createVenueInterest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          venueId: id,
          ...formData,
          eventDate: formattedDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit interest");
      }

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        eventDate: "",
        timeSlot: "",
        message: "",
      });

      handleAlertShow({
        type: "success",
        message:
          "Your interest has been submitted successfully! We will contact you shortly.",
        variant: "success", // This should match one of the variant options
      });
    } catch (error) {
      console.error("Interest submission error:", error);
      handleAlertShow({
        type: "error",
        message:
          error.message || "Failed to submit interest. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !venue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  const timeSlots = [
    { value: "morning", label: "Morning (6AM - 12PM)" },
    { value: "afternoon", label: "Afternoon (12PM - 4PM)" },
    { value: "evening", label: "Evening (4PM - 10PM)" },
    { value: "fullday", label: "Full Day" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {showAlert && (
          <>
            <Alert
              variant={submitStatus.variant}
              show={showAlert}
              onClose={handleAlertClose}
              autoClose={true}
              autoCloseTime={5000}
            >
              <AlertDescription>{submitStatus.message}</AlertDescription>
            </Alert>
          </>
        )}
        <div className="my-2 text-2xl font-bold text-center text-black">
          Venue Interest Form
        </div>
        <Card>
          <CardContent>
            <p className="text-center mb-4">
              Please input your active number (WhatsApp number preferable) and
              email address. We will reach out to you as soon as possible for
              more information concerning the venue.
            </p>
            {venue && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">Event Name:</span>
                  <span className="font-medium">{venue.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Initial Payment:</span>
                  <span className="font-medium">
                    ₦{venue.pricingDetails.initialPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Total Amount:</span>
                  <span className="font-medium">
                    ₦{venue.pricingDetails.totalpayment.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* call button */}
            <div className="flex justify-end">
              <div className="md:ml-4 mt-4 md:mt-0">
                <h2 className="text-xl font-bold text-center">Urgent?</h2>
                <a
                  href={`tel:${"07062916027"}`}
                  className="w-auto text-md px-2 text-red-800 hover:underline hover:font-bold  hover:text-red-800  ease-in-out duration-300 py-2 rounded-md  transition-colors animate-pulse flex items-center justify-center"
                >
                  <Phone className="w- 4 h-4 mr-2" />
                  Call Us Now
                </a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <form onSubmit={handleSubmit} className="space-y-6 md:w-full">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4" />
                      Event Date
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      required
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4" />
                      Preferred Time Slot
                    </label>
                    <select
                      name="timeSlot"
                      required
                      value={formData.timeSlot}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      rows={4}
                      placeholder="Any specific requirements or questions?"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    "Submit Interest"
                  )}
                </button>
              </form>
            </div>

            <div className="text-center mt-24">
              <h2 className="text-xl font-bold text-center mt-8">
                Confirmed Venue Availability?
              </h2>
              <p className="text-center mb-4">
                Proceed to payment to secure your booking.
              </p>
              <button className="relative flex mx-auto items-center justify-center w-auto px-4 py-2 text-white font-bold rounded-md bg-Blud transition duration-300 group overflow-hidden border border-transparent group-hover:border-hoverBtn">
                <span className="relative z-10 transition-colors group-hover:text-hoverBtn">
                  Proceed to Payment
                </span>
                <ChevronRight className="relative z-10 w-5 h-5 ml-2 transition-colors group-hover:text-hoverBtn" />
                <span className="absolute inset-0 w-full h-full bg-white rounded-md transform scale-0 transition-transform group-hover:scale-100"></span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VenueInterestPage;
