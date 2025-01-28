import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import backendURL from "../config";

const FreeTicketRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phoneNumber: "",
  });

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      const [firstName, ...lastNameParts] = (userInfo.username || "").split(
        " "
      );
      setRegistrationData((prev) => ({
        ...prev,
        firstName: firstName || "",
        lastName: lastNameParts.join(" ") || "",
        email: userInfo.email || "",
        confirmEmail: userInfo.email || "",
      }));
    }
    fetchEventDetails();
  }, [id, userInfo]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`${backendURL}/api/getEventById/${id}`);
      const data = await response.json();
      if (!data) throw new Error("Event not found");
      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any existing error/success messages when user starts typing
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${backendURL}/api/tickets/register-free`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({
          eventId: id,
          ...registrationData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Registration failed");
      }

      if (data.status) {
        setSuccess(
          "Registration successful! You will receive a confirmation email shortly."
        );
        // Optional: Redirect after a short delay
        setTimeout(() => {
          navigate(`/singEvenPage/${id}`);
        }, 5000);
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      setError(
        err.message || "Failed to complete registration. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Form */}
          <div className="flex-1">
            <button
              onClick={() => navigate(`/singEvenPage/${id}`)}
              className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to event
            </button>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-6">Checkout</h1>
              {error && (
                <Alert
                  variant="destructive"
                  show={!!error}
                  onClose={() => setError(null)}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </div>
                </Alert>
              )}

              {success && (
                <Alert
                  variant="success"
                  show={!!success}
                  onClose={() => setSuccess(null)}
                >
                  <div className="flex items-center gap-2 bg-amber-300 p-3 rounded-md">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </div>
                </Alert>
              )}

              <div className="text-sm text-gray-600 mb-6">
                Registration requires a VALID cell number as we send out event
                reminders and the link to attend via text. This way, you won't
                miss out on any important updates!
              </div>

              <h2 className="text-xl font-semibold mb-4">
                Contact information
              </h2>

              <div className="mb-4">
                <button className="text-blue-600 hover:text-blue-800">
                  Log in
                </button>
                <span className="text-gray-600 ml-2">
                  for a faster experience.
                </span>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name *"
                      value={registrationData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name *"
                      value={registrationData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address *"
                    value={registrationData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="confirmEmail"
                    placeholder="Confirm email *"
                    value={registrationData.confirmEmail}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone number *"
                    value={registrationData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-gray-600">
                      Keep me updated on more events and news from this event
                      organizer.
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-gray-600">
                      Send me emails about the best events happening nearby or
                      online.
                    </span>
                  </label>
                </div>

                <div className="text-sm text-gray-600">
                  By selecting Register, I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Terms of Service
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right side - Order summary */}
          <div className="w-full md:w-96">
            <div className="bg-white rounded-lg shadow-md p-6">
              {event?.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-lg font-semibold mb-4">Order summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>1 x Reserved Seating</span>
                  <span>#0.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>#0.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>1 x eTicket</span>
                  <span>#0.00</span>
                </div>
                <div className="pt-4 border-t flex justify-between font-semibold">
                  <span>Total</span>
                  <span>#0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTicketRegistration;
