import React, { useState, useEffect } from "react";
import { X, MapPin, Clock, Users, Building2, ArrowRight } from "lucide-react";
import backendURL from "../config";
import VenueImage from "../assets/Image/venueImag2.png";
import EventImage from "../assets/Image/eventImage2.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BusinessCard from "../components/Cards/businessCard";

function Services() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [businessType, setBusinessType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueStates, setUniqueStates] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 9;

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllBusinesses`);
        const data = await response.json();
        setBusinesses(data.businesses);
        setFilteredBusinesses(data.businesses);

        // Extract unique business types and states
        const types = [
          ...new Set(data.businesses.map((business) => business.type)),
        ]
          .filter((type) => type && type.trim() !== "")
          .sort();
        const states = [
          ...new Set(
            data.businesses.map((business) => business.address?.state)
          ),
        ]
          .filter((state) => state && state.trim() !== "")
          .sort();

        setUniqueTypes(types);
        setUniqueStates(states);
        setTotalPages(Math.ceil(data.businesses.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };
    fetchBusinesses();
  }, []);

  const handleSearch = () => {
    const filtered = businesses.filter((business) => {
      const matchType = !businessType || business.type === businessType;
      const matchState =
        !selectedState || business.address?.state === selectedState;
      return matchType && matchState;
    });

    setFilteredBusinesses(filtered);
    setIsModalOpen(true);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBusinesses.slice(startIndex, endIndex);
  };

  const handleBusinessClick = (businessId) => {
    console.log("Business clicked:", businessId);
    navigate(`service/${businessId}`);
  };

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen">
        {/* Hero Section */}
        <div
          className="relative h-screen bg-cover bg-top"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${VenueImage})`,
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-6">
              Find the Perfect{" "}
              <span className="text-red-600">Service Provider</span> for Your
              Needs
            </h1>

            <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg w-full max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="p-2 rounded-md text-black border border-gray-500 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Business Type</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="p-2 rounded-md text-black border border-gray-500 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select State</option>
                  {uniqueStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
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
            <div className="bg-white rounded-lg w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto relative p-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6">Search Results</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentPageData().map((business) => (
                  <div
                    key={business._id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={business.coverImage || "/api/placeholder/400/300"}
                        alt={business.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {business.address?.state}, {business.address?.lga}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {business.name}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{business.type}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {business.bio || "No description available"}
                      </p>

                      <div className="flex items-center justify-between mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Experience: {business.yearsOfExperience}y</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>
                            {business.verified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                      </div>
                      <Link to={`/service/${business._id}`}>
                        <button className="flex items-center text-sm text-red-600 font-semibold hover:text-Blud transition-colors duration-200">
                          View Details
                          <ArrowRight className="w-4 h-4 mt-1 ml-2" />
                        </button>
                      </Link>
                    </div>
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
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <section className="lg:px-12 my-16 ">
        <div className="relative w-full h-[200px] mt-8 rounded-lg overflow-hidden">
          <div className="absolute inset-0 z-10 "></div>
          <img
            src={VenueImage}
            alt="Venue"
            className="w-full h-full object-cover opacity-95  blur-[px]"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              Find the Top <span className="text-Blud">Events </span> Happening
              Around you
            </h2>
            <p className="text-sm mb-4 opacity-90 lg:mr-[15.5rem]">
              Lorem ipsum dolor sit amet consectetur. <br></br> Velit viverra
              rhoncus pharetra in ut sit.
            </p>
            <button className="bg-red-600 text-white px-10 py-3 rounded-full text-md transition-all duration-300 ease-out hover:scale-105 font-semibold">
              Events
            </button>
          </div>
        </div>
      </section>
      {/* |TopPhotographers */}
      <TopPhotographers />
      {/* MakeupArtists */}
      <section>
        <MakeupArtists />
      </section>
      <section>
        <FashionDesigners />
      </section>
      <section>
        <Catering />
      </section>
    </div>
  );
}

export default Services;

const TopPhotographers = () => {
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllBusinesses`);
        const data = await response.json();
        const photographers = data.businesses.filter(
          (business) => business.type === "photography"
        );
        setBusinesses(photographers);
      } catch (error) {
        console.error("Error fetching wedding businesses:", error);
      }
    };
    fetchVenues();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = businesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(businesses.length / itemsPerPage);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Popular Photographers/ Videographer
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentVenues.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>

        {/* Pagination */}
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

// TOP/ Popular Makeup Artists

const MakeupArtists = () => {
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllBusinesses`);
        const data = await response.json();
        const photographers = data.businesses.filter(
          (business) => business.type === "makeup artists"
        );
        setBusinesses(photographers);
      } catch (error) {
        console.error("Error fetching wedding businesses:", error);
      }
    };
    fetchVenues();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = businesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(businesses.length / itemsPerPage);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            TOP/ Popular Makeup Artists
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentVenues.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>

        {/* Pagination */}
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

const FashionDesigners = () => {
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllBusinesses`);
        const data = await response.json();
        const photographers = data.businesses.filter(
          (business) => business.type === "fashion designer"
        );
        setBusinesses(photographers);
      } catch (error) {
        console.error("Error fetching wedding businesses:", error);
      }
    };
    fetchVenues();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = businesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(businesses.length / itemsPerPage);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            TOP/ Popular Fashion Designers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentVenues.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>

        {/* Pagination */}
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

const Catering = () => {
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllBusinesses`);
        const data = await response.json();
        const photographers = data.businesses.filter(
          (business) => business.type === "Catering"
        );
        setBusinesses(photographers);
      } catch (error) {
        console.error("Error fetching Catering businesses:", error);
      }
    };
    fetchVenues();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = businesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(businesses.length / itemsPerPage);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            TOP/ Popular Catering Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentVenues.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>

        {/* Pagination */}
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
