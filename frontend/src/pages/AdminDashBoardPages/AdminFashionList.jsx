import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  ButtonGroup,
  Box,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { HiOutlineUserCircle } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { AiTwotoneDelete } from "react-icons/ai";
import { BiMessageSquareAdd } from "react-icons/bi";
import moment from "moment";
import backendURL from "../../config";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.breakpoints.down("sm")}`]: {
    fontSize: 12,
  },
}));

const PaginationButtons = React.memo(
  ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = useMemo(() => {
      const numbers = [];
      const maxVisibleButtons = 5;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisibleButtons / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

      if (endPage - startPage + 1 < maxVisibleButtons) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        numbers.push(i);
      }
      return numbers;
    }, [currentPage, totalPages]);

    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "text-blue-500 hover:text-white hover:bg-blue-600"
          }`}
        >
          &lt;
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded-lg text-blue-500 hover:bg-blue-600 hover:text-white"
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="px-3 py-2">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-2 rounded-lg ${
              currentPage === number
                ? "bg-blue-600 text-white"
                : "text-blue-500 hover:text-white hover:bg-blue-600"
            }`}
          >
            {number}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-3 py-2">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded-lg text-blue-500 hover:text-white hover:bg-blue-600"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "text-blue-500 hover:text-white hover:bg-blue-600"
          }`}
        >
          &gt;
        </button>
      </div>
    );
  }
);

