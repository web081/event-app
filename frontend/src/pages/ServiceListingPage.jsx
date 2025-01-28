import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useParams } from "react-router-dom";
import BusinessCard from "../components/Cards/businessCard";
import {
  Card,
  CardContent,
  InputBase,
  IconButton,
  Paper,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import backendURL from "../config";
import { Link } from "react-router-dom";

export const ServiceListingPage = () => {
  const { serviceType } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendURL}/api/getAllBusinesses`);
        const filteredBusinesses = response.data.businesses.filter(
          (business) =>
            business.type?.toLowerCase() === serviceType?.toLowerCase()
        );
        setBusinesses(filteredBusinesses);
      } catch (err) {
        setError("Failed to load businesses");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, [serviceType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBusinesses = businesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(businesses.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ py: 4 }}>
        {error}
      </Typography>
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
          Back to Services
        </Link>
        <Typography variant="h4" component="h1" gutterBottom>
          {serviceType?.replace(/_/g, " ")} Services
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {businesses.length} service provider{businesses.length !== 1 && "s"}{" "}
          available
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentBusinesses.map((business) => (
          <BusinessCard key={business._id} business={business} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
          className="mt-8 flex justify-center"
        />
      )}
    </div>
  );
};

export default ServiceListingPage;
