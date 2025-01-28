import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const VenueCard = ({ venue }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-xl">
      <div className="relative">
        <Link to={`/venue/${venue._id}`}>
          <img
            src={venue.coverImage || "/api/placeholder/400/300"}
            alt={venue.title}
            className="w-full h-48 object-cover transition-transform duration-300 ease-out hover:scale-105"
          />
        </Link>

        <div className="absolute bottom-4 right-4">
          <Link
            to={`/venue/${venue._id}`}
            className="bg-white text-gray-900 px-2 py-1 rounded-md text-sm font-medium transition-transform duration-300 ease-out hover:scale-110 hover:bg-gray-200 hover:font-semibold hover:text-Blud shadow-md hover:shadow-lg"
          >
            Explore
          </Link>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold mb-1">{venue.title}</h3>
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
          <MapPin size={14} />
          <span>{venue.address?.state}</span>
        </div>

        <div className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-3 h-3 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-600">
            5 ({venue.reviews || 22})
          </span>
        </div>

        <div className="text-xs text-gray-600">
          Upto {venue.capacity || 500} Guests
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
