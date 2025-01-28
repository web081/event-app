// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { logoutUser } from "../features/auth/authSlice";
// import { verifyAdminOTP, loginUser } from "../features/auth/authActions";
// import { resetSuccess, resetError } from "../features/auth/authSlice";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
// import { Eye, EyeOff, Mail, Lock } from "lucide-react";
// import EventImage from "../assets/Image/eventimage.png";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { handleGoogleLogin } from "../features/auth/authActions";
// import { setCredentials } from "../features/auth/authSlice";

// const Login = () => {
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [showPassword, setShowPassword] = useState(false);
//   const [googleError, setGoogleError] = useState(null);
//   const [formError, setFormError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);

//   const { userInfo, error, isOtpRequired, tempUserId } = useSelector(
//     (state) => state.auth
//   );

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === "clickaway") return;
//     setOpenSnackbar(false);
//   };

//   useEffect(() => {
//     if (userInfo && (!userInfo.role === "admin" || !isOtpRequired)) {
//       const timer = setTimeout(() => {
//         navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/");
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [userInfo, isOtpRequired, navigate]);

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     setFormError(null);

//     try {
//       const result = await dispatch(loginUser(data)).unwrap();

//       if (result.requireOTP) {
//         setFormError({
//           type: "info",
//           message: "OTP sent to your email. Please verify.",
//         });
//       } else {
//         reset();
//         navigate(result.user.role === "admin" ? "/Admin/DashBoard" : "/");
//       }
//     } catch (err) {
//       setFormError({
//         type: "error",
//         message: err.message || "Login failed. Please check your credentials.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOtpSubmit = (otp) => {
//     if (!tempUserId) {
//       setSnackbarMessage("User ID not found. Please try logging in again.");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       dispatch(resetError());
//       return;
//     }

//     dispatch(verifyAdminOTP({ userId: tempUserId, otp }))
//       .unwrap()
//       .then((response) => {
//         setSnackbarMessage("OTP verified successfully!");
//         setSnackbarSeverity("success");
//         setOpenSnackbar(true);
//         dispatch(resetSuccess());
//       })
//       .catch((error) => {
//         setSnackbarMessage(error || "OTP verification failed");
//         setSnackbarSeverity("error");
//         setOpenSnackbar(true);
//       });
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     setIsGoogleLoading(true);
//     setGoogleError(null);

//     try {
//       const response = await handleGoogleLogin(credentialResponse.credential);
//       // Check if response contains an error message
//       if (response.error) {
//         setGoogleError({
//           type: "error",
//           message: response.message || "Google login failed",
//         });
//         // Show the error in Snackbar
//         setSnackbarMessage(response.message || "Google login failed");
//         setSnackbarSeverity("error");
//         setOpenSnackbar(true);
//         return;
//       }

//       dispatch(setCredentials(response));
//       navigate(response.user.role === "admin" ? "/Admin/DashBoard" : "/");
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || error.message || "Google login failed";
//       setGoogleError({
//         type: "error",
//         message: errorMessage,
//       });
//       // Show the error in Snackbar
//       setSnackbarMessage(errorMessage);
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   };

//   const handleGoogleError = (error) => {
//     console.error("Google Sign-In Error:", error);
//     let errorMessage = "Google Sign-In failed. ";

//     if (error.error === "origin_mismatch") {
//       errorMessage +=
//         "The app's domain is not authorized in Google Cloud Console.";
//     } else if (error.error === "popup_closed_by_user") {
//       errorMessage += "Sign-in window was closed.";
//     } else if (error.error === "access_denied") {
//       errorMessage += "Access was denied.";
//     } else {
//       errorMessage += "Please try again later.";
//     }

//     setGoogleError({
//       type: "error",
//       message: errorMessage,
//     });
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//         <div className="flex flex-col lg:flex-row h-screen">
//           {/* Left Column (Form) */}
//           <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
//             <div className="max-w-md w-full">
//               <h1 className="text-3xl font-bold mb-4">Welcome back!!</h1>
//               <p className="text-gray-500 mb-6">
//                 Welcome back! Please enter your details.
//               </p>

