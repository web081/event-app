// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import {
//   UserCircle,
//   Search,
//   Check,
//   X,
//   Trash2,
//   AlertCircle,
//   Clock,
//   Shield,
//   AlertTriangle,
// } from "lucide-react";
// import { FaCheck, FaTimes } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";

// // MUI Imports
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Snackbar,
//   Alert,
//   Button,
//   Switch,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";

// // Simulated backend URL (replace with actual config)
// import backendURL from "../../config";

// export default function AdminAllServices() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [businesses, setBusinesses] = useState([]);
//   const [businessIdToDelete, setBusinessIdToDelete] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "info",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalBusinesses, setTotalBusinesses] = useState(0);
//   const businessesPerPage = 9;
//   const { userInfo } = useSelector((state) => state.auth);
//   const token = userInfo.token;

//   // V
//   const [verifyDialog, setVerifyDialog] = useState({
//     open: false,
//     business: null,
//   });
//   const [blacklistDialog, setBlacklistDialog] = useState({
//     open: false,
//     business: null,
//   });
//   const [actionReason, setActionReason] = useState("");
//   const [blacklistDuration, setBlacklistDuration] = useState("");
//   const [historyDialog, setHistoryDialog] = useState({
//     open: false,
//     business: null,
//   });

//   const handleVerifyDialog = (business) => {
//     if (!business?._id) {
//       showSnackbar("Invalid business data", "error");
//       return;
//     }
//     setVerifyDialog({ open: true, business });
//     setActionReason("");
//   };

//   const handleBlacklistDialog = (business) => {
//     if (!business?._id) {
//       showSnackbar("Invalid business data", "error");
//       return;
//     }
//     setBlacklistDialog({ open: true, business });
//     setActionReason("");
//     setBlacklistDuration("");
//   };

//   const handleVerifyBusiness = async () => {
//     if (!verifyDialog.business?._id) {
//       showSnackbar("Invalid business data", "error");
//       return;
//     }

//     try {
//       // First, fetch verification request
//       const verificationRes = await fetch(
//         `${backendURL}/api/verificationRequests/business/${verifyDialog.business._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const verificationData = await verificationRes.json();

//       // Then make verification request with verification ID
//       const res = await fetch(
//         `${backendURL}/api/verify/${verifyDialog.business._id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             reason: actionReason || "Business verification status updated",
//             verificationId: verificationData?.verificationRequest?._id || null,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         showSnackbar(data.message, "success");
//         fetchBusinesses(currentPage);
//       } else {
//         showSnackbar(data.message || "Failed to verify business", "error");
//       }
//     } catch (error) {
//       showSnackbar(error.message || "An error occurred", "error");
//     }
//     setVerifyDialog({ open: false, business: null });
//     setActionReason("");
//   };

//   const handleBlacklistBusiness = async () => {
//     if (!blacklistDialog.business?._id) {
//       showSnackbar("Invalid business data", "error");
//       return;
//     }

//     if (!actionReason.trim()) {
//       showSnackbar("Please provide a reason for blacklisting", "error");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${backendURL}/api/blacklist/${blacklistDialog.business._id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             reason: actionReason,
//             duration: blacklistDuration ? parseInt(blacklistDuration) : null,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         showSnackbar(data.message, "success");
//         fetchBusinesses(currentPage);
//       } else {
//         showSnackbar(
//           data.message || "Failed to update blacklist status",
//           "error"
//         );
//       }
//     } catch (error) {
//       showSnackbar(error.message || "An error occurred", "error");
//     } finally {
//       setBlacklistDialog({ open: false, business: null });
//       setActionReason("");
//       setBlacklistDuration("");
//     }
//   };

//   const handleCloseSnackbar = useCallback(() => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   }, []);

//   const showSnackbar = useCallback((message, severity = "info") => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

// const fetchBusinesses = useCallback(
//   async (page) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(
//         `${backendURL}/api/getAllBusinesses?page=${page}&limit=${businessesPerPage}`
//       );
//       const data = await res.json();

//       if (res.ok) {
//         const { businesses, totalBusinesses, totalPages, currentPage } = data;
//         // setBusinesses(businesses);
//         setBusinesses(businesses.filter((b) => b?._id));
//         setTotalBusinesses(totalBusinesses);
//         setTotalPages(totalPages);
//         setCurrentPage(currentPage);
//       } else {
//         showSnackbar(data.message || "Failed to fetch businesses", "error");
//       }
//     } catch (error) {
//       showSnackbar(
//         error.message || "An error occurred while fetching businesses",
//         "error"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   },
//   [backendURL, showSnackbar, businessesPerPage]
// );

