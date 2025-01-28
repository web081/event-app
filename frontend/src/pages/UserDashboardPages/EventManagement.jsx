import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import { Search } from "lucide-react";
import { Input } from "@mui/material";
import { useSelector } from "react-redux";

import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  User,
  Mail,
  Tag,
} from "lucide-react";
import axios from "axios";
import backendURL from "../../config";

const EventManagements = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [uniqueEvents, setUniqueEvents] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (eventFilter) params.append("eventName", eventFilter);

        const response = await axios.get(
          `${backendURL}/api/events/tickets?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setTickets(response.data.tickets);

        // Extract unique event names for the filter dropdown
        const events = [
          ...new Set(
            response.data.tickets.map((ticket) => ticket.eventId.title)
          ),
        ];
        setUniqueEvents(events);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userInfo.token, searchTerm, eventFilter]);

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Tickets Dashboard
        </h1>
        <p className="text-slate-600">
          View all your event tickets and their details
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name, email, or ticket ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
        <div className="w-full md:w-64">
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All Events</option>
            {uniqueEvents.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Tickets</p>
                <p className="text-2xl font-semibold">{tickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-slate-600">Active Tickets</p>
                <p className="text-2xl font-semibold">
                  {tickets.filter((ticket) => ticket.status === "valid").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Value</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(
                    tickets.reduce((sum, ticket) => sum + ticket.price, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Event Tickets</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Ticket Details</th>
                  <th className="text-left py-3 px-4">Event Info</th>
                  <th className="text-left py-3 px-4">Attendee</th>
                  <th className="text-left py-3 px-4">Payment Details</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.ticketId}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          Ticket ID: {ticket.ticketId}
                        </p>
                        <p className="text-sm text-slate-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {formatDateTime(ticket.purchaseDate)}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{ticket.eventId.title}</p>
                        <p className="text-sm text-slate-500">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {ticket.eventId.location}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {ticket.userId.username}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {ticket.userId.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {formatCurrency(ticket.price)}
                        </p>
                        <p className="text-sm text-slate-500">
                          Ref: {ticket.paymentReference}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          ticket.status === "valid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventManagements;
