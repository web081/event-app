import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Card,
  CardContent,
  InputBase,
  IconButton,
  Paper,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import backendURL from "../../config";
import { Link } from "react-router-dom";
const EmptyState = ({ searchTerm }) => (
  <div className="text-center py-12 px-4">
    <img
      src="/api/placeholder/400/320"
      alt="No results"
      className="mx-auto h-48 w-48 mb-4"
    />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No services found for "{searchTerm}"
    </h3>
    <p className="text-gray-600 mb-4">
      Try adjusting your search or browse our available categories
    </p>
  </div>
);

// components/ServiceCard.jsx
const ServiceCard = ({ type, image, serviceCount }) => (
  <Link
    to={`/services/${type.toLowerCase()}`}
    className="min-w-[280px] md:min-w-[240px] snap-start"
    style={{ textDecoration: "none" }}
  >
    <Card
      sx={{
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <div className="relative h-64 md:h-48">
        <img
          src={image || "/api/placeholder/400/320"}
          alt={type}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-colors" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: 600, marginBottom: 0.5 }}
          >
            {type}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgb(209 213 219)" }}>
            {serviceCount}{" "}
            {serviceCount === 1 ? "professional" : "professionals"}
          </Typography>
        </div>
      </div>
    </Card>
  </Link>
);

// components/BusinessCard.jsx
const BusinessCard = ({ business }) => (
  <Card className="h-full">
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={business.coverImage || "/api/placeholder/400/320"}
        alt={business.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
      <Link
        to={`/business/${business._id}`}
        className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
      >
        View Details
      </Link>
    </div>
    <CardContent>
      <Typography variant="h6" component="h3" gutterBottom>
        {business.name}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        className="line-clamp-2 mb-2"
      >
        {business.description}
      </Typography>
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= (business.rating || 5)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        <Typography variant="body2" color="text.secondary">
          {business.rating || 5} ({business.reviews || 0})
        </Typography>
      </div>
      {business.location?.state && (
        <div className="flex items-center gap-1 mt-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <Typography variant="body2" color="text.secondary">
            {business.location.state}
          </Typography>
        </div>
      )}
    </CardContent>
  </Card>
);

// ServiceTypeCarousel.jsx
export const ServiceTypeCarousel = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/getAllBusinesses?page=1&limit=9`
        );
        setBusinesses(response.data.businesses);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const serviceTypes = businesses.reduce((acc, business) => {
    if (!acc[business.type]) {
      acc[business.type] = {
        type: business.type,
        serviceCount: 0,
        image: business.coverImage || "/api/placeholder/400/320",
      };
    }
    acc[business.type].serviceCount++;
    return acc;
  }, {});

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const serviceTypeArray = Object.values(serviceTypes).filter((service) =>
    service.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ py: 4 }}>
        {error}
      </Typography>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* header */}
      <ServiceHeader />
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                className="md:w-[50%] p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 text-sm text-gray-600">
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Popular:
          </Typography>
          {["Photography", "Catering", "Makeup"].map((service) => (
            <Button
              key={service}
              variant="text"
              size="small"
              onClick={() => setSearchTerm(service)}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              {service}
            </Button>
          ))}
        </div>
      </div>
      <div className="relative">
        {serviceTypeArray.length > 0 ? (
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {serviceTypeArray.map((service) => (
              <ServiceCard
                key={service.type}
                type={service.type}
                image={service.image}
                serviceCount={service.serviceCount}
              />
            ))}
          </div>
        ) : (
          <EmptyState searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
};

export const ServiceHeader = () => {
  return (
    <div className="relative mb-12">
      {/* Background accent with reversed skew for visual variety */}
      <div className="absolute inset-0 bg-gradient-to-l from-gray-50 to-gray-100 transform skew-y-2" />

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main heading with highlight effect */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Find Trusted
            <span className="relative inline-block mx-3 text-blue-600">
              Services
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 transform skew-x-12" />
            </span>
            for Your Events
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with top-rated event professionals and service providers
          </p>

          {/* Category highlights */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {[
              "Photographer",
              "Catering",
              "Makeup Artist",
              "Fashion Designers",
            ].map((category) => (
              <div
                key={category}
                className="px-6 py-2 bg-white rounded-full shadow-sm border border-gray-100 
                hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <span className="text-sm font-medium text-gray-800">
                  {category}
                </span>
              </div>
            ))}
          </div>

          {/* Stats grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-lg bg-white shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                500+
              </div>
              <div className="text-sm text-gray-600">Service Providers</div>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                15+
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="hidden md:block p-4 rounded-lg bg-white shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                4.8
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
