import React, { useState, useEffect, useRef } from "react";
import { HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
import { VscDashboard } from "react-icons/vsc";
import { IoPerson } from "react-icons/io5";
import { FaUserCircle, FaHome } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";
import { fetchProfileById } from "../../features/Users/userAction";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

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
    {
      path: "/Admin/DashBoard",
      icon: VscDashboard,
      label: "Dashboard",
    },
    { path: "/Admin/Profile", icon: IoPerson, label: "Profile" },

    { path: "/Admin/Users", icon: FaUsers, label: "All Users" },
    {
      path: "/Admin/AllServices",
      icon: FaUsers,
      label: "All Services",
    },
    {
      path: "/Admin/AllVenues",
      icon: FaMapMarkerAlt,
      label: "All Venues",
    },
    {
      path: "/DashBoard/Admin/Comments",
      icon: BiCommentDetail,
      label: "Comments",
    },

    {
      path: "/Admin/VerificationData",
      icon: ShieldCheck,
      label: "Business Verification List",
    },
    {
      path: "/Admin/venueVerificationData",
      icon: ShieldCheck,
      label: "Venue Verification List",
    },
    {
      path: "/Admin/VenueInterest",
      icon: FaRegEye,
      label: "Venue Interest List",
    },
    {
      path: "/Admin/Notifications",
      icon: IoMdNotificationsOutline,
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
            {profile?.image ? (
              <img
                src={`${profile?.image}`}
                alt={`${userInfo.username}`}
                className="w-7 h-7 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback-image.png";
                }}
              />
            ) : (
              <FaUserCircle className="w-7 h-7 text-gray-400 mr-4 cursor-pointer" />
            )}
          </span>
          <span className="mb-1 mr-2 font-medium text-xs">
            {profile?.username || "Guest"}
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
            <h1 className="text-2xl font-bold mb-1">E-Venue</h1>
            <p className="text-sm text-purple-300 mb-6">Administrator</p>
            {!isSmallScreen && (
              <div className="flex items-center">
                <span className="mb-2">
                  {profile?.image ? (
                    <img
                      src={`${profile?.image}`}
                      alt={`${userInfo.username}`}
                      className="w-7 h-7 rounded-full object-cover mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-image.png";
                      }}
                    />
                  ) : (
                    <FaUserCircle className="w-7 h-7 text-gray-400 mr-4 cursor-pointer" />
                  )}
                </span>
                <span className="mb-1 mr-2 font-extralight text-xs">
                  {profile?.username || "Guest"}
                </span>
              </div>
            )}
          </div>

          <nav className="flex-grow overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => isSmallScreen && setIsOpen(false)}
                className={`flex items-center px-5 py-3 text-sm ${
                  location.pathname === link.path
                    ? "bg-red-00  scale-110 text-red-200"
                    : "hover:bg-red-500"
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
