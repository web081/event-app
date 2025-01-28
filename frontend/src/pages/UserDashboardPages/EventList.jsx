import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircle as AddIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import backendURL from "../../config";
const truncateHTML = (html, maxLength) => {
  if (!html) return "";

  // Create a temporary div to parse HTML
  const div = document.createElement("div");
  div.innerHTML = html;
  // Get text content
  let text = div.textContent || div.innerText;
  if (text.length <= maxLength) return html;
  text = text.slice(0, maxLength);

  // Find last space to avoid cutting words
  const lastSpace = text.lastIndexOf(" ");
  if (lastSpace > 0) {
    text = text.substr(0, lastSpace);
  }

  return text + "...";
};

const EventList = ({ html, maxLength = 100 }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/api/getAllEvents`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/User/CreateEvent/${eventId}`);
  };

  const handleDeleteConfirmOpen = (eventId) => {
    setEventToDelete(eventId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/deleteEvent/${eventToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete event");

      // Remove the deleted event from the list
      setEvents(events.filter((event) => event._id !== eventToDelete));
      handleDeleteConfirmClose();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentDate = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.Date) >= currentDate
  );
  const pastEvents = events.filter(
    (event) => new Date(event.Date) < currentDate
  );

  return (
    <div className="mid:mt-20" maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: {
              xs: "1.25rem", // Small screens
              sm: "1.5rem", // Medium screens
              md: "2rem", // Default for larger screens
            },
          }}
        >
          <EventIcon color="primary" />
          Upcoming Events
        </Typography>

        <button
          className="whitespace-nowrap px-3 py-2 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out flex items-center"
          onClick={() => navigate("/User/CreateEvent")}
        >
          <Add className="mr-2" /> {/* Add icon with margin for spacing */}
          Create New Event
        </button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {upcomingEvents.length === 0 ? (
            <Typography variant="body1">
              You have no upcoming events yet!
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {upcomingEvents.map((event) => (
                <Grid item xs={12} sm={6} md={6} key={event._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        position: "relative",
                        height: 200,
                        backgroundColor: "gray",
                      }}
                    >
                      {event.coverImage && (
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Chip
                        label={event.eventType?.toUpperCase() || "EVENT"}
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                        }}
                      />
                    </CardMedia>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {event.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flexGrow: 1,
                          mb: 2,
                          fontStyle: "italic",
                        }}
                        paragraph
                      >
                        {truncateHTML(event.description, 100)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(event.Date)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <TimeIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatTime(event.Date)} | {event.timeZone}
                        </Typography>
                      </Box>
                      {event.location && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {event.location}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: "auto",
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(event._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteConfirmOpen(event._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Past Events Section */}
          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            Past Events
          </Typography>
          {pastEvents.length === 0 ? (
            <Typography variant="body1">
              You have no past events yet!
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {pastEvents.map((event) => (
                <Grid item xs={12} sm={6} md={6} key={event._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        position: "relative",
                        height: 200,
                        backgroundColor: "gray",
                      }}
                    >
                      {event.coverImage && (
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Chip
                        label={event.eventType?.toUpperCase() || "EVENT"}
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                        }}
                      />
                    </CardMedia>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {event.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flexGrow: 1,
                          mb: 2,
                          fontStyle: "italic",
                        }}
                        paragraph
                      >
                        {truncateHTML(event.description, 100)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(event.Date)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <TimeIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatTime(event.Date)} | {event.timeZone}
                        </Typography>
                      </Box>
                      {event.location && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {event.location}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: "auto",
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(event._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteConfirmOpen(event._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="delete-event-dialog-title"
        aria-describedby="delete-event-dialog-description"
      >
        <DialogTitle id="delete-event-dialog-title">Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-event-dialog-description">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventList;