//   const handleStatusToggle = useCallback(
//     async (businessId, field, currentStatus) => {
//       const newStatus = !currentStatus;

//       // Optimistically update UI
//       setBusinesses((prevBusinesses) =>
//         prevBusinesses.map((business) =>
//           business._id === businessId
//             ? { ...business, [field]: newStatus }
//             : business
//         )
//       );

//       try {
//         const res = await fetch(
//           `${backendURL}/verify/${verifyDialog.business._id}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ [field]: newStatus }),
//           }
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           // Revert changes if update fails
//           setBusinesses((prevBusinesses) =>
//             prevBusinesses.map((business) =>
//               business._id === businessId
//                 ? { ...business, [field]: currentStatus }
//                 : business
//             )
//           );
//           showSnackbar(
//             data.message || `Failed to update ${field} status`,
//             "error"
//           );
//         } else {
//           showSnackbar(
//             `Business ${field} ${
//               newStatus ? "enabled" : "disabled"
//             } successfully`,
//             "success"
//           );
//         }
//       } catch (error) {
//         // Revert changes if network error occurs
//         setBusinesses((prevBusinesses) =>
//           prevBusinesses.map((business) =>
//             business._id === businessId
//               ? { ...business, [field]: currentStatus }
//               : business
//           )
//         );
//         showSnackbar(
//           error.message || `An error occurred while updating ${field}`,
//           "error"
//         );
//       }
//     },
//     [backendURL, showSnackbar]
//   );

//   const handleDeleteBusiness = useCallback(async () => {
//     try {
//       const res = await fetch(
//         `${backendURL}/api/deleteBusiness/${businessIdToDelete}`,
//         {
//           method: "DELETE",
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         const newTotalBusinesses = totalBusinesses - 1;
//         const newTotalPages = Math.ceil(newTotalBusinesses / businessesPerPage);
//         const pageToFetch =
//           currentPage > newTotalPages ? newTotalPages : currentPage;

//         setDeleteOpen(false);
//         showSnackbar("Business deleted successfully", "success");
//         fetchBusinesses(pageToFetch);
//       } else {
//         showSnackbar(data.message || "Failed to delete business", "error");
//       }
//     } catch (error) {
//       showSnackbar(
//         error.message || "An error occurred while deleting business",
//         "error"
//       );
//     }
//   }, [
//     backendURL,
//     businessIdToDelete,
//     currentPage,
//     totalBusinesses,
//     businessesPerPage,
//     fetchBusinesses,
//     showSnackbar,
//   ]);

//   const handleDeleteClick = useCallback((businessId) => {
//     setBusinessIdToDelete(businessId);
//     setDeleteOpen(true);
//   }, []);

//   useEffect(() => {
//     fetchBusinesses(currentPage);
//   }, [currentPage, fetchBusinesses]);

// const filteredBusinesses = useMemo(
//   () =>
//     businesses?.filter(
//       (business) =>
//         business?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         business?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         business?.email?.toLowerCase().includes(searchTerm.toLowerCase())
//     ),
//   [businesses, searchTerm]
// );

//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
//         <AlertCircle className="animate-spin text-blue-600" size={40} />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 bg-transparent">
//       {/* Search and Total Businesses */}
//       <div className="mb-4 flex justify-between items-center">
// <div className="relative flex-grow mr-4">
//   <input
//     type="text"
//     placeholder="Search businesses..."
//     value={searchTerm}
//     onChange={(e) => setSearchTerm(e.target.value)}
//     className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//   />
//   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// </div>
//         <div className="text-gray-600">Total Businesses: {totalBusinesses}</div>
//       </div>

