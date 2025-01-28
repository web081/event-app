import React, { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success"); // 'success' | 'error' | 'warning' | 'info'

  const showSnackbar = (msg, type = "success") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{
            width: "100%",
            "&.MuiAlert-standardSuccess": {
              backgroundColor: "#4caf50",
              color: "white",
            },
            "&.MuiAlert-standardError": {
              backgroundColor: "#f44336",
              color: "white",
            },
            "&.MuiAlert-standardWarning": {
              backgroundColor: "#ff9800",
              color: "white",
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
