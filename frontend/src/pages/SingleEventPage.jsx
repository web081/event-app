import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  Tag,
  Share2,
  Ticket,
  Info,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  Badge,
  CardContent,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Share,
  Twitter,
  Facebook,
  LinkedIn,
  WhatsApp,
} from "@mui/icons-material";
import backendURL from "../config";
import moment from "moment";
import { FaCalendar } from "react-icons/fa";
import EventCard from ".././components/Cards/eventsCard";

const SingleEventPage = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentEventId, setCurrentEventId] = useState([]);
  const [currenteventType, setCurrenteventType] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendURL}/api/getEventById/${id}`);
        const data = await response.json();
        setEvent(data);
        setCurrenteventType(data.eventType);
        setCurrentEventId(data._id);
      } catch (error) {
        console.error("Error fetching Event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
      </div>
    );
  }

  const allImages = [event.coverImage, ...(event.additionalImages || [])];

  const handleTicketPurchase = () => {
    console.log("Handling ticket for event ID:", id);
    // Check if event is free (price is 0)
    if (event.price === 0) {
      navigate(`/FreeTicketRegistration/${id}`);
    } else {
      navigate(`/event/tickets/${id}`);
    }
  };
  const ImageGallery = () => (
    <Dialog open={showGallery} onClose={() => setShowGallery(false)}>
      <DialogTitle>Event Gallery</DialogTitle>
      <DialogContent className="max-w-4xl">
        <div className="relative">
          <img
            src={allImages[currentImageIndex]}
            alt={`Gallery ${currentImageIndex + 1}`}
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? allImages.length - 1 : prev - 1
                )
              }
              className="rounded-full bg-white/80"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === allImages.length - 1 ? 0 : prev + 1
                )
              }
              className="rounded-full bg-white/80"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div
              className="relative group cursor-pointer"
              onClick={() => setShowGallery(true)}
            >
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Share2 className="w-8 h-8 text-white" />
              </div>
            </div>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-orange-900" />
                    <span>
                      {new Date(event.Date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5 text-orange-900" />
                    <span>
                      {new Date(event.Date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZoneName: "short",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-orange-900" />
                    <span>{event.location}</span>, <span>{event.state}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5 text-orange-900   " />
                    <span>{event.availableTickets} spots remaining</span>
                  </div>

                  {event.website && (
                    <div className="flex items-center gap-2 text-orange-900">
                      <Globe className="w-5 h-5 " />
                      <a
                        href={event.website}
                        className="text-blue-500 hover:underline"
                      >
                        Visit website
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2 text-orange-00">
                    About this event
                  </h2>
                  {/* <p className="text-gray-600">{event.description}</p> */}
                  <p
                    dangerouslySetInnerHTML={{
                      __html: event.description || "General Admission",
                    }}
                  ></p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-400">
                    {event.price ? `#${event.price}` : "Free"}
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    <span>{event.ticketName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: event.ticketDescription || "General Admission",
                      }}
                    ></span>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <button
                    className="flex items-center justify-center w-auto px-4 py-2 text-white font-bold rounded-md bg-Blud transition duration-300 hover:bg-hoverBtn"
                    onClick={handleTicketPurchase}
                  >
                    <span className="animate-pulse"> Tickets</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>

                  <button
                    className="flex items-center justify-center w-auto px-4 py-2 text-red-600 font-bold rounded-md bg-tranparent border border-red-600 hover:border-hoverBtn hover:text-hoverBtn transition duration-300 hover:bg-green-700"
                    // onClick={handleShareEvent}
                  >
                    <ShareFeature className="" />
                  </button>
                </div>

                {event.availableTickets > 0 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {event.availableTickets} tickets remaining
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          {/* MAp */}
          <div className="col-span-5 mt-6 md:mt-0">
            <h2 className="text-xl font-medium mb-4">Location</h2>
            <Map event={event} />
          </div>
          {/* MAp */}
        </div>
        {/* Other Related Events */}
        <section className="mt-12">
          <OtherRelatedEvent
            currenteventType={currenteventType}
            currentEventId={id}
          />
        </section>
      </div>

      <ImageGallery />
    </div>
  );
};

export default SingleEventPage;

const OtherRelatedEvent = ({ currentEventId, currenteventType }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(4);
      } else {
        setItemsPerView(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendURL}/api/getAllEvents`);
        const data = await response.json();
        const relatedEvents = data
          .filter(
            (event) =>
              event.eventType === currenteventType &&
              event._id !== currentEventId
          )
          .slice(0, 10);
        setEvents(relatedEvents);
      } catch (error) {
        console.error("Error fetching related events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedEvents();
  }, [currenteventType, currentEventId]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">No related events found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <h2 className="text-2xl font-bold">Related Events</h2>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {events.map((event, index) => (
            <div
              key={index}
              className="w-ful md:w-[200px] min-w-[300px] sm:min-w-[350px] snap-start"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {events.length > itemsPerView && (
          <>
            <button
              onClick={() => scroll("prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>

            <button
              onClick={() => scroll("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const ShareFeature = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const currentUrl = window.location.href;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(currentUrl);
    let shareUrl;

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${url}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    handleClose();
  };

  return (
    <>
      <button className="flex" onClick={handleClick}>
        <Share2 className="w-4 h-4 mr-2 mt-1 cursor-pointer" />
        <span>share</span>
      </button>
      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleShare("twitter")}>
          <Twitter sx={{ color: "#1DA1F2", mr: 1 }} />
          Twitter
        </MenuItem>
        <MenuItem onClick={() => handleShare("facebook")}>
          <Facebook sx={{ color: "#4267B2", mr: 1 }} />
          Facebook
        </MenuItem>
        <MenuItem onClick={() => handleShare("linkedin")}>
          <LinkedIn sx={{ color: "#0077b5", mr: 1 }} />
          LinkedIn
        </MenuItem>
        <MenuItem onClick={() => handleShare("whatsapp")}>
          <WhatsApp sx={{ color: "#25D366", mr: 1 }} />
          WhatsApp
        </MenuItem>
      </Menu>
    </>
  );
};
const Map = ({ event }) => {
  return (
    <div className="w-full h-64 bg-white rounded-lg shadow-lg overflow-hidden">
      <iframe
        title="Business Location"
        className="w-full h-full border-0"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(
          `${event.location},  ${event.state}`
        )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        allowFullScreen
      />
    </div>
  );
};
