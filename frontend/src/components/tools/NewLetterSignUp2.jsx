import React, { useState, useCallback, useEffect } from "react";
import { Modal, Button, Spinner } from "flowbite-react";
import { Alert, AlertDescription } from "./Alert";
import { Loader } from "lucide-react";
import backendURL from "../../config";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => {
        setAlertInfo(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const handleCloseAlert = () => {
    setAlertInfo(null);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch(`${backendURL}/api/newsletter-signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setAlertInfo({
            message: "Subscription successful!",
            variant: "success",
          });
          setEmail("");
          setShowModal(false);
        } else {
          setAlertInfo({
            message: data.message || "An error occurred. Please try again.",
            variant: data.message?.includes("already subscribed")
              ? "warning"
              : "destructive",
          });
        }
      } catch (error) {
        console.error("Newsletter signup error:", error);
        setAlertInfo({
          message: "An error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [email, backendURL]
  );

  return (
    <div className="hidden md:flex space-x-4">
      <div className="hidden md:flex space-x-4">
        <Button color="light">Newsletter</Button>
        <Button
          className="hover:bg-transparent hover:border hover:border-black hover:text-black"
          onClick={() => setShowModal(true)}
          color="dark"
        >
          Subscribe
        </Button>
      </div>

      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <Modal.Header>Subscribe to our Newsletter</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="mb-3">
              <label
                htmlFor="email-subscribe"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Subscribe to our newsletter
              </label>
              <input
                type="email"
                id="email-subscribe"
                autoComplete="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" size={20} />
                  <span>Subscribing...</span>
                </div>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {alertInfo && (
        <Alert variant={alertInfo.variant} onClose={handleCloseAlert}>
          <AlertDescription>{alertInfo.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NewsletterSubscription;
