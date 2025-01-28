import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import { AlertCircle, Search } from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import backendURL from "../config";

const BlacklistPage = () => {
  const [blacklistedVenues, setBlacklistedVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBlacklistedVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendURL}/api/getAllBusinesses`);
        const data = await response.json();
        // Filter only blacklisted businesses
        const blacklisted = data.businesses.filter(
          (business) => business.blacklisted
        );
        setBlacklistedVenues(blacklisted);
        console.log(data, "blacklisted");
      } catch (err) {
        setError("Failed to load blacklisted venues");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlacklistedVenues();
  }, []);

  const filteredVenues = blacklistedVenues.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.address?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDurationStatus = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    if (end > now) {
      return `Until ${formatDate(endDate)}`;
    }
    return "Expired";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Blacklisted Businesses</h1>
        <p className="text-gray-600">
          View Businesses that have been blacklisted due to policy violations or
          misconduct
        </p>
      </div>

      {/* Search and Stats Section */}
      <div className="mb-8">
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search blacklisted venues..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      )}

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((business) => (
          <Card
            key={business._id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={business.coverImage || "/api/placeholder/400/300"}
                alt={business.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                Blacklisted
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{business.name}</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  📍 {business.address?.street}, {business.address?.city}
                </p>
                <p>🏢 Type: {business.type}</p>
                <p>📱 {business.phoneNumber}</p>
                <p>✉️ {business.email}</p>
                <p>⚠️ Reason: {business.blacklistDetails?.reason}</p>
                <p>📅 Blacklisted: {formatDate(business.blacklistedAt)}</p>
                <p>
                  ⏳ Duration:{" "}
                  {getDurationStatus(business.blacklistDetails?.duration)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredVenues.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No Business found
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? "No blacklisted business match your search criteria"
              : "There are currently no blacklisted businesses"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlacklistPage;
