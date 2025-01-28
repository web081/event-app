import React from "react";
import { MapPin, Building2, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const BusinessCard = ({ business }) => {
  return (
    <div className="bg-gray-5 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative">
        <img
          src={business.coverImage || "/api/placeholder/400/300"}
          alt={business.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent" />
        <Link
          to={`/service/${business._id}`}
          className="absolute bottom-4 right-4 bg-white text-gray-900 px-2 py-1 rounded-md text-sm font-medium transition-transform duration-300 ease-out hover:scale-110 hover:bg-gray-200 hover:font-semibold hover:text-blue-500 shadow-md hover:shadow-lg"
        >
          Explore
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>
            {business.address?.state}, {business.address?.lga}
          </span>
        </div>

        {/* Business Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {business.name}
        </h3>

        {/* Business Type */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Building2 className="w-4 h-4" />
          <span className="text-sm font-semibold text-red-400">
            {business.type}
          </span>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {business.bio || "No Business description available"}
        </p>

        {/* Footer Info */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Experience: {business.yearsOfExperience}y</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{business.verified ? "Verified" : "Unverified"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
