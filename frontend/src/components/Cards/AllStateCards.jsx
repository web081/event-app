import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import backendURL from "../../config";
import { Link } from "react-router-dom";

const StateEventCenters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [venues, setVenues] = useState([]);
  const [stateData, setStateData] = useState([]);
  const carouselRef = useRef(null);

  // Map of state images
  const stateImages = {
    Abia: "/api/placeholder/400/320",
    Adamawa: "/api/placeholder/400/320",
    Anambra: "/api/placeholder/400/320",
    Bauchi: "/api/placeholder/400/320",
    Bayelsa: "/api/placeholder/400/320",
    // Add more states and their image URLs
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllVenues`);
        const data = await response.json();
        setVenues(data?.venues);
        const stateStats = processStateData(data?.venues);
        setStateData(stateStats);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const processStateData = (venueData) => {
    const stateStats = {};

    venueData.forEach((venue) => {
      const state = venue.address.state;
      if (!state) return;

      if (!stateStats[state]) {
        stateStats[state] = {
          name: state,
          eventCentres: 0,
          region: "NIGERIA",
          image: stateImages[state] || "/api/placeholder/400/320", // Use state-specific image
          categories: new Set(),
          totalCapacity: 0,
          averageRating: 0,
          ratingCount: 0,
          coverImage: venue.coverImage, // Store the first venue's cover image as fallback
        };
      }

      stateStats[state].eventCentres++;
      if (venue.category) stateStats[state].categories.add(venue.category);
      if (venue.capacity) stateStats[state].totalCapacity += venue.capacity;
      if (venue.rating) {
        stateStats[state].averageRating += venue.rating;
        stateStats[state].ratingCount++;
      }
    });

    return Object.values(stateStats).map((state) => ({
      ...state,
      categories: Array.from(state.categories),
      averageRating:
        state.ratingCount > 0
          ? (state.averageRating / state.ratingCount).toFixed(1)
          : 0,
    }));
  };

  const filteredStates = stateData.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleStateClick = (stateName) => {
    const stateVenues = venues.filter(
      (venue) => venue.address.state.toLowerCase() === stateName.toLowerCase()
    );
    console.log(`Venues in ${stateName}:`, stateVenues);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      {/* header */}
      <VenueHeader />
      {/* Search Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search states..."
                className="md:w-[50%] p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <span>Popular:</span>
          <button className="hover:text-blue-600">Lagos</button>
          <button className="hover:text-blue-600">Abuja</button>
          <button className="hover:text-blue-600">Port Harcourt</button>
        </div>
      </div>
      {/* States Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredStates.map((state) => (
            <Link to={`/Venue/State/${state.name}`}>
              <div
                key={state.name}
                onClick={() => handleStateClick(state.name)}
                className="min-w-[280px] md:min-w-[240px] rounded-lg overflow-hidden snap-start cursor-pointer group transform transition-transform hover:scale-105"
              >
                <div className="relative h-64 md:h-48">
                  <img
                    src={state.coverImage || state.image}
                    alt={state.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <div className="text-xs md:text-sm text-gray-300 mb-1">
                      {state.region}
                    </div>
                    <h3 className="text-lg md:text-base font-semibold mb-1 text-white">
                      {state.name}
                    </h3>
                    <div className="space-y-0.5">
                      <p className="text-sm md:text-xs text-white">
                        {state.eventCentres} Event Centre
                        {state.eventCentres !== 1 ? "s" : ""}
                      </p>
                      {state.categories.length > 0 && (
                        <p className="text-xs md:text-[10px] text-gray-300">
                          {state.categories.length} Categories
                        </p>
                      )}
                      {state.averageRating > 0 && (
                        <p className="text-xs md:text-[10px] text-yellow-400">
                          ⭐ {state.averageRating}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StateEventCenters;

export const VenueHeader = () => {
  return (
    <div className="relative mb-12">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 transform -skew-y-2" />

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main heading with highlight effect */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Discover Perfect
            <span className="relative inline-block mx-3 text-red-600">
              Venues
              <span className="absolute bottom-0 left-0 w-full h-2 bg-red-200 transform -skew-x-12" />
            </span>
            for Your Events
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore premier event spaces across Nigeria's finest locations
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-lg bg-white shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                36+
              </div>
              <div className="text-sm text-gray-600">States Covered</div>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                1000+
              </div>
              <div className="text-sm text-gray-600">Event Centers</div>
            </div>
            <div className="hidden md:block p-4 rounded-lg bg-white shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                10K+
              </div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
