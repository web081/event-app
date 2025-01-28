import React, { useEffect, useState } from "react";
import axios from "axios";
import backendURL from "../../config";

const ServiceCards = () => {
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/getAllBusinesses?page=1&limit=9`
        );
        setBusinesses(response.data.businesses);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 py-4">
        {businesses.map((business) => (
          <div
            key={business._id}
            className="flex flex-col items-center min-w-[100px] max-w-[200px] mx-2"
          >
            <div className="rounded-full h-24 w-24 overflow-hidden bg-gray-200">
              <img
                src={business.coverImage || "https://via.placeholder.com/150"}
                alt={business.name}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-2 text-sm font-medium">{business.name}</p>
            <p className="text-xs text-gray-500">{business.type}</p>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default ServiceCards;
