import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Building2,
  Clock,
  Users,
  Book,
  Phone,
  Mail,
  Send,
  X,
  Edit,
  Trash2,
  MessageCircle,
  Share2,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  Image as ImageIcon,
} from "lucide-react";
import MessageModal from "../components/MessageModal";
import {
  Share,
  Twitter,
  Facebook,
  LinkedIn,
  WhatsApp,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import backendURL from "../config";
import { socket } from "../components/tools/SocketClient";
import ReviewSection from "../components/ReviewSection";
import BusinessCard from "../components/Cards/businessCard";
import axios from "axios";

import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export const ShareFeature = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const currentUrl = window.location.href;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(currentUrl);
    let shareUrl;

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${url}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    handleClose();
  };

  return (
    <>
      <Share className="w-4 h-4 ml-2 cursor-pointer" onClick={handleClick} />
      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleShare("twitter")}>
          <Twitter sx={{ color: "#1DA1F2", mr: 1 }} />
          Twitter
        </MenuItem>
        <MenuItem onClick={() => handleShare("facebook")}>
          <Facebook sx={{ color: "#4267B2", mr: 1 }} />
          Facebook
        </MenuItem>
        <MenuItem onClick={() => handleShare("linkedin")}>
          <LinkedIn sx={{ color: "#0077b5", mr: 1 }} />
          LinkedIn
        </MenuItem>
        <MenuItem onClick={() => handleShare("whatsapp")}>
          <WhatsApp sx={{ color: "#25D366", mr: 1 }} />
          WhatsApp
        </MenuItem>
      </Menu>
    </>
  );
};

const Map = ({ address }) => {
  return (
    <div className="w-full h-64 bg-white rounded-lg shadow-lg overflow-hidden">
      <iframe
        title="Business Location"
        className="w-full h-full border-0"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(
          `${address.street}, ${address.lga}, ${address.state}`
        )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        allowFullScreen
      />
    </div>
  );
};
const SingleServicePage = () => {
  const [business, setBusiness] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const { userInfo } = useSelector((state) => state.auth);
  const currentUser = userInfo?._id;

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendURL}/api/getBusinessById/${id}`);
        const data = await response.json();
        setBusiness(data);
      } catch (error) {
        console.error("Error fetching business details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  if (!business) return null;

  const handleSendMessage = () => {
    if (!currentUser) {
      alert("Please log in to send a message");
      return;
    }
    setIsMessageModalOpen(true);
  };

  console.log(business?.createdBy?._id, "business?.createdBy?._id");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <img
          src={business.coverImage || "/api/placeholder/1200/800"}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50">
          <div className="max-w-6xl mx-auto h-full flex flex-col justify-end p-6">
            <span className="text-red-500 text-sm font-medium mb-2">
              {business.type}
            </span>
            <h1 className="text-white text-4xl font-bold mb-4">
              {business.name}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {business?.address?.state}, {business?.address?.lga}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {business.yearsOfExperience}y experience
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  business.verified ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                {business.verified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6 border-b">
              {["about", "gallery", "reviews", "location"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-4 capitalize ${
                    activeTab === tab
                      ? "border-b-2 border-red-600 text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === "about" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-gray-600">
                      {business.bio || "No description available"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Services</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {business.services?.map((service, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Opening Hours
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {Object.entries(business?.openingHours || {}).map(
                        ([day, hours]) => (
                          <div key={day} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium capitalize">{day}</p>
                            <p className="text-gray-600 text-sm">{hours}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <BusinessGalleryModal
                  business={business}
                  images={[
                    business.coverImage,
                    ...(business.additionalImages || []),
                  ].filter(Boolean)}
                />
              )}

              {activeTab === "reviews" && <ReviewSection businessId={id} />}

              {activeTab === "location" && (
                <div>
                  <Map address={business.address} />
                  <p className="mt-4 text-gray-600">
                    {business?.address?.street}, {business?.address?.lga},{" "}
                    {business?.address?.state}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{business.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{business.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                >
                  Send Message
                </button>

                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Businesses */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Businesses </h2>
          <RelatedBusiness
            currentCathegory={business.type}
            currentBusinessId={id}
          />
        </div>
      </div>

      {/* Message Modal */}
      {isMessageModalOpen && currentUser && (
        <MessageModal
          currentUser={currentUser}
          receiverId={business?.createdBy?._id}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SingleServicePage;

const BusinessGalleryModal = ({ business, images = [], loading = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // If no images or only one image, don't show the gallery
  if (!images || images.length <= 1) return null;

  if (loading) {
    return (
      <div className="w-full mt-4">
        <h3 className="text-lg font-semibold mb-3">Gallery</h3>
        <div className="grid grid-cols-12 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`animate-pulse bg-gray-200 rounded-sm ${
                i === 1 ? "col-span-6 row-span-2" : "col-span-3 row-span-1"
              }`}
              style={{ aspectRatio: i === 1 ? "2/1" : "1/1" }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Display up to 5 images in the grid
  const displayImages = images.slice(0, 5);
  const remainingCount = images.length - 5;

  return (
    <div className="w-full mt-4">
      <h3 className="text-lg font-semibold mb-3">Gallery</h3>

      {/* Image Grid */}
      <div className="grid grid-cols-12 gap-2">
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={`relative rounded-sm overflow-hidden cursor-pointer group ${
              index === 0 ? "col-span-6 row-span-2" : "col-span-3 row-span-1"
            }`}
            onClick={() => {
              setSelectedImageIndex(index);
              setIsModalOpen(true);
            }}
          >
            <img
              src={image}
              alt={`${business.name} ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Show remaining count on last visible image */}
            {index === 4 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  +{remainingCount} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal using shadcn Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={3}
            py={2}
          >
            <DialogTitle sx={{ m: 0, p: 0 }}>
              {business.name} Gallery
            </DialogTitle>

            <Button
              onClick={() => setIsModalOpen(false)}
              sx={{
                color: "gray",
                "&:hover": {
                  color: "red",
                },
              }}
            >
              X
            </Button>
          </Box>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-4 max-h-[100vh] overflow-y-auto">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${business.name} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Optional: Add image number indicator */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm px-2 py-1 rounded">
                  {index + 1}/{images.length}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RelatedBusiness = ({ currentCathegory, currentBusinessId }) => {
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllBusinesses`);
        const data = await response.json();
        const relatedBusinesses = data.businesses
          .filter(
            (business) =>
              // Filter businesses of the same category but exclude current business
              business.type === currentCathegory &&
              business._id !== currentBusinessId
          )
          .slice(0, 10); // Limit to 10 items
        setBusinesses(relatedBusinesses);
      } catch (error) {
        console.error("Error fetching related businesses:", error);
      }
    };
    fetchVenues();
  }, [currentCathegory, currentBusinessId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = businesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(businesses.length / itemsPerPage);

  // If no related businesses, don't render the component
  if (businesses.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Other related services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentVenues.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>

        {/* Pagination - Only show if there's more than one page */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50"
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === index + 1
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
