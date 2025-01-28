import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Loader2, AlertCircle, Ticket } from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import backendURL from "../config";

const TicketCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    type: "default",
    message: "",
  });
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setCheckoutData({
        fullName: userInfo.username || "",
        email: userInfo.email || "",
        phoneNumber: "",
      });
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

  const calculateTotal = () => {
    if (!event) return 0;
    return event.price * ticketQuantity;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= event.ticketPurchaseLimit) {
      setTicketQuantity(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentData = {
        email: checkoutData.email,
        amount: calculateTotal() * 100,
        metadata: {
          eventId: id,
          quantity: ticketQuantity,
          fullName: checkoutData.fullName,
          phoneNumber: checkoutData.phoneNumber,
        },
      };

      const response = await fetch(
        `${backendURL}/api/tickets/payment/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await response.json();

      if (data.status && data.authorization_url) {
        localStorage.setItem(
          "ticketCheckoutData",
          JSON.stringify({
            eventId: id,
            quantity: ticketQuantity,
            ...checkoutData,
          })
        );

        window.location.href = data.authorization_url;
      } else {
        throw new Error(data.message || "Payment initialization failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
              onClick={() => navigate(`/event/${id}`)}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Tickets
                  </label>
                  <select
                    value={ticketQuantity}
                    onChange={handleQuantityChange}
                    className="w-full p-3 border rounded-md"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name *"
                    value={checkoutData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address *"
                    value={checkoutData.email}
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
                    value={checkoutData.phoneNumber}
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
                  disabled={loading}
                  className="w-full py-3 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
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
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Ticket className="w-4 h-4" />
                  <span>{event?.ticketName}</span>
                </div>
                <div className="flex justify-between">
                  <span>{ticketQuantity} x Ticket(s)</span>
                  <span>₦{(event?.price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Processing Fee</span>
                  <span>₦0.00</span>
                </div>
                <div className="pt-4 border-t flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {alert.show && (
        <Alert
          variant={alert.type}
          show={alert.show}
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          autoClose={true}
          autoCloseTime={5000}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{alert.message}</span>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default TicketCheckout;
