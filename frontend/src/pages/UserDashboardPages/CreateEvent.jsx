import React, { useState, useRef, useEffect } from "react";
import { HiArrowRight } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Label,
  TextInput,
  Select,
  Textarea,
  FileInput,
  Button,
  Alert,
} from "flowbite-react";
import {
  HiArrowLeft,
  HiCloudUpload,
  HiPlus,
  HiX,
  HiInformationCircle,
} from "react-icons/hi";
import backendURL from "../../config";
import { statesAndLGAs } from "../../assets/State/LGAs.json";
import { Radio } from "flowbite-react";

const CreateEvent = () => {
  const { eventId } = useParams();
  const today = new Date().toISOString().slice(0, 16);

  // Declare STEPS before using it
  const STEPS = {
    EVENT_DETAILS: 0,
    TICKETS: 1,
  };
  const { userInfo } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(STEPS.EVENT_DETAILS);
  const [ticketType, setTicketType] = useState("free");

  const [formState, setFormState] = useState({
    title: "",
    eventType: "",
    Date: today,
    timeZone: "UTC",
    location: "",
    description: "",
    capacity: "",
    organizer: "",
    website: "",
    state: "",
    tags: [],
    ticketName: "",
    ticketStock: "",
    ticketPurchaseLimit: "",
    ticketDescription: "",
    price: "0",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success", // or "failure"
  });

  // React Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
  ];

  const showAlert = (message, type = "success") => {
    setAlert({
      show: true,
      message,
      type,
    });

    // Auto-hide the alert after 5 seconds
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const stateData = statesAndLGAs.find(
      (state) => state.name === selectedState
    );

    setFormState((prev) => ({
      ...prev,
      state: selectedState,
      lga: "",
    }));
  };

  const [images, setImages] = useState({
    coverImage: null,
    additionalImages: [],
  });

  const [previews, setPreviews] = useState({
    coverImage: null,
    additionalImages: [],
  });

  const [loading, setLoading] = useState(false);

  const eventTypes = ["conference", "workshop", "seminar", "webinar", "other"];

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showMessage = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  useEffect(() => {
    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`${backendURL}/api/getEventById/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      const data = await response.json();

      setFormState({
        title: data.title || "",
        eventType: data.eventType || "",
        Date: data.Date
          ? new Date(data.Date).toISOString().slice(0, 16)
          : today,
        timeZone: data.timeZone || "UTC",
        location: data.location || "",
        description: data.description || "",
        capacity: data.capacity?.toString() || "",
        organizer: data.organizer || "",
        website: data.website || "",
        state: data.state || "",
        tags: data.tags || [],
        price: data.price?.toString() || "",
        ticketName: data?.ticketName || "",
        ticketStock: data?.ticketStock || "",
        ticketPurchaseLimit: data?.ticketPurchaseLimit?.toString() || "",
        ticketDescription: data?.ticketDescription || "",
      });

      setPreviews({
        coverImage: data.coverImage,
        additionalImages: data.additionalImages || [],
      });
    } catch (error) {
      console.error("Error fetching event data:", error);
      showMessage("Failed to load event data. Please try again.", "error");
    }
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

  const removeImage = (type, index) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formState.title || !formState.eventType) {
        throw new Error("Please fill in all required fields");
      }

      // Ensure user is authenticated
      if (!userInfo || !userInfo.token) {
        throw new Error("You must be logged in to create an event");
      }

      const transformedData = {
        title: formState.title.trim(),
        eventType: formState.eventType,
        Date: new Date(formState.Date),
        timeZone: formState.timeZone,
        location: formState.location || undefined,
        description: formState.description || undefined,
        capacity: formState.capacity ? Number(formState.capacity) : undefined,
        organizer: formState.organizer || undefined,
        website: formState.website || undefined,
        state: formState.state || undefined,
        tags: formState.tags,
        price: formState.price ? Number(formState.price) : undefined,
        ticketName: formState.ticketName || undefined,
        ticketStock: formState.ticketStock || undefined,
        ticketPurchaseLimit: formState.ticketPurchaseLimit
          ? Number(formState.ticketPurchaseLimit)
          : undefined,
        ticketDescription: formState?.ticketDescription || undefined,
      };

      const cleanData = JSON.parse(JSON.stringify(transformedData));
      const formData = new FormData();
      formData.append("eventData", JSON.stringify(cleanData));

      if (images.coverImage) {
        formData.append("coverImage", images.coverImage);
      } else if (!eventId) {
        throw new Error("Cover image is required for new events");
      }

      if (images.additionalImages?.length > 0) {
        images.additionalImages.forEach((image) => {
          formData.append("additionalImages", image);
        });
      }

      const url = eventId
        ? `${backendURL}/api/updateEvent/${eventId}`
        : `${backendURL}/api/createEvent`;
      const method = eventId ? "PUT" : "POST";

      // Include authorization header
      const headers = {
        Authorization: `Bearer ${userInfo.token}`,
      };

      const response = await fetch(url, {
        method,
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save event");
      }

      showAlert(
        eventId ? "Event updated successfully!" : "Event created successfully!"
      );

      setTimeout(() => {
        window.history.back();
      }, 2000);
    } catch (error) {
      console.error("Error saving event:", error);
      showAlert(
        error.message || "Failed to save event. Please try again.",
        "failure"
      );
    } finally {
      setLoading(false);
    }
  };

  // renderEventDetails
  const RenderEventsDetails = () => (
    <div className="container mx-auto p-4">
      {alert.show && (
        <Alert
          color={alert.type}
          onDismiss={() => setAlert((prev) => ({ ...prev, show: false }))}
          className="fixed top-4 right-4 z-50 w-96"
        >
          <div className="flex items-center gap-3">
            <HiInformationCircle className="h-5 w-5" />
            <span className="font-medium bg-yellow-100 text-black p-2">
              {alert.message}
            </span>
          </div>
        </Alert>
      )}
      <Button
        color="light"
        onClick={() => window.history.back()}
        className="mb-4"
      >
        <HiArrowLeft className="mr-2" /> Back
      </Button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {/* {eventId ? "Edit Event" : "Create New Event"} */}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Event Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <TextInput
                id="title"
                type="text"
                placeholder="Enter event title"
                required
                value={formState.title}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div>
              <span></span>
              <Label htmlFor="eventType">What kind of event is it?</Label>
              <Select
                id="eventType"
                required
                value={formState.eventType}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    eventType: e.target.value,
                  }))
                }
              >
                <option value="">Select Event Type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="Date">Event Date and Time</Label>
              <TextInput
                id="Date"
                type="datetime-local"
                value={formState.Date}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    Date: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="timeZone">Time Zone</Label>
              <Select
                id="timeZone"
                value={formState.timeZone}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    timeZone: e.target.value,
                  }))
                }
              >
                {["UTC", "EST", "PST", "CST", "GMT"].map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Full address of the Event</Label>
              <TextInput
                id="location"
                type="text"
                placeholder="Enter event location"
                value={formState.location}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select
                id="state"
                value={formState.state}
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
          </div>

          <div>
            <Label htmlFor="description">Event Description</Label>
            <div className="mt-2">
              <ReactQuill
                theme="snow"
                value={formState.description}
                onChange={(content) =>
                  setFormState((prev) => ({
                    ...prev,
                    description: content,
                  }))
                }
                modules={modules}
                formats={formats}
                className="h-48 mb-12" // Add margin-bottom to account for Quill toolbar
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Event Photos</h3>

          <div className="mb-4">
            <Label htmlFor="coverImage">Cover Image</Label>
            <FileInput
              id="coverImage"
              helperText="Upload a cover image for your event"
              onChange={(e) => handleImageChange("coverImage", e.target.files)}
            />
            {previews.coverImage && (
              <div className="mt-2 relative">
                <img
                  src={previews.coverImage}
                  alt="Event cover image"
                  className="max-h-[18rem] w-auto object-cover rounded"
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
              helperText="Upload additional event images"
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
                    onClick={() => removeImage("additionalImages", index)}
                  >
                    <HiX />
                  </Button>
                </div>
              ))}
            </div>
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
    </div>
  );

  // RenderTicketSetup
  const RenderTicketSetup = () => (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Radio
          id="free"
          name="ticketType"
          value="free"
          checked={ticketType === "free"}
          onChange={(e) => setTicketType(e.target.value)}
        />
        <Label htmlFor="free">Free</Label>

        <Radio
          id="paid"
          name="ticketType"
          value="paid"
          checked={ticketType === "paid"}
          onChange={(e) => setTicketType(e.target.value)}
        />
        <Label htmlFor="paid">Paid</Label>
      </div>

      <div>
        <Label htmlFor="ticketName">Ticket Name</Label>
        <TextInput
          id="ticketName"
          value={formState.ticketName}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, ticketName: e.target.value }))
          }
        />
      </div>

      {/* ticket discription */}
      <div>
        <Label htmlFor="ticketDescription">Ticket Description</Label>
        <TextInput
          id="ticketDescription"
          type="text"
          value={formState.ticketDescription}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              ticketDescription: e.target.value,
            }))
          }
        />
      </div>

      {ticketType === "paid" && (
        <>
          <div>
            <Label htmlFor="ticketStock">Ticket Stock</Label>
            <TextInput
              id="ticketStock"
              type="number"
              value={formState.ticketStock}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  ticketStock: e.target.value,
                }))
              }
            />
          </div>
          {/* purchase limit */}
          <div>
            <Label htmlFor="ticketPurchaseLimit">Ticket Purchase Limit</Label>
            <TextInput
              id="ticketPurchaseLimit"
              type="number"
              value={formState.ticketPurchaseLimit}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  ticketPurchaseLimit: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <TextInput
              id="price"
              type="number"
              value={formState.price}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {eventId ? "Edit Event" : "Create New Event"}
            </h2>
            <div className="flex gap-2">
              <span className="text-gray-500">Step {currentStep + 1} of 3</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === STEPS.EVENT_DETAILS && RenderEventsDetails()}
            {currentStep === STEPS.TICKETS && RenderTicketSetup()}

            <div className="flex justify-between pt-4">
              {currentStep > 0 && (
                <Button color="light" onClick={handleBack}>
                  <HiArrowLeft className="mr-2" /> Back
                </Button>
              )}

              {currentStep < 1 ? (
                <button onClick={handleNext} className="ml-auto">
                  Next <HiArrowRight className="ml-2" />
                </button>
              ) : (
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="text-white w-full bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-offset-2 focus:ring-btColour transition-all duration-300 ease-in-out hover:scale-105 focus:ring-4 font-medium rounded-lg text-sm py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    {loading
                      ? "Saving..."
                      : eventId
                      ? "Update Event"
                      : "Create Event"}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
        {/* Snackbar notification */}
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
      </div>
    </>
  );
};

export default CreateEvent;
