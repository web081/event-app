// import React, { useEffect, useState } from "react";
// import { Star, ThumbsUp, Edit2, Trash2 } from "lucide-react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import backendURL from "../config";
// import { Snackbar, Alert } from "@mui/material";

// // Star Rating Component
// const StarRating = ({ rating, setRating, disabled }) => {
//   return (
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star
//           key={star}
//           className={`w-5 h-5 cursor-pointer ${
//             star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
//           }`}
//           onClick={() => !disabled && setRating(star)}
//         />
//       ))}
//     </div>
//   );
// };

// // Review Form Component
// const ReviewForm = ({ businessId, onSuccess, initialData = null }) => {
//   const [rating, setRating] = useState(initialData?.rating || 0);
//   const [comment, setComment] = useState(initialData?.comment || "");
//   const [loading, setLoading] = useState(false);
//   const [showSnackbar, setShowSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const { userInfo } = useSelector((state) => state.auth);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!rating || !comment.trim()) return;

//     setLoading(true);
//     try {
//       const data = {
//         businessId,
//         rating,
//         comment,
//         userId: userInfo._id,
//       };

//       if (initialData) {
//         await axios.put(`${backendURL}/api/reviews/${initialData._id}`, data);
//         setSnackbarMessage("Review updated successfully!");
//       } else {
//         await axios.post(`${backendURL}/api/reviews`, data);
//         setSnackbarMessage("Review posted successfully!");
//       }

//       setSnackbarSeverity("success");
//       setShowSnackbar(true);
//       onSuccess();
//       if (!initialData) {
//         setRating(0);
//         setComment("");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       setSnackbarMessage("Error submitting review. Please try again." || error);
//       setSnackbarSeverity("error");
//       setShowSnackbar(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSnackbarClose = () => setShowSnackbar(false);

//   return (
//     <div className="bg-white p-4 rounded-lg shadow space-y-4">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-2">Rating</label>
//           <StarRating rating={rating} setRating={setRating} />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-2">Comment</label>
//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className="w-full p-2 border rounded-md"
//             rows="4"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading
//             ? "Submitting..."
//             : initialData
//             ? "Update Review"
//             : "Post Review"}
//         </button>
//       </form>

//       <Snackbar
//         open={showSnackbar}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// const ReviewCard = ({ review, onDelete, onEdit, currentUser }) => {
//   return (
//     <div className="flex flex-col w-80 p-4 m-2 bg-white rounded-lg shadow-md shrink-0">
//       {/* User Image and Name */}
//       <div className="flex items-center gap-3 mb-3">
//         {review?.userId?.image ? (
//           <img
//             src={review.userId.image}
//             alt={review.userId.username}
//             className="w-12 h-12 rounded-full object-cover"
//           />
//         ) : (
//           <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
//             {review?.userId?.username?.[0]?.toUpperCase()}
//           </div>
//         )}
//         <div>
//           <h4 className="text-lg font-semibold">{review?.userId?.username}</h4>
//           <div className="flex items-center">
//             <StarRating rating={review.rating} disabled />
//           </div>
//         </div>
//       </div>

//       {/* Comment */}
//       <p className="text-gray-700 mb-4">{review.comment}</p>

//       {/* Actions (Edit/Delete) */}
//       {currentUser?._id === review.userId?._id && (
//         <div className="flex gap-2 mt-auto">
//           <button
//             onClick={() => onEdit(review)}
//             className="p-1 text-gray-500 hover:text-blue-600"
//           >
//             <Edit2 className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => onDelete(review._id)}
//             className="p-1 text-gray-500 hover:text-red-600"
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // Review Section Component
// const ReviewSection = ({ businessId }) => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingReview, setEditingReview] = useState(null);
//   const [showCommentForm, setShowCommentForm] = useState(false);
//   const { userInfo } = useSelector((state) => state.auth);

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         `${backendURL}/api/getBusinessReviews/${businessId}`
//       );
//       setReviews(data.reviews);
//       console.log("data.reviews", data.reviews);
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   const toggleCommentForm = () => {
//     setShowCommentForm(!showCommentForm);
//   };

//   const handleDelete = async (reviewId) => {
//     if (!window.confirm("Are you sure you want to delete this review?")) return;

//     try {
//       await axios.delete(`${backendURL}/api/reviews/${reviewId}`, {
//         data: { userId: userInfo._id },
//       });
//       fetchReviews();
//     } catch (error) {
//       console.error("Error deleting review:", error);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">Reviews</h2>

//       <div className="">
//         {showCommentForm ? (
//           <ReviewForm businessId={businessId} onSuccess={fetchReviews} />
//         ) : (
//           <button
//             className="w-aut py-1 px-3 font-semibold bg-transparent text-Blud rounded-md border border-Blud "
//             onClick={toggleCommentForm}
//           >
//             Post a Comment
//           </button>
//         )}
//       </div>

//       {editingReview && (
//         <ReviewForm
//           businessId={businessId}
//           initialData={editingReview}
//           onSuccess={() => {
//             fetchReviews();
//             setEditingReview(null);
//           }}
//         />
//       )}

//       <div className="overflow-x-auto">
//         <div className="flex gap-4">
//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             reviews.map((review) => (
//               <ReviewCard
//                 key={review._id}
//                 review={review}
//                 onDelete={handleDelete}
//                 onEdit={setEditingReview}
//                 currentUser={userInfo}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewSection;
import React, { useEffect, useState } from "react";
import { Star, ThumbsUp, Edit2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Alert, AlertDescription } from "../components/tools/Alert";
import backendURL from "../config";

// StarRating Component
const StarRating = ({ rating, setRating, disabled }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${!disabled && "cursor-pointer"} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => !disabled && setRating(star)}
        />
      ))}
    </div>
  );
};

