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
  Box,
  ImageList,
  ImageListItem,
  Skeleton,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  LocationOn,
  Business,
  Timer,
  Email,
  Phone,
  VerifiedUser,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import backendURL from "../../config";

const ServiceList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/api/getAllBusinesses`);
      if (!response.ok) throw new Error("Failed to fetch businesses");
      const data = await response.json();
      setBusinesses(data.businesses);
      console.log(data);
    } catch (error) {
      showSnackbar("Failed to load businesses", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (businessId) => {
    navigate(`/User/CreateServices/${businessId}`);
  };

  const handleDeleteClick = (business) => {
    setSelectedBusiness(business);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/deleteBusiness/${selectedBusiness._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete business");

      setBusinesses(businesses.filter((b) => b._id !== selectedBusiness._id));
      showSnackbar("Business deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete business", "error");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBusiness(null);
    }
  };

  const handleImageClick = (business) => {
    setSelectedImages([business.coverImage, ...business.additionalImages]);
    setImageDialogOpen(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const FilterTabs = () => (
    <Paper elevation={0} sx={{ mb: 3 }}>
      <Tabs
        value={filterType}
        onChange={(e, newValue) => setFilterType(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All Services" value="all" />
        <Tab label="Catering" value="catering" />
        <Tab label="Photography" value="photography" />
        <Tab label="Decoration" value="decoration" />
        <Tab label="Entertainment" value="entertainment" />
      </Tabs>
    </Paper>
  );

  const filteredBusinesses =
    filterType === "all"
      ? businesses
      : businesses.filter((business) => business.type === filterType);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <Typography variant="h4">Posted Services</Typography>
        <button
          className="whitespace-nowrap px-3 py-2 rounded-lg hover:bg-transparent hover:border hover:font-medium border-Blud text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out flex items-center"
          onClick={() => navigate("/User/CreateServices")}
        >
          <Add className="mr-2" />
          Create New Service
        </button>
      </Box>

      <FilterTabs />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Grid container spacing={3} padding={2}>
          {filteredBusinesses.map((business) => (
            <Grid item xs={12} sm={6} md={6} key={business._id}>
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
                  onClick={() => handleImageClick(business)}
                >
                  <img
                    src={business.coverImage}
                    alt={business.name}
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
                      {business.additionalImages?.length + 1})
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Chip label={business.type.toUpperCase()} color="primary" />
                    {business.verified && (
                      <Chip
                        icon={<VerifiedUser />}
                        label="Verified"
                        color="success"
                      />
                    )}
                  </Box>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {business.name}
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOn color="action" />
                        <Typography variant="body2">
                          {business.address?.street}, {business.address?.lga},{" "}
                          {business?.state}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Business color="action" />
                        <Typography variant="body2">
                          {business?.yearsOfExperience} Years Experience
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Timer color="action" />
                        <Typography variant="body2">
                          {business?.openingHours?.monday}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Email fontSize="small" />
                        {business.email}
                      </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Phone fontSize="small" />
                        {business.phoneNumber}
                      </Box>
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
                      onClick={() => handleEdit(business._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteClick(business)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedBusiness?.name}? This action
          cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Service Images</DialogTitle>
        <DialogContent>
          <ImageList cols={isSmallScreen ? 1 : 2} gap={8}>
            {selectedImages.map((img, index) => (
              <ImageListItem key={index}>
                <img
                  src={img}
                  alt={`Service image ${index + 1}`}
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

      {/* Snackbar for notifications */}
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

export default ServiceList;
