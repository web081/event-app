import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { GrRestroom } from "react-icons/gr";
import { FaUsers } from "react-icons/fa";
import backendURL from "../config";
import VenueImage from "../assets/Image/eventImage2.png";
import EventImage from "../assets/Image/venueImag2.png";
import { Link, useNavigate } from "react-router-dom";
import VenueCard from "../components/Cards/venueCard";

function Venues() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueStates, setUniqueStates] = useState([]);
  const [venueTypes] = useState(["Indoor", "Outdoor", "Both"]);
  const navigate = useNavigate();
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllVenues`);
        const data = await response.json();
        setVenues(data.venues || []); // Access venues array from response
        setFilteredVenues(data.venues || []);

        const categories = [
          ...new Set((data.venues || []).map((venue) => venue.category)),
        ]
          .filter((cat) => cat && cat.trim() !== "")
          .sort();
        const states = [
          ...new Set((data.venues || []).map((venue) => venue.address.state)),
        ]
          .filter((loc) => loc && loc.trim() !== "")
          .sort();

        setUniqueCategories(categories);
        setUniqueStates(states);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const handleSearch = () => {
    const filtered = venues.filter((venue) => {
      const matchCategory = !category || venue.category === category;
      const matchState = !state || venue.address.state === state;
      const matchType = !type || venue.type === type;
      return matchCategory && matchState && matchType;
    });

    setFilteredVenues(filtered);
    setIsModalOpen(true);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVenues.slice(indexOfFirstItem, indexOfLastItem);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleVenueClick = (venueId) => {
    console.log("Business clicked:", venueId);
    navigate(`/singleVenue/${venueId}`);
  };

  return (
    <>
      <div className="bg-gray-50">
        <div className="min-h-screen">
          {/* Hero Section */}
          <div
            className="relative h-screen bg-cover bg-top mb-16"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${VenueImage})`,
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <h1 className="text-2xl md:text-4xl font-bold mb-6">
                Book a <span className="text-red-600">Venue</span> for your{" "}
                <span className="text-red-600">Event</span>
              </h1>

              <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg w-full max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-3 rounded-md text-black border border-gray-500 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Category</option>
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="p-3 rounded-md text-black border border-gray-500 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select State</option>
                    {uniqueStates.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="p-3 rounded-md text-black border border-gray-500 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Space Preference</option>
                    {venueTypes.map((venueType) => (
                      <option key={venueType} value={venueType}>
                        {venueType}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleSearch}
                    className="p-3 bg-red-600 text-white rounded-md hover:bg-red-700 w-full max-w-sm"
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
              <div className="bg-white rounded-lg w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto relative p-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {currentItems.map((venue) => (
                    <VenueCard key={venue._id} venue={venue} />
                  ))}
                </div>
                <div className="mt-12 flex justify-center gap-4">
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
                    {Math.ceil(filteredVenues.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={
                      currentPage >=
                      Math.ceil(filteredVenues.length / itemsPerPage)
                    }
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wedding Venues Section */}
        <div className="">
          <WeddingVenues />
        </div>

        {/* Call to Action Section */}
        <section className="lg:px-12 my-24">
          <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
            <img
              src={EventImage}
              alt="Business"
              className="w-full h-full object-cover opacity-95"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
              <h2 className="text-2xl font-bold mb-2">
                Connect with Top{" "}
                <span className="text-red-600">Service Providers</span> Near You
              </h2>
              <p className="text-sm mb-4 text-center max-w-lg">
                Find experienced and verified professionals for all your service
                needs
              </p>
              <button className="bg-red-600 text-white px-10 py-3 rounded-full text-md transition-all duration-300 ease-out hover:scale-105 font-semibold">
                Explore Services
              </button>
            </div>
          </div>
        </section>

        {/* Top Venues Section */}
        <div className="py-[1rem]">
          <TopVenues />
        </div>

        {/* Venues by State Section */}
        <section className="py-[1rem]">
          <VenueByState />
        </section>
      </div>
    </>
  );
}

const WeddingVenues = () => {
  const [venues, setVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllVenues`);
        const data = await response.json();
        const weddingVenues = (data.venues || [])
          .filter((venue) => venue.category === "wedding")
          .slice(0, 9);
        setVenues(weddingVenues);
      } catch (error) {
        console.error("Error fetching wedding venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const currentVenues = venues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="px-6 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Wedding Venues</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentVenues.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TopVenues = () => {
  const [venues, setVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(
          `${backendURL}/api/getAllVenues?page=${currentPage}&limit=${itemsPerPage}`
        );
        const data = await response.json();
        setVenues(data.venues || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, [currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = venues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const totalPages = Math.ceil(venues.length / itemsPerPage);

  return (
    // <div className="px-6 py-12 ">
    //   <div className="max-w-7xl mx-auto">
    //     <div className="flex justify-between items-center mb-12">
    //       <h2 className="text-2xl font-semibold text-gray-900">
    //         Popular Event Centres
    //       </h2>
    //     </div>
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    //       {currentVenues.map((venue) => (
    //         <VenueCard key={venue._id} venue={venue} />
    //       ))}
    //     </div>

    //     <div className="mt-12 flex justify-center items-center gap-2">
    //       <button
    //         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    //         disabled={currentPage === 1}
    //         className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50"
    //       >
    //         ‹
    //       </button>

    //       {[...Array(totalPages)].map((_, index) => (
    //         <button
    //           key={index + 1}
    //           onClick={() => setCurrentPage(index + 1)}
    //           className={`w-8 h-8 flex items-center justify-center rounded-md ${
    //             currentPage === index + 1 ? "bg-gray-200" : "hover:bg-gray-100"
    //           }`}
    //         >
    //           {index + 1}
    //         </button>
    //       ))}

    //       <button
    //         onClick={() =>
    //           setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    //         }
    //         disabled={currentPage === totalPages}
    //         className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50"
    //       >
    //         ›
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Popular Event Centres
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {venues &&
            venues.map((venue) => <VenueCard key={venue._id} venue={venue} />)}
        </div>

        <div className="mt-12 flex justify-center items-center gap-2">
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
                currentPage === index + 1 ? "bg-gray-200" : "hover:bg-gray-100"
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
      </div>
    </div>
  );
};

const VenueByState = () => {
  const [venues, setVenues] = useState([]);
  const [userLocation, setUserLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const OPENCAGE_API_KEY = "599f4c582d104381aa756323a2345575";

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
    const fetchVenues = async () => {
      try {
        const endpoint =
          userLocation && userLocation !== "Unknown Location"
            ? `${backendURL}/api/getAllVenues?state=${encodeURIComponent(
                userLocation
              )}`
            : `${backendURL}/api/getAllVenues`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setVenues(data?.venues);
        console.log(data, "venue.......");
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchVenues();
  }, [userLocation]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = venues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(venues.length / itemsPerPage);

  return (
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Venues in <span className="text-blue-600">{userLocation}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentVenues.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </div>

        <div className="mt-12 flex justify-center items-center gap-2">
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
                currentPage === index + 1 ? "bg-gray-200" : "hover:bg-gray-100"
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
      </div>
    </div>
  );
};

export default Venues;
