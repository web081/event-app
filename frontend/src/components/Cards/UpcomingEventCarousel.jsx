import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import backendURL from "../../config";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "../../components/Cards/eventsCard";

const UpcomingEventCarousel = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLocation, setUserLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const OPENCAGE_API_KEY = "599f4c582d104381aa756323a2345575";
  const [itemsPerView, setItemsPerView] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getUserLocation = async () => {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${OPENCAGE_API_KEY}`
          );

          if (!response.ok) throw new Error("Geocoding API request failed");

          const data = await response.json();
          const state =
            data.results[0]?.components?.state || "Unknown Location";
          setUserLocation(state);
        } catch (error) {
          console.error("Location error:", error);
          setUserLocation("Unknown Location");
        }
        setLoading(false);
      } else {
        setUserLocation("Unknown Location");
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const endpoint =
          userLocation && userLocation !== "Unknown Location"
            ? `${backendURL}/api/getAllEvents?state=${encodeURIComponent(
                userLocation
              )}`
            : `${backendURL}/api/getAllEvents`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [userLocation]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth;
    const targetScroll =
      container.scrollLeft +
      (direction === "next" ? scrollAmount : -scrollAmount);

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <EventHeader />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h2 className="text-2xl font-bold flex flex-wrap items-center gap-2">
          Events in
          <span className="text-blue-600">{userLocation}</span>
        </h2>
        <div className="text-blue-600 font-semibold cursor-pointer underline hover:no-underline">
          View All
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No events found in {userLocation}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {events.map((event, index) => (
              <div
                key={index}
                className="w-full min-w-[300px] sm:min-w-[350px] snap-start"
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>

          {events.length > itemsPerView && (
            <>
              <button
                onClick={() => scroll("prev")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              <button
                onClick={() => scroll("next")}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex + itemsPerView >= events.length}
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UpcomingEventCarousel;

export const EventHeader = () => {
  return (
    <div className="relative mb-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero section with dark theme */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Floating particles background effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255, 69, 58, 0.1) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Main heading with highlight effect */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black">
            Find Amazing
            <span className="relative inline-block mx-3 text-red-500">
              Events
              <span className="absolute bottom-0 left-0 w-full h-2 bg-red-500/20" />
            </span>
            Near You
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-lg md:text-xl text-black   max-w-2xl mx-auto">
            Discover and explore upcoming events in your area
          </p>

          {/* Event types */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {["Concerts", "Conferences", "Weddings", "Corporate", "Social"].map(
              (type) => (
                <span
                  key={type}
                  className="px-6 py-2 bg-white rounded-full shadow-sm border border-gray-100 
                hover:border-blue-200 hover:shadow-md transition-all duration-200"
                >
                  {type}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
