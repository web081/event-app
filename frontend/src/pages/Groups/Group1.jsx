import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Snackbar,
  Box,
} from "@mui/material";
import {
  Group as GroupIcon,
  Forum as ForumIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import EgroupURL from "../../config2";

const EGroup = () => {
  const { slug } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [groupData, setGroupData] = useState(null);
  const [allDiscussions, setAllDiscussions] = useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [openNewDiscussion, setOpenNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [isGroupMember, setIsGroupMember] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const groupId = groupData?.id;
  const userId = userInfo?._id;

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(
          `${EgroupURL}/api/groups/getGroupBySlug/${slug}`
        );
        console.log(response, "response");
        setGroupData(response.data);
        setNewDiscussion((prev) => ({
          ...prev,
          category: response.data.category,
        }));
      } catch (error) {
        console.error("Error fetching group data:", error);
        setSnackbarMessage("Error loading group data");
        setSnackbarOpen(true);
      }
    };

    const fetchDiscussions = async () => {
      try {
        const response = await axios.get(
          `${EgroupURL}/api/groups/getDiscussionsByGroup/${slug}`
        );
        setAllDiscussions(response.data);
        setFilteredDiscussions(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setSnackbarMessage("Error loading discussions");
        setSnackbarOpen(true);
      }
    };

    const checkMembership = async () => {
      try {
        const response = await axios.get(
          `${EgroupURL}/api/groups/${groupId}/members/${userId}`
        );
        setIsGroupMember(response.data.isMember);
      } catch (error) {
        console.error("Error checking membership:", error);
      }
    };

    fetchGroupData();
    fetchDiscussions();
    checkMembership();
  }, [groupId, userId]);

  useEffect(() => {
    const filtered = allDiscussions.filter(
      (discussion) =>
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory === "All" || discussion.category === filterCategory)
    );
    setFilteredDiscussions(filtered);
    setPage(1);
  }, [searchTerm, filterCategory, allDiscussions]);

  const handleNewDiscussion = () => {
    setOpenNewDiscussion(true);
  };

  const handleCloseNewDiscussion = () => {
    setOpenNewDiscussion(false);
    setNewDiscussion({
      title: "",
      content: "",
      category: groupData?.category || "",
    });
  };

  const handleDiscussionSubmit = async () => {
    if (newDiscussion.title.trim() && newDiscussion.content.trim()) {
      try {
        const response = await axios.post(
          `${EgroupURL}/api/discussions/createDiscussion`,
          {
            ...newDiscussion,
            authorId: userId,
            groupId,
          }
        );
        setAllDiscussions([response.data, ...allDiscussions]);

        handleCloseNewDiscussion();
        setSnackbarMessage("Discussion created successfully!");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error creating discussion:", error);
        setSnackbarMessage("Error creating discussion");
        setSnackbarOpen(true);
      }
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleJoinGroup = async () => {
    try {
      await axios.post(`${EgroupURL}/api/groups/join/${groupId}`, {
        userId,
      });
      setIsGroupMember(true);
      setSnackbarMessage("You've successfully joined the group!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error joining group:", error);
      setSnackbarMessage("Error joining group");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const paginatedDiscussions = filteredDiscussions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (!groupData) {
    return (
      <div className="flex items-center justify-center h-screen w-screen absolute top-0 left-0 bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent
          sx={{
            bgcolor: "#5D4D4D",
            color: "primary.contrastText",
            py: { xs: 2, md: 4 },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
          >
            {groupData.name}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            <div dangerouslySetInnerHTML={{ __html: groupData.description }} />
          </Typography>
          <Chip label={groupData.category} color="secondary" sx={{ mt: 1 }} />
        </CardContent>
        <CardContent sx={{ bgcolor: "background.paper", py: 2 }}>
          <Grid container spacing={2} justifyContent="space-around">
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}
              >
                <GroupIcon sx={{ mr: 1 }} /> {groupData.members} member
                {groupData.members !== 1 ? "s" : ""}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}
              >
                <ForumIcon sx={{ mr: 1 }} /> {allDiscussions.length} discussions
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}
              >
                <CalendarIcon sx={{ mr: 1 }} /> Created{" "}
                {new Date(groupData.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", sm: "center" },
                  mb: 2,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                >
                  Discussions
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  className="!bg-red-500 !text-white !hover:bg-NavClr"
                  onClick={handleNewDiscussion}
                  disabled={!isGroupMember}
                  sx={{ mb: { xs: 2, sm: 0 } }}
                >
                  New Discussion
                </Button>
              </Box>

              <div className="mb-4 flex justify-start">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <List>
                {paginatedDiscussions.map((discussion, index) => (
                  <ListItem
                    key={discussion._id || index}
                    alignItems="flex-start"
                    divider
                    button
                    onClick={() =>
                      navigate(`/discussionPage/${discussion.slug}`)
                    }
                    sx={{
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>{discussion.author?.username?.[0] || "A"}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={discussion.title}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: { xs: "1.125rem", md: "1.25rem" },
                          fontWeight: "500",
                        },
                      }}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                          >
                            <span className="italic"> posted by: {""}</span>
                            <span className="font-semibold text-gray-700">
                              {discussion.author?.username || "Anonymous"}
                            </span>
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                          >
                            {` — ${
                              discussion.replies?.length || 0
                            } replies/comments  •  ${
                              discussion.likes.length || 0
                            } likes`}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={Math.ceil(filteredDiscussions.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    ".Mui-selected": {
                      backgroundColor: "#f05252",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "darkred",
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" } }}
              >
                About This Group
              </Typography>
              <Typography
                variant="body2"
                paragraph
                sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
              >
                This group is dedicated to discussing all aspects of{" "}
                {groupData.category.toLowerCase()}, from the latest developments
                to practical applications.
              </Typography>
              <Typography
                variant="h6"
                component="h4"
                gutterBottom
                sx={{ fontSize: { xs: "1rem", md: "1.125rem" } }}
              >
                Group Rules:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Be respectful to all members"
                    primaryTypographyProps={{
                      sx: { fontSize: { xs: "0.875rem", md: "1rem" } },
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Stay on topic"
                    primaryTypographyProps={{
                      sx: { fontSize: { xs: "0.875rem", md: "1rem" } },
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="No self-promotion"
                    primaryTypographyProps={{
                      sx: { fontSize: { xs: "0.875rem", md: "1rem" } },
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button
                sx={{ ml: 1 }}
                variant="contained"
                className="!bg-NavClr !text-white !hover:bg-NavClr"
                onClick={handleJoinGroup}
                fullWidth
                disabled={isGroupMember || !userInfo}
              >
                {isGroupMember ? "Joined" : "Join Group"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* New Discussion Dialog */}
      <Dialog
        open={openNewDiscussion}
        onClose={handleCloseNewDiscussion}
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          New Discussion
          <IconButton
            aria-label="close"
            onClick={handleCloseNewDiscussion}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Discussion Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newDiscussion.title}
            onChange={(e) =>
              setNewDiscussion({ ...newDiscussion, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="content"
            label="Discussion Content"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={newDiscussion.content}
            onChange={(e) =>
              setNewDiscussion({ ...newDiscussion, content: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={newDiscussion.category}
              label="Category"
              onChange={(e) =>
                setNewDiscussion({
                  ...newDiscussion,
                  category: e.target.value,
                })
              }
            >
              <MenuItem value={newDiscussion.category}>
                {newDiscussion.category}
              </MenuItem>
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewDiscussion}>Cancel</Button>
          <Button
            onClick={handleDiscussionSubmit}
            sx={{
              backgroundColor: "#3b82f6",
              "&:hover": {
                backgroundColor: "#2563eb",
              },
              color: "white",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default EGroup;