//       {/* Businesses Table */}
//       {businesses?.length > 0 ? (
//         <>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse bg-white shadow-md rounded-lg">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="px-4 py-3 text-left">Name</th>
//                   <th className="px-4 py-3 text-left">Type</th>
//                   <th className="px-4 py-3 text-left">Email</th>
//                   <th className="px-4 py-3 text-left">Phone</th>
//                   <th className="px-4 py-3 text-center">Verification Status</th>
//                   <th className="px-4 py-3 text-center">Blacklist Status</th>
//                   <th className="px-4 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredBusinesses.map((business) => (
//                   <tr
//                     key={business._id}
//                     className="border-b hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="px-4 py-3">{business.name}</td>
//                     <td className="px-4 py-3">{business.type}</td>
//                     <td className="px-4 py-3">{business.email}</td>
//                     <td className="px-4 py-3">{business.phoneNumber}</td>
//                     <td className="px-4 py-3 text-center">
//                       <div className="flex flex-col items-center">
//                         <Switch
//                           checked={business.verified}
//                           onChange={() => handleVerifyDialog(business)}
//                           color="success"
//                         />
//                         {business.verificationDetails && (
//                           <div className="text-xs mt-1">
//                             <div className="text-gray-600">
//                               {business.verificationDetails.reason}
//                             </div>
//                             <div className="text-gray-500">
//                               {moment(
//                                 business.verificationDetails.verifiedAt
//                               ).format("MMM DD, YYYY")}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <div className="flex flex-col items-center">
//                         <Switch
//                           checked={business.blacklisted}
//                           onChange={() => handleBlacklistDialog(business)}
//                           color="error"
//                         />
//                         {business.blacklistDetails && business.blacklisted && (
//                           <div className="text-xs mt-1">
//                             <div className="text-gray-600">
//                               {business.blacklistDetails.reason}
//                             </div>
//                             {business.blacklistDetails.duration && (
//                               <div className="text-gray-500">
//                                 Until:{" "}
//                                 {moment(
//                                   business.blacklistDetails.duration
//                                 ).format("MMM DD, YYYY")}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-center">
// <button
//   onClick={() => handleDeleteClick(business._id)}
//   className="w-full sm:w-auto font-medium text-red-500 bg-transparent border border-red-500 cursor-pointer hover:bg-red-500 hover:text-white p-1 rounded-md text-sm transition-colors"
// >
//   Delete
// </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {/* Verify Dialog */}
//             <Dialog
//               open={verifyDialog.open}
//               onClose={() => setVerifyDialog({ open: false, business: null })}
//             >
//               <DialogTitle>
//                 {verifyDialog.business?.verified
//                   ? "Update Verification"
//                   : "Verify Business"}
//               </DialogTitle>
//               <DialogContent>
//                 <TextField
//                   autoFocus
//                   margin="dense"
//                   label="Reason for verification"
//                   type="text"
//                   fullWidth
//                   value={actionReason}
//                   onChange={(e) => setActionReason(e.target.value)}
//                 />
//               </DialogContent>
//               <DialogActions>
//                 <Button
//                   onClick={() =>
//                     setVerifyDialog({ open: false, business: null })
//                   }
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleVerifyBusiness}
//                   color="primary"
//                   variant="contained"
//                 >
//                   Verify
//                 </Button>
//               </DialogActions>
//             </Dialog>

