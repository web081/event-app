import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Chip,
  Box,
  ImageList,
  ImageListItem,
  Skeleton,
  Tabs,
  Tab,
  Paper,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import {
  Edit,
  Delete,
  LocationOn,
  Bathroom,
  Timer,
  Chair,
  Home,
  CalendarToday,
  AttachMoney,
  Image,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import backendURL from "../../config";

const VenueList = () => {
  const [venueData, setVenueData] = useState({
    venues: [],
    totalPages: 0,
    currentPage: 1,
    totalVenues: 0,
  });
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/api/getAllVenues`);
      if (!response.ok) throw new Error("Failed to fetch venues");
      const data = await response.json();
      setVenueData(data); // Store the complete response object
      console.log(data);
    } catch (error) {
      showSnackbar("Failed to load venues", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (venueId) => {
    navigate(`/User/CreateVenue/${venueId}`);
  };

  const handleDeleteClick = (venue) => {
    setSelectedVenue(venue);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/deleteVenue/${selectedVenue._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete venue");

      // Update the venues array within the venueData object
      setVenueData((prevData) => ({
        ...prevData,
        venues: prevData.venues.filter(
          (venue) => venue._id !== selectedVenue._id
        ),
        totalVenues: prevData.totalVenues - 1,
      }));

      showSnackbar("Venue deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete venue", "error");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedVenue(null);
    }
  };

  const handleImageClick = (venue) => {
    setSelectedImages([venue.coverImage, ...venue.additionalImages]);
    setImageDialogOpen(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const FilterTabs = () => (
    <Paper elevation={0} sx={{ mb: 3 }}>
      <Tabs
        value={filterCategory}
        onChange={(e, newValue) => setFilterCategory(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All Venues" value="all" />
        <Tab label="Wedding" value="wedding" />
        <Tab label="Conference" value="conference" />
        <Tab label="Party" value="party" />
        <Tab label="Meeting" value="meeting" />
      </Tabs>
    </Paper>
  );

  const filteredVenues =
    filterCategory === "all"
      ? venueData.venues
      : venueData.venues.filter((venue) => venue.category === filterCategory);

  const LoadingSkeleton = () => (
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
        <Typography variant="h4"> Venue Listing</Typography>
        <button
          className="whitespace-nowrap px-3 py-2 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out flex items-center"
          onClick={() => navigate("/User/CreateVenue")}
        >
          <Add className="mr-2" />
          Create New Venue
        </button>
      </Box>

      {loading ? (
        <LoadingSkeleton />
      ) : venueData.venues.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          You have no venue listing yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredVenues.map((venue) => (
            <Grid item xs={12} sm={6} md={6} key={venue._id}>
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
                    height: 250,
                    cursor: "pointer",
                    "&:hover": {
                      "& .image-overlay": {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => handleImageClick(venue)}
                >
                  <img
                    src={venue.coverImage}
                    alt={venue.title}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    className="image-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                  >
                    <Typography color="white">
                      Click to view all images (
                      {venue.additionalImages.length + 1})
                    </Typography>
                  </Box>
                  <Chip
                    label={venue.type.toUpperCase()}
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                    }}
                  />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {venue.title}
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOn color="action" />
                        <Typography variant="body2">
                          {venue.address.area}, {venue.address.state}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Home color="action" />
                        <Typography variant="body2">
                          {venue.furnishing}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Bathroom color="action" />
                        <Typography variant="body2">
                          {venue.bathrooms} Bath, {venue.toilets} Toilets
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Timer color="action" />
                        <Typography variant="body2">
                          Duration: {venue.duration}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {formatCurrency(venue.pricingDetails.totalpayment)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Initial Payment:{" "}
                      {formatCurrency(venue.pricingDetails.initialPayment)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Payment Percentage: {venue.pricingDetails.percentage}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(venue._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteClick(venue)}
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedVenue?.title}? This action
          cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Venue Images</DialogTitle>
        <DialogContent>
          <ImageList cols={isSmallScreen ? 1 : 2} gap={8}>
            {selectedImages.map((img, index) => (
              <ImageListItem key={index}>
                <img
                  src={img}
                  alt={`Venue image ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VenueList;