//               <form
//                 className="mt-8 space-y-6"
//                 onSubmit={handleSubmit(onSubmit)}
//               >
//                 <div className="space-y-4">
//                   <div>
//                     <label htmlFor="email" className="sr-only">
//                       Email address
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Mail className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         {...register("email", {
//                           required: "Email is required",
//                           pattern: {
//                             value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                             message: "Invalid email address",
//                           },
//                         })}
//                         id="email"
//                         type="email"
//                         autoComplete="email"
//                         className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
//                         placeholder="Email address"
//                       />
//                     </div>
//                     {errors.email && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors.email.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label htmlFor="password" className="sr-only">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Lock className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         {...register("password", {
//                           required: "Password is required",
//                           minLength: {
//                             value: 6,
//                             message: "Password must be at least 6 characters",
//                           },
//                         })}
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         autoComplete="current-password"
//                         className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
//                         placeholder="Password"
//                       />
//                       <button
//                         s
//                         type="button"
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-5 w-5 text-gray-400" />
//                         ) : (
//                           <Eye className="h-5 w-5 text-gray-400" />
//                         )}
//                       </button>
//                     </div>
//                     {errors.password && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors.password.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out "
//                   >
//                     {isLoading ? (
//                       <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
//                     ) : (
//                       "Sign in"
//                     )}
//                   </button>
//                 </div>
//               </form>
//               <div className="text-sm flex justify-end">
//                 <Link
//                   to="/ForgotPassword"
//                   className="font-medium text-btColour hover:text-blue-500"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div>
//               <p className="text-sm text-center text-gray-500 mt-6">
//                 Don’t have an account?{" "}
//                 <Link
//                   to={"/signup"}
//                   className="font-medium text-red-600 hover:text-blue-500"
//                 >
//                   Sign up for free
//                 </Link>
//               </p>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">
//                   Or continue with
//                 </span>
//               </div>

//               <div className="mt-6">
//                 <div className="w-full flex justify-center">
//                   <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={handleGoogleError}
//                     useOneTap
//                     disabled={isGoogleLoading}
//                     theme="outline"
//                     shape="rectangular"
//                     locale="en"
//                   />
//                 </div>
//                 {isGoogleLoading && (
//                   <div className="flex justify-center mt-4">
//                     <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           {/* Right Column (Image) */}
//           <div className="w-full lg:w-1/2 relative Nlg:hidden">
//             <div className="relative h-full">
//               {/* Background Image */}
//               <img
//                 src={EventImage}
//                 alt="Event Background"
//                 className="h-full w-full object-cover"
//               />
//               {/* Overlay Content */}
//               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                 <div className="text-gray-200 text-center px-6">
//                   <h2 className="text-4xl font-bold mb-4">
//                     Discover Memorable Events That Inspire!
//                   </h2>
//                   <p className="text-lg mb-6">
//                     From conferences to social gatherings, we bring the best
//                     events to you. Find, explore, and participate today.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </GoogleOAuthProvider>
//     </>
//   );
// };

// export default Login;

// const OtpVerification = ({ onSubmit }) => {
//   const [otp, setOtp] = useState("");
//   const [otpError, setOtpError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (otp.length !== 6) {
//       setOtpError("OTP must be 6 characters long");
//       return;
//     }
//     setOtpError("");
//     onSubmit(otp);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//       <div>
//         <label
//           htmlFor="otp"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Enter OTP
//         </label>
//         <div className="mt-1">
//           <input
//             type="text"
//             id="otp"
//             maxLength={6}
//             className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour sm:text-sm"
//             placeholder="Enter 6-digit OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//           />
//           {otpError && <p className="mt-2 text-sm text-red-600">{otpError}</p>}
//         </div>
//       </div>
//       <div>
//         <button
//           type="submit"
//           className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out "
//         >
//           Verify OTP
//         </button>
//       </div>
//     </form>
//   );
// };
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { verifyAdminOTP, loginUser } from "../features/auth/authActions";
import {
  resetSuccess,
  resetError,
  setCredentials,
} from "../features/auth/authSlice";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import EventImage from "../assets/Image/eventimage.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { handleGoogleLogin } from "../features/auth/authActions";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpError, setOtpError] = useState("");

  const { userInfo, error, isOtpRequired, tempUserId } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && !isOtpRequired) {
      const timer = setTimeout(() => {
        navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userInfo, isOtpRequired, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const result = await dispatch(loginUser(data)).unwrap();

      if (result.requireOTP) {
        setShowOtpForm(true);
        setFormError({
          type: "info",
          message: "OTP sent to your email. Please verify.",
        });
      } else {
        reset();
        navigate(result.user.role === "admin" ? "/Admin/DashBoard" : "/");
      }
    } catch (err) {
      setFormError({
        type: "error",
        message: err.message || "Login failed. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    if (!tempUserId) {
      setOtpError("User ID not found. Please try logging in again.");
      return;
    }

    try {
      const response = await dispatch(
        verifyAdminOTP({ userId: tempUserId, otp })
      ).unwrap();
      if (response.success) {
        setOtpError("");
        navigate("/Admin/DashBoard");
      }
    } catch (error) {
      setOtpError(error.message || "OTP verification failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsGoogleLoading(true);
    setGoogleError(null);

    try {
      const response = await handleGoogleLogin(credentialResponse.credential);
      if (response.error) {
        setGoogleError({
          type: "error",
          message: response.message || "Google login failed",
        });
        return;
      }

      dispatch(setCredentials(response));
      navigate(response.user.role === "admin" ? "/Admin/DashBoard" : "/");
    } catch (error) {
      setGoogleError({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Google login failed",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google Sign-In Error:", error);
    setGoogleError({
      type: "error",
      message: "Google Sign-In failed. Please try again later.",
    });
  };

  const OtpVerificationForm = () => {
    const [otp, setOtp] = useState("");

    const handleOtpVerificationSubmit = (e) => {
      e.preventDefault();
      if (otp.length !== 6) {
        setOtpError("OTP must be 6 characters long");
        return;
      }
      handleOtpSubmit(otp);
    };

    return (
      <form onSubmit={handleOtpVerificationSubmit} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            Enter OTP
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="otp"
              maxLength={6}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour sm:text-sm"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            {otpError && (
              <p className="mt-2 text-sm text-red-600">{otpError}</p>
            )}
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out"
          >
            Verify OTP
          </button>
        </div>
      </form>
    );
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Column (Form) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
          <div className="max-w-md w-full">
            <h1 className="text-3xl font-bold mb-4">Welcome back!!</h1>
            <p className="text-gray-500 mb-6">
              Welcome back! Please enter your details.
            </p>

            {showOtpForm ? (
              <OtpVerificationForm />
            ) : (
              <>
                <form
                  className="mt-8 space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
                        placeholder="Email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
                        placeholder="Password"
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
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </form>

                {/* Additional Links and Google Login */}
                <div className="text-sm flex justify-end mt-4">
                  <Link
                    to="/ForgotPassword"
                    className="font-medium text-btColour hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <p className="text-sm text-center text-gray-500 mt-6">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-red-600 hover:text-blue-500"
                  >
                    Sign up for free
                  </Link>
                </p>

                <div className="relative flex justify-center text-sm mt-6">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>

                <div className="mt-6">
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
              </>
            )}

            {/* Error Messages */}
            {formError && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  formError.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {formError.message}
              </div>
            )}
            {googleError && (
              <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700">
                {googleError.message}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Image) */}
        <div className="w-full lg:w-1/2 relative Nlg:hidden">
          <div className="relative h-full">
            <img
              src={EventImage}
              alt="Event Background"
              className="h-full w-full object-cover"
            />
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
  );
};

export default Login;
