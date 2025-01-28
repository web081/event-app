// import React, { useState, useEffect } from "react";
// import { Navbar } from "flowbite-react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaTimes, FaBars } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../features/auth/authSlice";

// const ResponsiveNavbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Get userInfo from Redux store
//   const { userInfo } = useSelector((state) => state.auth);
//   console.log(userInfo);

//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [openSnackbar, setOpenSnackbar] = useState(false);

//   // Initialize user state from localStorage on component mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("userInfo");
//     if (storedUser && !userInfo) {
//       // Dispatch action to update Redux store with stored user data
//       dispatch({ type: "auth/setUserInfo", payload: JSON.parse(storedUser) });
//     }
//   }, [dispatch, userInfo]);

//   const handleLogout = () => {
//     try {
//       dispatch(logoutUser());
//       setSnackbarMessage("Logged out successfully!");
//       setSnackbarSeverity("success");
//       setOpenSnackbar(true);
//       localStorage.removeItem("userInfo"); // Clear localStorage
//       navigate("/");
//     } catch (error) {
//       setSnackbarMessage("Logout failed!");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       console.error("Logout error:", error);
//     }
//   };

//   // Rest of your component code remains the same...
//   const navLinks = [
//     { name: "Venues", url: "/venues" },
//     { name: "Ticketing", url: "/ticketing" },
//     { name: "Event Services", url: "/event-services" },
//     { name: "Event Showcase", url: "/event-showcase" },
//     { name: "About", url: "/about" },
//     { name: "Blacklist", url: "/blacklist" },
//   ];

//   const navLinkClasses = "hover:text-textClr px-4 py-2 transition duration-200";
//   const activeLinkClasses = "text-textClr font-bold";
//   const isActiveLink = (url) => location.pathname === url;

//   return (
//     <Navbar fluid className="bg-white shadow py-4">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           {/* Logo */}
//           <Link to="/" className="flex-shrink-0">
//             <div className="text-xl font-bold">Logo</div>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex flex-wrap items-center justify-center flex-grow gap-x-4 gap-y-2">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.url}
//                 to={link.url}
//                 className={`whitespace-nowrap ${navLinkClasses} ${
//                   isActiveLink(link.url) ? activeLinkClasses : ""
//                 }`}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           {/* Auth Buttons */}
//           <div className="hidden md:flex items-center gap-4 flex-shrink-0">
//             <Link to="/signup">
//               <button className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border  hover:font-medium border-Blud text-white   bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
//                 Sign Up
//               </button>
//             </Link>
//             <Link to="/login">
//               <button className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border  hover:font-medium border-Blud text-white   bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
//                 Login
//               </button>
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden text-gray-600"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
//           isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={() => setIsMenuOpen(false)}
//       >
//         <div
//           className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ${
//             isMenuOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="flex flex-col h-full">
//             <div className="p-4 border-b">
//               <button
//                 onClick={() => setIsMenuOpen(false)}
//                 className="text-gray-600"
//               >
//                 <FaTimes size={24} />
//               </button>
//             </div>
//             <div className="flex flex-col py-4">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.url}
//                   to={link.url}
//                   className={`px-4 py-2 ${
//                     isActiveLink(link.url) ? "text-red-600" : "text-gray-700"
//                   }`}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//               <div className="hidden md:flex items-center gap-4 flex-shrink-0">
//                 {userInfo ? (
//                   <>
//                     <span>Welcome, {userInfo.username}!</span>
//                     <button
//                       onClick={handleLogout}
//                       className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out"
//                     >
//                       Logout
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <Link to="/signup">
//                       <button className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
//                         Sign Up
//                       </button>
//                     </Link>
//                     <Link to="/login">
//                       <button className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
//                         Login
//                       </button>
//                     </Link>
//                   </>
//                 )}
//               </div>
//               ;
//             </div>
//           </div>
//         </div>
//       </div>
//     </Navbar>
//   );
// };

// export default ResponsiveNavbar;
import React, { useState, useEffect } from "react";
import { Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

const ResponsiveNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get userInfo from Redux store
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Initialize user state from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser && !userInfo) {
      // Dispatch action to update Redux store with stored user data
      dispatch({ type: "auth/setUser Info", payload: JSON.parse(storedUser) });
    }
  }, [dispatch, userInfo]);

  const handleLogout = () => {
    try {
      dispatch(logoutUser());
      setSnackbarMessage("Logged out successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      localStorage.removeItem("userInfo"); // Clear localStorage
      navigate("/");
    } catch (error) {
      setSnackbarMessage("Logout failed!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { name: "Venues", url: "/venues" },
    { name: "Ticketing", url: "/ticketing" },
    { name: "Services", url: "/event-services" },
    { name: "Events", url: "/event-showcase" },
    { name: "About", url: "/about" },
    { name: "Blacklist", url: "/blacklist" },
  ];

  const navLinkClasses = "hover:text-textClr px-4 py-2 transition duration-200";
  const activeLinkClasses = "text-textClr font-bold";
  const isActiveLink = (url) => location.pathname === url;

  return (
    <Navbar fluid className="bg-white shadow py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="text-xl font-bold">Logo</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-wrap items-center justify-center flex-grow gap-x-4 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                to={link.url}
                className={`whitespace-nowrap ${navLinkClasses} ${
                  isActiveLink(link.url) ? activeLinkClasses : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {userInfo ? (
              <>
                <button
                  onClick={handleLogout}
                  className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <button className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login">
                  <button className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.url}
                  to={link.url}
                  className={`px-4 py-2 ${
                    isActiveLink(link.url) ? "text-red-600" : "text-gray-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 flex-shrink-0">
                {userInfo ? (
                  <>
                    {/* <span>Welcome, {userInfo.username}!</span> */}
                    <button
                      onClick={handleLogout}
                      className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signup">
                      <button className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
                        Sign Up
                      </button>
                    </Link>
                    <Link to="/login">
                      <button className="whitespace-nowrap px-2 py-1 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
                        Login
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ResponsiveNavbar;