// Alert Toast Component
const AlertToast = ({ message, variant = "default", visible, onClose }) => {
  if (!visible) return null;

  return (
    <Alert
      variant={variant}
      className="fixed top-4 right-4 z-50 w-72 animate-in fade-in duration-300"
    >
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

// Review Form Component
const ReviewForm = ({ businessId, onSuccess, initialData = null }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "default",
  });
  const { userInfo } = useSelector((state) => state.auth);

  const showAlert = (message, variant = "default") => {
    setAlert({ show: true, message, variant });
    setTimeout(
      () => setAlert({ show: false, message: "", variant: "default" }),
      3000
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate rating
    if (!rating) {
      showAlert("Please select a rating", "destructive");
      return;
    }

    // Validate comment
    if (!comment.trim()) {
      showAlert("Please enter a comment", "destructive");
      return;
    }

    setLoading(true);
    try {
      const data = {
        businessId,
        rating,
        comment,
        userId: userInfo._id,
      };

      if (initialData) {
        await axios.put(`${backendURL}/api/reviews/${initialData._id}`, data);
        showAlert("Review updated successfully!");
      } else {
        await axios.post(`${backendURL}/api/reviews`, data);
        showAlert("Review posted successfully!");
      }

      onSuccess();
      if (!initialData) {
        setRating(0);
        setComment("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error submitting review. Please try again.";
      if (errorMessage.includes("already reviewed")) {
        showAlert("You have already reviewed this business", "destructive");
      } else {
        showAlert(errorMessage, "destructive");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-[50%] p-4 rounded-lg shadow space-y-4">
      <AlertToast
        message={alert.message}
        variant={alert.variant}
        visible={alert.show}
        onClose={() =>
          setAlert({ show: false, message: "", variant: "default" })
        }
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Share your experience..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-auto py-2 px-4 bg-Blud text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading
            ? "Submitting..."
            : initialData
            ? "Update Review"
            : "Post Review"}
        </button>
      </form>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review, onDelete, onEdit, currentUser }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setIsDeleting(true);
    try {
      await onDelete(review._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col w-80 p-4 m-2 bg-white rounded-lg shadow-md shrink-0">
      <div className="flex items-center gap-3 mb-3">
        {review?.userId?.image ? (
          <img
            src={review.userId.image}
            alt={review.userId.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
            {review?.userId?.username?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h4 className="text-lg font-semibold">{review?.userId?.username}</h4>
          <div className="flex items-center">
            <StarRating rating={review.rating} disabled />
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{review.comment}</p>

      {currentUser?._id === review.userId?._id && (
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onEdit(review)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Review Section Component
const ReviewSection = ({ businessId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "default",
  });
  const { userInfo } = useSelector((state) => state.auth);

  const showAlert = (message, variant = "default") => {
    setAlert({ show: true, message, variant });
    setTimeout(
      () => setAlert({ show: false, message: "", variant: "default" }),
      3000
    );
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendURL}/api/getBusinessReviews/${businessId}`
      );
      setReviews(data.reviews);
    } catch (error) {
      showAlert("Error fetching reviews", "destructive");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [businessId]);

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${backendURL}/api/reviews/${reviewId}`, {
        data: { userId: userInfo._id },
      });
      showAlert("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      showAlert("Error deleting review", "destructive");
    }
  };

  return (
    <div className="space-y-6">
      <AlertToast
        message={alert.message}
        variant={alert.variant}
        visible={alert.show}
        onClose={() =>
          setAlert({ show: false, message: "", variant: "default" })
        }
      />

      <h2 className="text-2xl font-bold">Reviews</h2>

      <div>
        {showCommentForm ? (
          <ReviewForm
            businessId={businessId}
            onSuccess={() => {
              fetchReviews();
              setShowCommentForm(false);
            }}
          />
        ) : (
          <button
            className="py-2 px-4 font-semibold bg-transparent  text-Blud border-2 border-Blud  rounded-md hover:bg-Blud hover:text-white transition-colors"
            onClick={() => setShowCommentForm(true)}
          >
            Write a Review
          </button>
        )}
      </div>

      {editingReview && (
        <ReviewForm
          businessId={businessId}
          initialData={editingReview}
          onSuccess={() => {
            fetchReviews();
            setEditingReview(null);
            showAlert("Review updated successfully");
          }}
        />
      )}

      <div className="overflow-x-auto">
        <div className="flex gap-4">
          {loading ? (
            <div className="w-full text-center py-4">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="w-full text-center py-4 text-gray-500">
              No reviews yet. Be the first to review!
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onDelete={handleDelete}
                onEdit={setEditingReview}
                currentUser={userInfo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
