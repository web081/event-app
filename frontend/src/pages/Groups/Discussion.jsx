import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Typography,
  Box,
  Container,
  Paper,
  Divider,
  Button,
  TextField,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Alert,
  Menu,
  MenuItem,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ThumbUp, Edit, Delete, Send, MoreVert } from "@mui/icons-material";
import {
  ThumbUpOutlined,
  ThumbUpRounded,
  SendRounded,
  CommentOutlined,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import EgroupURL from "../../config2";

const GroupDiscussionPage = () => {
  const { slug } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const currentUser = useSelector((state) => state.auth);
  const userId = currentUser?.userInfo?._id;
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReplyId, setSelectedReplyId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replyToDeleteId, setReplyToDeleteId] = useState(null);

  const safeFormatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  const handleLikeDiscussion = async () => {
    try {
      const isLiked = discussion.likes.includes(userId);
      const action = isLiked ? "unlike" : "like";

      const response = await fetch(
        `${EgroupURL}/api/discussions/${discussion._id}/likeDiscussion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, action }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like/unlike discussion");
      }

      const data = await response.json();

      setDiscussion((prevDiscussion) => ({
        ...prevDiscussion,
        likes: data.likes,
      }));

      setSnackbarMessage(data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error liking/unliking discussion:", error);
      setSnackbarMessage("Failed to like/unlike discussion.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const fetchDiscussion = async () => {
    try {
      const response = await fetch(
        `${EgroupURL}/api/discussions/getDiscussionBySlug/${slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch discussion");
      }
      const data = await response.json();
      setDiscussion(data);
      console.log("Fetched discussion data:", data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching discussion:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussionReplies = async () => {
    if (!discussion || !discussion._id) return;

    try {
      const response = await fetch(
        `${EgroupURL}/api/discussions/getDiscussionComments/${discussion._id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch discussion comments");
      }
      const data = await response.json();
      setReplies(data.comments);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, [slug]);

  useEffect(() => {
    if (discussion) {
      fetchDiscussionReplies();
    }
  }, [discussion]);

  const handleCommentSubmit = async () => {
    try {
      const replyData = {
        content: newReply,
        authorId: userId,
      };
      const response = await fetch(
        `${EgroupURL}/api/discussions/commentDiscussion/${discussion._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(replyData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create reply");
      }

      const newReplyObj = await response.json();

      // Update the local state with the new reply
      setReplies((prevReplies) => [...prevReplies, newReplyObj]);

      // Fetch updated discussion data to reflect the new comment count
      await fetchDiscussion();

      setNewReply("");
      setSnackbarMessage("Reply submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error submitting reply:", error);
      setSnackbarMessage("Failed to submit reply.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleReplyEdit = async (replyId, newContent) => {
    try {
      const response = await fetch(
        `${EgroupURL}/api/discussions/${discussion._id}/comments/${replyId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newContent,
            userId: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit reply");
      }

      await fetchDiscussion();

      setEditingReplyId(null);
      setEditedReplyContent("");
      setSnackbarMessage("Reply edited successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error editing reply:", error);
      setSnackbarMessage("Failed to edit reply.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleReplyDelete = async (replyId) => {
    try {
      const response = await fetch(
        `${EgroupURL}/api/discussions/${discussion._id}/comments/${replyId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete reply");
      }

      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply._id !== replyId)
      );
      setSnackbarMessage("Reply deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting reply:", error);
      setSnackbarMessage("Failed to delete reply.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const comment = replies.find((reply) => reply._id === commentId);
      const action = comment.likes.includes(userId) ? "unlike" : "like";

      const response = await fetch(
        `${EgroupURL}/api/discussions/${discussion._id}/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, action }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like/unlike comment");
      }

      const updatedComment = await response.json();

      // Update the local state with the updated comment
      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply._id === commentId
            ? { ...reply, likes: updatedComment.likes }
            : reply
        )
      );

      setSnackbarMessage(updatedComment.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
      setSnackbarMessage("Failed to like/unlike comment.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleMenuOpen = (event, replyId) => {
    setAnchorEl(event.currentTarget);
    setSelectedReplyId(replyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReplyId(null);
  };

  const handleEditClick = (reply) => {
    setEditingReplyId(reply._id);
    setEditedReplyContent(reply.content);
    handleMenuClose();
  };

  const handleDeleteClick = (replyId) => {
    setReplyToDeleteId(replyId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (replyToDeleteId) {
      handleReplyDelete(replyToDeleteId);
      setDeleteDialogOpen(false);
      setReplyToDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setReplyToDeleteId(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const renderDiscussionHeader = () => (
    <Paper
      elevation={3}
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 2,
        background: "linear-gradient(145deg, #f0f4f8 0%, #ffffff 100%)",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#1a2732",
              mb: 2,
            }}
          >
            {discussion.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={`${EgroupURL}${discussion.authorId?.image}`}
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                border: "2px solid #e0e0e0",
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                }}
              >
                {discussion.author?.username || "Anonymous"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posted{" "}
                {safeFormatDate(new Date(discussion.createdAt), {
                  addSuffix: true,
                })}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={
              discussion.likes.includes(userId) ? (
                <ThumbUpRounded />
              ) : (
                <ThumbUpOutlined />
              )
            }
            onClick={handleLikeDiscussion}
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {discussion.likes.length} Likes
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body1"
        sx={{
          color: "#34495e",
          lineHeight: 1.6,
        }}
      >
        {discussion.content}
      </Typography>
    </Paper>
  );

  const renderCommentInput = () => (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "#2c3e50",
          }}
        >
          <CommentOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
          Add a Comment
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Share your thoughts..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          endIcon={<SendRounded />}
          onClick={handleCommentSubmit}
          disabled={!newReply.trim()}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Post Comment
        </Button>
      </CardContent>
    </Card>
  );

  const renderComments = () => (
    <Box>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#2c3e50",
        }}
      >
        Discussion ({replies.length} Comments)
      </Typography>

      {replies.map((reply) => (
        <Card
          key={reply._id}
          variant="outlined"
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: "none",
          }}
        >
          {editingReplyId === reply._id ? (
            <CardContent>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editedReplyContent}
                onChange={(e) => setEditedReplyContent(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => handleReplyEdit(reply._id, editedReplyContent)}
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                <Button onClick={() => setEditingReplyId(null)}>Cancel</Button>
              </Box>
            </CardContent>
          ) : (
            <>
              <CardHeader
                avatar={
                  <Avatar
                    src={`${EgroupURL}${reply.author?.image}`}
                    sx={{
                      width: 35,
                      height: 35,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                }
                title={
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#2c3e50",
                    }}
                  >
                    {reply.author?.username || "Anonymous"}
                  </Typography>
                }
                subheader={
                  <Typography variant="caption" color="text.secondary">
                    {safeFormatDate(reply.createdAt)}
                  </Typography>
                }
                action={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      size="small"
                      color={
                        reply.likes?.includes(userId) ? "primary" : "default"
                      }
                      onClick={() => handleLikeComment(reply._id)}
                    >
                      {reply.likes?.includes(userId) ? (
                        <ThumbUpRounded />
                      ) : (
                        <ThumbUpOutlined />
                      )}
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {reply.likes?.length || 0}
                      </Typography>
                    </IconButton>
                    {(currentUser?.userInfo?._id === reply.author?._id ||
                      currentUser?.userInfo?.isAdmin) && (
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, reply._id)}
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {reply.content}
                </Typography>
              </CardContent>
            </>
          )}
        </Card>
      ))}

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const replyToEdit = replies.find((r) => r._id === selectedReplyId);
            handleEditClick(replyToEdit);
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedReplyId)}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-screen absolute top-0 left-0 bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  if (error) return <Typography color="error">{error}</Typography>;
  if (!discussion) return <Typography>Discussion not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {renderDiscussionHeader()}
      {renderCommentInput()}
      {renderComments()}
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GroupDiscussionPage;
