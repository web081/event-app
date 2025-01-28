import React from "react";
import summerTripImage from "../assets/Image/flyerbg1.png";
import afroBeachImage from "../assets/Image/flyerbg2.png";
import housePartyImage from "../assets/Image/flyerbg3.png";
import coverImage from "../assets/Image/flyerbg.png";

const EventFlyersSection = () => {
  const flyers = [
    {
      id: 1,
      title: "Summer Trip",
      image: summerTripImage,
    },
    {
      id: 2,
      title: "Afro Beach",
      image: afroBeachImage,
    },
    {
      id: 3,
      title: "House Party",
      image: housePartyImage,
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-red-900 to-red-800 py-16">
      {/* Background overlay for the darker edges */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/50"
        style={{
          backgroundImage: `url(${coverImage})`, // Correct usage of template literal
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {flyers.map((flyer) => (
            <div key={flyer.id} className="flex flex-col items-center">
              {/* Card Container */}
              <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Image Container */}
                <div className="relative aspect-[3/4]">
                  <img
                    src={flyer.image}
                    alt={flyer.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* View Button */}
                <div className="p-4 bg-gray-100">
                  <button className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFlyersSection;
