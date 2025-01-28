import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <>
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md h-full flex flex-col">
        <img
          src={event?.coverImage || "/api/placeholder/400/300"}
          alt={event?.title}
          className="rounded-t-lg object-cover h-48"
        />
        <div className="p-4 flex-grow">
          <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900">
            {event?.title}
          </h5>
          <p className="text-gray-600 flex items-center mb-2">
            <FaCalendarAlt className="w-3 h-3 mr-2 text-gray-600" />
            <span>{moment(event?.Date).format("ddd, MMM DD • h:mm A")}</span>
          </p>
          <p className="text-sm text-gray-500 flex items-center">
            <FaMapMarkerAlt className="w-3 h-3 mr-2 text-gray-500" />
            <span>
              {event?.location}, {event?.state}
            </span>
          </p>
        </div>

        <div className="p-4 flex gap-2">
          <button
            className={`w-full px-4 py-2 text-sm font-bold border rounded-md ${
              event.price <= 0
                ? "text-red-600 border-red-600"
                : "text-red-600 border-red-600  "
            }`}
          >
            {event.price <= 0 ? "Free" : `N${event?.price?.toLocaleString()}`}
          </button>
          <button
            onClick={() => navigate(`/singEvenPage/${event?._id}`)}
            className="w-full px-4 py-2 text-sm font-semibold bg-red-600  rounded-md border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out hover:bg-transparent hover:scale-105"
          >
            {event.price <= 0 ? "View" : "Get Tickets"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EventCard;
