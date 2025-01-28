import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";
import { fetchProfileById } from "../../features/Users/userAction";
import { IoHomeOutline } from "react-icons/io5";

function Adminheader() {
  const backendURL =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:3001";
  const [isNavOpen, setIsNavOpen] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.user._id;
  const { profile, loading, success, error } = useSelector(
    (state) => state.profiles
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfileById(userId));
    }
  }, [dispatch, userId]);

  const handleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle the file upload
      console.log(file);
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isNavOpen ? "opacity-70" : "opacity-0"
        } ${isNavOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ zIndex: 30 }}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed left-0 top-0 w-[75%] sm:w-[60%] h-screen bg-[#ecf0f3] p-10 transform transition-transform ease-in duration-500 ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="flex w-full items-center justify-between">
          <div
            onClick={handleNav}
            className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer"
          >
            <IoClose className="text-xl text-red-500" />
          </div>
        </div>
        <div className="border-b border-gray-300 my-4"></div>
        {/* Mobile menu items */}
        <Link
          onClick={() => setIsNavOpen(false)}
          to="/transactions&earnings"
          style={{ color: "green" }}
          className="text-black lg:mb-5 flex lg:focus:text-[#166534] lg:active:text-[#166534] flex-1"
        >
          <span>
            <TbMoneybag className="text-[15px] mr-2 mid:mt-1" />
          </span>
          <p>Transactions & Earnings</p>
        </Link>
      </div>
      {/* Mobile Menu */}

      {/* Large Screen Links */}
      <div className="flex items-center justify-between px-4 border-1 border-gray-100 shadow-lg py-3">
        {/* Start of the screen */}
        <div onClick={handleNav}>
          <MdOutlineDashboard
            size={24}
            className="w-8 h-8 text-purple cursor-pointer hover:scale-125 hidden mid:block"
          />
        </div>

        {/* End of the screen */}

        <div className="flex items-center">
          <span className="mb-1 mr-2 font-medium first-letter:uppercase">
            {profile?.username || "Guest"}
          </span>
          <span className="mb-2">
            {profile?.image ? (
              <img
                src={`${backendURL}/uploads/${profile?.image}`}
                alt={`${userInfo.username}`}
                className="w-7 h-7 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback-image.png";
                }}
              />
            ) : (
              <FaUserCircle
                className="w-7 h-7 text-gray-400 mr-4 cursor-pointer"
                onClick={handleClickUpload}
              />
            )}
          </span>
        </div>
      </div>
      {/* Large Screen Links */}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}

export default Adminheader;
