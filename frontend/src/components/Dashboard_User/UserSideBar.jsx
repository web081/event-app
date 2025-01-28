// import React, { useState, useEffect, useRef } from "react";
// import { HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
// import { CheckCircle, ShieldCheck } from "lucide-react";

// import { VscDashboard } from "react-icons/vsc";
// import { FaHome, FaUser, FaServicestack, FaCalendarAlt } from "react-icons/fa";
// import { MdOutlineEvent, MdNotifications } from "react-icons/md";
// import { useSelector, useDispatch } from "react-redux";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { logoutUser } from "../../features/auth/authSlice";

// const UserSideBar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const user = useSelector((state) => state.auth.user);
//   const sidebarRef = useRef(null);
//   const { userInfo } = useSelector((state) => state.auth);
//   const userId = userInfo?._id;

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate("/");
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth <= 768);
//       if (window.innerWidth > 768) {
//         setIsOpen(true);
//       } else {
//         setIsOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const sidebarLinks = [
//     { path: "/", icon: FaHome, label: "Home" },
//     { path: "/User/DashBoard", icon: VscDashboard, label: "Dashboard" },
//     { path: "/User/Profile", icon: FaUser, label: "Profile" },
//     {
//       path: "/User/ServicesList",
//       icon: FaServicestack,
//       label: "My Services / Business",
//     },
//     { path: "/User/VenueList", icon: FaCalendarAlt, label: "Venue Listing" },
//     { path: "/User/EventList", icon: MdOutlineEvent, label: "Event Listing" },
//     {
//       path: "/User/EventManagement",
//       icon: MdOutlineEvent,
//       label: "Event management",
//     },
//     {
//       path: "/User/UserVerifyPage",
//       icon: ShieldCheck,
//       label: "Verification",
//     },
//     {
//       path: "/User/UserNotificationPage",
//       icon: MdNotifications,
//       label: "Notifications",
//     },
//   ];

//   return (
//     <>
//       <div
//         className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center justify-between ${
//           isSmallScreen ? "" : "hidden"
//         }`}
//       >
//         <button
//           onClick={toggleSidebar}
//           className="text-purple-600 p-2 rounded-md focus:outline-none"
//         >
//           {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
//         </button>
//       </div>
//       <div
//         ref={sidebarRef}
//         className={`fixed inset-y-0 left-0 z-30 w-64 bg-Blud text-white transition-all duration-300 ease-in-out transform
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//           ${isSmallScreen ? "top-16" : "top-0"}`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-5">
//             <h1 className="text-2xl font-bold mb-1">E-venue</h1>
//             <p className="text-sm text-purple-300 mb-6">Administrator</p>
//           </div>

//           <nav className="flex-grow overflow-y-auto">
//             {sidebarLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 onClick={() => isSmallScreen && setIsOpen(false)}
//                 className={`flex items-center px-5 py-3 text-sm ${
//                   location.pathname === link.path
//                     ? "bg-purple-800"
//                     : "hover:bg-purple-600"
//                 }`}
//               >
//                 <link.icon className="w-5 h-5 mr-3" />
//                 <span>{link.label}</span>
//               </Link>
//             ))}
//           </nav>

//           <div className="p-5">
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center px-1 py-1 text-sm bg-red-50 hover:text-white text-red-700 rounded-md hover:bg-red-700 transition-colors"
//             >
//               <HiOutlineLogout className="w-5 h-5 mr-3" />
//               <span>Sign out</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`transition-all duration-300 ${
//           isOpen && !isSmallScreen ? "ml-64" : "ml-0"
//         }`}
//       ></div>
//     </>
//   );
// };

// export default UserSideBar;
import React, { useState, useEffect, useRef } from "react";
import { HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { VscDashboard } from "react-icons/vsc";
import { FaHome, FaUser, FaServicestack, FaCalendarAlt } from "react-icons/fa";
import { MdOutlineEvent, MdNotifications } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fetchProfileById } from "../../features/Users/userAction";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const sidebarRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const { profile } = useSelector((state) => state.profiles);
  console.log(profile);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfileById(userId));
    }
  }, [dispatch, userId]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarLinks = [
    { path: "/", icon: FaHome, label: "Home" },
    // { path: "/User /DashBoard", icon: VscDashboard, label: "Dashboard" },
    { path: "/User/Profile", icon: FaUser, label: "Profile" },
    {
      path: "/User/ServicesList",
      icon: FaServicestack,
      label: "My Services / Business",
    },
    { path: "/User/VenueList", icon: FaCalendarAlt, label: "Venue Listing" },
    { path: "/User/EventList", icon: MdOutlineEvent, label: "Event Listing" },
    {
      path: "/User/EventManagement",
      icon: MdOutlineEvent,
      label: "Event management",
    },
    {
      path: "/User/UserVerifyPage",
      icon: ShieldCheck,
      label: "Service Verification",
    },
    {
      path: "/User/UserVenueVerifyPage",
      icon: ShieldCheck,
      label: "Venue Verification",
    },
    {
      path: "/User/UserNotificationPage",
      icon: MdNotifications,
      label: "Notifications",
    },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center justify-between ${
          isSmallScreen ? "" : "hidden"
        }`}
      >
        <div className="flex items-center">
          <span className="mb-2">
            <img
              src={profile?.image}
              alt={profile?.image}
              className="w-7 h-7 rounded-full object-cover mr-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback-image.png"; // Fallback image
              }}
            />
          </span>
          <span className="mb-1 mr-2 font-medium text-xs">
            {profile?.username}
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-purple-600 p-2 rounded-md focus:outline-none"
        >
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-Blud text-white transition-all duration-300 ease-in-out transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isSmallScreen ? "top-16" : "top-0"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5">
            <h1 className="text- 2xl font-bold mb-1">E-venue</h1>
            <p className="text-sm text-purple-300 mb-6">Administrator</p>
            <div className="flex items-center mb-2">
              <img
                src={profile?.image}
                alt={profile?.image}
                className="w-7 h-7 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback-image.png"; // Fallback image
                }}
              />
              <span className="font-medium text-xs">{profile?.username}</span>
            </div>
          </div>

          <nav className="flex-grow overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => isSmallScreen && setIsOpen(false)}
                className={`flex items-center px-5 py-3 text-sm ${
                  location.pathname === link.path
                    ? "bg-purple-800"
                    : "hover:bg-purple-600"
                }`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-1 py-1 text-sm bg-red-50 hover:text-white text-red-700 rounded-md hover:bg-red-700 transition-colors"
            >
              <HiOutlineLogout className="w-5 h-5 mr-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          isOpen && !isSmallScreen ? "ml-64" : "ml-0"
        }`}
      ></div>
    </>
  );
};

export default AdminSidebar;