//             {/* Blacklist Dialog */}
//             <Dialog
//               open={blacklistDialog.open}
//               onClose={() =>
//                 setBlacklistDialog({ open: false, business: null })
//               }
//             >
//               <DialogTitle>
//                 {blacklistDialog.business?.blacklisted
//                   ? "Update Blacklist"
//                   : "Blacklist Business"}
//               </DialogTitle>
//               <DialogContent>
//                 <TextField
//                   autoFocus
//                   margin="dense"
//                   label="Reason for blacklisting"
//                   type="text"
//                   fullWidth
//                   value={actionReason}
//                   onChange={(e) => setActionReason(e.target.value)}
//                 />
//                 <FormControl fullWidth margin="dense">
//                   <InputLabel>Blacklist Duration (Days)</InputLabel>
//                   <Select
//                     value={blacklistDuration}
//                     onChange={(e) => setBlacklistDuration(e.target.value)}
//                   >
//                     <MenuItem value="">Indefinite</MenuItem>
//                     <MenuItem value="7">7 Days</MenuItem>
//                     <MenuItem value="30">30 Days</MenuItem>
//                     <MenuItem value="90">90 Days</MenuItem>
//                     <MenuItem value="180">180 Days</MenuItem>
//                   </Select>
//                 </FormControl>
//               </DialogContent>
//               <DialogActions>
//                 <Button
//                   onClick={() =>
//                     setBlacklistDialog({ open: false, business: null })
//                   }
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleBlacklistBusiness}
//                   color="error"
//                   variant="contained"
//                 >
//                   Blacklist
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-4 space-x-2">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-2 rounded-lg disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`px-3 py-2 rounded-lg ${
//                     currentPage === i + 1
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-2 rounded-lg disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       ) : (
//         <p className="text-center text-gray-500">No businesses found!</p>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteOpen}
//         onClose={() => setDeleteOpen(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           Are you sure you want to delete this business?
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             This action cannot be undone and will permanently remove the
//             business listing.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteOpen(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteBusiness} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar Notification */}
// <Snackbar
//   open={snackbar.open}
//   autoHideDuration={6000}
//   onClose={handleCloseSnackbar}
//   anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
// >
//   <Alert
//     onClose={handleCloseSnackbar}
//     severity={snackbar.severity}
//     sx={{ width: "100%" }}
//   >
//     {snackbar.message}
//   </Alert>
// </Snackbar>
//     </div>
//   );
// }

// import React, { useState, useCallback } from "react";
// import { AlertCircle, Search, Trash2 } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   FormControlLabel,
//   Switch,
//   Button,
//   Alert,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   CircularProgress,
//   InputAdornment,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import backendURL from "../../config";
// const AdminBusinesses = () => {
//   const [businesses, setBusinesses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [alert, setAlert] = useState({
//     show: false,
//     message: "",
//     type: "info",
//   });
//   const [deleteDialog, setDeleteDialog] = useState({
//     open: false,
//     businessId: null,
//   });
//   const [actionDialog, setActionDialog] = useState({
//     open: false,
//     type: null,
//     business: null,
//     reason: "",
//     duration: "",
//   });
//   const { userInfo } = useSelector((state) => state.auth);
//   const token = userInfo?.token;

//   const showAlert = useCallback((message, type = "info") => {
//     setAlert({ show: true, message, type });
//     setTimeout(
//       () => setAlert({ show: false, message: "", type: "info" }),
//       5000
//     );
//   }, []);

//   const handleStatusChange = async (business, type) => {
//     setActionDialog({
//       open: true,
//       type,
//       business,
//       reason: "",
//       duration: "",
//     });
//   };

//   const handleAction = async () => {
//     const { type, business, reason, duration } = actionDialog;

//     try {
//       const endpoint =
//         type === "verify"
//           ? `${backendURL}/api/verify/${business._id}`
//           : `${backendURL}/api/blacklist/${business._id}`;

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Add token
//         },
//         body: JSON.stringify({
//           reason,
//           duration: duration ? parseInt(duration) : null,
//         }),
//       });

//       if (response.ok) {
//         showAlert(
//           `Business ${
//             type === "verify" ? "verification" : "blacklist"
//           } status updated`,
//           "success"
//         );
//         fetchBusinesses(currentPage);
//       } else {
//         const data = await response.json();
//         throw new Error(data.message || "Failed to update status");
//       }
//     } catch (error) {
//       showAlert(error.message, "error");
//     } finally {
//       setActionDialog({
//         open: false,
//         type: null,
//         business: null,
//         reason: "",
//         duration: "",
//       });
//     }
//   };

//   const fetchBusinesses = useCallback(
//     async (page) => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(
//           `${backendURL}/api/getAllBusinesses?page=${page}&limit=10`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // Add token
//             },
//           }
//         );
//         const data = await response.json();

//         if (response.ok) {
//           setBusinesses(data.businesses);
//           setTotalPages(data.totalPages);
//           setCurrentPage(data.currentPage);
//         } else {
//           throw new Error(data.message || "Failed to fetch businesses");
//         }
//       } catch (error) {
//         showAlert(error.message, "error");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [showAlert, token] // Add token to dependencies
//   );

// const handleDelete = async () => {
//   try {
//     const response = await fetch(
//       `${backendURL}/api/deleteBusiness/${deleteDialog.businessId}`,
//       {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`, // Add token
//         },
//       }
//     );

//     if (response.ok) {
//       showAlert("Business deleted successfully", "success");
//       fetchBusinesses(currentPage);
//     } else {
//       const data = await response.json();
//       throw new Error(data.message || "Failed to delete business");
//     }
//   } catch (error) {
//     showAlert(error.message, "error");
//   } finally {
//     setDeleteDialog({ open: false, businessId: null });
//   }
// };

// React.useEffect(() => {
//   if (token) {
//     fetchBusinesses(currentPage);
//   }
// }, [currentPage, fetchBusinesses, token]);

//   if (isLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </div>
//     );
//   }

//   const filteredBusinesses = businesses.filter(
//     (business) =>
//       business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       business.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       business.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div
//       style={{
//         margin: "24px",
//         maxWidth: "1200px",
//         marginLeft: "auto",
//         marginRight: "auto",
//       }}
//     >
//       <div className="relative flex-grow mr-4 my-5 max-w-[50%]">
//         <input
//           type="text"
//           placeholder="Search businesses..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full bg-transparent pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//       </div>

//       {/* Alert */}
//       {alert.show && (
//         <Alert severity={alert.type} style={{ marginBottom: "24px" }}>
//           {alert.message}
//         </Alert>
//       )}

//       {/* Businesses Table */}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Type</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell align="center">Status</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredBusinesses.map((business) => (
//               <TableRow key={business._id}>
//                 <TableCell>{business.name}</TableCell>
//                 <TableCell>{business.type}</TableCell>
//                 <TableCell>{business.email}</TableCell>
//                 <TableCell align="center">
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       gap: "16px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                       }}
//                     >
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={business.verified}
//                             onChange={() =>
//                               handleStatusChange(business, "verify")
//                             }
//                           />
//                         }
//                         label="Verified"
//                         labelPlacement="bottom"
//                       />
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                       }}
//                     >
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={business.blacklisted}
//                             onChange={() =>
//                               handleStatusChange(business, "blacklist")
//                             }
//                           />
//                         }
//                         label="Blacklisted"
//                         labelPlacement="bottom"
//                       />
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell align="center">
//                   <Button
//                     variant="contained"
//                     color="error"
//                     size="small"
//                     Actions
//                     onClick={() =>
//                       setDeleteDialog({ open: true, businessId: business._id })
//                     }
//                   >
//                     <Trash2 />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: "8px",
//           marginTop: "24px",
//         }}
//       >
//         <Button
//           variant="outlined"
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outlined"
//           onClick={() =>
//             setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//           }
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </Button>
//       </div>

