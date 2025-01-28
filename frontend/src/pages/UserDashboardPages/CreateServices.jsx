import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Label,
  TextInput,
  Select,
  Textarea,
  FileInput,
  Button,
  Modal,
} from "flowbite-react";
import { HiArrowLeft, HiX } from "react-icons/hi";
import { statesAndLGAs } from "../../assets/State/LGAs.json";
import { useDispatch, useSelector } from "react-redux";
import backendURL from "../../config";

const CreateServices = () => {
  const { businessId } = useParams();
  const [formState, setFormState] = useState({
    name: "",
    type: "",
    address: {
      state: "",
      lga: "",
      street: "",
    },
    phoneNumber: "",
    email: "",
    yearsOfExperience: "",
    bio: "",
    openingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    verified: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [lgaOptions, setLgaOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    index: null,
  });

  const [images, setImages] = useState({
    coverImage: null,
    additionalImages: [],
  });

  const [previews, setPreviews] = useState({
    coverImage: null,
    additionalImages: [],
  });

  // Get userInfo from Redux store
  const { userInfo } = useSelector((state) => state.auth);
  const businessTypes = [
    "Catering",
    "Photography",
    "Decoration",
    "Entertainment",
    "Fashion Designer",
    "Security",
    "Cleaning",
    "Barber",
    "Makeup Artists",
    "Hair Dresser",
    "Event Planning",
    "Transportation",
    "Florist",
    "Beauty Services",
    "Printing",
    "Consulting",
    "Marketing",
    "Web Development",
    "Construction",
    "Fitness Training",
    "Legal Services",
    "Real Estate",
    "Pet Services",
    "Accounting",
    "Retail",
    "Food Delivery",
    "Technology Services",
    "Travel & Tourism",
    "Car Rental",
    "Laundry Services",
    "Tech Support",
    "Graphic Design",
    "Social Media Management",
    "Personal Training",
    "Massage Therapy",
    "Cleaning Supplies",
    "Wedding Planning",
    "Music Lessons",
    "Childcare",
    "Tutoring",
    "Interior Design",
    "Health & Wellness",
    "Property Management",
    "Construction Services",
    "Event Rentals",
    "Digital Marketing",
    "E-commerce",
  ];

  const handleModalToggle = () => {
    setModalOpen((prev) => !prev); // <-- Function to toggle modal visibility
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showMessage = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const stateData = statesAndLGAs.find(
      (state) => state.name === selectedState
    );

    setFormState((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state: selectedState,
        lga: "",
      },
    }));

    setLgaOptions(stateData ? stateData.local_governments : []);
  };

  const handleImageChange = (type, files) => {
    if (!files.length) return;

    if (type === "additionalImages") {
      const newImages = Array.from(files);
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));

      setImages((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newImages],
      }));

      setPreviews((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newPreviews],
      }));
    } else {
      const file = files[0];
      const preview = URL.createObjectURL(file);

      setImages((prev) => ({
        ...prev,
        coverImage: file,
      }));

      setPreviews((prev) => ({
        ...prev,
        coverImage: preview,
      }));
    }
  };
  const handleDeleteConfirmation = (type, index) => {
    setDeleteModal({
      isOpen: true,
      type,
      index,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      type: null,
      index: null,
    });
  };

  const removeImage = async (type, index) => {
    try {
      const imageUrl =
        type === "coverImage"
          ? previews.coverImage
          : previews.additionalImages[index];

      // Only make API call if the image is already saved (has a Cloudinary URL)
      if (imageUrl && imageUrl.includes("cloudinary")) {
        const response = await fetch(`${backendURL}/api/remove-image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId,
            imageUrl,
            imageType: type,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to remove image");
        }
      }

      // Update local state regardless of whether API call was made
      if (type === "coverImage") {
        setImages((prev) => ({ ...prev, coverImage: null }));
        setPreviews((prev) => ({ ...prev, coverImage: null }));
      } else {
        setImages((prev) => ({
          ...prev,
          additionalImages: prev.additionalImages.filter((_, i) => i !== index),
        }));
        setPreviews((prev) => ({
          ...prev,
          additionalImages: prev.additionalImages.filter((_, i) => i !== index),
        }));
      }

      showMessage("Image removed successfully", "success");
      handleDeleteCancel(); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error removing image:", error);
      showMessage("Failed to remove image", "error");
      handleDeleteCancel(); // Close the modal on error
    }
  };

  const fetchBusinessData = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/getBusinessById/${businessId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch business data");
      }
      const data = await response.json();
      console.log("getBusinessById", data);

      // Update form state with the correct structure
      setFormState({
        name: data.name || "",
        type: data.type || "",
        address: {
          state: data.address?.state || "",
          lga: data.address?.lga || "",
          street: data.address?.street || "",
        },
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        yearsOfExperience: data.yearsOfExperience || "",
        bio: data.bio || "",
        openingHours: {
          monday: data.openingHours?.monday || "",
          tuesday: data.openingHours?.tuesday || "",
          wednesday: data.openingHours?.wednesday || "",
          thursday: data.openingHours?.thursday || "",
          friday: data.openingHours?.friday || "",
          saturday: data.openingHours?.saturday || "",
          sunday: data.openingHours?.sunday || "",
        },
        verified: data.verified || false,
      });

      // Update LGA options based on the selected state
      if (data.address?.state) {
        const stateData = statesAndLGAs.find(
          (state) => state.name === data.address.state
        );
        setLgaOptions(stateData ? stateData.local_governments : []);
      }

      // Update image previews
      setPreviews({
        coverImage: data.coverImage || null,
        additionalImages: data.additionalImages || [],
      });
    } catch (error) {
      console.error("Error fetching business data:", error);
      showMessage("Failed to load business data. Please try again.", "error");
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchBusinessData();
    }
  }, [businessId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation checks
      if (
        !formState.name ||
        !formState.type ||
        !formState.phoneNumber ||
        !formState.email ||
        !formState.yearsOfExperience
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (
        isNaN(Number(formState.yearsOfExperience)) ||
        Number(formState.yearsOfExperience) < 0
      ) {
        throw new Error("Please enter a valid number of years of experience");
      }

      // Create a copy of formState and add keepImages for existing images
      const submitData = { ...formState };

      // If updating and there are existing additional images, specify which ones to keep
      if (businessId && previews.additionalImages.length > 0) {
        submitData.keepImages = previews.additionalImages.filter(
          (url) => typeof url === "string" && url.includes("cloudinary")
        );
      }

      const formData = new FormData();
      formData.append("businessData", JSON.stringify(submitData));

      // Only append coverImage if a new one is selected
      if (images.coverImage) {
        formData.append("coverImage", images.coverImage);
      } else if (!businessId) {
        // Only require cover image for new businesses
        throw new Error("Cover image is required");
      }

      // Append any new additional images
      if (images.additionalImages?.length > 0) {
        images.additionalImages.forEach((image) => {
          if (image instanceof File) {
            // Only append new files
            formData.append("additionalImages", image);
          }
        });
      }

      const url = businessId
        ? `${backendURL}/api/updateBusiness/${businessId}`
        : `${backendURL}/api/createBusiness`;
      const method = businessId ? "PUT" : "POST";

      // const response = await fetch(url, {
      //   method,
      //   body: formData,
      // });
      // Retrieve the token from local storage
      const token = userInfo.token;
      console.log(token);

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Include the Authorization header
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save business");
      }

      showMessage(
        businessId
          ? "Business updated successfully!"
          : "Business created successfully!",
        "success"
      );

      setTimeout(() => {
        window.history.back();
      }, 2000);
    } catch (error) {
      console.error("Error saving business:", error);
      showMessage(
        error.message || "Failed to save business. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button
        color="light"
        onClick={() => window.history.back()}
        className="mb-4"
      >
        <HiArrowLeft className="mr-2" /> Back
      </Button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Create Business/Service</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Business Name</Label>
              <TextInput
                id="name"
                type="text"
                placeholder="Enter business name"
                required
                value={formState.name}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="type">Business Type</Label>
              <Select
                id="type"
                required
                value={formState.type}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="">Select Type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="Enter email address"
                required
                value={formState.email}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <TextInput
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                required
                value={formState.phoneNumber}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <TextInput
                id="yearsOfExperience"
                type="number"
                min="0"
                placeholder="Enter years of experience"
                required
                value={formState.yearsOfExperience}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    yearsOfExperience: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="bio">Business Bio</Label>
            <Textarea
              id="bio"
              placeholder="Enter business description"
              required
              rows={4}
              value={formState.bio}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
          </div>

          <h3 className="text-lg font-semibold mb-4">Address Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select
                id="state"
                required
                value={formState.address.state}
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {statesAndLGAs.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="lga">LGA</Label>
              <Select
                id="lga"
                required
                value={formState.address.lga}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    address: { ...prev.address, lga: e.target.value },
                  }))
                }
                disabled={!formState.address.state}
              >
                <option value="">Select LGA</option>
                {lgaOptions.map((lga) => (
                  <option key={lga.id} value={lga.name}>
                    {lga.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <TextInput
                id="street"
                type="text"
                placeholder="Enter street address"
                required
                value={formState.address.street}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.keys(formState.openingHours).map((day) => (
              <div key={day}>
                <Label htmlFor={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Label>
                <TextInput
                  id={day}
                  type="text"
                  placeholder="e.g., 9 AM - 5 PM"
                  value={formState.openingHours[day]}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      openingHours: {
                        ...prev.openingHours,
                        [day]: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4">Business Photos</h3>
          <div className="mb-4">
            <Label htmlFor="coverImage">Cover Image</Label>
            <FileInput
              id="coverImage"
              helperText="Upload a cover image for your business"
              onChange={(e) => handleImageChange("coverImage", e.target.files)}
            />
            {previews.coverImage && (
              <div className="mt-2 relative">
                <img
                  src={previews.coverImage}
                  alt="Cover Preview"
                  className="max-h-[18rem]  w-auto object-cover rounded"
                />
                <Button
                  color="failure"
                  size="xs"
                  className="absolute top-0 right-0"
                  onClick={() => removeImage("coverImage")}
                >
                  <HiX />
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="additionalImages">Additional Images</Label>
            <FileInput
              id="additionalImages"
              multiple
              helperText="Upload additional business images"
              onChange={(e) =>
                handleImageChange("additionalImages", e.target.files)
              }
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {previews.additionalImages.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Additional Preview ${index}`}
                    className="w-full lg:h-48 object-cover rounded"
                  />
                  <Button
                    color="failure"
                    size="xs"
                    className="absolute top-0 right-0"
                    onClick={() =>
                      handleDeleteConfirmation("additionalImages", index)
                    }
                  >
                    <HiX />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="verified"
              checked={formState.verified}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  verified: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600"
            />
            <Label htmlFor="verified">Verified Business</Label>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-offset-2 focus:ring-btColour transition-all duration-300 ease-in-out hover:scale-105 focus:ring-4 font-medium rounded-lg text-sm w-[30%] py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Business"}
            </button>
          </div>
        </form>
      </div>

      {/* Snackbar Notification */}
      {snackbar.open && (
        <div
          className={`fixed top-4 right-4 p-4 rounded ${
            snackbar.severity === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {snackbar.message}
        </div>
      )}
      {/* Modal for submission confirm delete */}
      <Modal
        show={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        size="sm"
        popup
        className="rounded-lg shadow-md"
      >
        <Modal.Header className="border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-700">
            Confirm Deletion
          </h2>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center p-1">
            <h3 className="mb-4 text-lg font-medium text-gray-700">
              Are you sure you want to delete this image?
            </h3>
            <div className="flex justify-center gap-2 mt-2">
              <Button
                color="failure"
                onClick={() => removeImage(deleteModal.type, deleteModal.index)}
                className="px-1 py-2 hover:text-white rounded-lg shadow-md text-black hover:bg-red-700 focus:ring focus:ring-red-300"
              >
                Yes, delete it
              </Button>
              <Button
                color="gray"
                onClick={handleDeleteCancel}
                className="px-1 py-2 hover:text-white rounded-lg shadow-md hover:bg-gray-600 focus:ring focus:ring-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateServices;
