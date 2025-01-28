import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import backendURL from "../../config";
import BusinessCard from "./businessCard";

const TopServicesCard = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllBusinesses`);
        if (!response.ok) throw new Error("Failed to fetch businesses");
        const data = await response.json();
        setBusinesses(data.businesses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const scroll = (direction) => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = businesses.length - itemsPerView;
      return direction === "next"
        ? Math.min(prevIndex + 1, maxIndex)
        : Math.max(prevIndex - 1, 0);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h2 className="text-2xl font-bold">Top services</h2>
        <div
          onClick={() => navigate("/services")}
          className="text-blue-600 font-semibold cursor-pointer hover:underline"
        >
          View All ({businesses.length})
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden flow-">
          <div
            className=" flex transition-transform duration-500 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {businesses.map((business) => (
              <div
                key={business._id}
                className="flex-shrink-0 "
                style={{
                  width: `${100 / itemsPerView}%`,
                }}
              >
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </div>

        {businesses.length > itemsPerView && (
          <>
            <button
              onClick={() => scroll("prev")}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg transition-all duration-200 ${
                currentIndex === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-800 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("next")}
              disabled={currentIndex >= businesses.length - itemsPerView}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg transition-all duration-200 ${
                currentIndex >= businesses.length - itemsPerView
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-800 hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopServicesCard;
