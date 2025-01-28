import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, Button } from "@mui/material";
import backendURL from "../config";

const VenuePageByState = () => {
  const { stateName } = useParams();
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchStateVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllVenues`);
        const data = await response.json();
        const venueData = data.venues;
        const stateVenues = venueData.filter(
          (venue) =>
            venue.address?.state?.toLowerCase() === stateName?.toLowerCase()
        );
        setVenues(stateVenues);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStateVenues();
  }, [stateName]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = venues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(venues.length / itemsPerPage);

  const VenueCard = ({ venue }) => (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
        <img
          src={venue.coverImage || "/api/placeholder/400/320"}
          alt={venue.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <Link
          to={`/venue/${venue._id}`}
          className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
        >
          Explore
        </Link>
      </div>

      <CardContent className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{venue.title}</h3>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{venue.address?.state}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= (venue.rating || 5)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {venue.rating || 5} ({venue.reviews || 22})
          </span>
        </div>

        <p className="text-sm text-gray-600">
          Up to {venue.capacity || 500} Guests
        </p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to States
        </Link>
        <h1 className="text-3xl font-bold">Event Centers in {stateName}</h1>
        <p className="mt-2 text-gray-600">{venues.length} venues available</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(index + 1)}
                className="h-8 w-8 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VenuePageByState;
