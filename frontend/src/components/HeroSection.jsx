import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import backendURL from "../config";
import HeroImage from "../assets/Image/HeroImage.png";
import moment from "moment";
import { FaCalendar } from "react-icons/fa";
import EventCard from "../components/Cards/eventsCard";

function HeroSection() {
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
        `${backendURL}/api/getAllEvents?eventType=${eventType}&state=${state}&spacePreference=${spacePreference}`
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
            Discover where the <span className="text-red-600">fun</span> is
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
                {/* {currentItems.map((event, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg shadow-md flex flex-col"
                  >
                    <img
                      src={event?.coverImage || "/api/placeholder/400/300"}
                      alt={event?.title}
                      className="rounded-t-lg object-cover h-40 w-full"
                    />
                    <div className="p-3 flex-grow">
                      <h5 className="mb-2 text-base font-bold tracking-tight text-gray-900">
                        {event?.title}
                      </h5>
                      <p className="text-gray-600 mb-1 text-sm">
                        <FaCalendar className="inline-block mr-2" size={14} />
                        {moment(event?.Date).format("ddd, MMM DD • h:mm A")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event?.location}, {event?.state}
                      </p>
                    </div>
                    <div className="p-3 flex gap-2">
                      <button
                        className={`w-full px-3 py-2 text-xs font-bold border rounded-md ${
                          event.price <= 0
                            ? "text-green-600 border-green-600"
                            : "text-blue-600 border-blue-600"
                        }`}
                      >
                        {event.price <= 0
                          ? "Free"
                          : `N${event?.price?.toLocaleString()}`}
                      </button>
                      <button
                        onClick={() => handleEventClick(event.id)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {event.price <= 0 ? "View" : "Get Tickets"}
                      </button>
                    </div>
                  </div>
                ))} */}
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
  );
}

export default HeroSection;
