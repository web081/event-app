import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import backendURL from "../config";
import HeroImage from "../assets/Image/eventImageHero.jpg";
// import VenueImage from "../assets/Image/venueImag2.png";
import VenueImage from "../assets/Image/eventImageHero.jpg";
import moment from "moment";
import { FaCalendar } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "../components/Cards/eventsCard";
import PartyServices from "../components/Eventflyers";

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [spacePreference, setSpacePreference] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New state for storing unique locations and categories
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const itemsPerPage = 9;
  const spacePreferences = ["Indoor", "Outdoor", "Both"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllEvents`);
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);

        // Extract and set unique locations and categories
        const locations = [...new Set(data.map((event) => event.state))]
          .filter((loc) => loc && loc.trim() !== "")
          .sort();
        const categories = [...new Set(data.map((event) => event.eventType))]
          .filter((cat) => cat && cat.trim() !== "")
          .sort();

        setUniqueLocations(locations);
        setUniqueCategories(categories);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/getAllEvents?eventType=${eventType}&state=${state}`
      );
      const data = await response.json();
      setFilteredEvents(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error searching events:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  const handleEventClick = (eventId) => {
    // Implement event click logic
    console.log("Event clicked:", eventId);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Search */}
        <div
          className="relative h-screen  bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${HeroImage})`,
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <h1 className="text-white text-center text-4xl md:text-6xl font-bold mb-8">
              Search for <span className="text-red-600">Events</span> near you
            </h1>

            <div className="bg-white bg-opacity-10 backdrop-blur-m p-6 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="">Select Location</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSearch}
                  className="w-full p-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentItems.map((event, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg shadow-md flex flex-col"
                    >
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm">
                    Page {currentPage} of{" "}
                    {Math.ceil(filteredEvents.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={
                      currentPage >=
                      Math.ceil(filteredEvents.length / itemsPerPage)
                    }
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <section>
        <EventsNearYou />
      </section>

      <section className="lg:px-12 my-16 ">
        <div className="relative w-full h-[200px] mt-8 rounded-lg overflow-hidden">
          <div className="absolute inset-0 z-10 "></div>
          <img
            src={VenueImage}
            alt="Venue"
            className="w-full h-full object-cover opacity-95  blur-[px] md:rounded-full"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              Find the <span className="text-Blud">BEST VENUE</span> for your
              Events
            </h2>
            <p className="text-sm mb-4 opacity-90 lg:mr-[15.5rem]">
              Lorem ipsum dolor sit amet consectetur. <br></br> Velit viverra
              rhoncus pharetra in ut sit.
            </p>

            <Link to={"/venues"}>
              <button className="bg-red-600 text-white px-10 py-3 rounded-full text-md transition-all duration-300 ease-out hover:scale-105 font-semibold">
                Venue
              </button>
            </Link>
          </div>
        </div>
      </section>
      <section>
        <OtherEvents />
      </section>
      <section>
        <h1>
          <PartyServices />{" "}
        </h1>
      </section>
    </>
  );
}

export default Events;

export const EventsNearYou = () => {
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

  const handleEventClick = (eventId) => {
    navigate(`/singleEvent/${eventId}`);
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
    <div className="containe mx-auto px-2 py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h2 className="text-2xl font-bold flex flex-wrap items-center gap-2">
          Events in
          <span className="text-blue-600">{userLocation}</span>
        </h2>
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

const OtherEvents = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllEvents`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Await the JSON response
        const limitedData = data.slice(0, 9); // Limit to 9 items
        setEvents(limitedData);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Other Events you may like
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentEvents.map((event, index) => (
            <div
              key={index}
              className="w-full min-w-[300px] sm:min-w-[350px] snap-start"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