export default function AdminFashionList() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [postType, setPostType] = useState("All");
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const POSTS_PER_PAGE = 9;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const postTypes = [
    "All",
    "PopCulture",
    "Society",
    "Events",
    "Celebrities",
    "Fashion",
    "LifeStyle",
    "Entertainment",
    "Shopping",
    "Business",
    "Award",
  ];

  const lifeStyleSubCategories = [
    "All",
    "LifeStyle",
    "Food",
    "Wedding",
    "Parenting",
    "Travel",
    "Health & Fitness",
  ];

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        startIndex: ((currentPage - 1) * POSTS_PER_PAGE).toString(),
        limit: POSTS_PER_PAGE.toString(),
      });

      if (activeFilter !== "All") {
        queryParams.append("postType", activeFilter);
      }

      if (activeFilter === "LifeStyle" && activeSubCategory !== "All") {
        queryParams.append("subCategory", activeSubCategory);
      }

      const res = await fetch(
        `${backendURL}/api/getAllFashion?${queryParams.toString()}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUserPosts(data.posts);
      setTotalPosts(data.total);
    } catch (error) {
      console.error("Error fetching posts:", error);
      showSnackbar(`Failed to fetch posts: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeFilter, activeSubCategory, POSTS_PER_PAGE]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setActiveSubCategory("All"); // Reset subcategory when changing main filter
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (subCategory) => {
    setActiveSubCategory(subCategory);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  const getFilteredPosts = useCallback(() => {
    if (activeFilter === "All") {
      return userPosts;
    }

    // Handle both postType and category filtering
    return userPosts.filter(
      (post) => post.postType === activeFilter || post.category === activeFilter
    );
  }, [userPosts, activeFilter]);

  const handleDeleteConfirmation = (postId) => {
    setPostIdToDelete(postId);
    setDeleteOpen(true);
  };

  const handleDeletePost = async () => {
    if (!postIdToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${backendURL}/api/deleteFashion/${postIdToDelete}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete fashion post");
      }

      setUserPosts((prev) =>
        prev.filter((post) => post._id !== postIdToDelete)
      );
      showSnackbar("Fashion post deleted successfully", "success");
      setDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting fashion post:", error);
      showSnackbar(error.message || "Failed to delete fashion post", "error");
    } finally {
      setIsDeleting(false);
      setPostIdToDelete("");
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      // Remove the currentPage === 0 condition
      return (
        <TableRow>
          <TableCell colSpan={10} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (userPosts.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={10} align="center">
            No posts available for the selected filter
          </TableCell>
        </TableRow>
      );
    }

    return userPosts.map((post) => (
      <TableRow key={post._id} hover>
        <StyledTableCell>
          {moment(post.updatedAt).format("MMMM D, YYYY")}
        </StyledTableCell>
        <StyledTableCell>
          <Link to={`/post/${post.slug}`}>
            {post?.image1 ? (
              <img
                src={`${backendURL}${post.image1}`}
                alt={post.title}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback-image.png";
                }}
              />
            ) : (
              <HiOutlineUserCircle className="w-10 h-10 text-gray-500" />
            )}
          </Link>
        </StyledTableCell>
        <StyledTableCell>
          <Link to={`/post/${post.slug}`} className="hover:underline">
            {post.title.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 50) +
              (post.title.length > 50 ? "..." : "")}
          </Link>
        </StyledTableCell>
        <StyledTableCell>{post.category}</StyledTableCell>
        <StyledTableCell>{post.postType || "N/A"}</StyledTableCell>
        <StyledTableCell>{post.authorId.name}</StyledTableCell>
        <StyledTableCell>{post.subCategory}</StyledTableCell>
        <StyledTableCell>{post.likes?.length || 0}</StyledTableCell>
        <StyledTableCell>
          <Button
            onClick={() => handleDeleteConfirmation(post._id)}
            variant="contained"
            color="error"
            size="small"
          >
            Delete
          </Button>
        </StyledTableCell>
        <StyledTableCell>
          <Button
            component={Link}
            to={`/DashBoard/Admin/CreateFashion/${post._id}`}
            variant="contained"
            color="primary"
            size="small"
          >
            Edit
          </Button>
        </StyledTableCell>
      </TableRow>
    ));
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <div className="flex justify-between items-center p-4">
        <Button
          component={Link}
          to="/DashBoard/Admin/CreateFashion"
          startIcon={<BiMessageSquareAdd />}
          variant="outlined"
        >
          Create Posts
        </Button>
      </div>
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <ButtonGroup variant="contained">
            {postTypes.map((type) => (
              <Button
                key={type}
                onClick={() => handleFilterChange(type)}
                variant={activeFilter === type ? "contained" : "outlined"}
                color={activeFilter === type ? "primary" : "inherit"}
                sx={{
                  fontSize: { xs: "0.6rem", sm: "0.6rem", md: "0.6rem" },
                  padding: { xs: "4px 8px", sm: "6px 12px", md: "8px 16px" },
                  minWidth: { xs: "auto", sm: "auto", md: "64px" },
                  margin: "4px",
                }}
              >
                {type}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        {/* Lifestyle subcategory filters - only show when Lifestyle is selected */}
        {activeFilter === "LifeStyle" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <ButtonGroup variant="contained" size="small">
              {lifeStyleSubCategories.map((subCategory) => (
                <Button
                  key={subCategory}
                  onClick={() => handleSubCategoryChange(subCategory)}
                  variant={
                    activeSubCategory === subCategory ? "contained" : "outlined"
                  }
                  color={
                    activeSubCategory === subCategory ? "secondary" : "inherit"
                  }
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.7rem", md: "0.7rem" },
                    padding: { xs: "2px 6px", sm: "4px 8px", md: "6px 12px" },
                    margin: "2px",
                  }}
                >
                  {subCategory}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        )}
      </div>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date Updated</StyledTableCell>
              <StyledTableCell>Post Image</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Post Type</StyledTableCell>
              <StyledTableCell>Author</StyledTableCell>
              <StyledTableCell>SubCategory</StyledTableCell>
              <StyledTableCell>Likes</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Dialog
        open={deleteOpen}
        onClose={() => !isDeleting && setDeleteOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this post?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Please confirm if you want to proceed
            with deleting the post.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteOpen(false)}
            startIcon={<IoClose />}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePost}
            startIcon={
              isDeleting ? <CircularProgress size={20} /> : <AiTwotoneDelete />
            }
            disabled={isDeleting}
            color="error"
            autoFocus
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
