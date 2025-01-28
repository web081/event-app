import React, { useState, useEffect } from "react";
import { Upload, Mail, Building, MapPin } from "lucide-react";
import Alert, { AlertDescription } from "../../components/tools/Alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import backendURL from "../../config";

export default function UserVerifyPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "default",
  });
  const [formData, setFormData] = useState({
    businessName: "",
    fullAddress: "",
    email: "",
    phoneNumber: "",
    description: "",
  });
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch businesses owned by the logged-in user
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllBusinesses`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch businesses");
        }

        const data = await response.json();
        console.log(data);
        // Filter businesses where user is the owner
        const userBusinesses = data?.businesses?.filter(
          (business) => business.ownerId === userInfo._id
        );

        setBusinesses(userBusinesses);
      } catch (error) {
        showNotification(error.message, "destructive");
      }
    };

    if (userInfo?.token) {
      fetchBusinesses();
    }
  }, [userInfo]);

  // Update form when business is selected
  const handleBusinessSelect = (e) => {
    const businessId = e.target.value;
    setSelectedBusinessId(businessId);

    if (businessId) {
      const selectedBusiness = businesses.find((b) => b._id === businessId);
      if (selectedBusiness) {
        setFormData({
          businessName: selectedBusiness.name || "",
          fullAddress: selectedBusiness.address.street || "",
          email: selectedBusiness.email || "",
          phoneNumber: selectedBusiness.phoneNumber || "",
          description: selectedBusiness.bio || "",
        });
      }
    } else {
      // Reset form if no business selected
      setFormData({
        businessName: "",
        fullAddress: "",
        email: "",
        phoneNumber: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      showNotification("You can only upload up to 3 documents", "destructive");
      return;
    }

    const validFiles = files.filter(validateFile);
    setDocuments(validFiles);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBusinessId) {
      showNotification("Please select a business to verify", "destructive");
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
          businessId: selectedBusinessId,
        })
      );

      documents.forEach((doc) => {
        formDataToSend.append(`documents`, doc);
      });

      const response = await fetch(`${backendURL}/api/verification-requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: formDataToSend,
      });

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
        businessName: "",
        fullAddress: "",
        email: "",
        phoneNumber: "",
        description: "",
      });
      setSelectedBusinessId("");
      setDocuments([]);
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
            Business Verification Request
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Please select your business and submit verification documents. We
            support JPEG, PNG, and PDF files up to 5MB each.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Business Selection Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Business to Verify *
            </label>
            <select
              value={selectedBusinessId}
              onChange={handleBusinessSelect}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option className="text-black" value="">
                Select a business
              </option>
              {businesses.map((business) => (
                <option key={business._id} value={business._id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rest of the form fields */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="businessName"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.businessName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                name="fullAddress"
                rows="3"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.fullAddress}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Description
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
              Upload Documents * (Maximum 3 files)
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
                    <label
                      htmlFor="documents"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="documents"
                        name="documents"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Maximum 3 files (PDF, JPEG, or PNG up to 5MB each)
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
            disabled={
              isLoading || documents.length === 0 || !selectedBusinessId
            }
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Verification Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
