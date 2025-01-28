// EventTypeCategories.js
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import backendURL from "../../config";

const EventTypeCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [venues, setVenues] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const carouselRef = useRef(null);

  // Map of category images
  const categoryImages = {
    wedding: "/api/placeholder/400/320",
    corporate: "/api/placeholder/400/320",
    conference: "/api/placeholder/400/320",
    training: "/api/placeholder/400/320",
    meeting: "/api/placeholder/400/320",
    get_together: "/api/placeholder/400/320",
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllVenues`);
        const data = await response.json();
        setVenues(data.venues);

        const categoryStats = processCategoryData(data.venues);
        setCategoryData(categoryStats);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const processCategoryData = (venueData) => {
    const categoryStats = {};

    venueData.forEach((venue) => {
      const category = venue.type || "other";
      if (!categoryStats[category]) {
        categoryStats[category] = {
          name: category,
          eventCentres: 0,
          image: categoryImages[category] || "/api/placeholder/400/320",
          totalCapacity: 0,
          averageRating: 0,
          ratingCount: 0,
          coverImage: venue.coverImage,
        };
      }

      categoryStats[category].eventCentres++;
      if (venue.capacity) {
        const [min] = venue.capacity.split("-").map(Number);
        categoryStats[category].totalCapacity += min || 0;
      }
      if (venue.rating) {
        categoryStats[category].averageRating += venue.rating;
        categoryStats[category].ratingCount++;
      }
    });

    return Object.entries(categoryStats).map(([key, category]) => ({
      ...category,
      id: key,
      averageRating:
        category.ratingCount > 0
          ? (category.averageRating / category.ratingCount).toFixed(1)
          : 0,
    }));
  };

  const filteredCategories = categoryData.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredCategories, "filteredCategories");

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50  ">
      <h2 className="text-2xl font-bold mb-6">Popular Events Categories</h2>

      {/* Search Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
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
      </div>

      {/* Categories Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredCategories.map((category) => (
            <Link to={`/Venue/Category/${category.name}`} key={category._id}>
              <div className="min-w-[280px] md:min-w-[240px] rounded-lg overflow-hidden snap-start cursor-pointer group transform transition-transform hover:scale-105">
                <div className="relative h-64 md:h-48">
                  <img
                    src={category.coverImage || category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-lg md:text-base font-semibold mb-1 text-white capitalize">
                      {category.name.replace(/_/g, " ")}
                    </h3>
                    <div className="space-y-0.5">
                      <p className="text-sm md:text-xs text-white">
                        {category.eventCentres} Event Centre
                        {category.eventCentres !== 1 ? "s" : ""}
                      </p>
                      {category.averageRating > 0 && (
                        <p className="text-xs md:text-[10px] text-yellow-400">
                          ⭐ {category.averageRating}
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

export default EventTypeCategories;
