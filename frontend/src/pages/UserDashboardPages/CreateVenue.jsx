// import React, { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Label,
//   TextInput,
//   Select,
//   Textarea,
//   FileInput,
//   Button,
//   Datepicker,
//   Modal,
// } from "flowbite-react";
// import { HiArrowLeft, HiCloudUpload, HiPlus, HiX } from "react-icons/hi";
// import { statesAndLGAs } from "../../assets/State/LGAs.json";
// import backendURL from "../../config";

// const CreateVenue = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const { venueId } = useParams();
//   const [formState, setFormState] = useState({
//     title: "",
//     type: "",
//     capacity: "",
//     furnishing: "",
//     bathrooms: "",
//     toilets: "",
//     specifications: "",
//     duration: "",
//     state: "",
//     lga: "",
//     area: "",
//     street: "",
//     totalPayment: "",
//     percentage: "",
//     initialPayment: "",
//   });

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [lgaOptions, setLgaOptions] = useState([]);
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     type: null,
//     index: null,
//   });

//   const [images, setImages] = useState({
//     coverImage: null,
//     additionalImages: [],
//   });

//   const [previews, setPreviews] = useState({
//     coverImage: null,
//     additionalImages: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const fileInputRefs = {
//     coverImage: useRef(null),
//     additionalImage: useRef(null),
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   const showMessage = (message, severity) => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   const handleStateChange = (e) => {
//     const selectedState = e.target.value;
//     const stateData = statesAndLGAs.find(
//       (state) => state.name === selectedState
//     );

//     setFormState((prev) => ({
//       ...prev,
//       state: selectedState,
//       lga: "",
//     }));

//     setLgaOptions(stateData ? stateData.local_governments : []);
//   };

//   const handleLGAChange = (e) => {
//     setFormState((prev) => ({
//       ...prev,
//       lga: e.target.value,
//     }));
//   };

//   useEffect(() => {
//     if (venueId) {
//       fetchVenueData();
//     }
//   }, [venueId]);

//   const fetchVenueData = async () => {
//     try {
//       const response = await fetch(`${backendURL}/api/getVenueById/${venueId}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch venue data");
//       }
//       const data = await response.json();

//       setFormState({
//         title: data.title || "",
//         type: data.type || "",
//         capacity: data.capacity || "",
//         furnishing: data.furnishing || "",
//         bathrooms: data.bathrooms?.toString() || "",
//         toilets: data.toilets?.toString() || "",
//         duration: data.duration || "",
//         state: data.address?.state || "",
//         lga: data.address?.lga || "",
//         area: data.address?.area || "",
//         street: data.address?.street || "",
//         totalPayment: data.pricingDetails?.totalpayment?.toString() || "",
//         initialPayment: data.pricingDetails?.initialPayment?.toString() || "",
//         percentage: data.pricingDetails?.percentage || "",
//       });

//       if (data.address?.state) {
//         const stateData = statesAndLGAs.find(
//           (state) => state.name === data.address.state
//         );
//         setLgaOptions(stateData ? stateData.local_governments : []);
//       }

//       setPreviews({
//         coverImage: data.coverImage,
//         additionalImages: data.additionalImages || [],
//       });
//     } catch (error) {
//       console.error("Error fetching venue data:", error);
//       showMessage("Failed to load venue data. Please try again.", "error");
//     }
//   };

//   const handleImageChange = (type, files) => {
//     if (!files.length) return;

//     if (type === "additionalImages") {
//       const newImages = Array.from(files);
//       const newPreviews = newImages.map((file) => URL.createObjectURL(file));

//       setImages((prev) => ({
//         ...prev,
//         additionalImages: [...prev.additionalImages, ...newImages],
//       }));

//       setPreviews((prev) => ({
//         ...prev,
//         additionalImages: [...prev.additionalImages, ...newPreviews],
//       }));
//     } else {
//       const file = files[0];
//       const preview = URL.createObjectURL(file);

//       setImages((prev) => ({
//         ...prev,
//         coverImage: file,
//       }));

//       setPreviews((prev) => ({
//         ...prev,
//         coverImage: preview,
//       }));
//     }
//   };

//   const handleDeleteConfirmation = (type, index) => {
//     setDeleteModal({
//       isOpen: true,
//       type,
//       index,
//     });
//   };

//   const handleDeleteCancel = () => {
//     setDeleteModal({
//       isOpen: false,
//       type: null,
//       index: null,
//     });
//   };

//   const removeImage = async (type, index) => {
//     try {
//       const imageUrl =
//         type === "coverImage"
//           ? previews.coverImage
//           : previews.additionalImages[index];

//       // Only make API call if the image is already saved (has a Cloudinary URL)
//       if (imageUrl && imageUrl.includes("cloudinary")) {
//         const response = await fetch(`${backendURL}/api/remove-Venueimage`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             venueId,
//             imageUrl,
//             imageType: type,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to remove image");
//         }
//       }

//       // Update local state regardless of whether API call was made
//       if (type === "coverImage") {
//         setImages((prev) => ({ ...prev, coverImage: null }));
//         setPreviews((prev) => ({ ...prev, coverImage: null }));
//       } else {
//         setImages((prev) => ({
//           ...prev,
//           additionalImages: prev.additionalImages.filter((_, i) => i !== index),
//         }));
//         setPreviews((prev) => ({
//           ...prev,
//           additionalImages: prev.additionalImages.filter((_, i) => i !== index),
//         }));
//       }

//       showMessage("Image removed successfully", "success");
//       handleDeleteCancel(); // Close the modal after successful deletion
//     } catch (error) {
//       console.error("Error removing image:", error);
//       showMessage("Failed to remove image", "error");
//       handleDeleteCancel(); // Close the modal on error
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (
//         !formState.title ||
//         !formState.type ||
//         !formState.capacity ||
//         !formState.state ||
//         !formState.lga ||
//         !formState.totalPayment
//       ) {
//         throw new Error("Please fill in all required fields");
//       }

//       if (
//         isNaN(Number(formState.totalPayment)) ||
//         Number(formState.totalPayment) <= 0
//       ) {
//         throw new Error("Please enter a valid total payment amount");
//       }

//       if (
//         formState.initialPayment &&
//         (isNaN(Number(formState.initialPayment)) ||
//           Number(formState.initialPayment) <= 0)
//       ) {
//         throw new Error("Please enter a valid initial payment amount");
//       }

//       if (formState.bathrooms && isNaN(Number(formState.bathrooms))) {
//         throw new Error("Please enter a valid number of bathrooms");
//       }

//       if (formState.toilets && isNaN(Number(formState.toilets))) {
//         throw new Error("Please enter a valid number of toilets");
//       }

//       const transformedData = {
//         title: formState.title.trim(),
//         type: formState.type,
//         capacity: formState.capacity,
//         furnishing: formState.furnishing || undefined,
//         bathrooms: formState.bathrooms
//           ? Number(formState.bathrooms)
//           : undefined,
//         toilets: formState.toilets ? Number(formState.toilets) : undefined,
//         duration: formState.duration || undefined,
//         pricingDetails: {
//           totalpayment: Number(formState.totalPayment),
//           initialPayment: formState.initialPayment
//             ? Number(formState.initialPayment)
//             : undefined,
//           percentage: formState.percentage || undefined,
//         },
//         address: {
//           state: formState.state,
//           lga: formState.lga,
//           area: formState.area || undefined,
//           street: formState.street || undefined,
//         },
//       };

//       const cleanData = JSON.parse(JSON.stringify(transformedData));

//       const formData = new FormData();
//       formData.append("venueData", JSON.stringify(cleanData));

//       if (images.coverImage) {
//         formData.append("coverImage", images.coverImage);
//       } else if (!venueId) {
//         throw new Error("Cover image is required for new venues");
//       }

//       if (images.additionalImages && images.additionalImages.length > 0) {
//         images.additionalImages.forEach((image) => {
//           formData.append("additionalImages", image);
//         });
//       }

//       const url = venueId
//         ? `${backendURL}/api/updateVenue/${venueId}`
//         : `${backendURL}/api/createVenue`;
//       const method = venueId ? "PUT" : "POST";

//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${userInfo.token}`, // Include the Authorization header
//         },
//         method,
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to save venue");
//       }

//       showMessage(
//         venueId ? "Venue updated successfully!" : "Venue created successfully!",
//         "success"
//       );

//       setTimeout(() => {
//         window.history.back();
//       }, 2000);
//     } catch (error) {
//       console.error("Error saving venue:", error);
//       showMessage(
//         error.message || "Failed to save venue. Please try again.",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <Button
//         color="light"
//         onClick={() => window.history.back()}
//         className="mb-4"
//       >
//         <HiArrowLeft className="mr-2" /> Back
//       </Button>

//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-6">
//           {venueId ? "Edit Venue" : "Post a Venue"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <h3 className="text-lg font-semibold mb-4">Venue Details</h3>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="title">Venue Title</Label>
//               <TextInput
//                 id="title"
//                 type="text"
//                 placeholder="Enter venue title"
//                 required
//                 value={formState.title}
//                 onChange={(e) =>
//                   setFormState((prev) => ({ ...prev, title: e.target.value }))
//                 }
//               />
//             </div>

//             <div>
//               <Label htmlFor="type">Type</Label>
//               <Select
//                 id="type"
//                 required
//                 value={formState.type}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     type: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Select Type</option>
//                 <option value="multi_purpose_hall">Multi-purpose Hall</option>
//                 <option value="hall">Hall</option>
//                 <option value="auditorium">Auditorium</option>
//                 <option value="classroom">Classroom</option>
//                 <option value="conference_room">Conference Room</option>
//                 <option value="banquet_hall">Banquet Hall</option>
//                 <option value="wedding_hall">Wedding Hall</option>
//                 <option value="seminar_hall">Seminar Hall</option>
//                 <option value="party_venue">Party Venue</option>
//                 <option value="training_room">Training Room</option>
//                 <option value="meeting_room">Meeting Room</option>
//                 <option value="outdoor_space">Outdoor Space</option>
//                 <option value="community_center">Community Center</option>
//                 <option value="cultural_center">Cultural Center</option>
//                 <option value="church_hall">Church Hall</option>
//                 <option value="mosque_hall">Mosque Hall</option>
//                 <option value="temple_hall">Temple Hall</option>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="capacity">Capacity</Label>
//               <Select
//                 id="capacity"
//                 required
//                 value={formState.capacity}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     capacity: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Select Capacity</option>
//                 <option value="300-500">300-500 guests</option>
//                 <option value="500-800">500-800 guests</option>
//                 <option value="800-1000">800-1000 guests</option>
//                 <option value="1000+">1000+ guests</option>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="furnishing">Furnishing</Label>
//               <Select
//                 id="furnishing"
//                 value={formState.furnishing}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     furnishing: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Select Furnishing</option>
//                 <option value="furnished">Furnished</option>
//                 <option value="unfurnished">Unfurnished</option>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="bathrooms">Bathrooms</Label>
//               <Select
//                 id="bathrooms"
//                 value={formState.bathrooms}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     bathrooms: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Select Number</option>
//                 {[1, 2, 3, 4, 5].map((num) => (
//                   <option key={num} value={num.toString()}>
//                     {num}
//                   </option>
//                 ))}
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="toilets">Toilets</Label>
//               <Select
//                 id="toilets"
//                 value={formState.toilets}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     toilets: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Select Number</option>
//                 {[1, 2, 3, 4, 5].map((num) => (
//                   <option key={num} value={num.toString()}>
//                     {num}
//                   </option>
//                 ))}
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="duration">Duration</Label>
//               <Select
//                 id="duration"
//                 value={formState.duration}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     duration: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Select Duration</option>
//                 <option value="1hour">1 Hour</option>
//                 <option value="2hours">2 Hours</option>
//                 <option value="4hours">4 Hours</option>
//                 <option value="4hours">8 Hours</option>
//                 <option value="4hours">24 Hours</option>
//               </Select>
//             </div>
//           </div>

//           <h3 className="text-lg font-semibold mb-4">Address Details</h3>
//           <div className="grid md:grid-cols -2 gap-4">
//             <div>
//               <Label htmlFor="state">State</Label>
//               <Select
//                 id="state"
//                 value={formState.state}
//                 onChange={handleStateChange}
//               >
//                 <option value="">Select State</option>
//                 {statesAndLGAs.map((state) => (
//                   <option key={state.id} value={state.name}>
//                     {state.name}
//                   </option>
//                 ))}
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="lga">LGA</Label>
//               <Select
//                 id="lga"
//                 value={formState.lga}
//                 onChange={handleLGAChange}
//                 disabled={!formState.state}
//               >
//                 <option value="">Select LGA</option>
//                 {lgaOptions.map((lga) => (
//                   <option key={lga.id} value={lga.name}>
//                     {lga.name}
//                   </option>
//                 ))}
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="area">Area</Label>
//               <TextInput
//                 id="area"
//                 type="text"
//                 placeholder="Enter area"
//                 value={formState.area}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     area: e.target.value,
//                   }))
//                 }
//               />
//             </div>

//             <div>
//               <Label htmlFor="street">Street</Label>
//               <TextInput
//                 id="street"
//                 type="text"
//                 placeholder="Enter street"
//                 value={formState.street}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     street: e.target.value,
//                   }))
//                 }
//               />
//             </div>
//           </div>

//           <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="totalPayment">Total Price</Label>
//               <TextInput
//                 id="totalPayment"
//                 type="number"
//                 placeholder="Enter total price"
//                 value={formState.totalPayment}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     totalPayment: e.target.value,
//                   }))
//                 }
//               />
//             </div>

//             <div>
//               <Label htmlFor="initialPayment">Initial Payment Amount</Label>
//               <TextInput
//                 id="initialPayment"
//                 type="number"
//                 placeholder="Enter initial payment"
//                 value={formState.initialPayment}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     initialPayment: e.target.value,
//                   }))
//                 }
//               />
//             </div>

//             <div>
//               <Label htmlFor="percentage">Percentage</Label>
//               <Select
//                 id="percentage"
//                 value={formState.percentage}
//                 onChange={(e) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     percentage: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Select Percentage</option>
//                 <option value="10%">10%</option>
//                 <option value="20%">20%</option>
//                 <option value="30%">30%</option>
//                 <option value="40%">40%</option>
//                 <option value="50%">50%</option>
//               </Select>
//             </div>
//           </div>

//           <h3 className="text-lg font-semibold mb-4">Venue Photos</h3>

//           <div className="mb-4">
//             <Label htmlFor="coverImage">Cover Image</Label>
//             <FileInput
//               id="coverImage"
//               helperText="Upload a cover image for your venue"
//               onChange={(e) => handleImageChange("coverImage", e.target.files)}
//             />
//             {previews.coverImage && (
//               <div className="mt-2 relative">
//                 <img
//                   src={previews.coverImage}
//                   alt="Cover Preview"
//                   className="max-h-[18rem]  w-auto object-cover rounded"
//                 />
//               </div>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="additionalImages">Additional Images</Label>
//             <FileInput
//               id="additionalImages"
//               multiple
//               helperText="Upload additional venue images"
//               onChange={(e) =>
//                 handleImageChange("additionalImages", e.target.files)
//               }
//             />
//             <div className="grid grid-cols-3 gap-2 mt-2">
//               {previews.additionalImages.map((preview, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={preview}
//                     alt={`Additional Preview ${index}`}
//                     className="w-full lg:h-48 object-cover rounded"
//                   />
//                   <Button
//                     color="failure"
//                     size="xs"
//                     className="absolute top-0 right-0"
//                     onClick={() =>
//                       handleDeleteConfirmation("additionalImages", index)
//                     }
//                   >
//                     <HiX />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="text-center">
//             <button
//               type="submit"
//               disabled={loading}
//               className="text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-offset-2 focus:ring-btColour transition-all duration-300 ease-in-out hover:scale-105 focus:ring-4  font-medium rounded-lg text-sm w-[30%] py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 "
//             >
//               {loading
//                 ? "Saving..."
//                 : venueId
//                 ? "Update Venue"
//                 : "Create Venue"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Snackbar Notification */}
//       {snackbar.open && (
//         <div
//           className={`fixed top-4 right-4 p-4 rounded ${
//             snackbar.severity === "success"
//               ? "bg-green-500 text-white"
//               : "bg-red-500 text-white"
//           }`}
//         >
//           {snackbar.message}
//         </div>
//       )}

//       {/* Modal for submission confirm delete */}
//       <Modal
//         show={deleteModal.isOpen}
//         onClose={handleDeleteCancel}
//         size="sm"
//         popup
//         className="rounded-lg shadow-md"
//       >
//         <Modal.Header className="border-b border-gray-300">
//           <h2 className="text-lg font-semibold text-gray-700">
//             Confirm Deletion
//           </h2>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="text-center p-1">
//             <h3 className="mb-4 text-lg font-medium text-gray-700">
//               Are you sure you want to delete this image?
//             </h3>
//             <div className="flex justify-center gap-2 mt-2">
//               <Button
//                 color="failure"
//                 onClick={() => removeImage(deleteModal.type, deleteModal.index)}
//                 className="px-1 py-2 hover:text-white rounded-lg shadow-md text-black hover:bg-red-700 focus:ring focus:ring-red-300"
//               >
//                 Yes, delete it
//               </Button>
//               <Button
//                 color="gray"
//                 onClick={handleDeleteCancel}
//                 className="px-1 py-2 hover:text-white rounded-lg shadow-md hover:bg-gray-600 focus:ring focus:ring-gray-300"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default CreateVenue;\

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Label,
  TextInput,
  Select,
  Button,
  Modal,
  FileInput,
} from "flowbite-react";
import { HiArrowLeft, HiX } from "react-icons/hi";
import { statesAndLGAs } from "../../assets/State/LGAs.json";
import backendURL from "../../config";

const CreateVenue = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { venueId } = useParams();
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    businessEmail: "",
    businessPhoneNumbers: ["", ""],
    type: "",
    capacity: "",
    amenities: {
      isFurnished: false,
      hasAC: false,
      hasToilet: false,
      hasBathroom: false,
      hasChangingRoom: false,
      toilets: "",
      bathrooms: "",
    },
    state: "",
    lga: "",
    area: "",
    street: "",
    totalPayment: "",
    percentage: "",
    initialPayment: "",
    paymentDuration: [],
  });

  // Quill editor configurations
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
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
    "list",
    "bullet",
    "link",
  ];

  // Handle description change
  const handleDescriptionChange = (content) => {
    setFormState((prev) => ({
      ...prev,
      description: content,
    }));
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [lgaOptions, setLgaOptions] = useState([]);
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

  const [loading, setLoading] = useState(false);
  const fileInputRefs = {
    coverImage: useRef(null),
    additionalImage: useRef(null),
  };

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

    setLgaOptions(stateData ? stateData.local_governments : []);
  };

  const handleLGAChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      lga: e.target.value,
    }));
  };

  useEffect(() => {
    if (venueId) {
      fetchVenueData();
    }
  }, [venueId]);

  const handleAmenityChange = (field) => {
    setFormState((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [field]: !prev.amenities[field],
      },
    }));
  };

  const handlePhoneChange = (index, value) => {
    setFormState((prev) => ({
      ...prev,
      businessPhoneNumbers: prev.businessPhoneNumbers.map((phone, i) =>
        i === index ? value : phone
      ),
    }));
  };

  const handlePaymentDurationChange = (duration) => {
    setFormState((prev) => ({
      ...prev,
      paymentDuration: prev.paymentDuration.includes(duration)
        ? prev.paymentDuration.filter((d) => d !== duration)
        : [...prev.paymentDuration, duration],
    }));
  };

  // Modify the fetchVenueData function to handle new fields
  const fetchVenueData = async () => {
    try {
      const response = await fetch(`${backendURL}/api/getVenueById/${venueId}`);
      if (!response.ok) throw new Error("Failed to fetch venue data");
      const data = await response.json();

      setFormState({
        title: data.title || "",
        description: data.description || "",
        businessEmail: data.businessEmail || "",
        businessPhoneNumbers: data.businessPhoneNumbers || ["", ""],
        type: data.type || "",
        capacity: data.capacity || "",
        amenities: {
          isFurnished: data.amenities?.isFurnished || false,
          hasAC: data.amenities?.hasAC || false,
          hasToilet: data.amenities?.hasToilet || false,
          hasBathroom: data.amenities?.hasBathroom || false,
          hasChangingRoom: data.amenities?.hasChangingRoom || false,
          toilets: data.amenities?.toilets?.toString() || "",
          bathrooms: data.amenities?.bathrooms?.toString() || "",
        },
        state: data.address?.state || "",
        lga: data.address?.lga || "",
        area: data.address?.area || "",
        street: data.address?.street || "",
        totalPayment: data.pricingDetails?.totalPayment?.toString() || "",
        initialPayment: data.pricingDetails?.initialPayment?.toString() || "",
        percentage: data.pricingDetails?.percentage || "",
        paymentDuration: data.pricingDetails?.paymentDuration || [],
      });

      if (data.address?.state) {
        const stateData = statesAndLGAs.find(
          (state) => state.name === data.address.state
        );
        setLgaOptions(stateData ? stateData.local_governments : []);
      }

      setPreviews({
        coverImage: data.coverImage,
        additionalImages: data.additionalImages || [],
      });
    } catch (error) {
      console.error("Error fetching venue data:", error);
      showMessage("Failed to load venue data. Please try again.", "error");
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
        const response = await fetch(`${backendURL}/api/remove-Venueimage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            venueId,
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

  const handleImageChange = (type, fileList) => {
    if (!fileList || fileList.length === 0) return;

    if (type === "coverImage") {
      const file = fileList[0];
      const preview = URL.createObjectURL(file);

      setImages((prev) => ({
        ...prev,
        coverImage: file,
      }));

      setPreviews((prev) => ({
        ...prev,
        coverImage: preview,
      }));
    } else if (type === "additionalImages") {
      const newFiles = Array.from(fileList);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newFiles],
      }));

      setPreviews((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newPreviews],
      }));
    }
  };

  // Cleanup function for URL objects
  useEffect(() => {
    return () => {
      // Cleanup cover image preview URL
      if (previews.coverImage && !previews.coverImage.includes("cloudinary")) {
        URL.revokeObjectURL(previews.coverImage);
      }
      // Cleanup additional images preview URLs
      previews.additionalImages.forEach((url) => {
        if (!url.includes("cloudinary")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formState.title ||
        !formState.businessEmail ||
        !formState.businessPhoneNumbers[0] ||
        !formState.type ||
        !formState.capacity ||
        !formState.state ||
        !formState.lga ||
        !formState.street ||
        !formState.totalPayment ||
        !formState.initialPayment ||
        !formState.paymentDuration?.length // Must have at least one payment duration
      ) {
        throw new Error("Please fill in all required fields");
      }

      const transformedData = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        businessEmail: formState.businessEmail.trim(),
        businessPhoneNumbers: formState.businessPhoneNumbers.filter(
          (phone) => phone
        ), // Remove empty strings
        type: formState.type,
        capacity: formState.capacity,
        amenities: {
          isFurnished: formState.amenities.isFurnished,
          hasAC: formState.amenities.hasAC,
          hasToilet: formState.amenities.hasToilet,
          hasBathroom: formState.amenities.hasBathroom,
          hasChangingRoom: formState.amenities.hasChangingRoom,
          toilets: formState.amenities.toilets
            ? Number(formState.amenities.toilets)
            : 0,
          bathrooms: formState.amenities.bathrooms
            ? Number(formState.amenities.bathrooms)
            : 0,
        },
        pricingDetails: {
          totalPayment: Number(formState.totalPayment), // Note: correct casing
          initialPayment: Number(formState.initialPayment),
          percentage: formState.percentage,
          paymentDuration: formState.paymentDuration, // Include payment duration array
        },
        address: {
          state: formState.state,
          lga: formState.lga,
          area: formState.area || "",
          street: formState.street, // Required field
        },
      };

      const cleanData = JSON.parse(JSON.stringify(transformedData));
      const formData = new FormData();
      formData.append("venueData", JSON.stringify(cleanData));

      if (images.coverImage) {
        formData.append("coverImage", images.coverImage);
      } else if (!venueId) {
        throw new Error("Cover image is required for new venues");
      }

      if (images.additionalImages && images.additionalImages.length > 0) {
        images.additionalImages.forEach((image) => {
          formData.append("additionalImages", image);
        });
      }

      const url = venueId
        ? `${backendURL}/api/updateVenue/${venueId}`
        : `${backendURL}/api/createVenue`;
      const method = venueId ? "PUT" : "POST";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save venue");
      }

      showMessage(
        venueId ? "Venue updated successfully!" : "Venue created successfully!",
        "success"
      );

      setTimeout(() => {
        window.history.back();
      }, 2000);
    } catch (error) {
      console.error("Error saving venue:", error);
      showMessage(
        error.message || "Failed to save venue. Please try again.",
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
        <h2 className="text-2xl font-bold mb-6">
          {venueId ? "Edit Venue" : "Post a Venue"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Venue Title *</Label>
                <TextInput
                  id="title"
                  required
                  value={formState.title}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter venue title"
                />
              </div>

              <div>
                <Label htmlFor="businessEmail">Business Email *</Label>
                <TextInput
                  id="businessEmail"
                  type="email"
                  required
                  value={formState.businessEmail}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      businessEmail: e.target.value,
                    }))
                  }
                  placeholder="Enter business email"
                />
              </div>

              {formState.businessPhoneNumbers.map((phone, index) => (
                <div key={index}>
                  <Label htmlFor={`phone${index + 1}`}>
                    Business Phone {index + 1}
                    {index === 0 && " *"}
                  </Label>
                  <TextInput
                    id={`phone${index + 1}`}
                    required={index === 0}
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder={`Enter phone number ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Venue Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Venue Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Existing Type and Capacity fields */}
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  id="type"
                  required
                  value={formState.type}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option value="">Select Type</option>
                  <option value="multi_purpose_hall">Multi-purpose Hall</option>
                  <option value="hall">Hall</option>
                  <option value="auditorium">Auditorium</option>
                  <option value="classroom">Classroom</option>
                  <option value="conference_room">Conference Room</option>
                  <option value="banquet_hall">Banquet Hall</option>
                  <option value="wedding_hall">Wedding Hall</option>
                  <option value="seminar_hall">Seminar Hall</option>
                  <option value="party_venue">Party Venue</option>
                  <option value="training_room">Training Room</option>
                  <option value="meeting_room">Meeting Room</option>
                  <option value="outdoor_space">Outdoor Space</option>
                  <option value="community_center">Community Center</option>
                  <option value="cultural_center">Cultural Center</option>
                  <option value="church_hall">Church Hall</option>
                  <option value="mosque_hall">Mosque Hall</option>
                  <option value="temple_hall">Temple Hall</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Select
                  id="capacity"
                  required
                  value={formState.capacity}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      capacity: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Capacity</option>
                  <option value="300-500">300-500 guests</option>
                  <option value="500-800">500-800 guests</option>
                  <option value="800-1000">800-1000 guests</option>
                  <option value="1000+">1000+ guests</option>
                </Select>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFurnished"
                    checked={formState.amenities.isFurnished}
                    onChange={() => handleAmenityChange("isFurnished")}
                    className="rounded"
                  />
                  <Label htmlFor="isFurnished">Furnished</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasAC"
                    checked={formState.amenities.hasAC}
                    onChange={() => handleAmenityChange("hasAC")}
                    className="rounded"
                  />
                  <Label htmlFor="hasAC">Air Conditioning</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasToilet"
                    checked={formState.amenities.hasToilet}
                    onChange={() => handleAmenityChange("hasToilet")}
                    className="rounded"
                  />
                  <Label htmlFor="hasToilet">Toilet</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasBathroom"
                    checked={formState.amenities.hasBathroom}
                    onChange={() => handleAmenityChange("hasBathroom")}
                    className="rounded"
                  />
                  <Label htmlFor="hasBathroom">Bathroom</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasChangingRoom"
                    checked={formState.amenities.hasChangingRoom}
                    onChange={() => handleAmenityChange("hasChangingRoom")}
                    className="rounded"
                  />
                  <Label htmlFor="hasChangingRoom">Changing Room</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Description Editor */}
          <div className="md:col-span-2">
            <Label htmlFor="description">Venue Description *</Label>
            <div className="mt-2">
              <ReactQuill
                theme="snow"
                value={formState.description}
                onChange={handleDescriptionChange}
                modules={modules}
                formats={formats}
                placeholder="Provide a detailed description of your venue..."
                className="h-64 mb-12" // Add margin bottom to account for Quill toolbar
              />
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalPayment">Total Payment *</Label>
                <TextInput
                  id="totalPayment"
                  type="number"
                  required
                  value={formState.totalPayment}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      totalPayment: e.target.value,
                    }))
                  }
                  placeholder="Enter total payment amount"
                />
              </div>

              <div>
                <Label htmlFor="initialPayment">Initial Payment</Label>
                <TextInput
                  id="initialPayment"
                  type="number"
                  value={formState.initialPayment}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      initialPayment: e.target.value,
                    }))
                  }
                  placeholder="Enter initial payment amount"
                />
              </div>

              <div>
                <Label>Payment Duration Options</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[2, 3, 5, 7, 15].map((days) => (
                    <div key={days} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`duration${days}`}
                        checked={formState.paymentDuration.includes(days)}
                        onChange={() => handlePaymentDurationChange(days)}
                        className="rounded"
                      />
                      <Label htmlFor={`duration${days}`}>{days} days</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Address Details</h3>
          <div className="grid md:grid-cols -2 gap-4">
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

            <div>
              <Label htmlFor="lga">LGA</Label>
              <Select
                id="lga"
                value={formState.lga}
                onChange={handleLGAChange}
                disabled={!formState.state}
              >
                <option value="">Select LGA</option>
                {lgaOptions.map((lga) => (
                  <option key={lga.id} value={lga.name}>
                    {lga.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="area">Area</Label>
              <TextInput
                id="area"
                type="text"
                placeholder="Enter area"
                value={formState.area}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    area: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="street">Street</Label>
              <TextInput
                id="street"
                type="text"
                placeholder="Enter street"
                value={formState.street}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    street: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalPayment">Total Price</Label>
              <TextInput
                id="totalPayment"
                type="number"
                placeholder="Enter total price"
                value={formState.totalPayment}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    totalPayment: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="initialPayment">Initial Payment Amount</Label>
              <TextInput
                id="initialPayment"
                type="number"
                placeholder="Enter initial payment"
                value={formState.initialPayment}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    initialPayment: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="percentage">Percentage</Label>
              <Select
                id="percentage"
                value={formState.percentage}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    percentage: e.target.value,
                  }))
                }
              >
                <option value="">Select Percentage</option>
                <option value="10%">10%</option>
                <option value="20%">20%</option>
                <option value="30%">30%</option>
                <option value="40%">40%</option>
                <option value="50%">50%</option>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Venue Photos</h3>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image {!venueId && "*"}</Label>
              <FileInput
                id="coverImage"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange("coverImage", e.target.files)
                }
                helperText="Upload a cover image for your venue"
              />
              {previews.coverImage && (
                <div className="relative mt-2">
                  <img
                    src={previews.coverImage}
                    alt="Cover Preview"
                    className="max-h-48 w-auto object-cover rounded"
                  />
                  <Button
                    color="failure"
                    size="xs"
                    className="absolute top-2 right-2"
                    onClick={() => handleDeleteConfirmation("coverImage", null)}
                  >
                    <HiX />
                  </Button>
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div className="space-y-2">
              <Label htmlFor="additionalImages">Additional Images</Label>
              <FileInput
                id="additionalImages"
                multiple
                accept="image/*"
                onChange={(e) =>
                  handleImageChange("additionalImages", e.target.files)
                }
                helperText="Upload additional venue images"
              />
              <div className="grid grid-cols-3 gap-4 mt-2">
                {previews.additionalImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Additional Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded"
                    />
                    <Button
                      color="failure"
                      size="xs"
                      className="absolute top-2 right-2"
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
          </div>

          <div className="text-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-[30%] bg-gradient-to-r from-btColour to-Blud"
            >
              {loading
                ? "Saving..."
                : venueId
                ? "Update Venue"
                : "Create Venue"}
            </Button>
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

export default CreateVenue;
