import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { registerUser } from "../features/auth/authActions";
import { resetSuccess, resetError } from "../features/auth/authSlice";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import EventImage from "../assets/Image/eventimage.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { handleGoogleLogin } from "../features/auth/authActions";
import { setCredentials } from "../features/auth/authSlice";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup = () => {
  const { loading, userInfo, error, success } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  useEffect(() => {
    if (success) {
      setSnackbarMessage("Registered successfully. You can now log in.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      const timer = setTimeout(() => {
        navigate("/login");
        dispatch(resetSuccess());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      dispatch(resetError());
    }
  }, [error, dispatch]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const submitForm = (data) => {
    if (data.password !== data.confirmPassword) {
      setSnackbarMessage("Passwords do not match!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    data.email = data.email.toLowerCase();
    dispatch(registerUser(data));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsGoogleLoading(true);
    setGoogleError(null);

    try {
      const response = await handleGoogleLogin(credentialResponse.credential);
      // Check if response contains an error message
      if (response.error) {
        setGoogleError({
          type: "error",
          message: response.message || "Google login failed",
        });
        // Show the error in Snackbar
        setSnackbarMessage(response.message || "Google login failed");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      dispatch(setCredentials(response));
      navigate(response.user.role === "admin" ? "/Admin/DashBoard" : "/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";
      setGoogleError({
        type: "error",
        message: errorMessage,
      });
      // Show the error in Snackbar
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google Sign-In Error:", error);
    let errorMessage = "Google Sign-In failed. ";

    if (error.error === "origin_mismatch") {
      errorMessage +=
        "The app's domain is not authorized in Google Cloud Console.";
    } else if (error.error === "popup_closed_by_user") {
      errorMessage += "Sign-in window was closed.";
    } else if (error.error === "access_denied") {
      errorMessage += "Access was denied.";
    } else {
      errorMessage += "Please try again later.";
    }

    setGoogleError({
      type: "error",
      message: errorMessage,
    });
  };
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="flex flex-col lg:flex-row h-screen">
          {/* Left Column (Form) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
            <div className="max-w-md w-full">
              <h1 className="text-3xl font-bold mb-4">Create Your Account</h1>
              <p className="text-gray-500 mb-6">
                Join us today! Fill in your details to get started.
              </p>

              <div className="max-w-md w-full ">
                <form
                  className="mt-8 space-y-6"
                  onSubmit={handleSubmit(submitForm)}
                >
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="sr-only">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="username"
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
                          placeholder="Username"
                          {...register("username", {
                            required: "Username is required",
                          })}
                        />
                        {errors.username && (
                          <p className="mt-1 text-sm text-red -600">
                            {errors.username.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="sr-only">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
                          placeholder="Email address"
                          {...register("email", {
                            required: "Email is required",
                          })}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
                          placeholder="Password"
                          {...register("password", {
                            required: "Password is required",
                          })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="sr-only">
                        Confirm password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
                          placeholder="Confirm password"
                          {...register("confirmPassword", {
                            required: "Please confirm your password",
                          })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link
                        to="/login"
                        className="font-medium text-btColour hover:text-blue-500"
                      >
                        Already have an account?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out "
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </div>
                </form>
                <div className="relative flex justify-center text-sm mt-2">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>

                <div className="mt-2">
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      disabled={isGoogleLoading}
                      theme="outline"
                      shape="rectangular"
                      locale="en"
                    />
                  </div>
                  {isGoogleLoading && (
                    <div className="flex justify-center mt-4">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
                >
                  <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                  >
                    {snackbarMessage}
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
      </GoogleOAuthProvider>
      ;
    </>
  );
};

export default Signup;
