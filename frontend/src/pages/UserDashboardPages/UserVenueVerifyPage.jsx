import React, { useState, useEffect } from "react";
import { Upload, Mail, Building, MapPin } from "lucide-react";
import Alert, { AlertDescription } from "../../components/tools/Alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import backendURL from "../../config";

export default function VenueVerificationPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "default",
  });
  const [formData, setFormData] = useState({
    venueName: "",
    capacity: "",
    address: {
      state: "",
      lga: "",
      area: "",
      street: "",
    },
    ownerEmail: "",
    ownerPhone: "",
    description: "",
  });
  const [documents, setDocuments] = useState([]);
  const [safetyDocuments, setSafetyDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch venues owned by the logged-in user
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllVenues`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await response.json();
        // Filter venues where user is the owner and not yet verified
        const venueData = data?.venues;
        console.log(venueData, "venueData");
        const userVenues = venueData.filter(
          (venue) => venue.createdBy === userInfo._id
        );
        console.log(userVenues, "userVenues");

        setVenues(userVenues);
      } catch (error) {
        showNotification(error.message, "destructive");
      }
    };

    if (userInfo?.token) {
      fetchVenues();
    }
  }, [userInfo, userInfo?.token]);

  const handleVenueSelect = (e) => {
    const venueId = e.target.value;
    setSelectedVenueId(venueId);

    if (venueId) {
      const selectedVenue = venues.find((v) => v._id === venueId);
      if (selectedVenue) {
        setFormData({
          venueName: selectedVenue.title || "",
          capacity: selectedVenue.capacity || "",
          address: selectedVenue.address || {
            state: "",
            lga: "",
            area: "",
            street: "",
          },
          ownerEmail: userInfo.email || "",
          ownerPhone: userInfo.phoneNumber || "",
          description: "",
        });
      }
    } else {
      setFormData({
        venueName: "",
        capacity: "",
        address: {
          state: "",
          lga: "",
          area: "",
          street: "",
        },
        ownerEmail: "",
        ownerPhone: "",
        description: "",
      });
    }
  };

  const showNotification = (message, variant = "default") => {
    setAlert({
      show: true,
      message,
      variant,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      showNotification(
        `Invalid file type: ${file.name}. Only JPEG, PNG, and PDF files are allowed.`,
        "destructive"
      );
      return false;
    }

    if (file.size > maxSize) {
      showNotification(
        `File ${file.name} is too large. Maximum size is 5MB.`,
        "destructive"
      );
      return false;
    }

    return true;
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      showNotification("You can only upload up to 3 documents", "destructive");
      return;
    }

    const validFiles = files.filter(validateFile);
    if (type === "documents") {
      setDocuments(validFiles);
    } else {
      setSafetyDocuments(validFiles);
    }
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVenueId) {
      showNotification("Please select a venue to verify", "destructive");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "verificationData",
        JSON.stringify({
          ...formData,
          venueId: selectedVenueId,
        })
      );

      documents.forEach((doc) => {
        formDataToSend.append("documents", doc);
      });

      safetyDocuments.forEach((doc) => {
        formDataToSend.append("safetyDocuments", doc);
      });

      const response = await fetch(
        `${backendURL}/api/venue-verification-requests`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to submit verification request"
        );
      }

      showNotification(
        "Verification request submitted successfully",
        "success"
      );

      // Reset form
      setFormData({
        venueName: "",
        capacity: "",
        address: {
          state: "",
          lga: "",
          area: "",
          street: "",
        },
        ownerEmail: "",
        ownerPhone: "",
        description: "",
      });
      setSelectedVenueId("");
      setDocuments([]);
      setSafetyDocuments([]);
      setUploadProgress(0);
    } catch (error) {
      showNotification(error.message, "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {alert.show && (
        <Alert
          variant={alert.variant}
          show={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
        >
          <div className="flex items-center gap-2 bg-yellow-200 p-3">
            {alert.variant === "destructive" && (
              <AlertCircle className="h-4 w-4" />
            )}
            {alert.variant === "success" && <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{alert?.message}</AlertDescription>
          </div>
        </Alert>
      )}

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Venue Verification Request
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Please select your venue and submit verification documents. We
            support JPEG, PNG, and PDF files up to 5MB each.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Venue to Verify *
            </label>
            <select
              value={selectedVenueId}
              onChange={handleVenueSelect}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a venue</option>
              {venues.map((venue) => (
                <option key={venue._id} value={venue._id}>
                  {venue.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Venue Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="venueName"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.venueName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Capacity *
            </label>
            <input
              type="text"
              name="capacity"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.capacity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Address Details *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="address.state"
                placeholder="State"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.address.state}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address.lga"
                placeholder="LGA"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.address.lga}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="address.area"
                placeholder="Area"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.address.area}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="address.street"
                placeholder="Street"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.address.street}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Owner Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="ownerEmail"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.ownerEmail}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Owner Phone Number *
            </label>
            <input
              type="tel"
              autoComplete=""
              name="ownerPhone"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.ownerPhone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Venue Description
            </label>
            <textarea
              name="description"
              rows="4"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Venue Documents * (Maximum 3 files)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              {documents.length > 0 ? (
                <div className="mt-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  <ul className="mt-1 text-sm text-gray-500">
                    {documents.map((file, index) => (
                      <li key={index} className="truncate">
                        {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}{" "}
                        MB)
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload files</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(e) => handleFileChange(e, "documents")}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, JPEG, PNG up to 5MB each
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Safety Documents (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              {safetyDocuments.length > 0 ? (
                <div className="mt-2">
                  <p className="text-sm font-medium">
                    Selected safety documents:
                  </p>
                  <ul className="mt-1 text-sm text-gray-500">
                    {safetyDocuments.map((file, index) => (
                      <li key={index} className="truncate">
                        {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}{" "}
                        MB)
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload safety documents</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(e) => handleFileChange(e, "safety")}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Fire safety certificates, insurance documents, etc.
                  </p>
                </div>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || documents.length === 0 || !selectedVenueId}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Verification Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
