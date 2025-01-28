import React, { useState, useCallback, useEffect } from "react";
import { Trash2, Send, Calendar, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Box,
  TextField,
  Snackbar,
} from "@mui/material";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";

const statusColors = {
  pending: {
    bgcolor: "#FEF3C7",
    color: "#92400E",
  },
  contacted: {
    bgcolor: "#DBEAFE",
    color: "#1E40AF",
  },
  confirmed: {
    bgcolor: "#D1FAE5",
    color: "#065F46",
  },
  rejected: {
    bgcolor: "#FEE2E2",
    color: "#991B1B",
  },
};

const timeSlotLabels = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  fullday: "Full Day",
};

const VenueInterestTable = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [interests, setInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    interestId: null,
  });
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    interest: null,
    message: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = useCallback((message, severity = "info") => {
    setAlert({ open: true, message, severity });
  }, []);

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const fetchInterests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/getVenueInterests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch venue interests");
      }

      const data = await response.json();
      setInterests(data.interests);
    } catch (err) {
      setError(err.message);
      showAlert(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [userInfo?.token, showAlert]);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/venue-interest/deleteVenueInterest/${deleteDialog.interestId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete venue interest");

      await fetchInterests();
      setDeleteDialog({ open: false, interestId: null });
      showAlert("Interest deleted successfully", "success");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const handleWhatsAppMessage = () => {
    const { interest, message } = messageDialog;
    if (!interest || !message) return;

    const phoneNumber = interest.phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setMessageDialog({ open: false, interest: null, message: "" });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Venue Interest Requests
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Venue</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Event Details</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Submitted</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interests.map((interest) => (
              <TableRow key={interest._id}>
                <TableCell>
                  <Typography variant="subtitle2">
                    {interest.venueId.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Typography variant="subtitle2">
                      {interest.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {interest.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {interest.phoneNumber}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Calendar size={16} />
                      <Typography variant="body2">
                        {new Date(interest.eventDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Clock size={16} />
                      <Typography variant="body2">
                        {timeSlotLabels[interest.timeSlot]}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      interest.status.charAt(0).toUpperCase() +
                      interest.status.slice(1)
                    }
                    sx={{
                      bgcolor: statusColors[interest.status].bgcolor,
                      color: statusColors[interest.status].color,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(interest.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        setMessageDialog({
                          open: true,
                          interest,
                          message: "",
                        })
                      }
                      sx={{ minWidth: 0, p: 1 }}
                    >
                      <Send size={20} />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          interestId: interest._id,
                        })
                      }
                      sx={{ minWidth: 0, p: 1 }}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, interestId: null })}
      >
        <DialogTitle>Delete Venue Interest</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this venue interest request? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, interestId: null })}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* WhatsApp Message Dialog */}
      <Dialog
        open={messageDialog.open}
        onClose={() =>
          setMessageDialog({ open: false, interest: null, message: "" })
        }
      >
        <DialogTitle>Send WhatsApp Message</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Compose a message to send to {messageDialog.interest?.fullName}
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={messageDialog.message}
            onChange={(e) =>
              setMessageDialog((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Type your message here..."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setMessageDialog({ open: false, interest: null, message: "" })
            }
          >
            Cancel
          </Button>
          <Button onClick={handleWhatsAppMessage} variant="contained">
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VenueInterestTable;