//       {/* Action Dialog */}
//       <Dialog
//         open={actionDialog.open}
//         onClose={() =>
//           setActionDialog({
//             open: false,
//             type: null,
//             business: null,
//             reason: "",
//             duration: "",
//           })
//         }
//       >
//         <DialogTitle>
//           {actionDialog.type === "verify"
//             ? "Verify Business"
//             : "Blacklist Business"}
//         </DialogTitle>
//         <DialogContent>
//           <div style={{ marginTop: "16px" }}>
//             <TextField
//               fullWidth
//               label="Reason"
//               required
//               value={actionDialog.reason}
//               onChange={(e) =>
//                 setActionDialog((prev) => ({
//                   ...prev,
//                   reason: e.target.value,
//                 }))
//               }
//               placeholder="Enter reason..."
//               style={{ marginBottom: "16px" }}
//             />
//             {actionDialog.type === "blacklist" && (
//               <FormControl fullWidth>
//                 <InputLabel>Duration</InputLabel>
//                 <Select
//                   value={actionDialog.duration}
//                   onChange={(e) =>
//                     setActionDialog((prev) => ({
//                       ...prev,
//                       duration: e.target.value,
//                     }))
//                   }
//                   label="Duration"
//                 >
//                   <MenuItem value="">Indefinite</MenuItem>
//                   <MenuItem value="7">7 Days</MenuItem>
//                   <MenuItem value="30">30 Days</MenuItem>
//                   <MenuItem value="90">90 Days</MenuItem>
//                 </Select>
//               </FormControl>
//             )}
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() =>
//               setActionDialog({
//                 open: false,
//                 type: null,
//                 business: null,
//                 reason: "",
//                 duration: "",
//               })
//             }
//           >
//             Cancel
//           </Button>
//           <Button onClick={handleAction} variant="contained">
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Dialog */}
//       <Dialog
//         open={deleteDialog.open}
//         onClose={() => setDeleteDialog({ open: false, businessId: null })}
//       >
//         <DialogTitle>Delete Business</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this business? This action cannot be
//             undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setDeleteDialog({ open: false, businessId: null })}
//           >
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default AdminBusinesses;

