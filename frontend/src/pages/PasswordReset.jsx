// import React, { useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { Snackbar } from "@mui/material";
// import MuiAlert from "@mui/material/Alert";
// import Spinner from "../components/tools/Spinner";
// // import AutographLogo from "../assets/images/autograghLogo.png";
// import backendURL from "../config";

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const PasswordReset = () => {
//   const { token } = useParams(); // Get the reset token from the URL
//   const navigate = useNavigate(); // initialize useNavigate hook
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${backendURL}/api/reset-password/${token}`,
//         {
//           password,
//         }
//       );
//       setMessage(response.data.message);
//       setSnackbarSeverity("success");
//       setPassword("");
//       setOpenSnackbar(true);

//       // Navigate to /login after 2 seconds
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (error) {
//       setMessage(error.response?.data?.message || "An error occurred");
//       setSnackbarSeverity("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
//         <div className="text-center">
//           <div className="text-center">
//             {/* <img src={AutographLogo} alt="Autograph Logo" /> */}

//             <p className="mt-2  font-bold text-lg text-gray-600">
//               Reset Password
//             </p>
//           </div>
//           <p className="mt-2 text-sm text-gray-600">
//             Enter your new password below
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           <div className="space-y-4">
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your new password"
//                 required
//                 className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-NavClr hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out "
//             >
//               {loading ? <Spinner /> : "Set New Password"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default PasswordReset;
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Spinner from "../components/tools/Spinner";
import EventImage from "../assets/Image/eventimage.png";
import backendURL from "../config";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
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
      const response = await axios.post(
        `${backendURL}/api/reset-password/${token}`,
        {
          password,
        }
      );
      setMessage(response.data.message);
      setSnackbarSeverity("success");
      setPassword("");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
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
                <p className="mt-2 font-bold text-lg text-gray-600">
                  Reset Password
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Enter your new password below
              </p>
            </div>

            <div className="max-w-md w-full">
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out"
                  >
                    {loading ? <Spinner /> : "Set New Password"}
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

export default PasswordReset;

// <div className="lg:col-span-5">
//   <div className="max-w-md">
//     {/* Logo */}
//     <img alt="Eroot-logo" className="w-[13rem] h-[55px] mb-6" />

//     {/* Newsletter Section */}
//     <div className="mb-6">
//       <h3 className="text-base font-semibold mb-3">
//         Subscribe to our newsletter
//       </h3>
//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//           className="flex-1 p-2 rounded text-slate-800 placeholder-slate-400 text-sm"
//           required
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-[#005a00] text-white rounded hover:bg-white hover:text-[#198754] border border-transparent hover:border-[#198754] transition-all duration-300 flex items-center gap-2 text-sm"
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <Loader className="animate-spin" size={16} />
//           ) : (
//             "Subscribe"
//           )}
//         </button>
//       </form>
//     </div>
//   </div>
// </div>;
