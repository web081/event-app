import { io } from "socket.io-client";
import backendURL from "../../config";

// Create socket connection
export const socket = io(backendURL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection event handlers
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from socket server:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});
