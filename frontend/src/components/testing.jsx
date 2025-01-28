import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Share2,
  Bath,
  Clock,
  Home,
  DollarSign,
  Percent,
  ChevronRight,
  Mail,
  Phone,
  Instagram,
  Facebook,
  MessageCircle,
  X,
  Send,
  Building2,
} from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { useSelector } from "react-redux";
import backendURL from "../config";
import { socket } from "../components/tools/SocketClient";
import ReviewSectionVenue from "../components/ReviewSectionVenue";
import VenueCard from "../components/Cards/venueCard";
import MessageModal from "../components/MessageModal";
import axios from "axios";

const SingleVenue = () => {
  const [venue, setVenue] = useState(null);
  const [currentCathegory, setCurrentCathegory] = useState(null);
  const [currentVenueId, setCurrentVenueId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const { id } = useParams();

  const { userInfo } = useSelector((state) => state.auth);
  const currentUser = userInfo?._id;
  console.log(currentUser, "currentUser");

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendURL}/api/getVenueById/${id}`);
        const data = await response.json();
        console.log(data);
        setVenue(data);
        setCurrentCathegory(data.category);
        setCurrentVenueId(data._id);
      } catch (error) {
        console.error("Error fetching venue details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id]);

  if (loading || !venue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!currentUser) {
      alert("Please log in to send a message");
      return;
    }
    setIsMessageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <img
          src={venue.coverImage}
          alt={venue.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50">
          <div className="max-w-6xl mx-auto h-full flex flex-col justify-end p-6">
            <span className="text-red-500 text-sm font-medium mb-2">
              {venue.type}
            </span>
            <h1 className="text-white text-4xl font-bold mb-4">
              {venue.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {venue.address.state}, {venue.address.area}
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {venue.capacity} capacity
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {venue.duration} duration
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
                    <h3 className="text-lg font-semibold mb-3">
                      Venue Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-5 h-5 text-red-600" />
                        <span>{venue.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Bath className="w-5 h-5 text-red-600" />
                        <span>
                          {venue.bathrooms} bathrooms, {venue.toilets} toilets
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-5 h-5 text-red-600" />
                        <span>{venue.furnishing}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-5 h-5 text-red-600" />
                        <span>
                          ₦{venue.pricingDetails.totalpayment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5 text-red-600" />
                        <span>{venue.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Pricing Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-5 h-5 text-red-600" />
                        <span>
                          Initial Payment: ₦
                          {venue.pricingDetails.initialPayment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Percent className="w-5 h-5 text-red-600" />
                        <span>
                          {venue.pricingDetails.percentage}% of total amount
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5 text-red-600" />
                        <span>
                          Payment Duration: {venue.pricingDetails.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <VenueGalleryModal
                  venue={venue}
                  images={[
                    venue.coverImage,
                    ...(venue.additionalImages || []),
                  ].filter(Boolean)}
                />
              )}

              {activeTab === "reviews" && <ReviewSectionVenue venueId={id} />}

              {activeTab === "location" && (
                <div>
                  <div className="w-full h-64 bg-white rounded-lg shadow-lg overflow-hidden">
                    <iframe
                      title="Venue Location"
                      className="w-full h-full border-0"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        `${venue.address.street}, ${venue.address.area}, ${venue.address.state}`
                      )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      allowFullScreen
                    />
                  </div>
                  <p className="mt-4 text-gray-600">
                    {venue.address.street}, {venue.address.area},{" "}
                    {venue.address.state}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact Card */}
          {/* <div className="lg:w-1/3">
            <Card className="sticky top-4">
              <CardHeader>
                <span>
                  ₦{venue.pricingDetails.totalpayment.toLocaleString()}
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-Blud" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">+234 801 234 5678</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-Blud" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">contact@monarchevents.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-Blud" />
                  <div>
                    <p className="text-sm text-gray-500">Instagram</p>
                    <p className="font-medium">@monarchevents</p>
                  </div>
                </div>

                <div className="flex justify-between px-5 space-x-2">
                  <button
                    onClick={handleSendMessage}
                    className="flex items-center justify-center w-auto px-2 py-1 text-Blud border border-Blud font-light rounded-md transition duration-300 hover:border-Blud hover:text-Blud"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: venue.title,
                          url: window.location.href,
                        });
                      }
                    }}
                    className="flex items-center justify-center w-auto px-2 py-1 text-blue-500 border border-blue-500 font-light rounded-md transition duration-300 hover:border-Blud hover:text-Blud"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </button>
                </div>

                <Link
                  to={`/bookVenue/${venue._id}`}
                  className="flex items-center justify-center w-full px-4 py-2 text-white font-bold rounded-md bg-Blud transition duration-300 hover:bg-hoverBtn"
                >
                  <span className="animate-pulse">Book Venue</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </CardContent>
            </Card>
          </div> */}
          <div className="lg:w-1/3">
            <Card className="sticky top-4">
              <DialogTitle className="border-b">
                <h3 className="text-xl font-bold text-black">
                  Interested in this venue?
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Please fill the interest form with your contact details. You
                  will receive detailed information about the venue and its
                  availability before making any payment.
                </p>
              </DialogTitle>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4 mb-5">
                  <button
                    onClick={() => {
                      window.location.href = `tel:+234 801 234 5678`;
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-black py-3 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-red-600 animate-pulse" />
                    <span>
                      Urgent? <span className=" underlin">Call Now</span>{" "}
                    </span>
                  </button>

                  <Link to={`/Venue/VenueInterestPage/${venue._id}`}>
                    <button className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 border-2 border-blue-600 py-3 rounded-md hover:bg-blue-50 transition-colors">
                      Express Interest
                    </button>
                  </Link>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: venue.title,
                          url: window.location.href,
                        });
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 text-gray-600 py-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Venue
                  </button>
                </div>

                <Link className="" to={`/bookVenue/${venue._id}`}>
                  <button className="relative flex mx-auto items-center justify-center w-auto px-4 py-2 text-white font-bold rounded-md bg-Blud transition duration-300 group overflow-hidden border border-transparent group-hover:border-hoverBtn">
                    <span className="relative z-10 transition-colors group-hover:text-hoverBtn">
                      Proceed to Payment
                    </span>
                    <ChevronRight className="relative z-10 w-5 h-5 ml-2 transition-colors group-hover:text-hoverBtn" />
                    <span className="absolute inset-0 w-full h-full bg-white rounded-md transform scale-0 transition-transform group-hover:scale-100"></span>
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-24">
          <h2 className="text-2xl font-bold mb-6">
            Other Venues YOu may Like <span>{venue?.createdBy?._id}</span>
          </h2>
          <RelatedVenue currentCathegory={venue.category} currentVenueId={id} />
        </div>
      </div>

      {/* Message Modal */}
      {isMessageModalOpen && currentUser && (
        <MessageModal
          currentUser={currentUser}
          receiverId={venue?.createdBy}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SingleVenue;

// Import the MessageModal component from your existing components

const VenueGalleryModal = ({ venue, images = [], loading = false }) => {
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
              alt={`${venue.name} ${index + 1}`}
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
            <DialogTitle sx={{ m: 0, p: 0 }}>{venue.name} Gallery</DialogTitle>

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
                  alt={`${venue.name} ${index + 1}`}
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

const RelatedVenue = ({ currentCathegory, currentVenueId }) => {
  const [venue, setVenue] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllVenues`);
        const data = await response.json();
        const relatedVenue = data
          .filter(
            (venue) =>
              // Filter businesses of the same category but exclude current business
              venue.category === currentCathegory &&
              venue._id !== currentVenueId
          )
          .slice(0, 10); // Limit to 10 items
        setVenue(relatedVenue);
      } catch (error) {
        console.error("Error fetching related businesses:", error);
      }
    };
    fetchVenues();
  }, [currentCathegory, currentVenueId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = venue.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(venue.length / itemsPerPage);

  // If no related businesses, don't render the component
  if (venue.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentVenues.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
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
