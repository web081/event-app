import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import backendURL from "../../config";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaCalendar } from "react-icons/fa";
import EventCard from "../../components/Cards/eventsCard";

const TopEventsCard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

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
    const fetchEvents = async () => {
      try {
        const endpoint = `${backendURL}/api/getAllEvents`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h2 className="text-2xl font-bold">
          Upcoming Events you May Want To Attend
        </h2>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
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
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            <button
              onClick={() => scroll("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopEventsCard;
