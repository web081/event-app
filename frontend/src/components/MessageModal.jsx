// src/components/MessageModal/MessageModal.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Phone,
  Mail,
  Send,
  X,
  Edit,
  Trash2,
  MessageCircle,
  Share2,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  Image as ImageIcon,
} from "lucide-react";

import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Snackbar,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { socket } from "../components/tools/SocketClient";
import backendURL from "../config";

const MessageModal = ({ currentUser, receiverId, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const ConversationsList = () => (
    <List sx={{ p: 1, width: "100%" }}>
      {conversations.map((conversation) => (
        <ListItem
          key={conversation._id}
          button
          selected={selectedConversation?._id === conversation._id}
          onClick={() => {
            setSelectedConversation(conversation);
            if (isMobile) setDrawerOpen(false);
          }}
          sx={{
            mb: 1,
            borderRadius: 1,
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
            "&.Mui-selected": { bgcolor: "primary.light" },
          }}
        >
          <ListItemAvatar>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              color={conversation.otherUser.online ? "success" : "default"}
            >
              <Avatar
                src={
                  conversation.otherUser.profilePic ||
                  conversation.otherUser.image ||
                  "/api/placeholder/40/40"
                }
                alt={conversation.otherUser.username}
                sx={{ width: 48, height: 48 }}
              />
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle2" noWrap>
                {conversation.otherUser.username}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="text.secondary" noWrap>
                {conversation.lastMessage?.content || "No messages yet"}
              </Typography>
            }
            sx={{ ml: 1 }}
          />
          {conversation.unreadCount > 0 && (
            <Badge badgeContent={conversation.unreadCount} color="primary" />
          )}
        </ListItem>
      ))}
    </List>
  );
  // Get the current active user details for the header
  const activeUserDetails = useMemo(() => {
    if (selectedConversation?.otherUser) {
      const userImage =
        selectedConversation.otherUser.image ||
        selectedConversation.otherUser.profilePic;
      console.log(selectedConversation, "selectedConversation");
      return {
        username: selectedConversation.otherUser.username || "User",
        image:
          selectedConversation.otherUser.profilePic ||
          selectedConversation.otherUser.image ||
          "/api/placeholder/40/40",
        online: selectedConversation.otherUser.online || false,
        _id: selectedConversation.otherUser._id,
      };
    }
    if (receiverDetails) {
      return {
        username: receiverDetails.username || "User",
        image:
          receiverDetails.profilePic ||
          receiverDetails.image ||
          "/api/placeholder/40/40",
        online: receiverDetails.online || false,
        _id: receiverDetails._id,
      };
    }
    return null;
  }, [selectedConversation, receiverDetails]);
  console.log(activeUserDetails, "activeUserDetails.");

  // Update typing state to work with active user
  useEffect(() => {
    socket.on("typing_started", (userId) => {
      if (activeUserDetails?._id === userId) {
        setIsTyping(true);
      }
    });

    socket.on("typing_stopped", (userId) => {
      if (activeUserDetails?._id === userId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing_started");
      socket.off("typing_stopped");
    };
  }, [activeUserDetails]);

  const handleMessageSent = (data) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg._id === data.messageId) {
          return { ...msg, deliveryStatus: data.status };
        }
        return msg;
      })
    );
  };

  const handleMessageError = (data) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg._id === data.messageId) {
          return { ...msg, deliveryStatus: "error" };
        }
        return msg;
      })
    );

    setSnackbar({
      open: true,
      message: data.error || "Failed to send message",
      severity: "error",
    });
  };

  // Improve message handling with better socket management
  useEffect(() => {
    // Connect user to their room when component mounts
    if (currentUser) {
      socket.emit("user_connected", currentUser);
    }

    // Handle new messages with deduplication
    const handleNewMessage = (message) => {
      setMessages((prevMessages) => {
        // Check for duplicate messages
        const isDuplicate = prevMessages.some(
          (msg) =>
            msg._id === message._id ||
            (msg.senderId === message.senderId &&
              msg.content === message.content &&
              msg.timestamp === message.timestamp)
        );

        if (isDuplicate) return prevMessages;

        // Verify message belongs to current conversation
        const isRelevantMessage =
          (message.senderId === selectedConversation?.otherUser?._id &&
            message.receiverId === currentUser) ||
          (message.senderId === currentUser &&
            message.receiverId === selectedConversation?.otherUser?._id);

        if (!isRelevantMessage) return prevMessages;

        // Add new message
        return [...prevMessages, message].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
      });

      // Scroll to bottom on new message
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleMessageSent);
    socket.on("message_error", handleMessageError);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("message_error", handleMessageError);
    };
  }, [currentUser, selectedConversation]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `${backendURL}/api/conversations/${currentUser}`
        );
        const data = await response.json();

        // Ensure we always set an array to conversations
        const conversationsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.conversations)
          ? data.conversations
          : [];
        setConversations(conversationsArray);

        // If receiverId is provided, find and select that conversation
        if (receiverId) {
          const existingConv = conversationsArray.find(
            (conv) => conv.otherUser._id === receiverId
          );
          if (existingConv) {
            setSelectedConversation(existingConv);
          } else {
            // Create a new conversation if it doesn't exist
            try {
              const createConvResponse = await fetch(
                `${backendURL}/api/conversations/check`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ senderId: currentUser, receiverId }),
                }
              );
              const newConvData = await createConvResponse.json();
              if (newConvData.conversation) {
                // Initialize a new conversation object with minimum required data
                const newConversation = {
                  _id: `temp-${currentUser}-${receiverId}`,
                  otherUser: {
                    _id: receiverId,
                    ...receiverDetails,
                    username: receiverDetails?.username || "User",
                    image: receiverDetails?.image || "Avata",
                  },
                  lastMessage: null,
                  unreadCount: 0,
                };

                setConversations((prev) => [...prev, newConversation]);
                setSelectedConversation(newConversation);
              }
            } catch (error) {
              console.error("Error creating new conversation:", error);
              setSnackbar({
                open: true,
                message: "Error creating new conversation",
                severity: "error",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setSnackbar({
          open: true,
          message: "Error loading conversations",
          severity: "error",
        });
        // Ensure conversations is always an array even on error
        setConversations([]);
      }
    };

    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser, receiverId, receiverDetails]);

  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const targetReceiverId =
          selectedConversation?.otherUser?._id || receiverId;
        if (!targetReceiverId) return;

        const response = await fetch(
          `${backendURL}/api/conversation?userId=${currentUser}&otherUserId=${targetReceiverId}&page=${page}&limit=50`
        );
        const data = await response.json();
        console.log(data, "conversation");

        setMessages((prev) => {
          const newMessages =
            page === 1 ? data.messages : [...prev, ...data.messages];
          return newMessages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        });
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setSnackbar({
          open: true,
          message: "Error loading messages",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && (selectedConversation?.otherUser?._id || receiverId)) {
      fetchMessages();
    }
  }, [currentUser, selectedConversation, receiverId, page]);

  // Handle new message reception via socket
  useEffect(() => {
    socket.on("new_message", (message) => {
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some((msg) => msg._id === message._id);
        if (messageExists) return prev;

        // Verify the message belongs to current conversation
        const isRelevantMessage =
          (message.senderId === selectedConversation?.otherUser?._id &&
            message.receiverId === currentUser) ||
          (message.senderId === currentUser &&
            message.receiverId === selectedConversation?.otherUser?._id) ||
          (message.senderId === receiverId &&
            message.receiverId === currentUser) ||
          (message.senderId === currentUser &&
            message.receiverId === receiverId);

        if (!isRelevantMessage) return prev;

        // Add new message and sort by timestamp
        const newMessages = [...prev, message].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        return newMessages;
      });
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => socket.off("new_message");
  }, [selectedConversation, receiverId, currentUser]);

  // Update send message handling
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      _id: `temp-${Date.now()}`,
      senderId: currentUser,
      receiverId: selectedConversation?.otherUser?._id || receiverId,
      content: newMessage,
      contentType: "text",
      timestamp: new Date().toISOString(),
      deliveryStatus: "sending",
    };

    try {
      // Add optimistic update
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");

      // Emit socket event first
      socket.emit("private_message", messageData);

      // Send to backend
      const response = await fetch(`${backendURL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // No need to update messages here as the socket handlers will manage the status
    } catch (error) {
      handleMessageError({
        messageId: messageData._id,
        error: "Failed to send message",
      });
    }
  };

  // Socket event listeners properly placed within MessageModal
  useEffect(() => {
    // Listen for online/offline status changes
    socket.on("user_online", (userId) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.otherUser._id === userId) {
            return { ...conv, otherUser: { ...conv.otherUser, online: true } };
          }
          return conv;
        })
      );
    });

    socket.on("user_offline", (userId) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.otherUser._id === userId) {
            return { ...conv, otherUser: { ...conv.otherUser, online: false } };
          }
          return conv;
        })
      );
    });

    // Typing indicators
    socket.on("typing_started", (userId) => {
      // Only show typing indicator if it's from the selected conversation
      if (
        selectedConversation?.otherUser._id === userId ||
        userId === receiverId
      ) {
        setIsTyping(true);
      }
    });

    socket.on("typing_stopped", (userId) => {
      if (
        selectedConversation?.otherUser._id === userId ||
        userId === receiverId
      ) {
        setIsTyping(false);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("user_online");
      socket.off("user_offline");
      socket.off("typing_started");
      socket.off("typing_stopped");
    };
  }, [selectedConversation, receiverId]);

  const handleTyping = () => {
    // Emit typing started event
    socket.emit(
      "typing_start",
      selectedConversation?.otherUser._id || receiverId
    );

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(
        "typing_stop",
        selectedConversation?.otherUser._id || receiverId
      );
    }, 1000);
  };

  useEffect(() => {
    const fetchReceiverDetails = async () => {
      if (receiverId) {
        try {
          const response = await fetch(`${backendURL}/api/users/${receiverId}`);
          const data = await response.json();
          setReceiverDetails(data);
          console.log(data, "setReceiverDetails");
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Error fetching receiver details",
            severity: "error",
          });
        }
      }
    };
    fetchReceiverDetails();
  }, [receiverId]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await fetch(`${backendURL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const { fileUrl } = await uploadResponse.json();

      const response = await fetch(`${backendURL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUser,
          receiverId: selectedConversation?.otherUser._id || receiverId,
          content: file.name,
          contentType: file.type.startsWith("image/") ? "image" : "file",
          fileUrl,
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages((prev) => [...prev, sentMessage]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteMessageId) return;

    try {
      await fetch(
        `${backendURL}/api/messages/${deleteMessageId}/users/${currentUser}`,
        {
          method: "DELETE",
        }
      );

      setMessages((prev) => prev.filter((msg) => msg._id !== deleteMessageId));
      setDeleteMessageId(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const showError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: "64rem",
          height: "600px",
          display: "flex",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Responsive Drawer */}
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: { xs: "100%", sm: 320 },
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: { xs: "100%", sm: 320 },
              position: "relative",
              height: "100%",
              border: "none",
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">Messages</Typography>
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(false)}>
                <X />
              </IconButton>
            )}
          </Box>
          <ConversationsList />
        </Drawer>

        {/* Chat Area */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{ display: { sm: "none" } }}
              >
                <MessageCircle />
              </IconButton>
              {activeUserDetails && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color={activeUserDetails.online ? "success" : "default"}
                  >
                    <Avatar
                      src={activeUserDetails.image || "/api/placeholder/40/40"}
                      alt={activeUserDetails.username}
                    />
                  </Badge>
                  <Box>
                    <Typography variant="subtitle1">
                      {activeUserDetails.username}
                    </Typography>
                    {isTyping && (
                      <Typography variant="caption" color="text.secondary">
                        typing...
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
            <Box>
              <IconButton>
                <MoreVertical />
              </IconButton>
              <IconButton onClick={onClose}>
                <X />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              bgcolor: "grey.50",
            }}
          >
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress />
              </Box>
            )}
            {hasMore && (
              <Button
                fullWidth
                onClick={() => setPage((p) => p + 1)}
                sx={{ mb: 2 }}
              >
                Load more messages
              </Button>
            )}
            {messages.map((message) => {
              // Explicitly check if the message's senderId matches currentUser
              const isSender =
                message.senderId._id === currentUser ||
                message.senderId === currentUser;
              const messageUser = isSender ? receiverDetails : message.senderId;

              return (
                <Box
                  key={message._id}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: isSender ? "flex-end" : "flex-start",
                    mb: 2,
                    gap: 1,
                  }}
                >
                  {/* Only show avatar for received messages */}
                  {!isSender && (
                    <Avatar
                      src={activeUserDetails?.image || "/api/placeholder/32/32"}
                      alt={messageUser?.username || "User"}
                      sx={{ width: 32, height: 32 }}
                    />
                  )}

                  <Box
                    sx={{
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isSender ? "flex-end" : "flex-start",
                    }}
                  >
                    {/* Show username only for received messages */}
                    {!isSender && (
                      <Typography
                        variant="caption"
                        sx={{ ml: 1, mb: 0.5, color: "text.secondary" }}
                      >
                        {messageUser?.username || "User"}
                      </Typography>
                    )}

                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor: isSender ? "primary.main" : "grey.100",
                        color: isSender ? "white" : "text.primary",
                        borderRadius: isSender
                          ? "20px 20px 4px 20px"
                          : "20px 20px 20px 4px",
                        position: "relative",
                        "&:hover .delete-button": {
                          opacity: 1,
                        },
                      }}
                    >
                      {message.contentType === "image" ? (
                        <img
                          src={message.fileUrl}
                          alt="Shared image"
                          style={{ maxWidth: "100%", borderRadius: 8 }}
                        />
                      ) : message.contentType === "file" ? (
                        <Button
                          href={message.fileUrl}
                          target="_blank"
                          startIcon={<Paperclip />}
                          variant="text"
                          sx={{ color: "inherit" }}
                        >
                          {message.content}
                        </Button>
                      ) : (
                        <Typography sx={{ wordBreak: "break-word" }}>
                          {message.content}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                          opacity: 0.75,
                          justifyContent: isSender ? "flex-end" : "flex-start",
                        }}
                      >
                        <Typography variant="caption">
                          {new Date(
                            message.createdAt || message.timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                        {isSender && (
                          <>
                            {message.deliveryStatus === "sent" && (
                              <Check size={14} />
                            )}
                            {message.deliveryStatus === "delivered" && (
                              <Check size={14} />
                            )}
                            {message.deliveryStatus === "read" && (
                              <CheckCheck size={14} />
                            )}
                          </>
                        )}
                      </Box>

                      {isSender && (
                        <IconButton
                          className="delete-button"
                          size="small"
                          onClick={() => setDeleteMessageId(message._id)}
                          sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            opacity: 0,
                            transition: "opacity 0.2s",
                            color: "inherit",
                          }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                    </Paper>
                  </Box>

                  {/* Add invisible avatar space for sent messages to maintain alignment */}
                  {isSender && <Box sx={{ width: 32, height: 32 }} />}
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => fileInputRef.current?.click()}>
                <ImageIcon />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: "none" }}
              />
              <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                size="small"
                sx={{ bgcolor: "background.paper" }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                color="primary"
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Delete Message Dialog */}
      <Dialog open={!!deleteMessageId} onClose={() => setDeleteMessageId(null)}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this message? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteMessageId(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteMessage}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MessageModal;
