import React, { useState } from "react";
import axios from "axios";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Spinner from "../components/tools/Spinner";
import EventImage from "../assets/Image/eventimage.png";
import backendURL from "../config";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}/api/forgot-password`, {
        email,
      });
      setMessage(response.data.message);
      setSnackbarSeverity("success");
      setEmail("");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Column (Form) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
          <div className="max-w-md w-full">
            <div className="text-center">
              <div className="text-center">
                <p className="mt-2  font-bold text-lg text-gray-600">
                  Forgot Password?
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Enter your email to reset your password
              </p>
            </div>

            <div className="max-w-md w-full ">
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out "
                  >
                    {loading ? <Spinner /> : "Reset Password"}
                  </button>
                </div>
              </form>

              {/* Snackbar for notifications */}
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity={snackbarSeverity}
                  sx={{ width: "100%" }}
                >
                  {message}
                </Alert>
              </Snackbar>
            </div>
          </div>
        </div>

        {/* Right Column (Image) */}
        <div className="w-full lg:w-1/2 relative Nlg:hidden">
          <div className="relative h-full">
            {/* Background Image */}
            <img
              src={EventImage}
              alt="Event Background"
              className="h-full w-full object-cover"
            />
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-gray-200 text-center px-6">
                <h2 className="text-4xl font-bold mb-4">
                  Discover Memorable Events That Inspire!
                </h2>
                <p className="text-lg mb-6">
                  From conferences to social gatherings, we bring the best
                  events to you. Find, explore, and participate today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
