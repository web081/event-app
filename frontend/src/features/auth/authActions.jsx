import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import backendURL from "../../config";
// actions.js
import { SET_EMAIL } from "../types";

// Define your email sending API endpoint
const SEND_EMAIL_ENDPOINT = "http://localhost:8080/api/registerMail";

export const setEmail = (email) => ({
  type: SET_EMAIL,
  payload: email,
});

const normalizeUserData = (response) => {
  // For regular login response
  if (response.data?.requireOTP) {
    return response.data;
  }

  // Check if it's a Google login response
  if (response.data?.token && response.data?.user) {
    return {
      token: response.data.token,
      user: {
        ...response.data.user,
      },
    };
  }

  // For other response structures, try to normalize them
  const { token, user, ...rest } = response.data;
  return {
    token,
    user: user || rest,
  };
};

export const setCredentials = (data) => ({
  type: "auth/setCredentials",
  payload: data,
});

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      const normalizedData = normalizeUserData(response);

      if (normalizedData.requireOTP) {
        return normalizedData;
      }

      // Store normalized data
      localStorage.setItem("userToken", normalizedData.token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...normalizedData.user,
          token: normalizedData.token,
        })
      );

      return normalizedData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Updated Google login helper function
export const handleGoogleLogin = async (credential) => {
  try {
    const response = await axios.post(
      `${backendURL}/api/google-login`,
      { credential },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      }
    );

    if (!response.data) {
      throw new Error("No data received from Google login");
    }

    const normalizedData = normalizeUserData(response);

    // Store normalized data
    localStorage.setItem("userToken", normalizedData.token);
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        ...normalizedData.user,
        token: normalizedData.token,
      })
    );

    return normalizedData;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Google login failed");
  }
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/register`,
        { email, password, username },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      // Store tokens and user info in cookies
      if (typeof window !== "undefined") {
        Cookies.set("userToken", response.data.token, { expires: 7 });
        Cookies.set("userInfo", JSON.stringify(response.data.user), {
          expires: 7,
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/registerAdmin`,
        { email, password, username },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      // Store tokens and user info in cookies
      if (typeof window !== "undefined") {
        Cookies.set("userToken", response.data.token, { expires: 7 });
        Cookies.set("userInfo", JSON.stringify(response.data.user), {
          expires: 7,
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Action to reset the password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      };

      const response = await axios.post(
        `${backendURL}/api/resetPassword`,
        { email, password },
        config
      );

      if (response.status === 201) {
        return response.data; // Return data from the response
      } else {
        return rejectWithValue("Failed to reset password");
      }
    } catch (error) {
      // Handle error
      if (error.response && error.response.data.message) {
        // If there's an error response with a message, return the message
        return rejectWithValue(error.response.data.message);
      } else {
        // If there's an unexpected error, return the error message
        return rejectWithValue(error.message);
      }
    }
  }
);

export const verifyAdminOTP = createAsyncThunk(
  "auth/verifyAdminOTP",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/verifyAdminOTP`,
        {
          userId,
          otp,
        },
        {
          withCredentials: false,
        }
      );

      // Make sure the response matches the expected structure
      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);
