import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Loader,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import backendURL from "../config";
import { Alert, AlertDescription } from "../components/tools/Alert";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [alertInfo, setAlertInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent");
    if (consentGiven === null) {
      setShowCookieConsent(true);
    }
  }, []);

  useEffect(() => {
    if (alertInfo) {
      setShowModal(true);
      const timer = setTimeout(() => {
        setShowModal(false);
        setAlertInfo(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlertInfo({
        message: "Please enter a valid email address.",
        variant: "destructive",
        icon: AlertCircle,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/newsletter-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertInfo({
          message: "Subscription successful!",
          variant: "success",
          icon: CheckCircle,
        });
        setEmail("");
      } else {
        setAlertInfo({
          message: data.message || "An error occurred. Please try again.",
          variant: data.message.includes("already subscribed")
            ? "warning"
            : "destructive",
          icon: AlertCircle,
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Error during subscription:", error);
      setAlertInfo({
        message: "An error occurred. Please try again.",
        variant: "destructive",
        icon: AlertCircle,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCookieConsent = (consent) => {
    localStorage.setItem("cookieConsent", consent);
    setShowCookieConsent(false);
  };

  return (
    <footer className="bg-Blud text-white">
      <div className="max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-5">
          {/* Top Section with Logo and Newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="flex flex-col items-center lg:items-start">
              <img
                src="/path/to/logo.png"
                alt="Site Logo"
                className="h-12 mb-4"
              />
              <p className="text-gray-300 text-center lg:text-left max-w-md">
                Discover and create memorable events that inspire. Join our
                community of event enthusiasts.
              </p>
            </div>

            {/* Newsletter Section */}
            <div className="flex flex-col items-center lg:items-end">
              <div className="w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-center lg:text-right">
                  Subscribe to Our Newsletter
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-btColour"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-btColour text-white rounded hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin" size={16} />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/venues"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Venues
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ticketing"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Ticketing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/event-services"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Event Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/event-showcase"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Event Showcase
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blacklist"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Blacklist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/contact-us"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-gray-300 transition-colors"
                  >
                    About
                  </Link>
                </li>
                {userInfo?.role === "admin" && (
                  <li>
                    <Link
                      to="/DashBoard"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-300 transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-300 mb-4 sm:mb-0">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/terms"
                className="text-sm text-gray-300 hover:text-white"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-300 hover:text-white"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-gray-300 hover:text-white"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Cookie Consent */}
        {showCookieConsent && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-center sm:text-left">
                  Our site uses essential cookies to work. By continuing to use
                  this site, you consent to our use of cookies.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleCookieConsent("accepted")}
                    className="px-4 py-2 bg-btColour text-white rounded hover:bg-opacity-90 transition-colors text-sm"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => handleCookieConsent("declined")}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                  >
                    Decline All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal Component */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {alertInfo && (
          <Alert variant={alertInfo.variant} className="m-0">
            <div className="flex items-center gap-2">
              {alertInfo.icon && (
                <alertInfo.icon className="h-5 w-5 flex-shrink-0" />
              )}
              <AlertDescription>{alertInfo.message}</AlertDescription>
            </div>
          </Alert>
        )}
      </Modal>
    </footer>
  );
};

export default Footer;
