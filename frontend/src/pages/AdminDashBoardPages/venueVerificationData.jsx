import React, { useState, useCallback, useEffect } from "react";
import { Download, Eye, Trash2 } from "lucide-react";
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
} from "@mui/material";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useSelector } from "react-redux";
import backendURL from "../../config";

const statusColors = {
  pending: {
    bgcolor: "#FEF3C7",
    color: "#92400E",
  },
  approved: {
    bgcolor: "#D1FAE5",
    color: "#065F46",
  },
  rejected: {
    bgcolor: "#FEE2E2",
    color: "#991B1B",
  },
};

const VenueVerification = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    url: null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    requestId: null,
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "default",
  });

  const showAlert = useCallback((message, variant = "default") => {
    setAlert({ show: true, message, variant });
  }, []);

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching from:", `${backendURL}/api/venue-verification`);
      console.log("Token:", userInfo?.token);

      const response = await fetch(`${backendURL}/api/venue-verification`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch venue requests");
      }

      const data = await response.json();
      console.log("Received data:", data);
      setRequests(data.verificationRequests);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      showAlert(err.message, "destructive");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert, userInfo?.token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, userInfo?.token]); // Add userInfo?.token as dependency
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/venue-verification/${deleteDialog.requestId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete venue request");

      await fetchRequests();
      setDeleteDialog({ open: false, requestId: null });
      showAlert("Request deleted successfully", "success");
    } catch (err) {
      showAlert(err.message, "destructive");
    }
  };

  const handlePreview = (url) => {
    const fileExtension = url.split(".").pop().toLowerCase();
    if (["pdf"].includes(fileExtension)) {
      window.open(url, "_blank");
    } else {
      setPreviewDialog({ open: true, url });
    }
  };

  const handleDownload = async (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `venue-document-${Date.now()}.${url.split(".").pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Alert variant="destructive" className="m-2">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Venue Verification Requests
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Venue Name</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Safety Docs</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>
                  <Typography variant="subtitle2">
                    {request.venueName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {request.address.street}, {request.address.city}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {request.ownerEmail}
                    <br />
                    {request.ownerPhone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{request.capacity}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)
                    }
                    sx={{
                      bgcolor: statusColors[request.status].bgcolor,
                      color: statusColors[request.status].color,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {request.documents.map((doc, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 0.5 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handlePreview(doc)}
                          sx={{ minWidth: "auto", p: 1 }}
                        >
                          <Eye size={20} />
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDownload(doc)}
                          sx={{ minWidth: "auto", p: 1 }}
                        >
                          <Download size={20} />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {request.safetyDocuments.map((doc, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 0.5 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handlePreview(doc)}
                          sx={{ minWidth: "auto", p: 1 }}
                        >
                          <Eye size={20} />
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDownload(doc)}
                          sx={{ minWidth: "auto", p: 1 }}
                        >
                          <Download size={20} />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() =>
                      setDeleteDialog({ open: true, requestId: request._id })
                    }
                    sx={{ minWidth: "auto", p: 1 }}
                  >
                    <Trash2 size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, url: null })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Document Preview</DialogTitle>
        <DialogContent>
          <Box
            sx={{ position: "relative", width: "100%", paddingTop: "56.25%" }}
          >
            <Box
              component="img"
              src={previewDialog.url}
              alt="Document preview"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false, url: null })}>
            Close
          </Button>
          <Button
            onClick={() => handleDownload(previewDialog.url)}
            variant="contained"
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, requestId: null })}
      >
        <DialogTitle>Delete Venue Verification Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this venue verification request?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, requestId: null })}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Component */}
      {alert.show && (
        <Alert
          variant={alert.variant}
          show={alert.show}
          onClose={handleCloseAlert}
          autoClose={true}
          autoCloseTime={5000}
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

export default VenueVerification;