import React, { useState, useCallback, useMemo } from "react";
import { AlertCircle, Search, Trash2 } from "lucide-react";
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
} from "@mui/material";
import { useSelector } from "react-redux";
import backendURL from "../../config";

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    businessId: null,
  });
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: null,
    business: null,
    reason: "",
    duration: "",
  });

  const businessesPerPage = 9;

  const { userInfo } = useSelector((state) => state.auth);
  const token = userInfo?.token;

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStatusChange = async (business, type) => {
    setActionDialog({
      open: true,
      type,
      business,
      reason: "",
      duration: "",
    });
  };

  const handleAction = async () => {
    const { type, business, reason, duration } = actionDialog;

    if (!reason.trim()) {
      showSnackbar("Please provide a reason", "error");
      return;
    }

    try {
      const endpoint =
        type === "verify"
          ? `${backendURL}/api/verify/${business._id}`
          : `${backendURL}/api/blacklist/${business._id}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason,
          duration: duration ? parseInt(duration) : null,
        }),
      });

      if (response.ok) {
        showSnackbar(
          `Business ${
            type === "verify" ? "verification" : "blacklist"
          } status updated`,
          "success"
        );
        fetchBusinesses(currentPage);
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
        business: null,
        reason: "",
        duration: "",
      });
    }
  };

  const filteredBusinesses = useMemo(
    () =>
      businesses?.filter(
        (business) =>
          business?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [businesses, searchTerm]
  );

  const fetchBusinesses = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${backendURL}/api/getAllBusinesses?page=${page}&limit=${businessesPerPage}`
        );
        const data = await res.json();

        if (res.ok) {
          const { businesses, totalBusinesses, totalPages, currentPage } = data;
          // setBusinesses(businesses);
          setBusinesses(businesses.filter((b) => b?._id));
          setTotalBusinesses(totalBusinesses);
          setTotalPages(totalPages);
          setCurrentPage(currentPage);
        } else {
          showSnackbar(data.message || "Failed to fetch businesses", "error");
        }
      } catch (error) {
        showSnackbar(
          error.message || "An error occurred while fetching businesses",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [backendURL, showSnackbar, businessesPerPage]
  );

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/deleteBusiness/${deleteDialog.businessId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Add token
          },
        }
      );

      if (response.ok) {
        showAlert("Business deleted successfully", "success");
        fetchBusinesses(currentPage);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete business");
      }
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setDeleteDialog({ open: false, businessId: null });
    }
  };

  React.useEffect(() => {
    if (token) {
      fetchBusinesses(currentPage);
    }
  }, [currentPage, fetchBusinesses, token]);

  // ... (keep existing fetchBusinesses and handleDelete functions)

  return (
    <div
      style={{
        margin: "24px",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div className="relative flex-grow mr-4 my-5 max-w-[50%]">
        <TextField
          fullWidth
          placeholder="Search businesses..."
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
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBusinesses.map((business) => (
              <TableRow key={business._id}>
                <TableCell>{business.name}</TableCell>
                <TableCell>{business.type}</TableCell>
                <TableCell>{business.email}</TableCell>
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
                            checked={business.verified}
                            onChange={() =>
                              handleStatusChange(business, "verify")
                            }
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
                            checked={business.blacklisted}
                            onChange={() =>
                              handleStatusChange(business, "blacklist")
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
                      setDeleteDialog({ open: true, businessId: business._id })
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

      {/* Pagination */}
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
        onClose={() =>
          setActionDialog({
            open: false,
            type: null,
            business: null,
            reason: "",
            duration: "",
          })
        }
      >
        <DialogTitle>
          {actionDialog.type === "verify"
            ? "Verify Business"
            : "Blacklist Business"}
        </DialogTitle>
        <DialogContent>
          <div style={{ marginTop: "16px" }}>
            <TextField
              fullWidth
              label="Reason"
              required
              value={actionDialog.reason}
              onChange={(e) =>
                setActionDialog((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
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
                    setActionDialog((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
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
            onClick={() =>
              setActionDialog({
                open: false,
                type: null,
                business: null,
                reason: "",
                duration: "",
              })
            }
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
        onClose={() => setDeleteDialog({ open: false, businessId: null })}
      >
        <DialogTitle>Delete Business</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this business? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, businessId: null })}
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

export default AdminBusinesses;
