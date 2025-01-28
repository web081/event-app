import React, { useState, useCallback, useMemo } from "react";
import { Search, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Chip,
} from "@mui/material";
import backendURL from "../../config";

const AdminAllVenuesListing = () => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    venueId: null,
  });
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: null,
    venue: null,
    reason: "",
    duration: "",
  });

  const venuesPerPage = 9;

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStatusChange = (venue, type) => {
    setActionDialog({
      open: true,
      type,
      venue,
      reason: "",
      duration: "",
    });
  };

  const handleAction = async () => {
    const { type, venue, reason, duration } = actionDialog;

    if (!reason.trim()) {
      showSnackbar("Please provide a reason", "error");
      return;
    }

    try {
      const endpoint =
        type === "verify"
          ? `${backendURL}/api/venues/verify/${venue._id}`
          : `${backendURL}/api/venues/blacklist/${venue._id}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason,
          duration: duration ? parseInt(duration) : null,
        }),
      });

      if (response.ok) {
        showSnackbar(
          `Venue ${
            type === "verify" ? "verification" : "blacklist"
          } status updated`,
          "success"
        );
        fetchVenues(currentPage);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update status");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setActionDialog({
        open: false,
        type: null,
        venue: null,
        reason: "",
        duration: "",
      });
    }
  };

  const fetchVenues = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${backendURL}/api/getAllVenues?page=${page}&limit=${venuesPerPage}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch venues");
        }

        const data = await response.json();

        // Ensure data has the expected structure
        if (!data || !Array.isArray(data.venues)) {
          throw new Error("Invalid response format from server");
        }

        setVenues(data.venues || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } catch (error) {
        showSnackbar(error.message, "error");
        setVenues([]); // Set empty array on error
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [backendURL, venuesPerPage, showSnackbar]
  );

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/venues/deleteVenue/${deleteDialog.venueId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete venue");
      }

      showSnackbar("Venue deleted successfully", "success");
      fetchVenues(currentPage);
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setDeleteDialog({ open: false, venueId: null });
    }
  };

  React.useEffect(() => {
    fetchVenues(currentPage);
  }, [currentPage, fetchVenues]);

  // Safe filtering with null checks
  const filteredVenues = useMemo(() => {
    if (!Array.isArray(venues)) return [];

    return venues.filter((venue) => {
      if (!venue) return false;

      const searchLower = searchTerm.toLowerCase();
      const titleMatch =
        venue.title?.toLowerCase()?.includes(searchLower) || false;
      const typeMatch =
        venue.type?.toLowerCase()?.includes(searchLower) || false;
      const stateMatch =
        venue.address?.state?.toLowerCase()?.includes(searchLower) || false;

      return titleMatch || typeMatch || stateMatch;
    });
  }, [venues, searchTerm]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "16rem",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      style={{
        margin: "24px",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        style={{ position: "relative", marginBottom: "20px", maxWidth: "50%" }}
      >
        <TextField
          fullWidth
          placeholder="Search venues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search className="mr-2 h-4 w-4 text-gray-400" />,
          }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVenues.map((venue) => (
              <TableRow key={venue._id}>
                <TableCell>{venue.title}</TableCell>
                <TableCell>
                  {venue.address.state}, {venue.address.lga}
                </TableCell>
                <TableCell>{venue.capacity}</TableCell>
                <TableCell>
                  <Chip
                    label={`₦${venue.pricingDetails?.totalpayment?.toLocaleString()}`}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={venue.verified}
                            onChange={() => handleStatusChange(venue, "verify")}
                          />
                        }
                        label="Verified"
                        labelPlacement="bottom"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={venue.blacklisted}
                            onChange={() =>
                              handleStatusChange(venue, "blacklist")
                            }
                          />
                        }
                        label="Blacklisted"
                        labelPlacement="bottom"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    style={{
                      minWidth: "40px",
                      width: "40px",
                      height: "40px",
                      padding: "8px",
                    }}
                    onClick={() =>
                      setDeleteDialog({ open: true, venueId: venue._id })
                    }
                  >
                    <Trash2 size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "24px",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ ...actionDialog, open: false })}
      >
        <DialogTitle>
          {actionDialog.type === "verify" ? "Verify Venue" : "Blacklist Venue"}
        </DialogTitle>
        <DialogContent>
          <div style={{ marginTop: "16px" }}>
            <TextField
              fullWidth
              label="Reason"
              required
              value={actionDialog.reason}
              onChange={(e) =>
                setActionDialog({ ...actionDialog, reason: e.target.value })
              }
              placeholder="Enter reason..."
              style={{ marginBottom: "16px" }}
              error={actionDialog.open && !actionDialog.reason.trim()}
              helperText={
                actionDialog.open && !actionDialog.reason.trim()
                  ? "Reason is required"
                  : ""
              }
            />
            {actionDialog.type === "blacklist" && (
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={actionDialog.duration}
                  onChange={(e) =>
                    setActionDialog({
                      ...actionDialog,
                      duration: e.target.value,
                    })
                  }
                  label="Duration"
                >
                  <MenuItem value="">Indefinite</MenuItem>
                  <MenuItem value="7">7 Days</MenuItem>
                  <MenuItem value="30">30 Days</MenuItem>
                  <MenuItem value="90">90 Days</MenuItem>
                </Select>
              </FormControl>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setActionDialog({ ...actionDialog, open: false })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            disabled={!actionDialog.reason.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
      >
        <DialogTitle>Delete Venue</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this venue? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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

export default AdminAllVenuesListing;
